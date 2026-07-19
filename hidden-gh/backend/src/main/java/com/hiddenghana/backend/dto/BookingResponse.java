package com.hiddenghana.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private String id;
    private String type;
    private String guide;
    private String hotel;
    private String site;
    private LocalDate date;
    private String time;
    private String duration;
    private BigDecimal amount;
    private String status;
    private Integer rating;
    private String avatar;
    private String siteImage;
    private String bookingRef;
}
