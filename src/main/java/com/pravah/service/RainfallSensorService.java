package com.pravah.service;

import com.pravah.model.RainfallSensor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class RainfallSensorService {

    public List<RainfallSensor> getRainfallSensors() {

        return Arrays.asList(

                new RainfallSensor(
                        "RS-01",
                        "Panjabari",
                        26.1725,
                        91.8150,
                        2.4,
                        "ONLINE"
                ),

                new RainfallSensor(
                        "RS-02",
                        "Juripar",
                        26.1700,
                        91.8100,
                        3.1,
                        "ONLINE"
                ),

                new RainfallSensor(
                        "RS-03",
                        "VIP Road",
                        26.1600,
                        91.7950,
                        2.7,
                        "ONLINE"
                ),

                new RainfallSensor(
                        "RS-04",
                        "Beltola",
                        26.1250,
                        91.7900,
                        1.8,
                        "ONLINE"
                ),

                new RainfallSensor(
                        "RS-05",
                        "Rukminigaon",
                        26.1550,
                        91.8000,
                        2.2,
                        "ONLINE"
                ),

                new RainfallSensor(
                        "RS-06",
                        "Narengi",
                        26.1900,
                        91.8300,
                        1.5,
                        "ONLINE"
                ),

                new RainfallSensor(
                        "RS-07",
                        "Satgaon",
                        26.2050,
                        91.7600,
                        1.2,
                        "ONLINE"
                ),

                new RainfallSensor(
                        "RS-08",
                        "Hatigaon",
                        26.1450,
                        91.7850,
                        0.9,
                        "ONLINE"
                ),

                new RainfallSensor(
                        "RS-09",
                        "Chandmari",
                        26.1650,
                        91.7700,
                        1.1,
                        "ONLINE"
                ),

                new RainfallSensor(
                        "RS-10",
                        "Anil Nagar",
                        26.1550,
                        91.7500,
                        0.0,
                        "OFFLINE"
                )
        );
    }
}