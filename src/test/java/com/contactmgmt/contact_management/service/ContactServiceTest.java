package com.contactmgmt.contact_management.service;

import com.contactmgmt.contact_management.dto.ContactRequest;
import com.contactmgmt.contact_management.entity.Contact;
import com.contactmgmt.contact_management.entity.User;
import com.contactmgmt.contact_management.repository.ContactRepository;
import com.contactmgmt.contact_management.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ContactServiceTest {

    @Mock
    private ContactRepository contactRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ContactService contactService;

    private User testUser;
    private Contact testContact;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .email("test@gmail.com")
                .password("encodedPassword")
                .firstName("Muhammad")
                .lastName("Haris")
                .build();

        testContact = new Contact();
        testContact.setFirstName("John");
        testContact.setLastName("Doe");
        testContact.setTitle("Mr");
        testContact.setUser(testUser);
    }

    @Test
    void createContact_Success() {
        ContactRequest request = new ContactRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setTitle("Mr");

        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(testUser));
        when(contactRepository.save(any(Contact.class))).thenReturn(testContact);

        Contact result = contactService.createContact("test@gmail.com", request);

        assertNotNull(result);
        assertEquals("John", result.getFirstName());
        assertEquals("Doe", result.getLastName());
        verify(contactRepository, times(1)).save(any(Contact.class));
    }

    @Test
    void createContact_UserNotFound_ThrowsException() {
        ContactRequest request = new ContactRequest();
        request.setFirstName("John");
        request.setLastName("Doe");

        when(userRepository.findByEmail("notfound@gmail.com")).thenReturn(Optional.empty());
        when(userRepository.findByPhoneNumber("notfound@gmail.com")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> contactService.createContact("notfound@gmail.com", request));
    }

    @Test
    void getContacts_Success() {
        Page<Contact> page = new PageImpl<>(List.of(testContact));

        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(testUser));
        when(contactRepository.findByUserId(any(), any(Pageable.class))).thenReturn(page);

        Page<Contact> result = contactService.getContacts("test@gmail.com", 0, 10, null);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void deleteContact_Success() {
        when(contactRepository.findById(1L)).thenReturn(Optional.of(testContact));

        contactService.deleteContact("test@gmail.com", 1L);

        verify(contactRepository, times(1)).delete(testContact);
    }

    @Test
    void deleteContact_NotFound_ThrowsException() {
        when(contactRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> contactService.deleteContact("test@gmail.com", 99L));
    }
}