package com.hiddenghana.backend.controller;

import com.hiddenghana.backend.dto.SiteResponse;
import com.hiddenghana.backend.entity.Category;
import com.hiddenghana.backend.entity.TouristSite;
import com.hiddenghana.backend.exception.ApiException;
import com.hiddenghana.backend.repository.CategoryRepository;
import com.hiddenghana.backend.repository.TouristSiteRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sites")
@CrossOrigin(origins = "*")
public class SiteController {

    private final TouristSiteRepository siteRepository;
    private final CategoryRepository categoryRepository;

    public SiteController(TouristSiteRepository siteRepository, CategoryRepository categoryRepository) {
        this.siteRepository = siteRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<SiteResponse> listSites(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) Boolean premium,
            @RequestParam(required = false) String search,
            HttpServletRequest request
    ) {
        Specification<TouristSite> spec = Specification.where(null);

        if (category != null && !category.equals("all")) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("id"), category));
        }
        if (region != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("region"), region));
        }
        if (premium != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("isPremium"), premium));
        }
        if (search != null && !search.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%"),
                cb.like(cb.lower(root.get("location")), "%" + search.toLowerCase() + "%")
            ));
        }

        return siteRepository.findAll(spec).stream()
                .map(site -> toResponse(site, request))
                .toList();
    }

    @GetMapping("/{id}")
    public SiteResponse getSite(@PathVariable UUID id, HttpServletRequest request) {
        TouristSite site = siteRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Site not found"));
        return toResponse(site, request);
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getSiteImage(@PathVariable UUID id) {
        TouristSite site = siteRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Site not found"));

        if (site.getImageData() == null) {
            throw ApiException.notFound("Image not found");
        }

        MediaType mediaType = site.getImageMimeType() != null
                ? MediaType.parseMediaType(site.getImageMimeType())
                : MediaType.IMAGE_JPEG;

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .body(site.getImageData());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public SiteResponse createSite(
            @RequestParam String name,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String entryFee,
            @RequestParam(required = false) MultipartFile image,
            HttpServletRequest request
    ) throws IOException {
        if (name == null || name.isBlank()) {
            throw ApiException.badRequest("name is required");
        }

        TouristSite.TouristSiteBuilder builder = TouristSite.builder()
                .name(name)
                .location(location)
                .description(description)
                .region(region)
                .entryFee(entryFee);

        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> ApiException.badRequest("Unknown category: " + categoryId));
            builder.category(category);
        }

        if (image != null && !image.isEmpty()) {
            builder.imageData(image.getBytes());
            builder.imageMimeType(image.getContentType());
        }

        TouristSite saved = siteRepository.save(builder.build());
        return toResponse(saved, request);
    }

    private SiteResponse toResponse(TouristSite site, HttpServletRequest request) {
        String base = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();

        return SiteResponse.builder()
                .id(site.getId().toString())
                .name(site.getName())
                .location(site.getLocation())
                .description(site.getDescription())
                .longDescription(site.getLongDescription())
                .category(site.getCategory() != null ? site.getCategory().getId() : null)
                .region(site.getRegion())
                .openingHours(site.getOpeningHours())
                .entryFee(site.getEntryFee())
                .rating(site.getRating())
                .reviews(site.getReviewCount())
                .image(site.getImageData() != null ? base + "/api/sites/" + site.getId() + "/image" : null)
                .isPremium(site.isPremium())
                .premiumContent(site.getPremiumContent())
                .latitude(site.getLatitude())
                .longitude(site.getLongitude())
                .phone(site.getPhone())
                .website(site.getWebsite())
                .highlights(site.getHighlights())
                .build();
    }
}
