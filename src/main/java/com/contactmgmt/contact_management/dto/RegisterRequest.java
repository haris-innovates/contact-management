package com.contactmgmt.contact_management.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RegisterRequest {
    private String email;
    private String phoneNumber;
    @NotBlank
    private String password;
    private String firstName;
    private String lastName;
}