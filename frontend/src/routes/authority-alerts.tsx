import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, Megaphone, Truck } from "lucide-react";
import { AppShell } from "@/components/hydro/AppShell";
import { DataTag, Metric, SectionHeading } from "@/components/hydro/primitives";
import { AUTHORITY_ALERTS, type AuthorityAlert } from "@/lib/hydro/data";
import { riskText } from "@/lib/hydro/ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/authority-alerts")({
  head: () => ({
    meta: [
      { title: "Authority Alerts | Pravah" },
      {
        name: "description",
        content:
          "Auto-generated flood alerts with priority scoring and response coordination for authority teams.",
      },
    ],
  }),
  component: AuthorityAlertsPage,
});

const ACCENT_BORDER: Record<AuthorityAlert["level"], string> = {
  low: "border-l-low",
  moderate: "border-l-moderate",
  high: "border-l-high",
  critical: "border-l-critical",
};

function AuthorityAlertsPage() {
  const [resolved, setResolved] = useState<Record<string, boolean>>({});
  const [dispatched, setDispatched] = useState<Record<string, boolean>>({});

  const active = AUTHORITY_ALERTS.filter((a) => !resolved[a.id]);
  const critical = active.filter((a) => a.level === "critical");
  const resolvedCount = Object.values(resolved).filter(Boolean).length;

  return (
    <AppShell breadcrumb="Authority Alerts">
      <div className="flex flex-col gap-3">
        <SectionHeading
          title="Authority Dashboard"
          subtitle="Auto-generated alerts, priority scoring & response coordination"
          action={<DataTag kind="LIVE" />}
        />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Total Alerts" value={AUTHORITY_ALERTS.length} />
          <Metric
            label="Critical, Active"
            value={critical.length}
            tone={critical.length ? "critical" : "default"}
          />
          <Metric
            label="Priority 1"
            value={active.filter((a) => a.level === "critical" || a.level === "high").length}
            tone="high"
          />
          <Metric label="Resolved" value={resolvedCount} tone="low" />
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {AUTHORITY_ALERTS.map((alert) => {
            const isResolved = !!resolved[alert.id];
            const isDispatched = !!dispatched[alert.id];
            return (
              <div
                key={alert.id}
                className={cn(
                  "panel flex flex-col gap-3 border-l-4 p-4 transition-opacity",
                  ACCENT_BORDER[alert.level],
                  isResolved && "opacity-50",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <AlertTriangle className={cn("size-4 shrink-0", riskText[alert.level])} />
                    {alert.title}
                  </h3>
                  {isResolved ? <DataTag kind="OBSERVED" className="shrink-0" /> : null}
                </div>

                <dl className="space-y-2 text-sm">
                  <Row label="Flood Probability" value={`${alert.floodProbability}%`} />
                  <Row label="Citizen Reports" value={alert.citizenReports} />
                  <Row label="Road Blockages" value={alert.roadBlockages} />
                  <Row label="Drainage Capacity" value={alert.drainageCapacity} />
                  <Row label="Risk Trend" value={alert.trend} />
                </dl>

                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground/80">Recommended:</span>{" "}
                  {alert.recommended}
                </p>

                <div className="mt-1 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    disabled={isResolved || isDispatched}
                    onClick={() => setDispatched((d) => ({ ...d, [alert.id]: true }))}
                    className={cn(
                      "bg-low/15 text-low hover:bg-low/25",
                      isDispatched && "opacity-60",
                    )}
                  >
                    <Truck className="size-3.5" />
                    {isDispatched ? "Team Dispatched" : "Dispatch Response Team"}
                  </Button>
                  <Button size="sm" variant="outline" disabled={isResolved}>
                    <Megaphone className="size-3.5" />
                    Issue Public Alert
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isResolved}
                    onClick={() => setResolved((r) => ({ ...r, [alert.id]: true }))}
                  >
                    <CheckCircle2 className="size-3.5" />
                    Mark Resolved
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="num font-medium text-foreground">{value}</dd>
    </div>
  );
}
