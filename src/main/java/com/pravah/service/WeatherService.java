package com.pravah.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    private final RestTemplate restTemplate = new RestTemplate();

    private String cachedWeather;
    private long lastFetchTime = 0;

    // Refresh weather data every 30 minutes
    private static final long CACHE_DURATION =
            30 * 60 * 1000;

    public synchronized String getWeather() {

        long currentTime =
                System.currentTimeMillis();

        // Return cached data if it is still fresh
        if (cachedWeather != null
                && (currentTime - lastFetchTime)
                < CACHE_DURATION) {

            return cachedWeather;
        }

        String url =
                "https://api.open-meteo.com/v1/forecast" +
                        "?latitude=26.1445" +
                        "&longitude=91.7362" +
                        "&hourly=precipitation" +
                        "&forecast_days=7" +
                        "&timezone=Asia/Kolkata";

        cachedWeather =
                restTemplate.getForObject(
                        url,
                        String.class
                );

        lastFetchTime = currentTime;

        return cachedWeather;
    }
}