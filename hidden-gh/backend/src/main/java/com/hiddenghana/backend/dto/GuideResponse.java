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
public class GuideResponse {
    private String id;
    private String name;
    private String region;
    private String speciality;
    private BigDecimal rating;
    private Integer reviews;
    private List<String> languages;
    private boolean available;
    private String avatar;
    private String bio;
    private Integer tours;
    private String experience;
    private String price;
    private List<String> sites;
}
