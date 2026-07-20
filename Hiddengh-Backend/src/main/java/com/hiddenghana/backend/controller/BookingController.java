package com.hiddenghana.backend.controller;

import com.hiddenghana.backend.dto.BookingRequest;
import com.hiddenghana.backend.entity.Booking;
import com.hiddenghana.backend.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody BookingRequest request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(bookingService.createBooking(request, userEmail));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(bookingService.getUserBookings(userEmail));
    }

    @GetMapping("/my-bookings/status/{status}")
    public ResponseEntity<List<Booking>> getMyBookingsByStatus(
            @PathVariable String status,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(bookingService.getUserBookingsByStatus(userEmail, status));
    }

    @GetMapping("/ref/{bookingRef}")
    public ResponseEntity<Booking> getBookingByRef(@PathVariable String bookingRef) {
        return bookingService.getBookingByRef(bookingRef)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(bookingService.cancelBooking(id, userEmail));
    }

    @PutMapping("/{id}/rate")
    public ResponseEntity<Booking> rateBooking(
            @PathVariable Long id,
            @RequestParam Integer rating,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(bookingService.rateBooking(id, rating, userEmail));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
}