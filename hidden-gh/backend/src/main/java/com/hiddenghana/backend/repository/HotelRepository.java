package com.hiddenghana.backend.repository;

import com.hiddenghana.backend.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByRegion(String region);
    List<Hotel> findByType(String type);
    List<Hotel> findByAvailable(boolean available);
    List<Hotel> findByFeatured(boolean featured);
    List<Hotel> findByNameContainingIgnoreCase(String name);
    List<Hotel> findByPricePerNightLessThanEqual(Double price);
}