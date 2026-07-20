package com.hiddenghana.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String bookingType;

    @Column(nullable = false)
    private String bookingRef;

    @Column
    private Long guideId;

    @Column
    private Long hotelId;

    @Column
    private Long siteId;

    @Column(nullable = false)
    private LocalDate bookingDate;

    @Column(nullable = false)
    private String time;

    @Column(nullable = false)
    private String duration;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String status;

    @Column
    private Integer rating;

    @Column
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        bookingRef = "HG-" + System.currentTimeMillis();
    }

    public Booking() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getBookingType() { return bookingType; }
    public void setBookingType(String bookingType) { this.bookingType = bookingType; }

    public String getBookingRef() { return bookingRef; }
    public void setBookingRef(String bookingRef) { this.bookingRef = bookingRef; }

    public Long getGuideId() { return guideId; }
    public void setGuideId(Long guideId) { this.guideId = guideId; }

    public Long getHotelId() { return hotelId; }
    public void setHotelId(Long hotelId) { this.hotelId = hotelId; }

    public Long getSiteId() { return siteId; }
    public void setSiteId(Long siteId) { this.siteId = siteId; }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}