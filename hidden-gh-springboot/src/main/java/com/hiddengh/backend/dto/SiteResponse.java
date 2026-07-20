package com.hiddengh.backend.dto;

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
public class SiteResponse {
    private String id;
    private String name;
    private String location;
    private String description;
    private String longDescription;
    private String category;
    private String region;
    private String openingHours;
    private String entryFee;
    private BigDecimal rating;
    private Integer reviews;
    private String image;
    private boolean isPremium;
    private String premiumContent;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String phone;
    private String website;
    private List<String> highlights;
}
