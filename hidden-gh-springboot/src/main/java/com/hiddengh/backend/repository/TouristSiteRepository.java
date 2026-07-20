package com.hiddengh.backend.repository;

import com.hiddengh.backend.entity.TouristSite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface TouristSiteRepository extends JpaRepository<TouristSite, UUID>,
        JpaSpecificationExecutor<TouristSite> {
}
