package com.pravah.service;

import com.pravah.model.FloodZone;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FloodZoneService {

    private final RainfallService rainfallService;
    private final DrainageService drainageService;

    public FloodZoneService(
            RainfallService rainfallService,
            DrainageService drainageService) {

        this.rainfallService = rainfallService;
        this.drainageService = drainageService;
    }

    public List<FloodZone> getFloodZones() {

        // Get today's rainfall from the rainfall service
        double rainfall;

        try {
            var dailyRainfall = rainfallService.getDailyRainfall();

            rainfall = ((Number) dailyRainfall.get(0)
                    .get("rainfall_mm"))
                    .doubleValue();

        } catch (Exception e) {
            // If rainfall service fails, use 0 instead of crashing
            rainfall = 0.0;
        }

        System.out.println("Current rainfall = " + rainfall + " mm");

        return List.of(
                createZone("Panjabari", 26.1725, 91.8150,
                        "HIGH", rainfall),

                createZone("Juripar", 26.1700, 91.8100,
                        "HIGH", rainfall),

                createZone("VIP Road", 26.1600, 91.7950,
                        "HIGH", rainfall),

                createZone("Beltola", 26.1250, 91.7900,
                        "HIGH", rainfall),

                createZone("Rukminigaon", 26.1550, 91.8000,
                        "MEDIUM_HIGH", rainfall),

                createZone("Narengi", 26.1900, 91.8300,
                        "MEDIUM", rainfall),

                createZone("Satgaon", 26.2050, 91.7600,
                        "MEDIUM", rainfall),

                createZone("Hatigaon", 26.1450, 91.7850,
                        "MEDIUM", rainfall),

                createZone("Chandmari", 26.1650, 91.7700,
                        "MEDIUM", rainfall),

                createZone("Anil Nagar", 26.1550, 91.7500,
                        "MEDIUM", rainfall)
        );
    }

    private FloodZone createZone(
            String locality,
            double latitude,
            double longitude,
            String baseRisk,
            double rainfall) {

        // Get drainage capacity from DrainageService
        double drainageCapacity =
                drainageService.getDrainageCapacity(locality);

        String finalRisk = calculateRisk(
                baseRisk,
                rainfall,
                drainageCapacity
        );

        return new FloodZone(
                locality,
                latitude,
                longitude,
                finalRisk
        );
    }

    private String calculateRisk(
            String baseRisk,
            double rainfall,
            double drainageCapacity) {

        double excessRainfall = rainfall - drainageCapacity;

        if (rainfall >= 80) {
            return "VERY_HIGH";
        }

        if (excessRainfall >= 20) {
            return "VERY_HIGH";
        }

        if (excessRainfall > 0) {

            if (baseRisk.equals("HIGH")
                    || baseRisk.equals("MEDIUM_HIGH")) {

                return "VERY_HIGH";
            }

            return "HIGH";
        }

        if (rainfall >= 30) {

            if (baseRisk.equals("HIGH")
                    || baseRisk.equals("MEDIUM_HIGH")) {

                return "HIGH";
            }

            return "MEDIUM";
        }

        return baseRisk;
    }
}