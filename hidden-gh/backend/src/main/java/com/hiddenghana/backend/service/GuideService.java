package com.hiddenghana.backend.service;

import com.hiddenghana.backend.entity.Guide;
import com.hiddenghana.backend.repository.GuideRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GuideService {

    private final GuideRepository guideRepository;

    public GuideService(GuideRepository guideRepository) {
        this.guideRepository = guideRepository;
    }

    public List<Guide> getAllGuides() {
        return guideRepository.findAll();
    }

    public Optional<Guide> getGuideById(Long id) {
        return guideRepository.findById(id);
    }

    public List<Guide> getGuidesByRegion(String region) {
        return guideRepository.findByRegion(region);
    }

    public List<Guide> getAvailableGuides() {
        return guideRepository.findByAvailable(true);
    }

    public List<Guide> searchGuides(String name) {
        return guideRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Guide> getGuidesBySpeciality(String speciality) {
        return guideRepository.findBySpecialityContainingIgnoreCase(speciality);
    }

    public Guide createGuide(Guide guide) {
        return guideRepository.save(guide);
    }

    public Guide updateGuide(Long id, Guide guideDetails) {
        Guide guide = guideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guide not found"));

        guide.setName(guideDetails.getName());
        guide.setRegion(guideDetails.getRegion());
        guide.setSpeciality(guideDetails.getSpeciality());
        guide.setRating(guideDetails.getRating());
        guide.setLanguages(guideDetails.getLanguages());
        guide.setAvailable(guideDetails.isAvailable());
        guide.setTours(guideDetails.getTours());
        guide.setExperience(guideDetails.getExperience());
        guide.setAvatarUrl(guideDetails.getAvatarUrl());
        guide.setBio(guideDetails.getBio());
        guide.setPrice(guideDetails.getPrice());
        guide.setPhone(guideDetails.getPhone());
        guide.setEmail(guideDetails.getEmail());

        return guideRepository.save(guide);
    }

    public void deleteGuide(Long id) {
        guideRepository.deleteById(id);
    }

    public void initializeSampleData() {
        if (guideRepository.count() == 0) {
            Guide guide1 = new Guide();
            guide1.setName("Kwame Asante");
            guide1.setRegion("Central Region");
            guide1.setSpeciality("History & Slave Trade");
            guide1.setRating(4.9);
            guide1.setReviews(312);
            guide1.setLanguages("English, Twi, Fante");
            guide1.setAvailable(true);
            guide1.setTours(148);
            guide1.setExperience("8 years");
            guide1.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80");
            guide1.setBio("Licensed tour guide specialising in Cape Coast Castle and Elmina.");
            guide1.setPrice("GHS 150/hr");
            guide1.setPhone("+233240000001");
            guide1.setEmail("kwame@hiddenghana.com");
            guideRepository.save(guide1);

            Guide guide2 = new Guide();
            guide2.setName("Abena Mensah");
            guide2.setRegion("Greater Accra");
            guide2.setSpeciality("Culture & Art");
            guide2.setRating(4.8);
            guide2.setReviews(198);
            guide2.setLanguages("English, Twi, Ga");
            guide2.setAvailable(true);
            guide2.setTours(95);
            guide2.setExperience("5 years");
            guide2.setAvatarUrl("https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80");
            guide2.setBio("Cultural historian and certified guide covering Accra arts scene.");
            guide2.setPrice("GHS 120/hr");
            guide2.setPhone("+233240000002");
            guide2.setEmail("abena@hiddenghana.com");
            guideRepository.save(guide2);

            Guide guide3 = new Guide();
            guide3.setName("Kofi Boateng");
            guide3.setRegion("Savannah Region");
            guide3.setSpeciality("Wildlife & Nature");
            guide3.setRating(4.7);
            guide3.setReviews(245);
            guide3.setLanguages("English, Dagbani");
            guide3.setAvailable(false);
            guide3.setTours(203);
            guide3.setExperience("10 years");
            guide3.setAvatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80");
            guide3.setBio("Wildlife specialist with deep knowledge of Mole National Park.");
            guide3.setPrice("GHS 180/hr");
            guide3.setPhone("+233240000003");
            guide3.setEmail("kofi@hiddenghana.com");
            guideRepository.save(guide3);

            Guide guide4 = new Guide();
            guide4.setName("Ama Owusu");
            guide4.setRegion("Ashanti Region");
            guide4.setSpeciality("Royal Heritage & Culture");
            guide4.setRating(4.9);
            guide4.setReviews(421);
            guide4.setLanguages("English, Twi");
            guide4.setAvailable(true);
            guide4.setTours(310);
            guide4.setExperience("12 years");
            guide4.setAvatarUrl("https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=300&q=80");
            guide4.setBio("Expert in Ashanti royal heritage and Manhyia Palace.");
            guide4.setPrice("GHS 160/hr");
            guide4.setPhone("+233240000004");
            guide4.setEmail("ama@hiddenghana.com");
            guideRepository.save(guide4);
        }
    }
}