package com.hiddenghana.backend.repository;

import com.hiddenghana.backend.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface HotelRepository extends JpaRepository<Hotel, UUID>,
        JpaSpecificationExecutor<Hotel> {
}
