package com.pravah.controller;

import com.pravah.model.FloodZone;
import com.pravah.service.FloodZoneService;
import com.pravah.service.RainfallService;
import com.pravah.service.WeatherService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class FloodController {

    private final FloodZoneService service;
    private final WeatherService weatherService;
    private final RainfallService rainfallService;
    

    // Single constructor injecting all required dependencies
    public FloodController(
            FloodZoneService service,
            WeatherService weatherService,
            RainfallService rainfallService) {

        this.service = service;
        this.weatherService = weatherService;
        this.rainfallService = rainfallService;
    }

    @GetMapping("/flood-zones")
    public List<FloodZone> getFloodZones() {
        return service.getFloodZones();
    }

    @GetMapping("/weather")
    public String getWeather() {
        return weatherService.getWeather();
    }

    @GetMapping("/rainfall")
    public List<Map<String, Object>> getDailyRainfall() throws Exception {
        return rainfallService.getDailyRainfall();
    }
}