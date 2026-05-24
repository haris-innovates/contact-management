package com.contactmgmt.contact_management.repository;

import com.contactmgmt.contact_management.entity.PhoneNumber;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhoneNumberRepository extends JpaRepository<PhoneNumber, Long> {}