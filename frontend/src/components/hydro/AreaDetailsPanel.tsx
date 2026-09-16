import { useEffect, useState } from "react";
import { ArrowLeft, Gauge, X } from "lucide-react";
import type { ForecastStep, Zone } from "@/lib/hydro/data";
import { DataTag, FactorBar, KeyValue, RiskBadge } from "./primitives";
import { getRainfall } from "@/lib/api/rainfall";

export function AreaDetailsPanel({
  zone,
  step,
  onClose,
}: {
  zone: Zone;
  step: ForecastStep;
  onClose: () => void;
}) {
  const [view, setView] = useState<"details" | "explanation">("details");
  const [rainfall, setRainfall] = useState<number | null>(null);
  const f = zone.forecast[step];

  useEffect(() => {
  async function loadRainfall() {
    try {
      const data = await getRainfall();

      console.log("Rainfall API response:", data);

      if (Array.isArray(data) && data.length > 0) {
  const today = new Date().toISOString().split("T")[0];

  const todayData = data.find(
    (item) => item.date === today
  );

  if (todayData) {
    setRainfall(Number(todayData.rainfall_mm));
  }
}
    } catch (error) {
      console.error("Failed to load rainfall:", error);
    }
  }

  loadRainfall();
}, []);

  return (
    <aside className="panel flex h-full min-h-0 w-full flex-col">
      <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            {view === "explanation" ? (
              <button
                onClick={() => setView("details")}
                className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Back to area details"
              >
                <ArrowLeft className="size-4" />
              </button>
            ) : null}
            <h2 className="text-sm font-semibold tracking-[0.1em] text-foreground uppercase">
              {view === "details" ? zone.name : "Why is this area at risk?"}
            </h2>
          </div>
          <p className="label-xs mt-1">
            {view === "details" ? `${zone.kind} · Ward intelligence report` : zone.name}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close area details"
        >
          <X className="size-4" />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        {view === "details" ? (
          <>
            <div className="flex items-center justify-between">
              <span className="label-xs">Status</span>
              <RiskBadge level={f.level} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <div className="rounded-md border border-predicted/30 bg-predicted/8 px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <p className="label-xs">Flood probability</p>
                  <DataTag kind="PREDICTED" />
                </div>
                <p className="num mt-1.5 text-2xl font-semibold text-predicted">{f.probability}%</p>
              </div>
              <div className="rounded-md border border-border bg-surface px-3 py-2.5">
                <p className="label-xs">Expected water depth</p>
                <p className="num mt-1.5 text-2xl font-semibold">
                  {f.depthMin}–{f.depthMax}
                  <span className="ml-1 text-sm text-muted-foreground">cm</span>
                </p>
              </div>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
              <div className="rounded-md border border-border bg-surface px-3 py-2.5">
                <p className="label-xs">Estimated onset</p>
                <p className="num mt-1 text-lg font-semibold">{zone.onsetMinutes} min</p>
              </div>
              <div className="rounded-md border border-border bg-surface px-3 py-2.5">
                <p className="label-xs">Prediction confidence</p>
                <p className="num mt-1 text-lg font-semibold text-observed">{f.confidence}%</p>
              </div>
            </div>

            <div className="mt-5 border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <p className="label-xs text-foreground/80">Current conditions</p>
                <DataTag kind="OBSERVED" />
              </div>
              <div className="mt-1">
                <KeyValue
  label="Rainfall"
  value={
  rainfall !== null
    ? `${rainfall} mm`
    : "Loading..."
}
/>
                <KeyValue label="Drain capacity" value={`${zone.drainUtilisation}% utilised · ${zone.drainId}`} />
                <KeyValue label="Elevation" value={zone.elevation} />
                <KeyValue label="Surface type" value={zone.surface} />
                <KeyValue
                  label={`Nearby water sensor (${zone.nearestSensor})`}
                  value={`${zone.observedLevelCm} cm`}
                />
              </div>
            </div>

            <p className="mt-4 rounded-md border border-border/70 bg-surface px-3 py-2 text-xs text-muted-foreground">
              Observed values are direct sensor measurements. Depth and probability are model
              outputs and carry the confidence shown above.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-end justify-between">
              <div>
                <p className="label-xs">Flood risk score</p>
                <p className="num mt-1 text-4xl leading-none font-semibold text-critical">
                  {zone.riskScore}
                  <span className="text-lg text-muted-foreground"> / 100</span>
                </p>
              </div>
              <Gauge className="size-8 text-muted-foreground/50" />
            </div>

            <div className="mt-5 space-y-3">
              <p className="label-xs text-foreground/80">Contributing factors</p>
              {zone.factors.map((factor) => (
                <FactorBar key={factor.label} label={factor.label} value={factor.value} />
              ))}
            </div>

            <div className="mt-5 rounded-md border border-high/35 bg-high/8 px-3 py-3">
              <p className="label-xs text-high">Primary contributor</p>
              <p className="mt-1.5 text-sm text-foreground/90">{zone.primaryContributor}</p>
            </div>

            <div className="mt-3 rounded-md border border-border bg-surface px-3 py-3">
              <p className="label-xs">Model note</p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Attribution derived from the nowcasting ensemble (hydrological + rainfall-runoff),
                weighted by observed sensor agreement over the last 60 minutes.
              </p>
            </div>
          </>
        )}
      </div>

      {view === "details" ? (
        <footer className="border-t border-border p-3">
          <button
            onClick={() => setView("explanation")}
            className="w-full rounded-md border border-primary/40 bg-primary/12 px-3 py-2.5 text-xs font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:bg-primary/20"
          >
            View risk explanation
          </button>
        </footer>
      ) : null}
    </aside>
  );
}
