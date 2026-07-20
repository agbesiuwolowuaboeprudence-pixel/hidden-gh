package com.hiddengh.backend.controller;

import com.hiddengh.backend.dto.NotificationResponse;
import com.hiddengh.backend.entity.Notification;
import com.hiddengh.backend.entity.User;
import com.hiddengh.backend.exception.ApiException;
import com.hiddengh.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

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
