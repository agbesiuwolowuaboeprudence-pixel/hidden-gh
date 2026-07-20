package com.hiddengh.backend.repository;

import com.hiddengh.backend.entity.Notification;
import com.hiddengh.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    Optional<Notification> findByIdAndUser(UUID id, User user);
    List<Notification> findByUserAndIsReadFalse(User user);
}
