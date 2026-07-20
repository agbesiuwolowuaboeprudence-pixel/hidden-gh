package com.hiddengh.backend.controller;

import com.hiddengh.backend.dto.BookingResponse;
import com.hiddengh.backend.dto.CreateBookingRequest;
import com.hiddengh.backend.entity.*;
import com.hiddengh.backend.exception.ApiException;
import com.hiddengh.backend.repository.BookingRepository;
import com.hiddengh.backend.repository.GuideRepository;
import com.hiddengh.backend.repository.HotelRepository;
import com.hiddengh.backend.repository.TouristSiteRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private static final String REF_CHARS = "0123456789ABCDEF";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final BookingRepository bookingRepository;
    private final GuideRepository guideRepository;
    private final HotelRepository hotelRepository;
    private final TouristSiteRepository siteRepository;

    @GetMapping
    public List<BookingResponse> listBookings(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Booking.Status status,
            HttpServletRequest request
    ) {
        List<Booking> bookings = status != null
                ? bookingRepository.findByUserAndStatusOrderByBookingDateDesc(user, status)
                : bookingRepository.findByUserOrderByBookingDateDesc(user);

        return bookings.stream().map(b -> toResponse(b, request)).toList();
    }

    @GetMapping("/{id}")
    public BookingResponse getBooking(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            HttpServletRequest request
    ) {
        Booking booking = bookingRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> ApiException.notFound("Booking not found"));
        return toResponse(booking, request);
    }

    @PostMapping
    public BookingResponse createBooking(
            @AuthenticationPrincipal User user,
            @RequestBody CreateBookingRequest req,
            HttpServletRequest request
    ) {
        if (!"guide".equals(req.getType()) && !"hotel".equals(req.getType())) {
            throw ApiException.badRequest("type must be 'guide' or 'hotel'");
        }
        if ("guide".equals(req.getType()) && req.getGuideId() == null) {
            throw ApiException.badRequest("guideId is required for guide bookings");
        }
        if ("hotel".equals(req.getType()) && req.getHotelId() == null) {
            throw ApiException.badRequest("hotelId is required for hotel bookings");
        }

        Booking.BookingBuilder builder = Booking.builder()
                .user(user)
                .type(Booking.Type.valueOf(req.getType()))
                .bookingDate(req.getDate())
                .bookingTime(req.getTime())
                .duration(req.getDuration())
                .amount(req.getAmount())
                .bookingRef(generateBookingRef());

        if (req.getGuideId() != null) {
            Guide guide = guideRepository.findById(req.getGuideId())
                    .orElseThrow(() -> ApiException.badRequest("Guide not found"));
            builder.guide(guide);
        }
        if (req.getHotelId() != null) {
            Hotel hotel = hotelRepository.findById(req.getHotelId())
                    .orElseThrow(() -> ApiException.badRequest("Hotel not found"));
            builder.hotel(hotel);
        }
        if (req.getSiteId() != null) {
            TouristSite site = siteRepository.findById(req.getSiteId())
                    .orElseThrow(() -> ApiException.badRequest("Site not found"));
            builder.site(site);
        }

        Booking saved = bookingRepository.save(builder.build());
        return toResponse(saved, request);
    }

    @PatchMapping("/{id}/cancel")
    public BookingResponse cancelBooking(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            HttpServletRequest request
    ) {
        Booking booking = bookingRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> ApiException.notFound("Booking not found"));

        if (booking.getStatus() != Booking.Status.Upcoming) {
            throw ApiException.badRequest("Only upcoming bookings can be cancelled");
        }

        booking.setStatus(Booking.Status.Cancelled);
        Booking saved = bookingRepository.save(booking);
        return toResponse(saved, request);
    }

    private String generateBookingRef() {
        StringBuilder sb = new StringBuilder("HGH-");
        for (int i = 0; i < 6; i++) {
            sb.append(REF_CHARS.charAt(RANDOM.nextInt(REF_CHARS.length())));
        }
        return sb.toString();
    }

    private BookingResponse toResponse(Booking booking, HttpServletRequest request) {
        String base = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();

        return BookingResponse.builder()
                .id(booking.getId().toString())
                .type(booking.getType().name())
                .guide(booking.getGuide() != null ? booking.getGuide().getName() : null)
                .hotel(booking.getHotel() != null ? booking.getHotel().getName() : null)
                .site(booking.getSite() != null ? booking.getSite().getName() : null)
                .date(booking.getBookingDate())
                .time(booking.getBookingTime())
                .duration(booking.getDuration())
                .amount(booking.getAmount())
                .status(booking.getStatus().name())
                .rating(booking.getRating())
                .avatar(booking.getGuide() != null && booking.getGuide().getAvatarData() != null
                        ? base + "/api/guides/" + booking.getGuide().getId() + "/avatar" : null)
                .siteImage(booking.getSite() != null && booking.getSite().getImageData() != null
                        ? base + "/api/sites/" + booking.getSite().getId() + "/image" : null)
                .bookingRef(booking.getBookingRef())
                .build();
    }
}
