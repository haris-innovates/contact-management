package com.contactmgmt.contact_management.controller;

import com.contactmgmt.contact_management.dto.ContactRequest;
import com.contactmgmt.contact_management.dto.ContactResponse;
import com.contactmgmt.contact_management.dto.EmailDto;
import com.contactmgmt.contact_management.dto.PhoneDto;
import com.contactmgmt.contact_management.entity.Contact;
import com.contactmgmt.contact_management.entity.EmailAddress;
import com.contactmgmt.contact_management.entity.PhoneNumber;
import com.contactmgmt.contact_management.service.ContactService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = "*")
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    private ContactResponse toResponse(Contact contact) {
        ContactResponse response = new ContactResponse();
        response.setId(contact.getId());
        response.setFirstName(contact.getFirstName());
        response.setLastName(contact.getLastName());
        response.setTitle(contact.getTitle());

        if (contact.getPhoneNumbers() != null) {
            List<PhoneDto> phones = contact.getPhoneNumbers().stream().map(p -> {
                PhoneDto dto = new PhoneDto();
                dto.setNumber(p.getNumber());
                dto.setLabel(p.getLabel());
                return dto;
            }).collect(Collectors.toList());
            response.setPhoneNumbers(phones);
        }

        if (contact.getEmailAddresses() != null) {
            List<EmailDto> emails = contact.getEmailAddresses().stream().map(e -> {
                EmailDto dto = new EmailDto();
                dto.setEmail(e.getEmail());
                dto.setLabel(e.getLabel());
                return dto;
            }).collect(Collectors.toList());
            response.setEmailAddresses(emails);
        }

        return response;
    }

    @PostMapping
    public ResponseEntity<ContactResponse> createContact(@RequestBody ContactRequest request,
                                                         Principal principal) {
        logger.info("Create contact request received");
        Contact contact = contactService.createContact(principal.getName(), request);
        return ResponseEntity.ok(toResponse(contact));
    }

    @GetMapping
    public ResponseEntity<Page<ContactResponse>> getContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            Principal principal) {
        logger.info("Get contacts request received");
        Page<Contact> contacts = contactService.getContacts(principal.getName(), page, size, search);
        List<ContactResponse> responses = contacts.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new PageImpl<>(responses, contacts.getPageable(), contacts.getTotalElements()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> getContactById(@PathVariable Long id,
                                                          Principal principal) {
        logger.info("Get contact by id request received");
        Contact contact = contactService.getContactById(principal.getName(), id);
        return ResponseEntity.ok(toResponse(contact));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactResponse> updateContact(@PathVariable Long id,
                                                         @RequestBody ContactRequest request,
                                                         Principal principal) {
        logger.info("Update contact request received");
        Contact contact = contactService.updateContact(principal.getName(), id, request);
        return ResponseEntity.ok(toResponse(contact));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteContact(@PathVariable Long id,
                                                Principal principal) {
        logger.info("Delete contact request received");
        contactService.deleteContact(principal.getName(), id);
        return ResponseEntity.ok("Contact deleted successfully");
    }
}