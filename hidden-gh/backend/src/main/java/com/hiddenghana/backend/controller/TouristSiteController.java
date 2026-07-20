package com.hiddenghana.backend.controller;

import com.hiddenghana.backend.entity.TouristSite;
import com.hiddenghana.backend.service.TouristSiteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites")
@CrossOrigin(origins = "*")
public class TouristSiteController {

    private final TouristSiteService touristSiteService;

    public TouristSiteController(TouristSiteService touristSiteService) {
        this.touristSiteService = touristSiteService;
    }

    @GetMapping
    public ResponseEntity<List<TouristSite>> getAllSites() {
        return ResponseEntity.ok(touristSiteService.getAllSites());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TouristSite> getSiteById(@PathVariable Long id) {
        return touristSiteService.getSiteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<TouristSite>> getSitesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(touristSiteService.getSitesByCategory(category));
    }

    @GetMapping("/region/{region}")
    public ResponseEntity<List<TouristSite>> getSitesByRegion(@PathVariable String region) {
        return ResponseEntity.ok(touristSiteService.getSitesByRegion(region));
    }

    @GetMapping("/search")
    public ResponseEntity<List<TouristSite>> searchSites(@RequestParam String name) {
        return ResponseEntity.ok(touristSiteService.searchSites(name));
    }

    @GetMapping("/premium")
    public ResponseEntity<List<TouristSite>> getPremiumSites() {
        return ResponseEntity.ok(touristSiteService.getPremiumSites());
    }

    @PostMapping
    public ResponseEntity<TouristSite> createSite(@RequestBody TouristSite site) {
        return ResponseEntity.ok(touristSiteService.createSite(site));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TouristSite> updateSite(@PathVariable Long id, @RequestBody TouristSite site) {
        return ResponseEntity.ok(touristSiteService.updateSite(id, site));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSite(@PathVariable Long id) {
        touristSiteService.deleteSite(id);
        return ResponseEntity.ok().build();
    }
}