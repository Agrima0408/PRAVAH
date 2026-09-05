package com.pravah.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    private final RestTemplate restTemplate = new RestTemplate();

    public String getWeather() {

        String url =
                "https://api.open-meteo.com/v1/forecast" +
                        "?latitude=26.1445" +
                        "&longitude=91.7362" +
                        "&hourly=precipitation" +
                        "&forecast_days=7" +
                        "&timezone=Asia/Kolkata";

        return restTemplate.getForObject(url, String.class);
    }
}