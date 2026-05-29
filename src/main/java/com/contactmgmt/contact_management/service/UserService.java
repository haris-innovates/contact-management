package com.contactmgmt.contact_management.service;

import com.contactmgmt.contact_management.dto.UserProfileResponse;
import com.contactmgmt.contact_management.entity.User;
import com.contactmgmt.contact_management.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserProfileResponse getProfile(String identifier) {
        logger.info("Fetching profile for: {}", identifier);

        User user = userRepository.findByEmail(identifier)
                .orElseGet(() -> userRepository.findByPhoneNumber(identifier)
                        .orElseThrow(() -> new RuntimeException("User not found")));

        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());

        return response;
    }
}
