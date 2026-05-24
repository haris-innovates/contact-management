package com.contactmgmt.contact_management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "phone_numbers")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PhoneNumber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String number;

    private String label;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", nullable = false)
    private Contact contact;
}