package com.contactmgmt.contact_management.service;

import com.contactmgmt.contact_management.dto.AuthResponse;
import com.contactmgmt.contact_management.dto.ChangePasswordRequest;
import com.contactmgmt.contact_management.dto.LoginRequest;
import com.contactmgmt.contact_management.dto.RegisterRequest;
import com.contactmgmt.contact_management.entity.User;
import com.contactmgmt.contact_management.repository.UserRepository;
import com.contactmgmt.contact_management.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        logger.info("Registering new user with email: {}", request.getEmail());

        if (request.getEmail() == null && request.getPhoneNumber() == null) {
            throw new RuntimeException("Email or phone number is required");
        }

        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (request.getPhoneNumber() != null && userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();

        userRepository.save(user);
        logger.info("User registered successfully: {}", request.getEmail());

        String identifier = request.getEmail() != null ? request.getEmail() : request.getPhoneNumber();
        String token = jwtUtil.generateToken(identifier);

        return new AuthResponse(token, "User registered successfully");
    }

    public AuthResponse login(LoginRequest request) {
        logger.info("Login attempt for identifier: {}", request.getIdentifier());

        User user = userRepository.findByEmail(request.getIdentifier())
                .orElseGet(() -> userRepository.findByPhoneNumber(request.getIdentifier())
                        .orElseThrow(() -> new RuntimeException("User not found")));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            logger.warn("Invalid password for user: {}", request.getIdentifier());
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(request.getIdentifier());
        logger.info("Login successful for: {}", request.getIdentifier());

        return new AuthResponse(token, "Login successful");
    }

    public AuthResponse changePassword(String identifier, ChangePasswordRequest request) {
        logger.info("Change password request for: {}", identifier);

        User user = userRepository.findByEmail(identifier)
                .orElseGet(() -> userRepository.findByPhoneNumber(identifier)
                        .orElseThrow(() -> new RuntimeException("User not found")));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        logger.info("Password changed successfully for: {}", identifier);
        return new AuthResponse(null, "Password changed successfully");
    }
}