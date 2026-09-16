import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { Clock, MapPinned, Milestone, Navigation, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/hydro/AppShell";
import { Panel, SectionHeading } from "@/components/hydro/primitives";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DESTINATION_TYPES,
  SHELTERS,
  ZONES,
  calculateSafeRoute,
  type DestinationType,
  type SafeRoute,
} from "@/lib/hydro/data";

export const Route = createFileRoute("/safe-routes")({
  head: () => ({
    meta: [
      { title: "Find Safe Route | Pravah" },
      {
        name: "description",
        content:
          "Routes avoid flooded & blocked roads using the latest sensor and citizen reports.",
      },
    ],
  }),
  component: SafeRoutesPage,
});

function SafeRoutesPage() {
  const [from, setFrom] = useState(ZONES[0]!.id);
  const [destType, setDestType] = useState<DestinationType>(DESTINATION_TYPES[0]!);
  const [destination, setDestination] = useState(SHELTERS[0]!.name);
  const [route, setRoute] = useState<SafeRoute | null>(null);

  const destinationOptions = useMemo(() => SHELTERS.map((s) => s.name), []);

  return (
    <AppShell breadcrumb="Safe Routes">
      <div className="flex flex-col gap-3">
        <SectionHeading
          title="Find Safe Route"
          subtitle="Routes avoid flooded & blocked roads using latest reports"
        />

        <Panel>
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="From">
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ZONES.map((z) => (
                    <SelectItem key={z.id} value={z.id}>
                      {z.name.split("—")[0]!.trim()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="To (Destination Type)">
              <Select value={destType} onValueChange={(v) => setDestType(v as DestinationType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DESTINATION_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Destination">
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {destinationOptions.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Button
            className="mt-3 h-11 w-full bg-low/15 text-low hover:bg-low/25"
            onClick={() => setRoute(calculateSafeRoute(from, destination))}
          >
            <Navigation className="size-4" />
            Calculate Safe Route
          </Button>
        </Panel>

        {route ? (
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
            <Panel title="Route Steps">
              <ol className="space-y-3">
                {route.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="num flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/12 text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-foreground/85">{step.instruction}</span>
                  </li>
                ))}
              </ol>

              {route.roadsAvoided.length ? (
                <div className="mt-4 border-t border-border pt-3">
                  <p className="label-xs mb-2">Flooded roads avoided</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {route.roadsAvoided.map((r) => (
                      <li
                        key={r}
                        className="rounded border border-high/40 bg-high/10 px-2 py-1 text-xs text-high"
                      >
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </Panel>

            <div className="flex flex-col gap-3">
              <div className="panel grid grid-cols-2 gap-3 p-4">
                <div>
                  <p className="label-xs flex items-center gap-1.5">
                    <Milestone className="size-3.5" /> Distance
                  </p>
                  <p className="num mt-1 text-xl font-semibold text-foreground">
                    {route.distanceKm} km
                  </p>
                </div>
                <div>
                  <p className="label-xs flex items-center gap-1.5">
                    <Clock className="size-3.5" /> ETA
                  </p>
                  <p className="num mt-1 text-xl font-semibold text-foreground">
                    {route.etaMinutes} min
                  </p>
                </div>
              </div>
              <div className="panel flex items-start gap-2.5 border-low/40 bg-low/8 p-4">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-low" />
                <p className="text-xs text-foreground/85">
                  This route avoids all roads currently at high or critical flood severity, based on
                  live sensor and citizen reports.
                </p>
              </div>
              <div className="panel flex items-start gap-2.5 p-4">
                <MapPinned className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-xs text-muted-foreground">
                  Destination: <span className="font-medium text-foreground">{destination}</span>
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="label-xs mb-1.5">{label}</p>
      {children}
    </div>
  );
}
