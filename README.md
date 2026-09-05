# 🌊 PRAVAH — Urban Flood Nowcasting System

> **A Spring Boot backend for urban flood risk prediction and emergency response.**

PRAVAH is an **Urban Flood Nowcasting System** developed for **Smart India Hackathon (SIH26085)**.

The backend provides REST APIs for processing rainfall and drainage-related data, calculating flood-risk levels for different localities, and serving the results to the PRAVAH frontend.

---

## 🎯 Problem

Urban flooding can occur rapidly due to heavy rainfall, inadequate drainage capacity, and water accumulation in vulnerable areas.

Existing weather applications primarily provide rainfall or weather information but may not answer:

* Which localities are at higher flood risk?
* How does rainfall affect a particular area?
* How does drainage capacity influence flooding?
* Which areas should authorities prioritize?

PRAVAH aims to provide a localized flood-risk layer that can support both **citizens and authorities**.

---

## 💡 Solution

The PRAVAH backend processes environmental and locality-level information and generates flood-risk information that can be consumed by the frontend.

```text
Rainfall Data
      │
      ▼
Data Processing
      │
      ▼
Drainage Capacity
      │
      ▼
Flood Risk Calculation
      │
      ▼
Risk Classification
      │
      ▼
REST API Response
      │
      ▼
PRAVAH Frontend
```

---

## ✨ Backend Features

### 🌧️ Rainfall Processing

The backend is designed to work with rainfall information such as:

* Daily rainfall
* Rainfall accumulation
* Rainfall intensity

The current prototype supports manually provided data while keeping the architecture ready for future API integration.

---

### 🌊 Flood Risk Prediction

The backend combines rainfall and drainage-related information to determine the flood risk of a locality.

Risk levels can be represented as:

```text
LOW
MEDIUM
HIGH
```

The resulting risk information can then be displayed on the PRAVAH map.

---

### 🗺️ Flood Zone API

The backend provides locality-level flood-zone information including geographical coordinates and risk level.

Example response:

```json
[
  {
    "locality": "Panjabari",
    "latitude": 26.1545,
    "longitude": 91.8077,
    "riskLevel": "HIGH"
  },
  {
    "locality": "Beltola",
    "latitude": 26.1352,
    "longitude": 91.7981,
    "riskLevel": "MEDIUM"
  }
]
```

This data can be consumed by the frontend to visualize flood-prone areas on an interactive map.

---

## 🏗️ Backend Architecture

```text
                 ┌─────────────────────┐
                 │     REST API        │
                 │     Controllers      │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │      Services       │
                 ├─────────────────────┤
                 │  WeatherService     │
                 │  RainfallService    │
                 │  FloodZoneService   │
                 │  DrainageService    │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Flood Risk Logic    │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │      Models         │
                 │    FloodZone        │
                 └─────────────────────┘
```

---

## 🛠️ Tech Stack

| Technology       | Purpose                           |
| ---------------- | --------------------------------- |
| **Java 17**      | Backend programming               |
| **Spring Boot**  | REST API development              |
| **Spring Web**   | HTTP/REST endpoints               |
| **Maven**        | Dependency management             |
| **H2 Database**  | Prototype data storage            |
| **REST APIs**    | Frontend-backend communication    |
| **Open-Meteo**   | Weather/rainfall data integration |
| **Git & GitHub** | Version control                   |

---

## 📂 Project Structure

```text
PRAVAH/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── ...
│       │
│       └── resources/
│           └── application.properties
│
├── pom.xml
├── README.md
└── ...
```

The backend follows a service-oriented Spring Boot structure.

```text
Controller
    ↓
Service
    ↓
Data / Business Logic
    ↓
Model
```

---

## 🔌 Core Services

### `RainfallService`

Responsible for retrieving and processing rainfall information.

### `WeatherService`

Handles weather-related data and external weather API integration.

### `DrainageService`

Responsible for drainage-related information used during flood-risk assessment.

### `FloodZoneService`

Combines relevant information and generates flood-zone data containing:

* Locality
* Latitude
* Longitude
* Risk level

---

## 🌐 API Example

### Get Flood Zones

```http
GET /api/flood-zones
```

Example response:

```json
[
  {
    "locality": "Panjabari",
    "latitude": 26.1545,
    "longitude": 91.8077,
    "riskLevel": "HIGH"
  }
]
```

The frontend can use this response to plot flood-risk zones on a map.

---

## 🧪 Current Prototype

The current version focuses on demonstrating the backend architecture and flood-risk workflow.

### Current

* ✅ Spring Boot REST backend
* ✅ Flood-zone service
* ✅ Rainfall processing
* ✅ Drainage-related logic
* ✅ Locality-level risk classification
* ✅ JSON API responses
* ✅ Prototype data handling
* ✅ External weather API integration architecture

### Future Integration

* 🔄 Real-time rainfall APIs
* 🔄 Municipal drainage data
* 🔄 IoT drainage sensors
* 🔄 Real-time GIS/map data
* 🔄 Machine-learning-based flood prediction

---

## 🗺️ Frontend Integration

The PRAVAH frontend is maintained separately from this repository.

The backend exposes flood-risk information through REST APIs which can be consumed by the frontend.

```text
┌──────────────────┐
│   PRAVAH Backend │
│   Spring Boot    │
└────────┬─────────┘
         │
         │ REST API
         ▼
┌──────────────────┐
│ PRAVAH Frontend  │
│ React + Vite     │
└────────┬─────────┘
         │
         ▼
    Interactive Map
    Flood Zones
    Safe Routes
    Dashboard
```

---

## 🚀 Future Scope

PRAVAH can be expanded into a real-time urban flood management platform by integrating:

* 🌧️ Real-time weather forecasting
* 🛰️ Satellite-based flood detection
* 📡 IoT-based drainage sensors
* 🤖 Machine-learning flood prediction
* 🗺️ Advanced GIS processing
* 🚑 Emergency vehicle routing
* 📱 Offline-first emergency functionality
* 🔔 Automated flood alerts
* 🏛️ Authority monitoring dashboards

---

## 🎯 Impact

PRAVAH aims to shift urban flood management from **reactive response to proactive preparedness**.

Instead of only identifying flooding after it occurs, the system aims to provide information that can help answer:

> **Where is flooding likely to occur, and what should we do before it gets worse?**

---

## 🏆 Hackathon

Developed for:

**Smart India Hackathon 2026**

**Problem Statement:** SIH26085 — Urban Flood Nowcasting System

**Project:** PRAVAH

---

## 👩‍💻 Developer

**Agrima Agarwal**

B.Tech Computer Science & Engineering

**Backend Development | Java | Spring Boot | REST APIs | Blockchain**

---

## 📌 Project Status

🚧 **Prototype / Hackathon Development**

The backend currently demonstrates the core flood-risk processing workflow using prototype data and is structured for future integration with real-time environmental and drainage data sources.
