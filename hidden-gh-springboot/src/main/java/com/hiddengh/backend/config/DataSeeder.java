package com.hiddengh.backend.config;

import com.hiddengh.backend.entity.Category;
import com.hiddengh.backend.entity.TouristSite;
import com.hiddengh.backend.repository.CategoryRepository;
import com.hiddengh.backend.repository.TouristSiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Seeds baseline categories + a few sample sites on first run, matching the
 * frontend's mockData.ts, so the app has something to display immediately.
 * Only runs when the categories table is empty — safe to leave enabled.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final TouristSiteRepository siteRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            return;
        }

        Category historical = categoryRepository.save(
                Category.builder().id("Historical").label("Historical").icon("building-castle").color("#B08D57").build());
        Category nature = categoryRepository.save(
                Category.builder().id("Nature").label("Nature").icon("leaf").color("#22C55E").build());
        Category wildlife = categoryRepository.save(
                Category.builder().id("Wildlife").label("Wildlife").icon("paw").color("#97C459").build());
        categoryRepository.save(
                Category.builder().id("Cultural").label("Cultural").icon("mask").color("#C9A84C").build());
        categoryRepository.save(
                Category.builder().id("Adventure").label("Adventure").icon("mountain").color("#4A90D9").build());

        siteRepository.saveAll(List.of(
                TouristSite.builder()
                        .name("Elmina Castle")
                        .location("Elmina, Central Region")
                        .description("A UNESCO World Heritage site and one of the oldest European buildings in sub-Saharan Africa.")
                        .category(historical)
                        .region("Central Region")
                        .entryFee("GHS 70")
                        .rating(new BigDecimal("4.7"))
                        .reviewCount(980)
                        .build(),
                TouristSite.builder()
                        .name("Lake Bosomtwe")
                        .location("Ashanti Region")
                        .description("Ghana's only natural lake, formed by a meteorite impact.")
                        .category(nature)
                        .region("Ashanti Region")
                        .entryFee("GHS 45")
                        .rating(new BigDecimal("4.7"))
                        .reviewCount(1340)
                        .build(),
                TouristSite.builder()
                        .name("Paga Crocodile Pond")
                        .location("Paga, Upper East Region")
                        .description("A sacred pond where visitors can safely interact with crocodiles.")
                        .category(wildlife)
                        .region("Upper East Region")
                        .entryFee("GHS 35")
                        .rating(new BigDecimal("4.4"))
                        .reviewCount(654)
                        .isPremium(true)
                        .build()
        ));
    }
}
