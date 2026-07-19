package com.hiddenghana.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    public enum Type { guide, hotel }
    public enum Status { Upcoming, Completed, Cancelled }

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guide_id")
    private Guide guide;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id")
    private TouristSite site;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    @Column(name = "booking_time", length = 20)
    private String bookingTime;

    @Column(length = 30)
    private String duration;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.Upcoming;

    private Integer rating;

    @Column(name = "booking_ref", unique = true, length = 30)
    private String bookingRef;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}
