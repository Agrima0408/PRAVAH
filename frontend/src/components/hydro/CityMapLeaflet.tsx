import { useEffect, useState } from "react";

import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

import { cn } from "@/lib/utils";

import {
  CITY,
  DRAINS,
  RAIN_SENSORS,
  RIVER_PATH,
  ROADS,
} from "@/lib/hydro/data";

import { CONFIDENCE_VAR, confidenceBand } from "@/lib/hydro/ui";
import type { CityMapProps } from "./CityMap";

const RISK_COLORS = {
  low: "#22c55e",
  moderate: "#eab308",
  high: "#f97316",
  critical: "#ef4444",
} as const;

interface FloodZoneApiResponse {
  locality: string;
  latitude: number;
  longitude: number;
  riskLevel: string;
}

interface WaterSensorApiResponse {
  id: string;
  location: string;
  latitude: number;
  longitude: number;
  waterLevelCm: number;
  status: string;
  riskLevel: string;
}

const FLOOD_ZONES_API_URL =
  "https://pravah-ergp.onrender.com/api/flood-zones";

const WATER_SENSORS_API_URL =
  "https://pravah-ergp.onrender.com/api/water-sensors";

const CENTER: LatLngExpression = [26.1725, 91.815];

const X_CENTER = 500;
const Y_CENTER = 320;

const LAT_PER_UNIT = 0.000045;
const LNG_PER_UNIT = 0.00005;

function pointToLatLng(
  [x, y]: [number, number],
): [number, number] {
  return [
    (CENTER as [number, number])[0] -
      (y - Y_CENTER) * LAT_PER_UNIT,
    (CENTER as [number, number])[1] +
      (x - X_CENTER) * LNG_PER_UNIT,
  ];
}

function pathToLatLng(
  path: string,
): [number, number][] {
  const values = [
    ...path.matchAll(/-?\d+(?:\.\d+)?/g),
  ].map((match) => Number(match[0]));

  const points: [number, number][] = [];

  for (
    let i = 0;
    i + 1 < values.length;
    i += 2
  ) {
    points.push(
      pointToLatLng([
        values[i],
        values[i + 1],
      ]),
    );
  }

  return points;
}

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const update = () => map.invalidateSize();

    const timer = window.setTimeout(
      update,
      100,
    );

    window.addEventListener(
      "resize",
      update,
    );

    const container =
      map.getContainer();

    const observer =
      typeof ResizeObserver !==
      "undefined"
        ? new ResizeObserver(update)
        : null;

    observer?.observe(container);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(
        "resize",
        update,
      );
      observer?.disconnect();
    };
  }, [map]);

  return null;
}

function normalizeRiskLevel(
  riskLevel: string,
): keyof typeof RISK_COLORS {
  const normalized = riskLevel
    .toUpperCase()
    .replace("-", "_");

  if (normalized === "CRITICAL") {
    return "critical";
  }

  if (normalized === "HIGH") {
    return "high";
  }

  if (normalized === "MEDIUM_HIGH") {
    return "high";
  }

  if (
    normalized === "MEDIUM" ||
    normalized === "MODERATE"
  ) {
    return "moderate";
  }

  return "low";
}

