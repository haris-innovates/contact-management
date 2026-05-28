package com.contactmgmt.contact_management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "email_addresses")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    private String label;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", nullable = false)
    private Contact contact;
}