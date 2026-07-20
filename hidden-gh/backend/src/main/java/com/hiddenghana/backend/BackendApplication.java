package com.hiddenghana.backend;

import com.hiddenghana.backend.service.GuideService;
import com.hiddenghana.backend.service.HotelService;
import com.hiddenghana.backend.service.TouristSiteService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(
            TouristSiteService touristSiteService,
            GuideService guideService,
            HotelService hotelService
    ) {
        return args -> {
            touristSiteService.initializeSampleData();
            guideService.initializeSampleData();
            hotelService.initializeSampleData();
            System.out.println("All sample data initialized successfully!");
        };
    }
}