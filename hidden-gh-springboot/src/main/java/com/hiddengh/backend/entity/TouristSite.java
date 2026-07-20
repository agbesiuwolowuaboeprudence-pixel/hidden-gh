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
@Table(name = "tourist_sites")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TouristSite {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(length = 200)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "long_description", columnDefinition = "TEXT")
    private String longDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(length = 60)
    private String region;

    @Column(name = "opening_hours", length = 100)
    private String openingHours;

    @Column(name = "entry_fee", length = 50)
    private String entryFee;

    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(name = "review_count")
    @Builder.Default
    private Integer reviewCount = 0;

    @Lob
    @Column(name = "image_data")
    private byte[] imageData;

    @Column(name = "image_mime_type", length = 50)
    private String imageMimeType;

    @Column(name = "is_premium")
    @Builder.Default
    private boolean isPremium = false;

    @Column(name = "premium_content", columnDefinition = "TEXT")
    private String premiumContent;

    private BigDecimal latitude;
    private BigDecimal longitude;

    @Column(length = 30)
    private String phone;

    @Column(length = 200)
    private String website;

    @ElementCollection
    @CollectionTable(name = "tourist_site_highlights", joinColumns = @JoinColumn(name = "site_id"))
    @Column(name = "highlight")
    private List<String> highlights;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}
