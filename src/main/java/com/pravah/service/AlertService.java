package com.pravah.service;

import com.pravah.model.FloodZone;
import com.pravah.model.WaterSensor;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AlertService {

    private final FloodZoneService floodZoneService;
    private final WaterSensorService waterSensorService;

    public AlertService(
            FloodZoneService floodZoneService,
            WaterSensorService waterSensorService) {

        this.floodZoneService = floodZoneService;
        this.waterSensorService = waterSensorService;
    }

    public List<Map<String, Object>> getAlerts() {

        List<Map<String, Object>> alerts =
                new ArrayList<>();

        // Flood-zone alerts
        List<FloodZone> floodZones =
                floodZoneService.getFloodZones();

        for (FloodZone zone : floodZones) {

            String risk =
                    zone.getRiskLevel().toUpperCase();

            if (risk.equals("VERY_HIGH")
                    || risk.equals("HIGH")) {

                Map<String, Object> alert =
                        new HashMap<>();

                alert.put("type", "FLOOD");
                alert.put("level", risk);
                alert.put(
                        "title",
                        risk.equals("VERY_HIGH")
                                ? "Very high flood risk"
                                : "High flood risk"
                );
                alert.put(
                        "location",
                        zone.getLocality()
                );
                alert.put(
                        "detail",
                        "Flood risk level is " + risk
                );
                alert.put("age", "Current");

                alerts.add(alert);
            }
        }

        // Water-sensor alerts
        List<WaterSensor> sensors =
                waterSensorService.getWaterSensors();

        for (WaterSensor sensor : sensors) {

            String risk =
                    sensor.getRiskLevel().toUpperCase();

            String status =
                    sensor.getStatus().toUpperCase();

            // Offline sensor
            if (!status.equals("ONLINE")) {

                Map<String, Object> alert =
                        new HashMap<>();

                alert.put("type", "SENSOR");
                alert.put("level", "HIGH");
                alert.put(
                        "title",
                        "Water sensor offline"
                );
                alert.put(
                        "location",
                        sensor.getLocation()
                );
                alert.put(
                        "detail",
                        "Sensor " + sensor.getId()
                                + " is offline"
                );
                alert.put("age", "Current");

                alerts.add(alert);
            }

            // High water-level risk
            if (risk.equals("HIGH")
                    || risk.equals("VERY_HIGH")) {

                Map<String, Object> alert =
                        new HashMap<>();

                alert.put("type", "WATER");
                alert.put("level", risk);
                alert.put(
                        "title",
                        "High water level"
                );
                alert.put(
                        "location",
                        sensor.getLocation()
                );
                alert.put(
                        "detail",
                        "Water level: "
                                + sensor.getWaterLevelCm()
                                + " cm"
                );
                alert.put("age", "Current");

                alerts.add(alert);
            }
        }

        return alerts;
    }
}