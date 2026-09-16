import { ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DRAINS,
  PUMPS,
  CITY_STATUS,
  pct,
  type DrainState,
  type ScenarioInput,
  type ScenarioResult,
} from "@/lib/hydro/data";
import { DataTag, Panel } from "./primitives";

const RAIN_OPTIONS = [-20, 0, 20, 50] as const;
const DURATIONS = [15, 30, 60, 120] as const;
const DRAIN_STATES: Array<{ id: DrainState; label: string }> = [
  { id: "normal", label: "Normal" },
  { id: "partial", label: "Partial Blockage" },
  { id: "severe", label: "Severe Blockage" },
];

export function ScenarioControls({
  input,
  onChange,
  onRun,
  running,
}: {
  input: ScenarioInput;
  onChange: (next: ScenarioInput) => void;
  onRun: () => void;
  running: boolean;
}) {
  const simulatedRainfall = Math.round(
    CITY_STATUS.rainfallIntensity * (1 + input.rainfallDelta / 100),
  );

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <Panel title="Rainfall Intensity" bodyClassName="p-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="label-xs">Current rainfall</p>
            <p className="num mt-1 text-lg font-semibold">{CITY_STATUS.rainfallIntensity} mm/hr</p>
          </div>
          <div className="text-right">
            <p className="label-xs">Simulated</p>
            <p className="num mt-1 text-lg font-semibold text-simulated">{simulatedRainfall} mm/hr</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {RAIN_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => onChange({ ...input, rainfallDelta: d })}
              className={cn(
                "num rounded-md border px-2 py-2 text-xs font-semibold transition-colors",
                input.rainfallDelta === d
                  ? "border-simulated/50 bg-simulated/15 text-simulated"
                  : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
              )}
            >
              {d === 0 ? "NORMAL" : `${d > 0 ? "+" : ""}${d}%`}
            </button>
          ))}
        </div>
        <input
          type="range"
          min={-20}
          max={50}
          step={10}
          value={input.rainfallDelta}
          onChange={(e) => onChange({ ...input, rainfallDelta: Number(e.target.value) })}
          className="mt-3 w-full accent-[var(--primary)]"
          aria-label="Rainfall intensity change"
        />
      </Panel>

      <Panel title="Pump Status" bodyClassName="p-3">
        <ul className="space-y-2">
          {PUMPS.map((p) => {
            const failed = input.pumpFailures.includes(p.id);
            return (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                  <p className="num text-[11px] text-muted-foreground">
                    {p.zone} · {p.capacity}
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={failed}
                  aria-label={`Simulate failure of ${p.name}`}
                  onClick={() =>
                    onChange({
                      ...input,
                      pumpFailures: failed
                        ? input.pumpFailures.filter((id) => id !== p.id)
                        : [...input.pumpFailures, p.id],
                    })
                  }
                  className={cn(
                    "relative h-5 w-9 shrink-0 rounded-full border transition-colors",
                    failed ? "border-critical/50 bg-critical/30" : "border-border-strong bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 size-3.5 rounded-full transition-all",
                      failed ? "left-[18px] bg-critical" : "left-0.5 bg-muted-foreground",
                    )}
                  />
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-2.5 text-[11px] text-muted-foreground">
          Toggle a station to simulate failure. Real operational state is unchanged.
        </p>
      </Panel>

      <Panel title="Drainage Status" bodyClassName="p-3">
        <ul className="space-y-2.5">
          {DRAINS.filter((d) => ["D-17", "D-21", "D-09"].includes(d.id)).map((d) => (
            <li key={d.id}>
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-medium text-foreground">
                  {d.id}
                  <span className="ml-2 text-xs text-muted-foreground">{d.name}</span>
                </p>
                <span className="num text-xs text-muted-foreground">{d.load}% load</span>
              </div>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                {DRAIN_STATES.map((s) => {
                  const active = (input.drainStates[d.id] ?? "normal") === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() =>
                        onChange({
                          ...input,
                          drainStates: { ...input.drainStates, [d.id]: s.id },
                        })
                      }
                      className={cn(
                        "rounded-md border px-1.5 py-1.5 text-[11px] font-medium transition-colors",
                        active
                          ? "border-simulated/50 bg-simulated/15 text-simulated"
                          : "border-border bg-surface text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Simulation Duration" bodyClassName="p-3">
        <div className="grid grid-cols-4 gap-1.5">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => onChange({ ...input, durationMinutes: d })}
              className={cn(
                "num rounded-md border px-2 py-2 text-xs font-semibold transition-colors",
                input.durationMinutes === d
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {d} min
            </button>
          ))}
        </div>
      </Panel>

      <button
        onClick={onRun}
        disabled={running}
        className="relative w-full overflow-hidden rounded-md border border-primary/50 bg-primary/18 px-4 py-3.5 text-sm font-bold tracking-[0.16em] text-primary uppercase transition-colors hover:bg-primary/28 disabled:opacity-70"
      >
        {running ? "Running model…" : "Run simulation"}
        {running ? (
          <span className="sweep absolute inset-y-0 left-0 w-1/3 bg-primary/25 blur-md" />
        ) : null}
      </button>
    </div>
  );
}

function DeltaChip({ from, to, unit }: { from: number; to: number; unit?: string }) {
  const change = pct(from, to);
  const tone = change > 40 ? "text-critical" : change > 0 ? "text-high" : "text-low";
  return (
    <span className={cn("num text-xs font-semibold", tone)}>
      {change > 0 ? "+" : ""}
      {change}%{unit ? ` ${unit}` : ""}
    </span>
  );
}

export function SimulationResults({
  result,
  running,
  onViewOnMap,
}: {
  result: ScenarioResult | null;
  running: boolean;
  onViewOnMap: () => void;
}) {
  if (running) {
    return (
      <Panel title="Simulation Results" bodyClassName="p-3">
        <div className="space-y-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      </Panel>
    );
  }

  if (!result) {
    return (
      <Panel title="Simulation Results" bodyClassName="p-3">
        <div className="grid h-full min-h-[240px] place-items-center rounded-md border border-dashed border-border px-4 text-center">
          <div>
            <Sparkles className="mx-auto size-6 text-muted-foreground/60" />
            <p className="mt-2 text-sm font-medium text-foreground">No scenario evaluated</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Configure rainfall, pumps and drainage, then run the simulation to compare against the
              live baseline.
            </p>
          </div>
        </div>
      </Panel>
    );
  }

  const rows = [
    { label: "Affected Area", b: result.baseline.affectedAreaKm2, s: result.simulated.affectedAreaKm2, unit: "km²" },
    { label: "Critical Roads", b: result.baseline.criticalRoads, s: result.simulated.criticalRoads, unit: "" },
    { label: "Average Flood Depth", b: result.baseline.avgDepthCm, s: result.simulated.avgDepthCm, unit: "cm" },
    { label: "Population Exposed", b: result.baseline.peopleExposed, s: result.simulated.peopleExposed, unit: "" },
  ];

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <Panel
        title="Simulation Results"
        action={<DataTag kind="SIMULATED" />}
        bodyClassName="p-3"
      >
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 gap-y-2 text-xs">
          <span className="label-xs">Metric</span>
          <span className="label-xs text-right">Baseline</span>
          <span className="label-xs text-right">Simulated</span>
          {rows.map((r) => (
            <div key={r.label} className="col-span-3 grid grid-cols-[1fr_auto_auto] items-center gap-x-3 border-t border-border/60 py-2">
              <div>
                <p className="text-sm text-foreground">{r.label}</p>
                <DeltaChip from={r.b} to={r.s} />
              </div>
              <span className="num text-right text-sm text-muted-foreground">
                {r.b.toLocaleString("en-IN")} {r.unit}
              </span>
              <span className="num text-right text-base font-semibold text-simulated">
                {r.s.toLocaleString("en-IN")} {r.unit}
              </span>
            </div>
          ))}
        </div>
        <p className="num mt-3 text-xs text-muted-foreground">
          Scenario confidence {result.confidence}% · results are model outputs, not observations.
        </p>
      </Panel>

      <Panel
        title={
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-primary" /> AI Recommendation
          </span>
        }
        bodyClassName="p-3"
      >
        <p className="label-xs">Priority action</p>
        <p className="mt-1.5 text-sm font-medium text-foreground">{result.recommendation.action}</p>
        <p className="label-xs mt-4">Expected impact</p>
        <p className="mt-1.5 text-sm text-foreground/85">{result.recommendation.impact}</p>
        <p className="label-xs mt-4">Secondary action</p>
        <p className="mt-1.5 text-sm text-foreground/85">{result.recommendation.secondary}</p>
        <button
          onClick={onViewOnMap}
          className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-primary/40 bg-primary/12 px-3 py-2.5 text-xs font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:bg-primary/20"
        >
          View on map <ArrowUpRight className="size-3.5" />
        </button>
      </Panel>
    </div>
  );
}
