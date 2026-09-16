import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import type {
  ForecastStep,
  RiskLevel,
  Zone,
} from "@/lib/hydro/data";

export type LayerId =
  | "risk"
  | "rainfall"
  | "sensors"
  | "drainage"
  | "roads"
  | "satellite"
  | "confidence";

export const DEFAULT_LAYERS: LayerId[] = [
  "risk",
  "rainfall",
  "sensors",
  "drainage",
  "roads",
];

export type MapMode = "risk" | "confidence";

export interface CityMapProps {
  step: ForecastStep;
  layers: LayerId[];
  mode?: MapMode;
  selectedZoneId?: string | null;
  onSelectZone?: (zone: Zone) => void;
  zoneLevelOverride?: Record<string, RiskLevel> | null;
  compact?: boolean;
  className?: string;
}

/**
 * SSR-safe map wrapper.
 *
 * TanStack Start renders routes on the server, while Leaflet requires `window`.
 * Therefore this file never imports Leaflet or react-leaflet directly.
 * The browser loads the Leaflet implementation only after mounting.
 */
export function CityMap(props: CityMapProps) {
  const [MapComponent, setMapComponent] =
    useState<ComponentType<CityMapProps> | null>(null);

  useEffect(() => {
    let cancelled = false;

    import("./CityMapLeaflet").then((module) => {
      if (!cancelled) {
        setMapComponent(() => module.CityMapLeaflet);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!MapComponent) {
    return (
      <div
        className={[
          "map-scope grid h-full w-full place-items-center overflow-hidden rounded-xl border border-border bg-surface",
          props.className ?? "",
        ].join(" ")}
      >
        <div className="text-sm text-muted-foreground">
          Loading interactive GIS map…
        </div>
      </div>
    );
  }

  return <MapComponent {...props} />;
}
