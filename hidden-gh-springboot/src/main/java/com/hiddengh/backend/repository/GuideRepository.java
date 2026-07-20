package com.hiddengh.backend.repository;

import com.hiddengh.backend.entity.Guide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface GuideRepository extends JpaRepository<Guide, UUID>,
        JpaSpecificationExecutor<Guide> {
}
