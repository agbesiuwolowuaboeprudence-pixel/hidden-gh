package com.hiddenghana.backend.service;

import com.hiddenghana.backend.dto.AuthResponse;
import com.hiddenghana.backend.dto.LoginRequest;
import com.hiddenghana.backend.dto.RegisterRequest;
import com.hiddenghana.backend.entity.Role;
import com.hiddenghana.backend.entity.User;
import com.hiddenghana.backend.repository.UserRepository;
import com.hiddenghana.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import java.net.URL;
import java.security.interfaces.RSAPublicKey;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone() != null ? request.getPhone() : "")
                .location(request.getLocation() != null ? request.getLocation() : "")
                .role(Role.USER)
                .isPremium(false)
                .build();

        userRepository.save(user);
        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .isPremium(user.isPremium())
                .message("Registration successful")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .isPremium(user.isPremium())
                .message("Login successful")
                .build();
    }
    /**
     * Verify Google ID token via Google's tokeninfo endpoint, then upsert the user and return our JWT.
     */
    public AuthResponse googleLogin(String idToken) {
        RestTemplate rest = new RestTemplate();
        String tokenInfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
        Map<String, Object> info = rest.getForObject(tokenInfoUrl, Map.class);
        if (info == null || !info.containsKey("email")) {
            throw new RuntimeException("Invalid Google ID token");
        }

        String email = String.valueOf(info.get("email"));
        String name = info.containsKey("name") ? String.valueOf(info.get("name")) : email.split("@")[0];

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User u = User.builder()
                    .fullName(name)
                    .email(email)
                    // create unusable password for social account
                    .password(passwordEncoder.encode("SOCIAL_LOGIN_PLACEHOLDER"))
                    .phone("")
                    .location("")
                    .role(Role.USER)
                    .isPremium(false)
                    .build();
            userRepository.save(u);
            return u;
        });

        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .isPremium(user.isPremium())
                .message("Login successful")
                .build();
    }

    /**
     * Verify Apple ID token signature using Apple's JWKS and issue local JWT.
     */
    public AuthResponse appleLogin(String idToken) {
        try {
            // Parse the JWT
            SignedJWT signedJWT = SignedJWT.parse(idToken);

            String kid = signedJWT.getHeader().getKeyID();

            // Fetch Apple's public keys
            JWKSet jwkSet = JWKSet.load(new URL("https://appleid.apple.com/auth/keys"));
            List<JWK> keys = jwkSet.getKeys();

            Optional<JWK> maybe = keys.stream().filter(k -> k.getKeyID().equals(kid)).findFirst();
            if (maybe.isEmpty()) throw new RuntimeException("No matching Apple key found");

            RSAKey rsaKey = (RSAKey) maybe.get();
            RSAPublicKey publicKey = rsaKey.toRSAPublicKey();

            JWSVerifier verifier = new RSASSAVerifier(publicKey);
            boolean valid = signedJWT.verify(verifier);
            if (!valid) throw new RuntimeException("Invalid Apple ID token signature");

            // Extract claims
            String email = (String) signedJWT.getJWTClaimsSet().getClaim("email");
            String name = email != null ? email.split("@")[0] : "AppleUser";

            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User u = User.builder()
                        .fullName(name)
                        .email(email)
                        .password(passwordEncoder.encode("SOCIAL_LOGIN_PLACEHOLDER"))
                        .phone("")
                        .location("")
                        .role(Role.USER)
                        .isPremium(false)
                        .build();
                userRepository.save(u);
                return u;
            });

            String jwtToken = jwtService.generateToken(user);

            return AuthResponse.builder()
                    .token(jwtToken)
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .role(user.getRole().name())
                    .isPremium(user.isPremium())
                    .message("Login successful")
                    .build();
        } catch (Exception ex) {
            throw new RuntimeException("Apple ID token verification failed: " + ex.getMessage());
        }
    }
}