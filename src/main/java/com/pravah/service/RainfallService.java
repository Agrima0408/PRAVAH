package com.pravah.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class RainfallService {

    private final WeatherService weatherService;
    private final ObjectMapper objectMapper;

    public RainfallService(WeatherService weatherService) {
        this.weatherService = weatherService;
        this.objectMapper = new ObjectMapper();
    }

    public List<Map<String, Object>> getDailyRainfall() throws Exception {

        String weatherJson = weatherService.getWeather();

        JsonNode root = objectMapper.readTree(weatherJson);

        JsonNode times = root.path("hourly").path("time");
        JsonNode precipitation = root.path("hourly").path("precipitation");

        Map<String, Double> dailyRainfall = new LinkedHashMap<>();

        for (int i = 0; i < times.size(); i++) {

            String date = times.get(i).asText().substring(0, 10);
            double rain = precipitation.get(i).asDouble();

            dailyRainfall.put(
                    date,
                    dailyRainfall.getOrDefault(date, 0.0) + rain
            );
        }

        List<Map<String, Object>> result = new ArrayList<>();

        for (Map.Entry<String, Double> entry : dailyRainfall.entrySet()) {

            Map<String, Object> day = new LinkedHashMap<>();

            day.put("date", entry.getKey());
            day.put("rainfall_mm", Math.round(entry.getValue() * 100.0) / 100.0);

            result.add(day);
        }

        return result;
    }
}