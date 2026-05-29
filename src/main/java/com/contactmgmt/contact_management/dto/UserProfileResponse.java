package com.contactmgmt.contact_management.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserProfileResponse {
    private Long id;
    private String email;
    private String phoneNumber;
    private String firstName;
    private String lastName;
}