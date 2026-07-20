package com.hiddenghana.backend.controller;

import com.hiddenghana.backend.dto.NotificationResponse;
import com.hiddenghana.backend.entity.Notification;
import com.hiddenghana.backend.entity.User;
import com.hiddenghana.backend.exception.ApiException;
import com.hiddenghana.backend.repository.NotificationRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public List<NotificationResponse> list(@AuthenticationPrincipal User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::toResponse)
                .toList();
    }

    @PatchMapping("/{id}/read")
    public NotificationResponse markRead(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        Notification n = notificationRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> ApiException.notFound("Notification not found"));
        n.setRead(true);
        return toResponse(notificationRepository.save(n));
    }

    @PatchMapping("/read-all")
    public void markAllRead(@AuthenticationPrincipal User user) {
        List<Notification> unread = notificationRepository.findByUserAndIsReadFalse(user);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId().toString())
                .title(n.getTitle())
                .body(n.getBody())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
