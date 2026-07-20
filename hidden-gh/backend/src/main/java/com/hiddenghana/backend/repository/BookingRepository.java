package com.hiddenghana.backend.repository;

import com.hiddenghana.backend.entity.Booking;
import com.hiddenghana.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByUserAndStatus(User user, String status);
    Optional<Booking> findByBookingRef(String bookingRef);
    List<Booking> findByStatus(String status);
}