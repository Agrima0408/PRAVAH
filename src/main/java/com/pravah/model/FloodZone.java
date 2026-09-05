package com.pravah.model;

public class FloodZone {
    private String locality;
    private double latitude;
    private double longitude;
    private String riskLevel;

    public FloodZone(String locality, double latitude,
                     double longitude, String riskLevel) {
        this.locality = locality;
        this.latitude = latitude;
        this.longitude = longitude;
        this.riskLevel = riskLevel;
    }

    public String getLocality() {
        return locality;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public String getRiskLevel() {
        return riskLevel;
    }
}
