package com.pravah.model;

public class WaterSensor {

    private String id;
    private String location;
    private double latitude;
    private double longitude;
    private double waterLevelCm;
    private String status;
    private String riskLevel;

    public WaterSensor() {
    }

    public WaterSensor(
            String id,
            String location,
            double latitude,
            double longitude,
            double waterLevelCm,
            String status,
            String riskLevel
    ) {
        this.id = id;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.waterLevelCm = waterLevelCm;
        this.status = status;
        this.riskLevel = riskLevel;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getWaterLevelCm() {
        return waterLevelCm;
    }

    public void setWaterLevelCm(double waterLevelCm) {
        this.waterLevelCm = waterLevelCm;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
}