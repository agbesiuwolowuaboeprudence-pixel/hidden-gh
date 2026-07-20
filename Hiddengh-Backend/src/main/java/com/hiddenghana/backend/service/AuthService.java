package com.hiddenghana.backend.service;

import com.hiddenghana.backend.dto.AuthResponse;
import com.hiddenghana.backend.dto.LoginRequest;
import com.hiddenghana.backend.dto.RegisterRequest;
import com.hiddenghana.backend.entity.Role;
import com.hiddenghana.backend.entity.User;
import com.hiddenghana.backend.entity.VerificationToken;
import com.hiddenghana.backend.exception.ApiException;
import com.hiddenghana.backend.repository.UserRepository;
import com.hiddenghana.backend.repository.VerificationTokenRepository;
import com.hiddenghana.backend.security.JwtService;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URL;
import java.security.interfaces.RSAPublicKey;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.SignedJWT;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final VerificationTokenRepository verificationTokenRepository;
    private final EmailService emailService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            VerificationTokenRepository verificationTokenRepository,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.verificationTokenRepository = verificationTokenRepository;
        this.emailService = emailService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw ApiException.badRequest("Email already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone() != null ? request.getPhone() : "")
                .location(request.getLocation() != null ? request.getLocation() : "")
                .role(Role.USER)
                .isPremium(false)
                .emailVerified(false)
                .build();

        userRepository.save(user);
        sendVerificationTokenFor(user);

        // Return a JWT immediately so the user is authenticated after signup
        // (the verification email is best-effort and not required to proceed).
        return AuthResponse.builder()
                .token(jwtService.generateToken(user))
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .isPremium(user.isPremium())
                .message("Registration successful!")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();

        return buildAuthResponse(user, "Login successful");
    }

    /**
     * Verify Google ID token via Google's tokeninfo endpoint, then upsert the user and return our JWT.
     */
    public AuthResponse googleLogin(String idToken) {
        RestTemplate rest = new RestTemplate();
        String tokenInfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
        Map<String, Object> info = rest.getForObject(tokenInfoUrl, Map.class);
        if (info == null || !info.containsKey("email")) {
            throw ApiException.unauthorized("Invalid Google ID token");
        }

        String email = String.valueOf(info.get("email"));
        String name = info.containsKey("name") ? String.valueOf(info.get("name")) : email.split("@")[0];

        User user = findOrCreateSocialUser(email, name);
        return buildAuthResponse(user, "Login successful");
    }

    /**
     * Verify Apple ID token signature using Apple's JWKS and issue local JWT.
     */
    public AuthResponse appleLogin(String idToken) {
        SignedJWT signedJWT;
        try {
            signedJWT = SignedJWT.parse(idToken);
        } catch (Exception ex) {
            throw ApiException.unauthorized("Malformed Apple ID token");
        }

        String kid = signedJWT.getHeader().getKeyID();

        JWKSet jwkSet;
        try {
            jwkSet = JWKSet.load(new URL("https://appleid.apple.com/auth/keys"));
        } catch (Exception ex) {
            throw ApiException.unauthorized("Could not fetch Apple's public keys: " + ex.getMessage());
        }

        List<JWK> keys = jwkSet.getKeys();
        Optional<JWK> maybe = keys.stream().filter(k -> k.getKeyID().equals(kid)).findFirst();
        if (maybe.isEmpty()) {
            throw ApiException.unauthorized("No matching Apple public key found for token verification");
        }

        RSAKey rsaKey = (RSAKey) maybe.get();
        boolean valid;
        try {
            RSAPublicKey publicKey = rsaKey.toRSAPublicKey();
            JWSVerifier verifier = new RSASSAVerifier(publicKey);
            valid = signedJWT.verify(verifier);
        } catch (Exception ex) {
            throw ApiException.unauthorized("Apple ID token signature verification failed: " + ex.getMessage());
        }

        if (!valid) {
            throw ApiException.unauthorized("Invalid Apple ID token signature");
        }

        String email;
        try {
            email = (String) signedJWT.getJWTClaimsSet().getClaim("email");
        } catch (Exception ex) {
            throw ApiException.unauthorized("Could not read email claim from Apple ID token");
        }

        String name = email != null ? email.split("@")[0] : "AppleUser";

        User user = findOrCreateSocialUser(email, name);
        return buildAuthResponse(user, "Login successful");
    }

    public String verifyEmail(String token) {
        VerificationToken vt = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> ApiException.badRequest("Invalid verification link."));

        if (vt.isUsed()) {
            return buildHtmlPage("Already Verified", "This email has already been verified. You can log in to the app.");
        }
        if (vt.isExpired()) {
            return buildHtmlPage("Link Expired", "This verification link has expired. Please request a new one from the app.");
        }

        User user = vt.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        vt.setUsed(true);
        verificationTokenRepository.save(vt);

        return buildHtmlPage("Email Verified!", "Your email has been verified successfully. You can now return to the Hidden Ghana app and log in.");
    }

    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> ApiException.badRequest("User not found"));

        if (user.isEmailVerified()) {
            throw ApiException.badRequest("Email is already verified.");
        }

        sendVerificationTokenFor(user);
    }

    // ------------------------------------------------------------------
    // Shared helpers (this is what removes the duplication)
    // ------------------------------------------------------------------

    /**
     * Used by both googleLogin() and appleLogin() — finds an existing user by
     * email, or creates a new one with a placeholder password. Social logins
     * are treated as pre-verified since the provider already confirmed the email.
     */
    private User findOrCreateSocialUser(String email, String name) {
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User u = User.builder()
                    .fullName(name)
                    .email(email)
                    .password(passwordEncoder.encode("SOCIAL_LOGIN_PLACEHOLDER"))
                    .phone("")
                    .location("")
                    .role(Role.USER)
                    .isPremium(false)
                    .emailVerified(true)
                    .build();
            return userRepository.save(u);
        });

        if (!user.isEmailVerified()) {
            user.setEmailVerified(true);
            userRepository.save(user);
        }

        return user;
    }

    private AuthResponse buildAuthResponse(User user, String message) {
        String jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .isPremium(user.isPremium())
                .message(message)
                .build();
    }

    private void sendVerificationTokenFor(User user) {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(
                token, user, LocalDateTime.now().plusHours(24)
        );
        verificationTokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), token);
    }

    private String buildHtmlPage(String title, String message) {
        return """
                <html>
                <body style="font-family: Arial, sans-serif; text-align:center; padding:60px 20px;">
                    <h1 style="color:#1a7a3c;">%s</h1>
                    <p style="font-size:16px; color:#333;">%s</p>
                </body>
                </html>
                """.formatted(title, message);
    }
}