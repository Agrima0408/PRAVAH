import { createFileRoute } from "@tanstack/react-router";
import { Accessibility, HeartPulse, UtensilsCrossed } from "lucide-react";
import type { ReactNode } from "react";
import { AppShell } from "@/components/hydro/AppShell";
import { SectionHeading } from "@/components/hydro/primitives";
import { Progress } from "@/components/ui/progress";
import { SHELTERS, ZONES, shelterPctFull } from "@/lib/hydro/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shelters")({
  head: () => ({
    meta: [
      { title: "Emergency Shelters | Pravah" },
      {
        name: "description",
        content: "Live occupancy & support availability across city shelters.",
      },
    ],
  }),
  component: SheltersPage,
});

function fullTone(pct: number) {
  if (pct >= 90)
    return { bar: "bg-critical", badge: "border-critical/40 bg-critical/10 text-critical" };
  if (pct >= 60)
    return { bar: "bg-moderate", badge: "border-moderate/40 bg-moderate/10 text-moderate" };
  return { bar: "bg-low", badge: "border-low/40 bg-low/10 text-low" };
}

function SheltersPage() {
  return (
    <AppShell breadcrumb="Shelters">
      <div className="flex flex-col gap-3">
        <SectionHeading
          title="Emergency Shelters"
          subtitle="Live occupancy & support availability"
        />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {SHELTERS.map((s) => {
            const pctFull = shelterPctFull(s);
            const tone = fullTone(pctFull);
            const available = s.capacity - s.occupied;
            const zoneName = ZONES.find((z) => z.id === s.zoneId)
              ?.name.split("—")[0]
              ?.trim();
            return (
              <div key={s.id} className="panel flex flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{s.name}</h3>
                    {zoneName ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">{zoneName}</p>
                    ) : null}
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                      tone.badge,
                    )}
                  >
                    {pctFull}% Full
                  </span>
                </div>

                <Progress
                  value={pctFull}
                  className="h-1.5 bg-muted"
                  indicatorClassName={tone.bar}
                />

                <dl className="space-y-1.5 text-sm">
                  <Row label="Capacity" value={s.capacity} />
                  <Row label="Occupied" value={s.occupied} />
                  <Row label="Available" value={available} />
                  <Row
                    label={
                      <span className="flex items-center gap-1.5">
                        <UtensilsCrossed className="size-3.5" /> Food / Water
                      </span>
                    }
                    value={s.foodWater}
                    valueTone={s.foodWater === "Limited" ? "text-moderate" : "text-low"}
                  />
                  <Row
                    label={
                      <span className="flex items-center gap-1.5">
                        <HeartPulse className="size-3.5" /> Medical Support
                      </span>
                    }
                    value={s.medicalSupport}
                    valueTone={
                      s.medicalSupport === "Not on-site" ? "text-muted-foreground" : "text-low"
                    }
                  />
                  <Row
                    label={
                      <span className="flex items-center gap-1.5">
                        <Accessibility className="size-3.5" /> Accessibility
                      </span>
                    }
                    value={s.accessibility}
                    valueTone="text-muted-foreground"
                  />
                </dl>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

function Row({
  label,
  value,
  valueTone,
}: {
  label: ReactNode;
  value: string | number;
  valueTone?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-1.5 first:border-0 first:pt-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("num font-medium text-foreground", valueTone)}>{value}</dd>
    </div>
  );
}
