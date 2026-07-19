package com.hiddenghana.backend.controller;

import com.hiddenghana.backend.dto.GuideResponse;
import com.hiddenghana.backend.entity.Guide;
import com.hiddenghana.backend.entity.TouristSite;
import com.hiddenghana.backend.exception.ApiException;
import com.hiddenghana.backend.repository.GuideRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/guides")
@CrossOrigin(origins = "*")
public class GuideController {

    private final GuideRepository guideRepository;

    public GuideController(GuideRepository guideRepository) {
        this.guideRepository = guideRepository;
    }

    @GetMapping
    public List<GuideResponse> listGuides(
            @RequestParam(required = false) String region,
            @RequestParam(required = false) Boolean available,
            HttpServletRequest request
    ) {
        Specification<Guide> spec = Specification.where(null);

        if (region != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("region"), region));
        }
        if (available != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("isAvailable"), available));
        }

        return guideRepository.findAll(spec).stream()
                .map(g -> toResponse(g, request))
                .toList();
    }

    @GetMapping("/{id}")
    public GuideResponse getGuide(@PathVariable UUID id, HttpServletRequest request) {
        Guide guide = guideRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Guide not found"));
        return toResponse(guide, request);
    }

    @GetMapping("/{id}/avatar")
    public ResponseEntity<byte[]> getAvatar(@PathVariable UUID id) {
        Guide guide = guideRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Guide not found"));

        if (guide.getAvatarData() == null) {
            throw ApiException.notFound("Avatar not found");
        }

        MediaType mediaType = guide.getAvatarMimeType() != null
                ? MediaType.parseMediaType(guide.getAvatarMimeType())
                : MediaType.IMAGE_JPEG;

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .body(guide.getAvatarData());
    }

    private GuideResponse toResponse(Guide guide, HttpServletRequest request) {
        String base = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();

        return GuideResponse.builder()
                .id(guide.getId().toString())
                .name(guide.getName())
                .region(guide.getRegion())
                .speciality(guide.getSpeciality())
                .rating(guide.getRating())
                .reviews(guide.getReviewCount())
                .languages(guide.getLanguages())
                .available(guide.isAvailable())
                .avatar(guide.getAvatarData() != null ? base + "/api/guides/" + guide.getId() + "/avatar" : null)
                .bio(guide.getBio())
                .tours(guide.getToursCompleted())
                .experience(guide.getExperience())
                .price(guide.getPrice())
                .sites(guide.getSites() != null
                        ? guide.getSites().stream().map(TouristSite::getId).map(UUID::toString).toList()
                        : List.of())
                .build();
    }
}
