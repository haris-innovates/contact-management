package com.contactmgmt.contact_management.controller;

import com.contactmgmt.contact_management.dto.ContactRequest;
import com.contactmgmt.contact_management.entity.Contact;
import com.contactmgmt.contact_management.service.ContactService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = "*")
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<Contact> createContact(@RequestBody ContactRequest request,
                                                 Principal principal) {
        logger.info("Create contact request received");
        Contact contact = contactService.createContact(principal.getName(), request);
        return ResponseEntity.ok(contact);
    }

    @GetMapping
    public ResponseEntity<Page<Contact>> getContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            Principal principal) {
        logger.info("Get contacts request received");
        Page<Contact> contacts = contactService.getContacts(principal.getName(), page, size, search);
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable Long id,
                                                  Principal principal) {
        logger.info("Get contact by id request received");
        Contact contact = contactService.getContactById(principal.getName(), id);
        return ResponseEntity.ok(contact);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contact> updateContact(@PathVariable Long id,
                                                 @RequestBody ContactRequest request,
                                                 Principal principal) {
        logger.info("Update contact request received");
        Contact contact = contactService.updateContact(principal.getName(), id, request);
        return ResponseEntity.ok(contact);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteContact(@PathVariable Long id,
                                                Principal principal) {
        logger.info("Delete contact request received");
        contactService.deleteContact(principal.getName(), id);
        return ResponseEntity.ok("Contact deleted successfully");
    }
}