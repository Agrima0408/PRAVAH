package com.pravah.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DrainageService {

    private final Map<String, Double> drainageCapacity = Map.of(
            "Panjabari", 40.0,
            "Juripar", 35.0,
            "VIP Road", 45.0,
            "Beltola", 50.0,
            "Rukminigaon", 45.0,
            "Narengi", 60.0,
            "Satgaon", 55.0,
            "Hatigaon", 50.0,
            "Chandmari", 65.0,
            "Anil Nagar", 45.0
    );

    public double getDrainageCapacity(String locality) {
        return drainageCapacity.getOrDefault(locality, 0.0);
    }
}