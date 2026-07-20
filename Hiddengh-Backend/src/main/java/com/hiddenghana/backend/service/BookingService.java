package com.hiddenghana.backend.service;

import com.hiddenghana.backend.dto.BookingRequest;
import com.hiddenghana.backend.entity.Booking;
import com.hiddenghana.backend.entity.User;
import com.hiddenghana.backend.repository.BookingRepository;
import com.hiddenghana.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            UserRepository userRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    public Booking createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setBookingType(request.getBookingType());
        booking.setGuideId(request.getGuideId());
        booking.setHotelId(request.getHotelId());
        booking.setSiteId(request.getSiteId());
        booking.setBookingDate(request.getBookingDate());
        booking.setTime(request.getTime());
        booking.setDuration(request.getDuration());
        booking.setAmount(request.getAmount());
        booking.setStatus("Upcoming");

        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUser(user);
    }

    public List<Booking> getUserBookingsByStatus(String userEmail, String status) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUserAndStatus(user, status);
    }

    public Optional<Booking> getBookingByRef(String bookingRef) {
        return bookingRepository.findByBookingRef(bookingRef);
    }

    public Booking cancelBooking(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to cancel this booking");
        }

        booking.setStatus("Cancelled");
        return bookingRepository.save(booking);
    }

    public Booking rateBooking(Long id, Integer rating, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to rate this booking");
        }

        booking.setRating(rating);
        booking.setStatus("Completed");
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}