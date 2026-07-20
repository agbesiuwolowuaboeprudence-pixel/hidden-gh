package com.hiddenghana.backend.controller;

import com.hiddenghana.backend.dto.AuthResponse;
import com.hiddenghana.backend.dto.LoginRequest;
import com.hiddenghana.backend.dto.RegisterRequest;
import com.hiddenghana.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/oauth/google")
    public ResponseEntity<AuthResponse> googleOAuth(@RequestBody Map<String, String> body) {
        String idToken = body.get("idToken");
        return ResponseEntity.ok(authService.googleLogin(idToken));
    }

    @PostMapping("/oauth/apple")
    public ResponseEntity<AuthResponse> appleOAuth(@RequestBody Map<String, String> body) {
        String idToken = body.get("idToken");
        return ResponseEntity.ok(authService.appleLogin(idToken));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Hidden Ghana Backend is running!");
    }
}