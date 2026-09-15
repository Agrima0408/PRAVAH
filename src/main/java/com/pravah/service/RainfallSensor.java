package com.pravah.model;

public class RainfallSensor {

    private String id;
    private String location;
    private double latitude;
    private double longitude;
    private double rainfallMmPerHour;
    private String status;

    public RainfallSensor() {
    }

    public RainfallSensor(
            String id,
            String location,
            double latitude,
            double longitude,
            double rainfallMmPerHour,
            String status
    ) {
        this.id = id;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.rainfallMmPerHour = rainfallMmPerHour;
        this.status = status;
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

    public double getRainfallMmPerHour() {
        return rainfallMmPerHour;
    }

    public void setRainfallMmPerHour(
            double rainfallMmPerHour
    ) {
        this.rainfallMmPerHour =
                rainfallMmPerHour;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}