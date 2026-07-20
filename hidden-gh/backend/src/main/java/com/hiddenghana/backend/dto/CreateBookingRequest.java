package com.hiddenghana.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreateBookingRequest {
    @NotNull
    private String type; // "guide" or "hotel"

    private UUID guideId;
    private UUID hotelId;
    private UUID siteId;

    private LocalDate date;
    private String time;
    private String duration;
    private BigDecimal amount;
}
