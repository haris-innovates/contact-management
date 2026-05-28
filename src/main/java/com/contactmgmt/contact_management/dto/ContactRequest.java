package com.contactmgmt.contact_management.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter @Setter
public class ContactRequest {
    private String firstName;
    private String lastName;
    private String title;
    private List<PhoneDto> phoneNumbers;
    private List<EmailDto> emailAddresses;
}