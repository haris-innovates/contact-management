package com.contactmgmt.contact_management.service;

import com.contactmgmt.contact_management.dto.LoginRequest;
import com.contactmgmt.contact_management.dto.RegisterRequest;
import com.contactmgmt.contact_management.entity.User;
import com.contactmgmt.contact_management.repository.UserRepository;
import com.contactmgmt.contact_management.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .email("test@gmail.com")
                .password("encodedPassword")
                .firstName("Muhammad")
                .lastName("Haris")
                .build();
    }

    @Test
    void register_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@gmail.com");
        request.setPassword("Test@1234");
        request.setFirstName("Muhammad");
        request.setLastName("Haris");

        when(userRepository.existsByEmail("test@gmail.com")).thenReturn(false);
        when(passwordEncoder.encode("Test@1234")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken("test@gmail.com")).thenReturn("mockToken");

        var response = authService.register(request);

        assertNotNull(response);
        assertEquals("mockToken", response.getToken());
        assertEquals("User registered successfully", response.getMessage());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_EmailAlreadyExists_ThrowsException() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@gmail.com");
        request.setPassword("Test@1234");

        when(userRepository.existsByEmail("test@gmail.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("test@gmail.com");
        request.setPassword("Test@1234");

        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("Test@1234", "encodedPassword")).thenReturn(true);
        when(jwtUtil.generateToken("test@gmail.com")).thenReturn("mockToken");

        var response = authService.login(request);

        assertNotNull(response);
        assertEquals("mockToken", response.getToken());
        assertEquals("Login successful", response.getMessage());
    }

    @Test
    void login_InvalidPassword_ThrowsException() {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("test@gmail.com");
        request.setPassword("wrongPassword");

        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> authService.login(request));
    }

    @Test
    void login_UserNotFound_ThrowsException() {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("notfound@gmail.com");
        request.setPassword("Test@1234");

        when(userRepository.findByEmail("notfound@gmail.com")).thenReturn(Optional.empty());
        when(userRepository.findByPhoneNumber("notfound@gmail.com")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authService.login(request));
    }
}
