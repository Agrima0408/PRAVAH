import { cn } from "@/lib/utils";
import { FORECAST_STEPS, FORECAST_BY_STEP, type ForecastStep } from "@/lib/hydro/data";
import { DataTag } from "./primitives";

const stepLabel = (s: ForecastStep) => (s === 0 ? "NOW" : `+${s} MIN`);

export function ForecastTimeline({
  step,
  onChange,
  layout = "full",
  className,
}: {
  step: ForecastStep;
  onChange: (s: ForecastStep) => void;
  layout?: "full" | "compact";
  className?: string;
}) {
  const row = FORECAST_BY_STEP[step];
  const index = FORECAST_STEPS.indexOf(step);

  return (
    <section className={cn("panel p-4", className)}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="label-xs text-foreground/80">Flood Forecast</h2>
          <DataTag kind={step === 0 ? "OBSERVED" : "PREDICTED"} />
        </div>
        <p className="text-xs text-muted-foreground">
          Nowcast model run 2 min ago · confidence{" "}
          <span className="num text-foreground">{row.confidence}%</span>
        </p>
      </header>

      {/* Slider */}
      <div className="mt-5 px-1">
        <div className="relative h-1.5 rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary/70"
            style={{ width: `${(index / (FORECAST_STEPS.length - 1)) * 100}%` }}
          />
          <div className="absolute -top-3.5 flex w-full justify-between">
            {FORECAST_STEPS.map((s) => {
              const active = s === step;
              return (
                <button
                  key={s}
                  onClick={() => onChange(s)}
                  aria-label={`Forecast ${stepLabel(s)}`}
                  aria-pressed={active}
                  className="group flex flex-col items-center"
                >
                  <span
                    className={cn(
                      "grid size-8 place-items-center rounded-full border transition-all",
                      active
                        ? "border-primary bg-primary/20 shadow-glow"
                        : "border-border-strong bg-panel group-hover:border-primary/60",
                    )}
                  >
                    <span
                      className={cn(
                        "size-2.5 rounded-full transition-colors",
                        active ? "bg-primary" : "bg-muted-foreground/60",
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      "num mt-2 text-[11px] font-semibold tracking-wider",
                      active ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {stepLabel(s)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "mt-12 grid gap-3",
          layout === "full" ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2",
        )}
      >
        <div className="rounded-md border border-primary/30 bg-primary/8 px-3 py-2.5">
          <p className="label-xs">Selected Forecast Time</p>
          <p className="num mt-1 text-xl font-semibold text-primary">{stepLabel(step)}</p>
        </div>
        <div className="rounded-md border border-border bg-surface px-3 py-2.5">
          <p className="label-xs">Predicted affected area</p>
          <p className="num mt-1 text-xl font-semibold">
            {row.affectedAreaKm2}
            <span className="ml-1 text-sm text-muted-foreground">km²</span>
          </p>
        </div>
        <div className="rounded-md border border-border bg-surface px-3 py-2.5">
          <p className="label-xs">Critical road segments</p>
          <p className="num mt-1 text-xl font-semibold text-high">{row.criticalRoads}</p>
        </div>
        <div className="rounded-md border border-border bg-surface px-3 py-2.5">
          <p className="label-xs">Average predicted depth</p>
          <p className="num mt-1 text-xl font-semibold">
            {row.avgDepthCm}
            <span className="ml-1 text-sm text-muted-foreground">cm</span>
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">{row.headline}</p>
    </section>
  );
}
