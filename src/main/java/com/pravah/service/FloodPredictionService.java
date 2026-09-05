package com.pravah.service;

import org.springframework.stereotype.Service;

@Service
public class FloodPredictionService {

    public String calculateRisk(double rainfall) {

        if (rainfall < 20) {
            return "LOW";
        }
        else if (rainfall < 50) {
            return "MEDIUM";
        }
        else if (rainfall < 80) {
            return "HIGH";
        }
        else {
            return "VERY HIGH";
        }
    }
}