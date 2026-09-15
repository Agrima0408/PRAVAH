package com.pravah.controller;

import com.pravah.service.FloodPredictionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PredictionController {

    private final FloodPredictionService floodPredictionService;

    public PredictionController(
            FloodPredictionService floodPredictionService) {

        this.floodPredictionService =
                floodPredictionService;
    }

    @GetMapping("/prediction")
    public String predictFloodRisk(
            @RequestParam double rainfall) {

        return floodPredictionService
                .calculateRisk(rainfall);
    }
}