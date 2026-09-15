package com.pravah.controller;

import com.pravah.service.DashboardMetricsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class DashboardMetricsController {

    private final DashboardMetricsService dashboardMetricsService;

    public DashboardMetricsController(
            DashboardMetricsService dashboardMetricsService) {

        this.dashboardMetricsService =
                dashboardMetricsService;
    }

    @GetMapping("/dashboard-metrics")
    public Map<String, Object> getDashboardMetrics() {

        return dashboardMetricsService
                .getDashboardMetrics();
    }
}