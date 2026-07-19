package com.hiddenghana.backend.controller;

import com.hiddenghana.backend.dto.UserResponse;
import com.hiddenghana.backend.entity.User;
import com.hiddenghana.backend.repository.BookingRepository;
import com.hiddenghana.backend.repository.UserRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public UserController(UserRepository userRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal User user) {
        long toursBooked = bookingRepository.findByUserOrderByBookingDateDesc(user).size();

        return UserResponse.builder()
                .id(user.getId().toString())
                .name(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .location(user.getLocation())
                .memberSince(user.getCreatedAt())
                .isPremium(user.isPremium())
                .avatar(user.getAvatarData() != null ? "/api/users/" + user.getId() + "/avatar" : null)
                .stats(UserResponse.UserStats.builder()
                        .sitesVisited(0)
                        .savedSites(0)
                        .toursBooked(toursBooked)
                        .reviews(0)
                        .build())
                .build();
    }

    @PatchMapping("/me")
    public UserResponse updateMe(
            @AuthenticationPrincipal User user,
            @RequestBody UpdateProfileRequest req
    ) {
        if (req.name() != null) user.setFullName(req.name());
        if (req.phone() != null) user.setPhone(req.phone());
        if (req.location() != null) user.setLocation(req.location());

        userRepository.save(user);
        return me(user);
    }

    @GetMapping("/{id}/avatar")
    public ResponseEntity<byte[]> getAvatar(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        if (user.getAvatarData() == null) {
            return ResponseEntity.notFound().build();
        }

        MediaType mediaType = user.getAvatarMimeType() != null
                ? MediaType.parseMediaType(user.getAvatarMimeType())
                : MediaType.IMAGE_JPEG;

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .body(user.getAvatarData());
    }

    public record UpdateProfileRequest(String name, String phone, String location) {}
}
