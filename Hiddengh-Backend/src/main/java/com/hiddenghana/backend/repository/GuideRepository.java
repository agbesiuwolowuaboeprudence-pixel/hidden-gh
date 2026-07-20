package com.hiddenghana.backend.repository;

import com.hiddenghana.backend.entity.Guide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;



@Repository
public interface GuideRepository extends JpaRepository<Guide, Long> {
    List<Guide> findByRegion(String region);
    List<Guide> findByAvailable(boolean available);
    List<Guide> findBySpecialityContainingIgnoreCase(String speciality);
    List<Guide> findByNameContainingIgnoreCase(String name);
}