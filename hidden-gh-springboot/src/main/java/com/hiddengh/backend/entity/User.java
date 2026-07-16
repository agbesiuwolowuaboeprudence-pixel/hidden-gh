package com.hiddengh.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(length = 30)
    private String phone;

    @Column(length = 120)
    private String location;

    @Lob
    @Column(name = "avatar_data")
    private byte[] avatarData;

    @Column(name = "avatar_mime_type", length = 50)
    private String avatarMimeType;

    @Column(name = "is_premium")
    @Builder.Default
    private boolean isPremium = false;

    @Column(name = "member_since")
    @Builder.Default
    private Instant memberSince = Instant.now();

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}
