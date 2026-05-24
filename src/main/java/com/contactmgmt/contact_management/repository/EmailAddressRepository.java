package com.contactmgmt.contact_management.repository;

import com.contactmgmt.contact_management.entity.EmailAddress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailAddressRepository extends JpaRepository<EmailAddress, Long> {}