export function CityMapLeaflet({
  step,
  layers,
  mode = "risk",
  selectedZoneId,
  onSelectZone,
  zoneLevelOverride,
  compact = false,
  className,
}: CityMapProps) {
  const [floodZones, setFloodZones] =
    useState<FloodZoneApiResponse[]>(
      [],
    );

  const [waterSensors, setWaterSensors] =
    useState<WaterSensorApiResponse[]>(
      [],
    );

  const has = (layer: string) =>
    layers.includes(layer as never);

  const showConfidence =
    mode === "confidence" ||
    has("confidence");

  /* -------------------- flood zones API -------------------- */

  useEffect(() => {
    async function loadFloodZones() {
      try {
        const response = await fetch(
          FLOOD_ZONES_API_URL,
        );

        if (!response.ok) {
          throw new Error(
            `Flood zones request failed with status ${response.status}`,
          );
        }

        const data =
          (await response.json()) as FloodZoneApiResponse[];

        console.log(
          "Flood Zones API response:",
          data,
        );

        if (Array.isArray(data)) {
          setFloodZones(data);
        } else {
          setFloodZones([]);
        }
      } catch (error) {
        console.error(
          "Failed to load flood zones:",
          error,
        );

        setFloodZones([]);
      }
    }

    loadFloodZones();
  }, []);

  /* -------------------- water sensors API -------------------- */

  useEffect(() => {
    async function loadWaterSensors() {
      try {
        const response = await fetch(
          WATER_SENSORS_API_URL,
        );

        if (!response.ok) {
          throw new Error(
            `Water sensors request failed with status ${response.status}`,
          );
        }

        const data =
          (await response.json()) as WaterSensorApiResponse[];

        console.log(
          "Map Water Sensors API response:",
          data,
        );

        if (Array.isArray(data)) {
          setWaterSensors(data);
        } else {
          setWaterSensors([]);
        }
      } catch (error) {
        console.error(
          "Failed to load map water sensors:",
          error,
        );

        setWaterSensors([]);
      }
    }

    loadWaterSensors();
  }, []);

  return (
    <div
      className={cn(
        "map-scope relative h-full w-full overflow-hidden rounded-xl border border-border bg-surface",
        className,
      )}
    >
      <MapContainer
        center={CENTER}
        zoom={12}
        scrollWheelZoom
        className="hydropulse-leaflet-map"
      >
        <MapResizeHandler />

        {has("satellite") ? (
          <TileLayer
            attribution="Tiles &copy; Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        ) : (
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}

        {!compact ? (
          <CircleMarker
            center={CENTER}
            radius={4}
            pathOptions={{
              color: "#38bdf8",
              fillColor: "#38bdf8",
              fillOpacity: 0.9,
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -4]}
              opacity={0.95}
            >
              Guwahati
            </Tooltip>
          </CircleMarker>
        ) : null}

        {/* Java backend flood zones */}

        {floodZones.map((zone) => {
          const risk =
            normalizeRiskLevel(
              zone.riskLevel,
            );

          const color =
            RISK_COLORS[risk];

          return (
            <CircleMarker
              key={`${zone.locality}-${zone.latitude}-${zone.longitude}`}
              center={[
                zone.latitude,
                zone.longitude,
              ]}
              radius={12}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.45,
                weight: 3,
              }}
            >
              <Tooltip sticky>
                <div className="text-xs">
                  <strong>
                    {zone.locality}
                  </strong>
                  <br />
                  Risk:{" "}
                  {zone.riskLevel.replace(
                    "_",
                    " ",
                  )}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}

        {/* Drainage network */}

        {has("drainage")
          ? DRAINS.map((drain) => (
              <Polyline
                key={drain.id}
                positions={pathToLatLng(
                  drain.path,
                )}
                pathOptions={{
                  color:
                    drain.status ===
                    "exceeded"
                      ? "#ef4444"
                      : drain.status ===
                          "stressed"
                        ? "#f97316"
                        : "#38bdf8",
                  weight: 3,
                  dashArray: "8 6",
                  opacity: 0.8,
                }}
              >
                <Tooltip sticky>
                  {drain.name} ·{" "}
                  {drain.load}% load
                </Tooltip>
              </Polyline>
            ))
          : null}

        {/* River */}

        <Polyline
          positions={pathToLatLng(
            RIVER_PATH,
          )}
          pathOptions={{
            color: "#38bdf8",
            weight: 10,
            opacity: 0.35,
          }}
        />

        {/* Affected roads */}

        {has("roads")
          ? ROADS.map((road) => {
              const severity =
                road.severity[step];

              if (!severity) {
                return null;
              }

              return (
                <Polyline
                  key={road.id}
                  positions={pathToLatLng(
                    road.path,
                  )}
                  pathOptions={{
                    color:
                      RISK_COLORS[
                        severity
                      ],
                    weight: 6,
                    opacity: 0.85,
                  }}
                >
                  <Tooltip sticky>
                    {road.name}
                  </Tooltip>
                </Polyline>
              );
            })
          : null}

        {/* Rainfall sensors */}

        {has("rainfall")
          ? RAIN_SENSORS.map(
              (sensor) => (
                <CircleMarker
                  key={sensor.id}
                  center={pointToLatLng(
                    sensor.at,
                  )}
                  radius={6}
                  pathOptions={{
                    color: "#0ea5e9",
                    fillColor:
                      "#0ea5e9",
                    fillOpacity:
                      sensor.status ===
                      "live"
                        ? 0.9
                        : 0.4,
                    weight: 2,
                  }}
                >
                  <Tooltip sticky>
                    {sensor.id} ·{" "}
                    {sensor.location}
                    <br />
                    Rainfall:{" "}
                    {sensor.rainfall}{" "}
                    mm/hr
                  </Tooltip>
                </CircleMarker>
              ),
            )
          : null}

        {/* Water-level sensors from Java backend */}

        {has("sensors")
          ? waterSensors.map(
              (sensor) => {
                const risk =
                  normalizeRiskLevel(
                    sensor.riskLevel,
                  );

                const color =
                  RISK_COLORS[risk];

                return (
                  <CircleMarker
                    key={sensor.id}
                    center={[
                      sensor.latitude,
                      sensor.longitude,
                    ]}
                    radius={8}
                    pathOptions={{
                      color,
                      fillColor:
                        color,
                      fillOpacity:
                        sensor.status.toUpperCase() ===
                        "ONLINE"
                          ? 0.9
                          : 0.4,
                      weight: 2,
                    }}
                  >
                    <Tooltip sticky>
                      <strong>
                        {sensor.id} ·{" "}
                        {sensor.location}
                      </strong>
                      <br />
                      Water level:{" "}
                      {
                        sensor.waterLevelCm
                      }{" "}
                      cm
                      <br />
                      Status:{" "}
                      {sensor.status}
                      <br />
                      Risk:{" "}
                      {sensor.riskLevel.replace(
                        "_",
                        " ",
                      )}
                    </Tooltip>
                  </CircleMarker>
                );
              },
            )
          : null}
      </MapContainer>
    </div>
  );
}