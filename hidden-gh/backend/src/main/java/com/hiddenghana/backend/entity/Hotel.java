package com.hiddenghana.backend.entity;

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
@Table(name = "hotels")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hotel {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(length = 200)
    private String location;

    private BigDecimal price;

    @Column(length = 10)
    @Builder.Default
    private String currency = "GHS";

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

    @ElementCollection
    @CollectionTable(name = "hotel_amenities", joinColumns = @JoinColumn(name = "hotel_id"))
    @Column(name = "amenity")
    private List<String> amenities;

    @Column(length = 60)
    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "near_site_id")
    private TouristSite nearSite;

    @Column(name = "is_available")
    @Builder.Default
    private boolean isAvailable = true;

    @Column(name = "is_featured")
    @Builder.Default
    private boolean isFeatured = false;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}
