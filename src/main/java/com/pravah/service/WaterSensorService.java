package com.pravah.service;

import com.pravah.model.WaterSensor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class WaterSensorService {

    public List<WaterSensor> getWaterSensors() {

        return Arrays.asList(

                new WaterSensor(
                        "WS-01",
                        "Panjabari",
                        26.1725,
                        91.8150,
                        42.5,
                        "ONLINE",
                        "HIGH"
                ),

                new WaterSensor(
                        "WS-02",
                        "Juripar",
                        26.1700,
                        91.8100,
                        38.2,
                        "ONLINE",
                        "HIGH"
                ),

                new WaterSensor(
                        "WS-03",
                        "VIP Road",
                        26.1600,
                        91.7950,
                        35.7,
                        "ONLINE",
                        "HIGH"
                ),

                new WaterSensor(
                        "WS-04",
                        "Beltola",
                        26.1250,
                        91.7900,
                        31.4,
                        "ONLINE",
                        "MEDIUM"
                ),

                new WaterSensor(
                        "WS-05",
                        "Rukminigaon",
                        26.1550,
                        91.8000,
                        28.6,
                        "ONLINE",
                        "MEDIUM"
                ),

                new WaterSensor(
                        "WS-06",
                        "Narengi",
                        26.1900,
                        91.8300,
                        24.1,
                        "ONLINE",
                        "MEDIUM"
                ),

                new WaterSensor(
                        "WS-07",
                        "Satgaon",
                        26.2050,
                        91.7600,
                        21.8,
                        "ONLINE",
                        "MEDIUM"
                ),

                new WaterSensor(
                        "WS-08",
                        "Hatigaon",
                        26.1450,
                        91.7850,
                        19.6,
                        "ONLINE",
                        "LOW"
                ),

                new WaterSensor(
                        "WS-09",
                        "Chandmari",
                        26.1650,
                        91.7700,
                        18.3,
                        "ONLINE",
                        "LOW"
                ),

                new WaterSensor(
                        "WS-10",
                        "Anil Nagar",
                        26.1550,
                        91.7500,
                        16.9,
                        "OFFLINE",
                        "LOW"
                )
        );
    }
}