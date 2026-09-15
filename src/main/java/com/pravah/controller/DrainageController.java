package com.pravah.controller;

import com.pravah.service.DrainageService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DrainageController {

    private final DrainageService drainageService;

    public DrainageController(
            DrainageService drainageService) {

        this.drainageService = drainageService;
    }

    @GetMapping("/drainage")
    public Map<String, Double> getDrainage() {

        Map<String, Double> drainage =
                new LinkedHashMap<>();

        drainage.put(
                "Panjabari",
                drainageService.getDrainageCapacity(
                        "Panjabari"
                )
        );

        drainage.put(
                "Juripar",
                drainageService.getDrainageCapacity(
                        "Juripar"
                )
        );

        drainage.put(
                "VIP Road",
                drainageService.getDrainageCapacity(
                        "VIP Road"
                )
        );

        drainage.put(
                "Beltola",
                drainageService.getDrainageCapacity(
                        "Beltola"
                )
        );

        drainage.put(
                "Rukminigaon",
                drainageService.getDrainageCapacity(
                        "Rukminigaon"
                )
        );

        drainage.put(
                "Narengi",
                drainageService.getDrainageCapacity(
                        "Narengi"
                )
        );

        drainage.put(
                "Satgaon",
                drainageService.getDrainageCapacity(
                        "Satgaon"
                )
        );

        drainage.put(
                "Hatigaon",
                drainageService.getDrainageCapacity(
                        "Hatigaon"
                )
        );

        drainage.put(
                "Chandmari",
                drainageService.getDrainageCapacity(
                        "Chandmari"
                )
        );

        drainage.put(
                "Anil Nagar",
                drainageService.getDrainageCapacity(
                        "Anil Nagar"
                )
        );

        return drainage;
    }
}