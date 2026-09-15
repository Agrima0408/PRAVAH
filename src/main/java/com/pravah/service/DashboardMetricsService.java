package com.pravah.service;

import com.pravah.model.WaterSensor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardMetricsService {

    private final RainfallSensorService rainfallSensorService;
    private final WaterSensorService waterSensorService;

    public DashboardMetricsService(
            RainfallSensorService rainfallSensorService,
            WaterSensorService waterSensorService) {

        this.rainfallSensorService =
                rainfallSensorService;

        this.waterSensorService =
                waterSensorService;
    }

    public Map<String, Object> getDashboardMetrics() {

        Map<String, Object> metrics =
                new LinkedHashMap<>();

        // Average rainfall from rainfall sensors
        double totalRainfall = 0.0;
        int rainfallSensorCount = 0;

        var rainfallSensors =
                rainfallSensorService.getRainfallSensors();

        for (var sensor : rainfallSensors) {

            if (sensor.getStatus()
                    .equalsIgnoreCase("ONLINE")) {

                totalRainfall +=
                        sensor.getRainfallMmPerHour();

                rainfallSensorCount++;
            }
        }

        double averageRainfall =
                rainfallSensorCount > 0
                        ? totalRainfall / rainfallSensorCount
                        : 0.0;

        // Maximum water level
        List<WaterSensor> waterSensors =
                waterSensorService.getWaterSensors();

        double maximumWaterLevel = 0.0;
        String maximumWaterLocation = "N/A";
        String maximumWaterSensor = "N/A";

        for (WaterSensor sensor : waterSensors) {

            if (sensor.getStatus()
                    .equalsIgnoreCase("ONLINE")
                    && sensor.getWaterLevelCm()
                    > maximumWaterLevel) {

                maximumWaterLevel =
                        sensor.getWaterLevelCm();

                maximumWaterLocation =
                        sensor.getLocation();

                maximumWaterSensor =
                        sensor.getId();
            }
        }

        // Current critical/high events
        int criticalEvents = 0;

        for (WaterSensor sensor : waterSensors) {

            String risk =
                    sensor.getRiskLevel()
                            .toUpperCase();

            if (risk.equals("HIGH")
                    || risk.equals("VERY_HIGH")
                    || risk.equals("CRITICAL")) {

                criticalEvents++;
            }
        }

        // Prediction accuracy requires
        // historical prediction vs actual data.
        Double predictionAccuracy = null;

        metrics.put(
                "averageRainfallMmPerHour",
                Math.round(
                        averageRainfall * 100.0
                ) / 100.0
        );

        metrics.put(
                "rainfallPeriod",
                "Current sensor average"
        );

        metrics.put(
                "maximumWaterLevelCm",
                maximumWaterLevel
        );

        metrics.put(
                "maximumWaterLocation",
                maximumWaterLocation
        );

        metrics.put(
                "maximumWaterSensor",
                maximumWaterSensor
        );

        metrics.put(
                "criticalEvents",
                criticalEvents
        );

        metrics.put(
                "predictionAccuracy",
                predictionAccuracy
        );

        return metrics;
    }
}