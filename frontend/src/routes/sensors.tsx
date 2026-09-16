import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/hydro/AppShell";
import { CityMap, type LayerId } from "@/components/hydro/CityMap";
import { DataTag, Metric, Panel, SectionHeading } from "@/components/hydro/primitives";
import {
  DataHealthPanel,
  DrainageTable,
  InfrastructureTable,
  RainSensorTable,
  WaterSensorTable,
} from "@/components/hydro/SensorPanels";
import { CITY_STATUS, RAIN_SENSORS, WATER_SENSORS } from "@/lib/hydro/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sensors")({
  head: () => ({
    meta: [
      { title: "Live Data & Sensor Network | Pravah" },
      {
        name: "description",
        content:
          "Monitor the urban flood sensor network: rainfall gauges, water-level sensors, drainage load, pump infrastructure and data freshness warnings.",
      },
      { property: "og:title", content: "Live Data & Sensor Network | Pravah" },
      {
        property: "og:description",
        content:
          "Observed sensor telemetry, drainage load and data-health status for the city flood monitoring network.",
      },
    ],
  }),
  component: SensorsPage,
});

const TABS = ["Rainfall", "Water Level", "Drainage", "Infrastructure"] as const;
type Tab = (typeof TABS)[number];

const SENSOR_LAYERS: LayerId[] = ["sensors", "drainage", "risk"];

function SensorsPage() {
  const [tab, setTab] = useState<Tab>("Rainfall");

  return (
    <AppShell breadcrumb="Data & Sensors">
      <div className="flex flex-col gap-3">
        <SectionHeading
          title="Live Data & Sensor Network"
          subtitle="All values on this page are direct instrument measurements — no model output."
          action={<DataTag kind="OBSERVED" />}
        />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Rainfall Gauges"
            value={`${RAIN_SENSORS.filter((s) => s.status === "live").length} / ${RAIN_SENSORS.length}`}
            sub="Reporting in last 5 min"
            tag="LIVE"
          />
          <Metric
            label="Water Level Sensors"
            value={`${CITY_STATUS.sensorsOnline} / ${CITY_STATUS.sensorsTotal}`}
            sub="4 offline · 1 delayed"
            tone="high"
          />
          <Metric
            label="Peak Observed Level"
            value={Math.max(...WATER_SENSORS.map((s) => s.levelCm))}
            unit="cm"
            tone="critical"
            sub="W-012 · Sector 17"
          />
          <Metric
            label="Peak Rainfall"
            value={Math.max(...RAIN_SENSORS.map((s) => s.rainfall))}
            unit="mm/hr"
            tone="primary"
            sub="R-014 · River Road"
          />
        </div>

        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_340px]">
          <Panel
            title="Sensor Telemetry"
            action={
              <div className="flex flex-wrap gap-1">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "rounded px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase transition-colors",
                      tab === t
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            }
            bodyClassName="p-0"
          >
            {tab === "Rainfall" ? <RainSensorTable /> : null}
            {tab === "Water Level" ? <WaterSensorTable /> : null}
            {tab === "Drainage" ? <DrainageTable /> : null}
            {tab === "Infrastructure" ? <InfrastructureTable /> : null}
          </Panel>

          <div className="flex flex-col gap-3">
            <Panel title="Sensor Map" bodyClassName="p-3">
              <div className="map-scope h-[240px]">
                <CityMap step={0} layers={SENSOR_LAYERS} compact />
              </div>
              <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rotate-45 bg-primary" /> Rain gauge
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-high" /> Water level sensor
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-px w-4 border-t border-dashed border-primary" /> Drain
                </span>
              </div>
            </Panel>
            <DataHealthPanel />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
