package com.contactmgmt.contact_management.service;

import com.contactmgmt.contact_management.dto.ContactRequest;
import com.contactmgmt.contact_management.dto.EmailDto;
import com.contactmgmt.contact_management.dto.PhoneDto;
import com.contactmgmt.contact_management.entity.Contact;
import com.contactmgmt.contact_management.entity.EmailAddress;
import com.contactmgmt.contact_management.entity.PhoneNumber;
import com.contactmgmt.contact_management.entity.User;
import com.contactmgmt.contact_management.repository.ContactRepository;
import com.contactmgmt.contact_management.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.contactmgmt.contact_management.exception.AppException;

import java.util.ArrayList;
import java.util.List;

@Service
public class ContactService {
    private static final String CONTACT_NOT_FOUND = "Contact not found";
    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    public ContactService(ContactRepository contactRepository, UserRepository userRepository) {
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
    }

    public Contact createContact(String identifier, ContactRequest request) {
        logger.info("Creating contact for user: {}", identifier);

        User user = userRepository.findByEmail(identifier)
                .orElseGet(() -> userRepository.findByPhoneNumber(identifier)
                        .orElseThrow(() -> new AppException("User not found")));

        Contact contact = new Contact();
        contact.setFirstName(request.getFirstName());
        contact.setLastName(request.getLastName());
        contact.setTitle(request.getTitle());
        contact.setUser(user);

        if (request.getPhoneNumbers() != null) {
            List<PhoneNumber> phones = new ArrayList<>();
            for (PhoneDto dto : request.getPhoneNumbers()) {
                PhoneNumber phone = new PhoneNumber();
                phone.setNumber(dto.getNumber());
                phone.setLabel(dto.getLabel());
                phone.setContact(contact);
                phones.add(phone);
            }
            contact.setPhoneNumbers(phones);
        }

        if (request.getEmailAddresses() != null) {
            List<EmailAddress> emails = new ArrayList<>();
            for (EmailDto dto : request.getEmailAddresses()) {
                EmailAddress email = new EmailAddress();
                email.setEmail(dto.getEmail());
                email.setLabel(dto.getLabel());
                email.setContact(contact);
                emails.add(email);
            }
            contact.setEmailAddresses(emails);
        }

        return contactRepository.save(contact);
    }

    public Page<Contact> getContacts(String identifier, int page, int size, String search) {
        logger.info("Fetching contacts for user: {}", identifier);

        User user = userRepository.findByEmail(identifier)
                .orElseGet(() -> userRepository.findByPhoneNumber(identifier)
                        .orElseThrow(() -> new AppException("User not found")));

        Pageable pageable = PageRequest.of(page, size);

        if (search != null && !search.isEmpty()) {
            return contactRepository.searchByUserIdAndName(user.getId(), search, pageable);
        }
        return contactRepository.findByUserId(user.getId(), pageable);
    }

    public Contact updateContact(String identifier, Long contactId, ContactRequest request) {
        logger.info("Updating contact {} for user: {}", contactId, identifier);

        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new AppException(CONTACT_NOT_FOUND));

        contact.setFirstName(request.getFirstName());
        contact.setLastName(request.getLastName());
        contact.setTitle(request.getTitle());

        if (request.getPhoneNumbers() != null) {
            contact.getPhoneNumbers().clear();
            for (PhoneDto dto : request.getPhoneNumbers()) {
                PhoneNumber phone = new PhoneNumber();
                phone.setNumber(dto.getNumber());
                phone.setLabel(dto.getLabel());
                phone.setContact(contact);
                contact.getPhoneNumbers().add(phone);
            }
        }

        if (request.getEmailAddresses() != null) {
            contact.getEmailAddresses().clear();
            for (EmailDto dto : request.getEmailAddresses()) {
                EmailAddress email = new EmailAddress();
                email.setEmail(dto.getEmail());
                email.setLabel(dto.getLabel());
                email.setContact(contact);
                contact.getEmailAddresses().add(email);
            }
        }

        return contactRepository.save(contact);
    }

    public void deleteContact(String identifier, Long contactId) {
        logger.info("Deleting contact {} for user: {}", contactId, identifier);
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new AppException(CONTACT_NOT_FOUND));
        contactRepository.delete(contact);
    }

    public Contact getContactById(String identifier, Long contactId) {
        logger.info("Fetching contact {} for user: {}", contactId, identifier);
        return contactRepository.findById(contactId)
                .orElseThrow(() -> new AppException(CONTACT_NOT_FOUND));
    }
}