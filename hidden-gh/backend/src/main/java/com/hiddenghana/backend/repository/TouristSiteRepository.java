package com.hiddenghana.backend.repository;

import com.hiddenghana.backend.entity.TouristSite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TouristSiteRepository extends JpaRepository<TouristSite, Long> {
    List<TouristSite> findByCategory(String category);
    List<TouristSite> findByRegion(String region);
    List<TouristSite> findByIsPremium(boolean isPremium);
    List<TouristSite> findByNameContainingIgnoreCase(String name);
}