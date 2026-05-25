package com.contactmgmt.contact_management.dto;

import jakarta.validation.constraints.NotBlank;

public class RegisterRequest {
    private String email;
    private String phoneNumber;

    @NotBlank
    private String password;

    private String firstName;
    private String lastName;

    public String getEmail() { return email; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getPassword() { return password; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public void setEmail(String email) { this.email = email; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setPassword(String password) { this.password = password; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
}