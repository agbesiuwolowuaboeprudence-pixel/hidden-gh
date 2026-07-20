package com.hiddenghana.backend.service;

import com.hiddenghana.backend.entity.Hotel;
import com.hiddenghana.backend.repository.HotelRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public Optional<Hotel> getHotelById(Long id) {
        return hotelRepository.findById(id);
    }

    public List<Hotel> getHotelsByRegion(String region) {
        return hotelRepository.findByRegion(region);
    }

    public List<Hotel> getHotelsByType(String type) {
        return hotelRepository.findByType(type);
    }

    public List<Hotel> getAvailableHotels() {
        return hotelRepository.findByAvailable(true);
    }

    public List<Hotel> getFeaturedHotels() {
        return hotelRepository.findByFeatured(true);
    }

    public List<Hotel> searchHotels(String name) {
        return hotelRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Hotel> getHotelsByMaxPrice(Double price) {
        return hotelRepository.findByPricePerNightLessThanEqual(price);
    }

    public Hotel createHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public Hotel updateHotel(Long id, Hotel hotelDetails) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        hotel.setName(hotelDetails.getName());
        hotel.setLocation(hotelDetails.getLocation());
        hotel.setRegion(hotelDetails.getRegion());
        hotel.setType(hotelDetails.getType());
        hotel.setRating(hotelDetails.getRating());
        hotel.setPricePerNight(hotelDetails.getPricePerNight());
        hotel.setImageUrl(hotelDetails.getImageUrl());
        hotel.setAmenities(hotelDetails.getAmenities());
        hotel.setNearSites(hotelDetails.getNearSites());
        hotel.setAvailable(hotelDetails.isAvailable());
        hotel.setFeatured(hotelDetails.isFeatured());
        hotel.setDescription(hotelDetails.getDescription());
        hotel.setPhone(hotelDetails.getPhone());
        hotel.setEmail(hotelDetails.getEmail());

        return hotelRepository.save(hotel);
    }

    public void deleteHotel(Long id) {
        hotelRepository.deleteById(id);
    }

    public void initializeSampleData() {
        if (hotelRepository.count() == 0) {
            Hotel hotel1 = new Hotel();
            hotel1.setName("Kempinski Hotel Gold Coast");
            hotel1.setLocation("Accra, Greater Accra");
            hotel1.setRegion("Greater Accra");
            hotel1.setType("Luxury Hotel");
            hotel1.setRating(4.9);
            hotel1.setReviews(1240);
            hotel1.setPricePerNight(850.0);
            hotel1.setImageUrl("https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80");
            hotel1.setAmenities("Pool, Spa, WiFi, Gym, Restaurant, Bar");
            hotel1.setNearSites("Kwame Nkrumah Memorial, Labadi Beach");
            hotel1.setAvailable(true);
            hotel1.setFeatured(true);
            hotel1.setDescription("The most prestigious five-star hotel in Ghana located in the heart of Accra.");
            hotel1.setPhone("+233302000001");
            hotel1.setEmail("info@kempinski-accra.com");
            hotelRepository.save(hotel1);

            Hotel hotel2 = new Hotel();
            hotel2.setName("Elmina Beach Resort");
            hotel2.setLocation("Elmina, Central Region");
            hotel2.setRegion("Central");
            hotel2.setType("Beach Resort");
            hotel2.setRating(4.7);
            hotel2.setReviews(654);
            hotel2.setPricePerNight(420.0);
            hotel2.setImageUrl("https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80");
            hotel2.setAmenities("Beach Access, Pool, WiFi, Restaurant, Bar");
            hotel2.setNearSites("Elmina Castle, Cape Coast Castle, Kakum National Park");
            hotel2.setAvailable(true);
            hotel2.setFeatured(true);
            hotel2.setDescription("A stunning beachfront resort just minutes from Elmina Castle.");
            hotel2.setPhone("+233332000002");
            hotel2.setEmail("info@elminabeachresort.com");
            hotelRepository.save(hotel2);

            Hotel hotel3 = new Hotel();
            hotel3.setName("Labadi Beach Hotel");
            hotel3.setLocation("Accra, Greater Accra");
            hotel3.setRegion("Greater Accra");
            hotel3.setType("Beach Hotel");
            hotel3.setRating(4.6);
            hotel3.setReviews(892);
            hotel3.setPricePerNight(380.0);
            hotel3.setImageUrl("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80");
            hotel3.setAmenities("Beach Access, Pool, WiFi, Restaurant, Tennis");
            hotel3.setNearSites("Labadi Beach, Arts Centre");
            hotel3.setAvailable(true);
            hotel3.setFeatured(false);
            hotel3.setDescription("Accra premier beachfront hotel sitting right on the famous Labadi Beach.");
            hotel3.setPhone("+233302000003");
            hotel3.setEmail("info@labadibeachhotel.com");
            hotelRepository.save(hotel3);

            Hotel hotel4 = new Hotel();
            hotel4.setName("Mole Motel");
            hotel4.setLocation("Mole National Park, Savannah Region");
            hotel4.setRegion("Savannah");
            hotel4.setType("Safari Lodge");
            hotel4.setRating(4.5);
            hotel4.setReviews(423);
            hotel4.setPricePerNight(250.0);
            hotel4.setImageUrl("https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=600&q=80");
            hotel4.setAmenities("Pool, WiFi, Restaurant, Safari Tours, Wildlife Viewing");
            hotel4.setNearSites("Mole National Park, Larabanga Mosque");
            hotel4.setAvailable(true);
            hotel4.setFeatured(true);
            hotel4.setDescription("The only accommodation inside Mole National Park with unmatched wildlife viewing.");
            hotel4.setPhone("+233372000004");
            hotel4.setEmail("info@molemotel.com");
            hotelRepository.save(hotel4);

            Hotel hotel5 = new Hotel();
            hotel5.setName("Golden Tulip Kumasi City");
            hotel5.setLocation("Kumasi, Ashanti Region");
            hotel5.setRegion("Ashanti");
            hotel5.setType("City Hotel");
            hotel5.setRating(4.4);
            hotel5.setReviews(567);
            hotel5.setPricePerNight(310.0);
            hotel5.setImageUrl("https://images.unsplash.com/photo-1580746738099-b2d424ea3bc8?w=600&q=80");
            hotel5.setAmenities("Pool, WiFi, Gym, Restaurant, Conference Rooms");
            hotel5.setNearSites("Manhyia Palace, Kejetia Market, Lake Bosomtwe");
            hotel5.setAvailable(true);
            hotel5.setFeatured(false);
            hotel5.setDescription("The finest hotel in Kumasi perfectly located for exploring Ashanti royal heritage.");
            hotel5.setPhone("+233322000005");
            hotel5.setEmail("info@goldentulipkumasi.com");
            hotelRepository.save(hotel5);
        }
    }
}