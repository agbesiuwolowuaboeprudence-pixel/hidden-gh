package com.hiddenghana.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotelResponse {
    private String id;
    private String name;
    private String location;
    private BigDecimal price;
    private String currency;
    private BigDecimal rating;
    private Integer reviews;
    private String image;
    private List<String> amenities;
    private String type;
    private String nearSite;
    private boolean available;
    private boolean featured;
}
