package com.pravah.controller;

import com.pravah.model.RainfallSensor;
import com.pravah.service.RainfallSensorService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RainfallController {

    private final RainfallSensorService rainfallSensorService;

    public RainfallController(
            RainfallSensorService rainfallSensorService) {

        this.rainfallSensorService =
                rainfallSensorService;
    }

    @GetMapping("/rainfall-sensors")
    public List<RainfallSensor> getRainfallSensors() {

        return rainfallSensorService
                .getRainfallSensors();
    }
}