import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

import {
  RISK_LABEL,
} from "@/lib/hydro/data";

import type { WeatherApiResponse } from "@/lib/api/weather";

import { riskBorder, riskText } from "@/lib/hydro/ui";
import { cn } from "@/lib/utils";
import {
  DataTag,
  Metric,
  Panel,
} from "./primitives";

interface RainfallApiResponse {
  date: string;
  rainfall_mm: number;
}

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

interface AlertApiResponse {
  type: string;
  level: string;
  title: string;
  location: string;
  detail: string;
  age: string;
}

const RAINFALL_API_URL =
  "https://pravah-ergp.onrender.com/api/rainfall";

const FLOOD_ZONES_API_URL =
  "https://pravah-ergp.onrender.com/api/flood-zones";

const WATER_SENSORS_API_URL =
  "https://pravah-ergp.onrender.com/api/water-sensors";

const ALERTS_API_URL =
  "https://pravah-ergp.onrender.com/api/alerts";

export function CityStatusPanel({
  className,
  weather,
  weatherLoading = false,
}: {
  className?: string;
  weather?: WeatherApiResponse | null;
  weatherLoading?: boolean;
}) {
  const [dailyRainfall, setDailyRainfall] =
    useState<number | null>(null);

  const [rainfallLoading, setRainfallLoading] =
    useState(true);

  const [floodZones, setFloodZones] =
    useState<FloodZoneApiResponse[]>([]);

  const [floodZonesLoading, setFloodZonesLoading] =
    useState(true);

  const [waterSensors, setWaterSensors] =
    useState<WaterSensorApiResponse[]>([]);

  const [waterSensorsLoading, setWaterSensorsLoading] =
    useState(true);

  const [alerts, setAlerts] =
    useState<AlertApiResponse[]>([]);

  const [alertsLoading, setAlertsLoading] =
    useState(true);

  /* -------------------- rainfall API -------------------- */

  useEffect(() => {
    async function loadRainfall() {
      try {
        setRainfallLoading(true);

        const response = await fetch(
          RAINFALL_API_URL,
        );

        if (!response.ok) {
          throw new Error(
            `Rainfall request failed with status ${response.status}`,
          );
        }

        const data =
          (await response.json()) as RainfallApiResponse[];

        console.log(
          "City Status Rainfall API response:",
          data,
        );

        const now = new Date();

        const today =
          `${now.getFullYear()}-${String(
            now.getMonth() + 1,
          ).padStart(2, "0")}-${String(
            now.getDate(),
          ).padStart(2, "0")}`;

        const todayRainfall = data.find(
          (item) => item.date === today,
        );

        if (todayRainfall) {
          setDailyRainfall(
            todayRainfall.rainfall_mm,
          );
        } else {
          setDailyRainfall(null);
        }
      } catch (error) {
        console.error(
          "Failed to load city rainfall:",
          error,
        );

        setDailyRainfall(null);
      } finally {
        setRainfallLoading(false);
      }
    }

    loadRainfall();
  }, []);

    useEffect(() => {
    async function loadAlerts() {
      try {
        setAlertsLoading(true);

        const response =
          await fetch(ALERTS_API_URL);

        if (!response.ok) {
          throw new Error(
            `Alerts request failed with status ${response.status}`,
          );
        }

        const data =
          (await response.json()) as AlertApiResponse[];

        console.log(
          "Alerts API response:",
          data,
        );

        if (Array.isArray(data)) {
          setAlerts(data);
        } else {
          setAlerts([]);
        }

      } catch (error) {

        console.error(
          "Failed to load alerts:",
          error,
        );

        setAlerts([]);

      } finally {
        setAlertsLoading(false);
      }
    }

    loadAlerts();
  }, []);

  /* -------------------- flood zones API -------------------- */

  useEffect(() => {
    async function loadFloodZones() {
      try {
        setFloodZonesLoading(true);

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
          "City Status Flood Zones API response:",
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
      } finally {
        setFloodZonesLoading(false);
      }
    }

    loadFloodZones();
  }, []);

  /* -------------------- water sensors API -------------------- */

  useEffect(() => {
    async function loadWaterSensors() {
      try {
        setWaterSensorsLoading(true);

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
          "Water Sensors API response:",
          data,
        );

        if (Array.isArray(data)) {
          setWaterSensors(data);
        } else {
          setWaterSensors([]);
        }
      } catch (error) {
        console.error(
          "Failed to load water sensors:",
          error,
        );

        setWaterSensors([]);
      } finally {
        setWaterSensorsLoading(false);
      }
    }

    loadWaterSensors();
  }, []);

   /* -------------------- load alerts -------------------- */
    useEffect(() => {
    async function loadAlerts() {
      try {
        setAlertsLoading(true);

        const response =
          await fetch(ALERTS_API_URL);

        if (!response.ok) {
          throw new Error(
            `Alerts request failed with status ${response.status}`,
          );
        }

        const data =
          (await response.json()) as AlertApiResponse[];

        console.log(
          "Alerts API response:",
          data,
        );

        if (Array.isArray(data)) {
          setAlerts(data);
        } else {
          setAlerts([]);
        }

      } catch (error) {

        console.error(
          "Failed to load alerts:",
          error,
        );

        setAlerts([]);

      } finally {
        setAlertsLoading(false);
      }
    }

    loadAlerts();
  }, []);
  /* -------------------- calculate city risk -------------------- */

  const normalizedRisks = floodZones.map(
    (zone) =>
      zone.riskLevel
        .toUpperCase()
        .replace("-", "_"),
  );

  const criticalZones =
    normalizedRisks.filter(
      (risk) => risk === "CRITICAL",
    ).length;

  const highZones =
    normalizedRisks.filter(
      (risk) => risk === "HIGH",
    ).length;

  const mediumHighZones =
    normalizedRisks.filter(
      (risk) => risk === "MEDIUM_HIGH",
    ).length;

  const mediumZones =
    normalizedRisks.filter(
      (risk) =>
        risk === "MEDIUM" ||
        risk === "MODERATE",
    ).length;

  let cityRisk:
    | "low"
    | "moderate"
    | "high"
    | "critical" = "low";

  if (criticalZones > 0) {
    cityRisk = "critical";
  } else if (
    highZones > 0 ||
    mediumHighZones > 0
  ) {
    cityRisk = "high";
  } else if (mediumZones > 0) {
    cityRisk = "moderate";
  }

  /* -------------------- calculate water sensors -------------------- */

  const waterSensorsTotal =
    waterSensors.length;

  const waterSensorsOnline =
    waterSensors.filter(
      (sensor) =>
        sensor.status.toUpperCase() === "ONLINE",
    ).length;

  const waterSensorsOffline =
    waterSensors.filter(
      (sensor) =>
        sensor.status.toUpperCase() !== "ONLINE",
    ).length;

  const temperature =
    weather?.current?.temperature_2m;

  const weatherSub = weatherLoading
    ? "Loading live weather..."
    : temperature !== undefined
      ? `Live · ${temperature.toFixed(1)}°C`
      : "Live backend rainfall data";

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col gap-3",
        className,
      )}
    >
      <Panel
        title="Current City Status"
        action={<DataTag kind="LIVE" />}
        bodyClassName="p-3"
      >
        <div className="grid grid-cols-2 gap-2.5">

          {/* Flood Risk Level */}

          <Metric
            label="Flood Risk Level"
            value={
              floodZonesLoading
                ? "--"
                : RISK_LABEL[
                    cityRisk
                  ].toUpperCase()
            }
            tone={cityRisk}
            sub={
              floodZonesLoading
                ? "Loading backend data..."
                : `Based on ${floodZones.length} monitored zones`
            }
          />

          {/* Critical Areas */}

          <Metric
            label="Areas at Critical Risk"
            value={
              floodZonesLoading
                ? "--"
                : criticalZones
            }
            tone="critical"
            sub={
              floodZonesLoading
                ? "Loading backend data..."
                : `of ${floodZones.length} monitored zones`
            }
          />

          {/* Water Sensors */}

          <Metric
            label="Active Water Sensors"
            value={
              waterSensorsLoading
                ? "--"
                : `${waterSensorsOnline} / ${waterSensorsTotal}`
            }
            sub={
              waterSensorsLoading
                ? "Loading backend data..."
                : `${waterSensorsOffline} offline`
            }
          />

          {/* Live Rainfall */}

          <Metric
            label="Live Precipitation"
            value={
              rainfallLoading
                ? "--"
                : dailyRainfall !== null
                  ? dailyRainfall.toFixed(1)
                  : "--"
            }
            unit="mm"
            tone="primary"
            sub={
              rainfallLoading
                ? "Loading backend data..."
                : dailyRainfall !== null
                  ? `Today · ${weatherSub}`
                  : "Backend data unavailable"
            }
          />
        </div>
      </Panel>

      {/* Critical Alerts */}

      <Panel
        title={
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="size-3.5 text-high" />
            Critical Alerts
          </span>
        }
        action={
          <span className="num text-xs text-muted-foreground">
            {alertsLoading ? "--" : `${alerts.length} active`}
          </span>
        }
        className="min-h-0 flex-1"
        bodyClassName="overflow-auto p-3"
      >
        <ul className="space-y-2">
          {alerts.map((a, index) => (
            <li
              key={`${a.type}-${a.location}-${index}`}
              className={cn(
                "rounded-md border bg-surface px-3 py-2.5 transition-colors hover:border-border-strong",
                riskBorder[
  a.level.toLowerCase().replace("-", "_") as keyof typeof riskBorder
],
              )}
            >
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    "mt-1 size-2 shrink-0 rounded-full bg-current",
                    riskText[
  a.level.toLowerCase().replace("-", "_") as keyof typeof riskText
],
                  )}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {a.title}
                    </p>

                    <DataTag kind={a.tag} />
                  </div>

                  <p className="mt-0.5 text-xs font-medium text-foreground/70">
                    {a.location}
                  </p>

                  <p className="num mt-1 text-xs text-muted-foreground">
                    {a.detail}
                  </p>

                  <p className="mt-1.5 text-[10px] tracking-[0.1em] text-muted-foreground/80 uppercase">
                    {a.age}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}