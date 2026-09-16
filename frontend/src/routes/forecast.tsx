import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/hydro/AppShell";
import { CityMap, DEFAULT_LAYERS, type LayerId, type MapMode } from "@/components/hydro/CityMap";
import { MapLayerControl, MapLegend, MapModeToggle } from "@/components/hydro/MapControls";
import { DataTag, Panel, SectionHeading } from "@/components/hydro/primitives";
import {
  FORECAST_STEPS,
  FORECAST_SUMMARY,
  FORECAST_BY_STEP,
  CITY_STATUS,
  type ForecastStep,
  type Zone,
} from "@/lib/hydro/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/forecast")({
  head: () => ({
    meta: [
      { title: "Flood Nowcasting & Forecast | Pravah" },
      {
        name: "description",
        content:
          "60-minute urban flood nowcast: see how flood extent, depth and road impact evolve at +15, +30, +45 and +60 minutes with model confidence.",
      },
      { property: "og:title", content: "Flood Nowcasting & Forecast | Pravah" },
      {
        property: "og:description",
        content:
          "Step through the flood nowcast timeline and review predicted extent, depth and confidence per interval.",
      },
    ],
  }),
  component: ForecastPage,
});

const stepLabel = (s: ForecastStep) => (s === 0 ? "NOW" : `+${s}m`);

function ForecastPage() {
  const [step, setStep] = useState<ForecastStep>(30);
  const [layers, setLayers] = useState<LayerId[]>(DEFAULT_LAYERS);
  const [mode, setMode] = useState<MapMode>("risk");
  const [zone, setZone] = useState<Zone | null>(null);
  const row = FORECAST_BY_STEP[step];

  const toggle = (id: LayerId) =>
    setLayers((cur) => (cur.includes(id) ? cur.filter((l) => l !== id) : [...cur, id]));

  return (
    <AppShell breadcrumb="Forecast">
      <div className="flex min-h-full flex-col gap-3">
        <SectionHeading
          title="Flood Nowcasting & Forecast"
          subtitle="Short-term prediction of flood extent, depth and road impact across the next 60 minutes."
          action={<DataTag kind="PREDICTED" />}
        />

        {/* Timeline */}
        <div className="panel flex flex-wrap items-center gap-2 p-3">
          {FORECAST_STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => setStep(s)}
                className={cn(
                  "num rounded-md border px-3.5 py-2 text-xs font-bold tracking-widest uppercase transition-colors",
                  s === step
                    ? "border-primary/50 bg-primary/15 text-primary"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground",
                )}
              >
                {stepLabel(s)}
              </button>
              {i < FORECAST_STEPS.length - 1 ? (
                <span className="h-px w-5 bg-border-strong sm:w-8" />
              ) : null}
            </div>
          ))}
          <p className="num ml-auto text-xs text-muted-foreground">
            Model run {CITY_STATUS.modelRun} · ensemble of 12 members
          </p>
        </div>

        <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="map-scope relative h-[560px] max-h-[70vh] min-h-[420px] self-start">
            <CityMap
              step={step}
              layers={layers}
              mode={mode}
              selectedZoneId={zone?.id ?? null}
              onSelectZone={setZone}
            />
            <MapLayerControl layers={layers} onToggle={toggle} className="absolute top-3 left-3 z-10" />
            <MapModeToggle mode={mode} onChange={setMode} className="absolute top-3 right-3 z-10" />
            <MapLegend mode={mode} className="absolute bottom-3 left-3 z-10 max-w-md" />
          </div>

          <div className="flex min-h-0 flex-col gap-3">
            <Panel title="Forecast Summary" bodyClassName="p-3">
              <ul className="space-y-2">
                {FORECAST_SUMMARY.filter((r) => r.step !== 0).map((r) => (
                  <li key={r.step}>
                    <button
                      onClick={() => setStep(r.step)}
                      className={cn(
                        "w-full rounded-md border px-3 py-2.5 text-left transition-colors",
                        r.step === step
                          ? "border-primary/40 bg-primary/8"
                          : "border-border bg-surface hover:border-border-strong",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "num text-xs font-bold tracking-widest",
                            r.step === step ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          +{r.step} MIN
                        </span>
                        <span className="num text-[11px] text-muted-foreground">
                          {r.affectedAreaKm2} km² · {r.criticalRoads} roads
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-foreground/90">{r.headline}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title={`Selected · ${stepLabel(step)}`} bodyClassName="p-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-md border border-border bg-surface px-2.5 py-2">
                  <p className="label-xs">Area</p>
                  <p className="num mt-1 text-lg font-semibold">{row.affectedAreaKm2} km²</p>
                </div>
                <div className="rounded-md border border-border bg-surface px-2.5 py-2">
                  <p className="label-xs">Roads</p>
                  <p className="num mt-1 text-lg font-semibold text-high">{row.criticalRoads}</p>
                </div>
                <div className="rounded-md border border-border bg-surface px-2.5 py-2">
                  <p className="label-xs">Depth</p>
                  <p className="num mt-1 text-lg font-semibold">{row.avgDepthCm} cm</p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                <div>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-muted-foreground">Forecast confidence</span>
                    <span className="num font-semibold text-observed">{row.confidence}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-observed"
                      style={{ width: `${row.confidence}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-muted-foreground">Data quality</span>
                  <span className="font-medium text-low">{CITY_STATUS.dataQuality}</span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-muted-foreground">Last model run</span>
                  <span className="num font-medium">{CITY_STATUS.modelRun}</span>
                </div>
              </div>

              <p className="mt-4 rounded-md border border-predicted/30 bg-predicted/8 px-3 py-2 text-xs text-foreground/85">
                All values on this page are model predictions. Compare against observed sensor
                readings in Data &amp; Sensors before issuing public advisories.
              </p>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
