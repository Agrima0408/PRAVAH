package com.pravah.controller;

import com.pravah.model.FloodZone;
import com.pravah.model.WaterSensor;
import com.pravah.service.FloodZoneService;
import com.pravah.service.RainfallService;
import com.pravah.service.WaterSensorService;
import com.pravah.service.WeatherService;
import com.pravah.service.AlertService;

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
    private final WaterSensorService waterSensorService;
    private final AlertService alertService
            ;
    public FloodController(
            FloodZoneService service,
            WeatherService weatherService,
            RainfallService rainfallService,
            WaterSensorService waterSensorService,
            AlertService alertService) {

        this.alertService = alertService;
        this.service = service;
        this.weatherService = weatherService;
        this.rainfallService = rainfallService;
        this.waterSensorService = waterSensorService;
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

    @GetMapping("/water-sensors")
    public List<WaterSensor> getWaterSensors() {
        return waterSensorService.getWaterSensors();
    }

    @GetMapping("/alerts")
    public List<Map<String, Object>> getAlerts() {
        return alertService.getAlerts();
    }
}