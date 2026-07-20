package com.hiddenghana.backend.service;

import com.hiddenghana.backend.entity.TouristSite;
import com.hiddenghana.backend.repository.TouristSiteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TouristSiteServiceTest {

    @Mock
    private TouristSiteRepository touristSiteRepository;

    @InjectMocks
    private TouristSiteService touristSiteService;

    @Test
    void initializeSampleDataShouldRefreshExistingSiteImageUrl() {
        TouristSite existingSite = new TouristSite();
        existingSite.setName("Cape Coast Castle");
        existingSite.setImageUrl("old-image-url");

        when(touristSiteRepository.findByNameContainingIgnoreCase("Cape Coast Castle"))
                .thenReturn(List.of(existingSite));

        touristSiteService.initializeSampleData();

        verify(touristSiteRepository).save(argThat(site ->
                "Cape Coast Castle".equals(site.getName())
                        && "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/a8/6d/86/ever-been-to-cape-coast.jpg?w=1200&h=-1&s=1".equals(site.getImageUrl())
        ));
    }
}
