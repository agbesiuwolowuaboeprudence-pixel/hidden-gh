package com.hiddenghana.backend.controller;

import com.hiddenghana.backend.entity.Guide;
import com.hiddenghana.backend.service.GuideService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guides")
@CrossOrigin(origins = "*")
public class GuideController {

    private final GuideService guideService;

    public GuideController(GuideService guideService) {
        this.guideService = guideService;
    }

    @GetMapping
    public ResponseEntity<List<Guide>> getAllGuides() {
        return ResponseEntity.ok(guideService.getAllGuides());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Guide> getGuideById(@PathVariable Long id) {
        return guideService.getGuideById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/region/{region}")
    public ResponseEntity<List<Guide>> getGuidesByRegion(@PathVariable String region) {
        return ResponseEntity.ok(guideService.getGuidesByRegion(region));
    }

    @GetMapping("/available")
    public ResponseEntity<List<Guide>> getAvailableGuides() {
        return ResponseEntity.ok(guideService.getAvailableGuides());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Guide>> searchGuides(@RequestParam String name) {
        return ResponseEntity.ok(guideService.searchGuides(name));
    }

    @GetMapping("/speciality/{speciality}")
    public ResponseEntity<List<Guide>> getGuidesBySpeciality(@PathVariable String speciality) {
        return ResponseEntity.ok(guideService.getGuidesBySpeciality(speciality));
    }

    @PostMapping
    public ResponseEntity<Guide> createGuide(@RequestBody Guide guide) {
        return ResponseEntity.ok(guideService.createGuide(guide));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Guide> updateGuide(@PathVariable Long id, @RequestBody Guide guide) {
        return ResponseEntity.ok(guideService.updateGuide(id, guide));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGuide(@PathVariable Long id) {
        guideService.deleteGuide(id);
        return ResponseEntity.ok().build();
    }
}