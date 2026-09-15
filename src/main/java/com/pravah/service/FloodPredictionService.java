package com.pravah.service;

import org.springframework.stereotype.Service;

@Service
public class FloodPredictionService {

    public String calculateRisk(double rainfall) {

        if (rainfall < 20) {
            return "LOW";
        }

        if (rainfall < 50) {
            return "MEDIUM";
        }

        if (rainfall < 80) {
            return "HIGH";
        }

        return "VERY_HIGH";
    }

    public String calculateRisk(
            double rainfall,
            double drainageCapacity) {

        double excessRainfall =
                rainfall - drainageCapacity;

        // Extremely heavy rainfall
        if (rainfall >= 80) {
            return "VERY_HIGH";
        }

        // Rainfall significantly exceeds
        // local drainage capacity
        if (excessRainfall >= 20) {
            return "VERY_HIGH";
        }

        // Rainfall is greater than
        // drainage capacity
        if (excessRainfall > 0) {
            return "HIGH";
        }

        // Moderate rainfall
        if (rainfall >= 30) {
            return "MEDIUM";
        }

        return "LOW";
    }
}