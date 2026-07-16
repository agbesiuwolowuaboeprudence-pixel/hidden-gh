package com.hiddengh.backend.controller;

import com.hiddengh.backend.dto.HotelResponse;
import com.hiddengh.backend.entity.Hotel;
import com.hiddengh.backend.exception.ApiException;
import com.hiddengh.backend.repository.HotelRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelRepository hotelRepository;

    @GetMapping
    public List<HotelResponse> listHotels(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) UUID nearSite,
            @RequestParam(required = false) Boolean featured,
            HttpServletRequest request
    ) {
        Specification<Hotel> spec = Specification.where(null);

        if (type != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("type"), type));
        }
        if (nearSite != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("nearSite").get("id"), nearSite));
        }
        if (featured != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("isFeatured"), featured));
        }

        return hotelRepository.findAll(spec).stream()
                .map(h -> toResponse(h, request))
                .toList();
    }

    @GetMapping("/{id}")
    public HotelResponse getHotel(@PathVariable UUID id, HttpServletRequest request) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Hotel not found"));
        return toResponse(hotel, request);
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable UUID id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Hotel not found"));

        if (hotel.getImageData() == null) {
            throw ApiException.notFound("Image not found");
        }

        MediaType mediaType = hotel.getImageMimeType() != null
                ? MediaType.parseMediaType(hotel.getImageMimeType())
                : MediaType.IMAGE_JPEG;

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .body(hotel.getImageData());
    }

    private HotelResponse toResponse(Hotel hotel, HttpServletRequest request) {
        String base = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();

        return HotelResponse.builder()
                .id(hotel.getId().toString())
                .name(hotel.getName())
                .location(hotel.getLocation())
                .price(hotel.getPrice())
                .currency(hotel.getCurrency())
                .rating(hotel.getRating())
                .reviews(hotel.getReviewCount())
                .image(hotel.getImageData() != null ? base + "/api/hotels/" + hotel.getId() + "/image" : null)
                .amenities(hotel.getAmenities())
                .type(hotel.getType())
                .nearSite(hotel.getNearSite() != null ? hotel.getNearSite().getId().toString() : null)
                .available(hotel.isAvailable())
                .featured(hotel.isFeatured())
                .build();
    }
}
