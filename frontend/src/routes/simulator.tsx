import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/hydro/AppShell";
import { CityMap, DEFAULT_LAYERS, type LayerId } from "@/components/hydro/CityMap";
import { MapLegend } from "@/components/hydro/MapControls";
import { DataTag, SectionHeading } from "@/components/hydro/primitives";
import { ScenarioControls, SimulationResults } from "@/components/hydro/ScenarioPanels";
import {
  runScenario,
  type ScenarioInput,
  type ScenarioResult,
  type Zone,
} from "@/lib/hydro/data";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Urban Flood Scenario Simulator | Pravah" },
      {
        name: "description",
        content:
          "Test what-if flood scenarios: increase rainfall, fail a pump station or block a drain, then compare simulated impact against the live baseline.",
      },
      { property: "og:title", content: "Urban Flood Scenario Simulator | Pravah" },
      {
        property: "og:description",
        content:
          "Evaluate rainfall, pump-failure and drainage-blockage scenarios with AI-generated response recommendations.",
      },
    ],
  }),
  component: SimulatorPage,
});

const INITIAL: ScenarioInput = {
  rainfallDelta: 20,
  pumpFailures: [],
  drainStates: { "D-17": "normal", "D-21": "normal", "D-09": "normal" },
  durationMinutes: 30,
};

function SimulatorPage() {
  const [input, setInput] = useState<ScenarioInput>(INITIAL);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [running, setRunning] = useState(false);
  const [layers] = useState<LayerId[]>(DEFAULT_LAYERS);

  const run = () => {
    setRunning(true);
    setResult(null);
    const next = runScenario(input);
    setTimeout(() => {
      setResult(next);
      setRunning(false);
    }, 900);
  };

  const [, setSelected] = useState<Zone | null>(null);

  return (
    <AppShell breadcrumb="Scenario Simulator">
      <div className="flex min-h-full flex-col gap-3">
        <SectionHeading
          title="Urban Flood Scenario Simulator"
          subtitle="Test potential events and evaluate their impact before they occur."
          action={<DataTag kind={result ? "SIMULATED" : "BASELINE"} />}
        />

        <div className="grid min-h-0 flex-1 gap-3 xl:grid-cols-[300px_minmax(0,1fr)_340px]">
          <div className="min-h-0 overflow-auto pr-1">
            <ScenarioControls input={input} onChange={setInput} onRun={run} running={running} />
          </div>

          <div className="map-scope relative h-[560px] max-h-[70vh] min-h-[420px] self-start xl:order-none">
            <CityMap
              step={30}
              layers={layers}
              zoneLevelOverride={result?.zoneLevels ?? null}
              onSelectZone={setSelected}
            />
            <MapLegend mode="risk" className="absolute bottom-3 left-3 z-10 max-w-md" />
            <div className="absolute top-3 right-3 z-10 rounded-md border border-border bg-popover/92 px-3 py-2 backdrop-blur">
              <p className="label-xs">Map state</p>
              <p className="num text-sm font-semibold" style={{ color: result ? "var(--simulated)" : "var(--primary)" }}>
                {result ? "Simulated outcome" : "Live baseline"}
              </p>
            </div>
            {running ? (
              <div className="absolute inset-0 z-20 grid place-items-center bg-background/55 backdrop-blur-sm">
                <div className="panel px-5 py-4 text-center">
                  <p className="label-xs text-primary">Running hydraulic model</p>
                  <div className="mt-3 h-1 w-48 overflow-hidden rounded-full bg-muted">
                    <div className="sweep h-full w-1/3 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="min-h-0 overflow-auto pr-1">
            <SimulationResults
              result={result}
              running={running}
              onViewOnMap={() => {
                if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
