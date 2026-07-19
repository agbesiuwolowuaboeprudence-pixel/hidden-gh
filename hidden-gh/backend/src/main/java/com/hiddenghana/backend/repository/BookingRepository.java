package com.hiddenghana.backend.repository;

import com.hiddenghana.backend.entity.Booking;
import com.hiddenghana.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByUserOrderByBookingDateDesc(User user);
    List<Booking> findByUserAndStatusOrderByBookingDateDesc(User user, Booking.Status status);
    Optional<Booking> findByIdAndUser(UUID id, User user);
}
