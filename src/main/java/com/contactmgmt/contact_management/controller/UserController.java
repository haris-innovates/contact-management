package com.contactmgmt.contact_management.controller;

import com.contactmgmt.contact_management.dto.UserProfileResponse;
import com.contactmgmt.contact_management.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(Principal principal) {
        logger.info("Get profile request received");
        UserProfileResponse response = userService.getProfile(principal.getName());
        return ResponseEntity.ok(response);
    }
}