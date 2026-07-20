package com.hiddenghana.backend.dto;

import java.time.LocalDate;

public class BookingRequest {

    private String bookingType;
    private Long guideId;
    private Long hotelId;
    private Long siteId;
    private LocalDate bookingDate;
    private String time;
    private String duration;
    private Double amount;

    public BookingRequest() {}

    public String getBookingType() { return bookingType; }
    public void setBookingType(String bookingType) { this.bookingType = bookingType; }

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
}