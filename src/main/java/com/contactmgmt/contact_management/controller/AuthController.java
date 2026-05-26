package com.contactmgmt.contact_management.controller;

import com.contactmgmt.contact_management.dto.AuthResponse;
import com.contactmgmt.contact_management.dto.ChangePasswordRequest;
import com.contactmgmt.contact_management.dto.LoginRequest;
import com.contactmgmt.contact_management.dto.RegisterRequest;
import com.contactmgmt.contact_management.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        logger.info("Register request received");
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        logger.info("Login request received");
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/change-password")
    public ResponseEntity<AuthResponse> changePassword(
            @RequestBody ChangePasswordRequest request,
            java.security.Principal principal) {
        logger.info("Change password request received");
        AuthResponse response = authService.changePassword(principal.getName(), request);
        return ResponseEntity.ok(response);
    }

}