package com.hiddenghana.backend.service;

import com.hiddenghana.backend.entity.TouristSite;
import com.hiddenghana.backend.repository.TouristSiteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TouristSiteService {

    private final TouristSiteRepository touristSiteRepository;

    public TouristSiteService(TouristSiteRepository touristSiteRepository) {
        this.touristSiteRepository = touristSiteRepository;
    }

    public List<TouristSite> getAllSites() {
        return touristSiteRepository.findAll();
    }

    public Optional<TouristSite> getSiteById(Long id) {
        return touristSiteRepository.findById(id);
    }

    public List<TouristSite> getSitesByCategory(String category) {
        return touristSiteRepository.findByCategory(category);
    }

    public List<TouristSite> getSitesByRegion(String region) {
        return touristSiteRepository.findByRegion(region);
    }

    public List<TouristSite> searchSites(String name) {
        return touristSiteRepository.findByNameContainingIgnoreCase(name);
    }

    public List<TouristSite> getPremiumSites() {
        return touristSiteRepository.findByIsPremium(true);
    }

    public TouristSite createSite(TouristSite site) {
        return touristSiteRepository.save(site);
    }

    public TouristSite updateSite(Long id, TouristSite siteDetails) {
        TouristSite site = touristSiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Site not found"));

        site.setName(siteDetails.getName());
        site.setLocation(siteDetails.getLocation());
        site.setRegion(siteDetails.getRegion());
        site.setDescription(siteDetails.getDescription());
        site.setLongDescription(siteDetails.getLongDescription());
        site.setCategory(siteDetails.getCategory());
        site.setEntryFee(siteDetails.getEntryFee());
        site.setOpeningHours(siteDetails.getOpeningHours());
        site.setRating(siteDetails.getRating());
        site.setImageUrl(siteDetails.getImageUrl());
        site.setPremium(siteDetails.isPremium());
        site.setLatitude(siteDetails.getLatitude());
        site.setLongitude(siteDetails.getLongitude());

        return touristSiteRepository.save(site);
    }

    public void deleteSite(Long id) {
        touristSiteRepository.deleteById(id);
    }

    public void initializeSampleData() {
        createOrUpdateSite(
                "Cape Coast Castle",
                "Cape Coast, Central Region",
                "Central",
                "A UNESCO World Heritage Site and former slave trade fortress.",
                "Cape Coast Castle is one of about forty slave castles built on the Gold Coast of West Africa by European traders.",
                "Historical",
                "GHS 80",
                "9:00 AM - 5:00 PM",
                4.8,
                2341,
                "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/a8/6d/86/ever-been-to-cape-coast.jpg?w=1200&h=-1&s=1",
                false,
                5.1047,
                -1.2427
        );

        createOrUpdateSite(
                "Kakum National Park",
                "Assin Attandanso, Central Region",
                "Central",
                "Famous canopy walkway suspended 30 metres above the rainforest floor.",
                "Kakum National Park covers 375 square kilometres of tropical rainforest.",
                "Nature",
                "GHS 120",
                "8:00 AM - 4:30 PM",
                4.7,
                1892,
                "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80",
                false,
                5.3500,
                -1.3833
        );

        createOrUpdateSite(
                "Mole National Park",
                "Damongo, Savannah Region",
                "Savannah",
                "Ghana's largest wildlife refuge with over 93 mammal species.",
                "Mole National Park is Ghana's largest wildlife sanctuary covering 4,840 square kilometres.",
                "Wildlife",
                "GHS 150",
                "6:00 AM - 6:00 PM",
                4.9,
                3102,
                "https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=600&q=80",
                false,
                9.2610,
                -1.8558
        );

        createOrUpdateSite(
                "Labadi Beach",
                "Accra, Greater Accra",
                "Greater Accra",
                "Most popular beach in Accra, known for live music.",
                "Labadi Beach is the most popular beach in Accra featuring live highlife music.",
                "Beach",
                "GHS 40",
                "8:00 AM - 10:00 PM",
                4.5,
                4200,
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
                false,
                5.5571,
                -0.1469
        );

        createOrUpdateSite(
                "Larabanga Mosque",
                "Larabanga, Savannah Region",
                "Savannah",
                "One of the oldest mosques in West Africa, built around 1421.",
                "The Larabanga Mosque is believed to be one of the oldest mosques in West Africa.",
                "Cultural",
                "GHS 30",
                "Sunrise - Sunset",
                4.6,
                876,
                "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&q=80",
                true,
                9.2259,
                -1.8583
        );
    }

    private TouristSite createOrUpdateSite(
            String name,
            String location,
            String region,
            String description,
            String longDescription,
            String category,
            String entryFee,
            String openingHours,
            double rating,
            int reviews,
            String imageUrl,
            boolean isPremium,
            double latitude,
            double longitude
    ) {
        List<TouristSite> existingSites = touristSiteRepository.findByNameContainingIgnoreCase(name);
        TouristSite site = existingSites.isEmpty() ? new TouristSite() : existingSites.get(0);

        site.setName(name);
        site.setLocation(location);
        site.setRegion(region);
        site.setDescription(description);
        site.setLongDescription(longDescription);
        site.setCategory(category);
        site.setEntryFee(entryFee);
        site.setOpeningHours(openingHours);
        site.setRating(rating);
        site.setReviews(reviews);
        site.setImageUrl(imageUrl);
        site.setPremium(isPremium);
        site.setLatitude(latitude);
        site.setLongitude(longitude);

        return touristSiteRepository.save(site);
    }
}