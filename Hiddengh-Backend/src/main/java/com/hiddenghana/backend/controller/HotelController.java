package com.hiddenghana.backend.controller;

import com.hiddenghana.backend.entity.Hotel;
import com.hiddenghana.backend.service.HotelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "*")
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllHotels());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        return hotelService.getHotelById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/region/{region}")
    public ResponseEntity<List<Hotel>> getHotelsByRegion(@PathVariable String region) {
        return ResponseEntity.ok(hotelService.getHotelsByRegion(region));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Hotel>> getHotelsByType(@PathVariable String type) {
        return ResponseEntity.ok(hotelService.getHotelsByType(type));
    }

    @GetMapping("/available")
    public ResponseEntity<List<Hotel>> getAvailableHotels() {
        return ResponseEntity.ok(hotelService.getAvailableHotels());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Hotel>> getFeaturedHotels() {
        return ResponseEntity.ok(hotelService.getFeaturedHotels());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Hotel>> searchHotels(@RequestParam String name) {
        return ResponseEntity.ok(hotelService.searchHotels(name));
    }

    @GetMapping("/price")
    public ResponseEntity<List<Hotel>> getHotelsByMaxPrice(@RequestParam Double maxPrice) {
        return ResponseEntity.ok(hotelService.getHotelsByMaxPrice(maxPrice));
    }

    @PostMapping
    public ResponseEntity<Hotel> createHotel(@RequestBody Hotel hotel) {
        return ResponseEntity.ok(hotelService.createHotel(hotel));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Long id, @RequestBody Hotel hotel) {
        return ResponseEntity.ok(hotelService.updateHotel(id, hotel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.ok().build();
    }
}