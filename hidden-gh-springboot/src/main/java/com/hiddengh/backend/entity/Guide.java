package com.hiddengh.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "guides")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Guide {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 60)
    private String region;

    @Column(length = 120)
    private String speciality;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @ElementCollection
    @CollectionTable(name = "guide_languages", joinColumns = @JoinColumn(name = "guide_id"))
    @Column(name = "language")
    private List<String> languages;

    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(name = "review_count")
    @Builder.Default
    private Integer reviewCount = 0;

    @Column(name = "tours_completed")
    @Builder.Default
    private Integer toursCompleted = 0;

    @Column(length = 60)
    private String experience;

    @Column(length = 50)
    private String price;

    @Lob
    @Column(name = "avatar_data")
    private byte[] avatarData;

    @Column(name = "avatar_mime_type", length = 50)
    private String avatarMimeType;

    @Column(name = "is_available")
    @Builder.Default
    private boolean isAvailable = true;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();

    @ManyToMany
    @JoinTable(
            name = "guide_sites",
            joinColumns = @JoinColumn(name = "guide_id"),
            inverseJoinColumns = @JoinColumn(name = "site_id")
    )
    private List<TouristSite> sites;
}
