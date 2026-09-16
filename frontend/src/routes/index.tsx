import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/hydro/AppShell";
import { CityMap, DEFAULT_LAYERS, type LayerId } from "@/components/hydro/CityMap";
import { MapLayerControl, MapLegend } from "@/components/hydro/MapControls";
import { CityStatusPanel } from "@/components/hydro/CityStatusPanel";
import { AreaDetailsPanel } from "@/components/hydro/AreaDetailsPanel";
import { ForecastTimeline } from "@/components/hydro/ForecastTimeline";
import type { ForecastStep, Zone } from "@/lib/hydro/data";
import { useWeather } from "@/hooks/use-weather";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pravah Command Center | Urban Flood Intelligence" },
      {
        name: "description",
        content:
          "Live urban flood command center for Gorakhpur: rainfall, water-level sensors, risk zones, road impact and 60-minute flood nowcasting in one console.",
      },
      { property: "og:title", content: "Pravah Command Center | Urban Flood Intelligence" },
      {
        property: "og:description",
        content:
          "Real-time flood risk map, critical alerts and 60-minute forecast timeline for city disaster-management teams.",
      },
    ],
  }),
  component: CommandCenter,
});

function CommandCenter() {
  const [step, setStep] = useState<ForecastStep>(0);
  const [layers, setLayers] = useState<LayerId[]>(DEFAULT_LAYERS);
  const [zone, setZone] = useState<Zone | null>(null);
  const { data: weather, loading: weatherLoading } = useWeather();

  const toggle = (id: LayerId) =>
    setLayers((cur) => (cur.includes(id) ? cur.filter((l) => l !== id) : [...cur, id]));

  return (
    <AppShell breadcrumb="Command Center">
      <div className="flex h-full min-h-0 flex-col gap-3">
        <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* Map */}
          <div className="map-scope relative min-h-[320px]">
            <CityMap
              step={step}
              layers={layers}
              selectedZoneId={zone?.id ?? null}
              onSelectZone={setZone}
            />
            <MapLayerControl
              layers={layers}
              onToggle={toggle}
              className="absolute top-3 left-3 z-[1100] pointer-events-auto"
            />
            <MapLegend mode="risk" className="absolute bottom-3 left-3 z-[1100] pointer-events-auto max-w-md" />
          </div>

          {/* Right rail */}
          <div className="min-h-0 overflow-y-auto">
            {zone ? (
              <AreaDetailsPanel zone={zone} step={step} onClose={() => setZone(null)} />
            ) : (
              <CityStatusPanel className="h-full" weather={weather} weatherLoading={weatherLoading} />
            )}
          </div>
        </div>

        <div className="shrink-0">
          <ForecastTimeline step={step} onChange={setStep} />
        </div>
      </div>
    </AppShell>
  );
}
