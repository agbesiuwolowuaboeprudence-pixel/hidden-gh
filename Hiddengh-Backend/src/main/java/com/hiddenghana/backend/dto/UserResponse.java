package com.hiddenghana.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String location;
    private LocalDateTime memberSince;
    private boolean isPremium;
    private String avatar;
    private UserStats stats;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserStats {
        private long sitesVisited;
        private long savedSites;
        private long toursBooked;
        private long reviews;
    }
}
