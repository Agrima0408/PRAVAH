import { useState } from "react";
import { Layers, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LayerId, MapMode } from "./CityMap";
import { RISK_ORDER, RISK_LABEL } from "@/lib/hydro/data";

const LAYER_DEFS: Array<{ id: LayerId; label: string }> = [
  { id: "risk", label: "Flood Risk" },
  { id: "rainfall", label: "Rainfall Intensity" },
  { id: "sensors", label: "Water Level Sensors" },
  { id: "drainage", label: "Drainage Network" },
  { id: "roads", label: "Affected Roads" },
  { id: "satellite", label: "Satellite View" },
  { id: "confidence", label: "Prediction Confidence" },
];

export function MapLayerControl({
  layers,
  onToggle,
  className,
}: {
  layers: LayerId[];
  onToggle: (id: LayerId) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={cn(
        "w-52 pointer-events-auto rounded-lg border border-border bg-popover/95 p-3 shadow-panel backdrop-blur",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="label-xs flex w-full cursor-pointer items-center justify-between text-foreground/80"
        aria-expanded={open}
        aria-controls="map-layer-list"
      >
        <span className="flex items-center gap-1.5">
          <Layers className="size-3.5" /> Map Layers
        </span>
        <ChevronDown
          className={cn("size-3.5 transition-transform duration-200", !open && "-rotate-90")}
        />
      </button>
      {open ? (
        <ul id="map-layer-list" className="mt-2.5 space-y-1">
          {LAYER_DEFS.map((l) => {
            const on = layers.includes(l.id);
            return (
              <li key={l.id}>
                <button
                  onClick={() => onToggle(l.id)}
                  className="flex w-full items-center gap-2 rounded px-1 py-1 text-left text-xs transition-colors hover:bg-muted"
                >
                  <span
                    className={cn(
                      "grid size-3.5 shrink-0 place-items-center rounded-[3px] border",
                      on ? "border-primary bg-primary text-primary-foreground" : "border-border-strong",
                    )}
                  >
                    {on ? (
                      <svg viewBox="0 0 10 10" className="size-2.5">
                        <path d="M1 5.5 L3.8 8 L9 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    ) : null}
                  </span>
                  <span className={on ? "text-foreground" : "text-muted-foreground"}>{l.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function MapModeToggle({
  mode,
  onChange,
  className,
}: {
  mode: MapMode;
  onChange: (m: MapMode) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex rounded-md border border-border bg-popover/92 p-0.5 backdrop-blur", className)}>
      {(
        [
          ["risk", "Flood Risk"],
          ["confidence", "Prediction Confidence"],
        ] as const
      ).map(([value, label]) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={cn(
            "rounded px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase transition-colors",
            mode === value
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function MapLegend({ mode, className }: { mode: MapMode; className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-4 rounded-lg border border-border bg-popover/92 px-3.5 py-2 shadow-panel backdrop-blur",
        className,
      )}
      title={
        mode === "risk"
          ? "Severity = predicted flood impact. Not a measure of certainty."
          : "Confidence = model certainty only. It does not indicate flood severity."
      }
    >
      <p className="label-xs shrink-0">{mode === "risk" ? "Risk" : "Confidence"}</p>
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {mode === "risk"
          ? RISK_ORDER.map((l) => (
              <li key={l} className="flex items-center gap-1.5 text-xs whitespace-nowrap text-foreground/85">
                <span className="size-2.5 rounded-full" style={{ background: `var(--${l})` }} />
                {RISK_LABEL[l]}
              </li>
            ))
          : (
              [
                ["High", "var(--observed)"],
                ["Moderate", "var(--predicted)"],
                ["Low", "var(--simulated)"],
              ] as const
            ).map(([label, color]) => (
              <li key={label} className="flex items-center gap-1.5 text-xs whitespace-nowrap text-foreground/85">
                <span className="size-2.5 rounded-full" style={{ background: color }} />
                {label}
              </li>
            ))}
      </ul>
    </div>
  );
}
