import { AlertTriangle, CheckCircle2, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DATA_HEALTH,
  DATA_WARNINGS,
  DRAINS,
  PUMPS,
  RAIN_SENSORS,
  WATER_SENSORS,
} from "@/lib/hydro/data";
import { riskText } from "@/lib/hydro/ui";
import { DataTag, Panel, RiskBadge } from "./primitives";

function StatusPill({ status }: { status: "live" | "delayed" | "offline" }) {
  if (status === "live") return <DataTag kind="LIVE" />;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.14em] uppercase",
        status === "delayed"
          ? "border-moderate/40 bg-moderate/10 text-moderate"
          : "border-border-strong bg-muted text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}

const th = "label-xs px-3 py-2 text-left font-semibold";
const td = "px-3 py-2.5 text-sm";

export function RainSensorTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className={th}>Sensor ID</th>
            <th className={th}>Location</th>
            <th className={cn(th, "text-right")}>Rainfall</th>
            <th className={th}>Status</th>
            <th className={cn(th, "text-right")}>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {RAIN_SENSORS.map((s) => (
            <tr key={s.id} className="border-b border-border/50 transition-colors hover:bg-muted/50">
              <td className={cn(td, "num font-medium text-primary")}>{s.id}</td>
              <td className={cn(td, "text-foreground/90")}>{s.location}</td>
              <td className={cn(td, "num text-right")}>{s.rainfall} mm/hr</td>
              <td className={td}>
                <StatusPill status={s.status} />
              </td>
              <td className={cn(td, "num text-right text-muted-foreground")}>{s.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WaterSensorTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className={th}>Sensor ID</th>
            <th className={th}>Location</th>
            <th className={cn(th, "text-right")}>Water Level</th>
            <th className={cn(th, "text-right")}>Threshold</th>
            <th className={th}>Risk</th>
            <th className={th}>Trend</th>
            <th className={th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {WATER_SENSORS.map((s) => (
            <tr key={s.id} className="border-b border-border/50 transition-colors hover:bg-muted/50">
              <td className={cn(td, "num font-medium text-primary")}>{s.id}</td>
              <td className={cn(td, "text-foreground/90")}>{s.location}</td>
              <td className={cn(td, "num text-right font-semibold", riskText[s.risk])}>
                {s.levelCm} cm
              </td>
              <td className={cn(td, "num text-right text-muted-foreground")}>{s.thresholdCm} cm</td>
              <td className={td}>
                <RiskBadge level={s.risk} size="sm" />
              </td>
              <td className={cn(td, "text-xs text-muted-foreground capitalize")}>{s.trend}</td>
              <td className={td}>
                <StatusPill status={s.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DrainageTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className={th}>Drain ID</th>
            <th className={th}>Name</th>
            <th className={cn(th, "text-right")}>Load</th>
            <th className={th}>Capacity State</th>
          </tr>
        </thead>
        <tbody>
          {DRAINS.map((d) => (
            <tr key={d.id} className="border-b border-border/50 transition-colors hover:bg-muted/50">
              <td className={cn(td, "num font-medium text-primary")}>{d.id}</td>
              <td className={cn(td, "text-foreground/90")}>{d.name}</td>
              <td className={cn(td, "num text-right")}>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                    <span
                      className="block h-full rounded-full"
                      style={{
                        width: `${d.load}%`,
                        background:
                          d.status === "exceeded"
                            ? "var(--critical)"
                            : d.status === "stressed"
                              ? "var(--high)"
                              : "var(--low)",
                      }}
                    />
                  </span>
                  {d.load}%
                </span>
              </td>
              <td className={cn(td, "text-xs capitalize")}>
                <span
                  className={
                    d.status === "exceeded"
                      ? "text-critical"
                      : d.status === "stressed"
                        ? "text-high"
                        : "text-low"
                  }
                >
                  {d.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InfrastructureTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className={th}>Asset</th>
            <th className={th}>Zone</th>
            <th className={cn(th, "text-right")}>Capacity</th>
            <th className={cn(th, "text-right")}>Load</th>
            <th className={th}>State</th>
          </tr>
        </thead>
        <tbody>
          {PUMPS.map((p) => (
            <tr key={p.id} className="border-b border-border/50 transition-colors hover:bg-muted/50">
              <td className={cn(td, "text-foreground/90")}>
                <span className="num mr-2 text-primary">{p.id}</span>
                {p.name}
              </td>
              <td className={cn(td, "text-foreground/80")}>{p.zone}</td>
              <td className={cn(td, "num text-right")}>{p.capacity}</td>
              <td className={cn(td, "num text-right")}>{p.load}%</td>
              <td className={cn(td, "text-xs")}>
                <span className={p.operational ? "text-low" : "text-muted-foreground"}>
                  {p.operational ? "Operational" : "Standby / Offline"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DataHealthPanel({ className }: { className?: string }) {
  return (
    <Panel title="Data Health" className={className ?? ""} bodyClassName="p-3">
      <ul className="space-y-2">
        {DATA_HEALTH.map((row) => (
          <li
            key={row.id}
            className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2"
          >
            <span className="flex items-center gap-2 text-sm text-foreground/90">
              {row.state === "healthy" ? (
                <CheckCircle2 className="size-4 text-low" />
              ) : row.state === "degraded" ? (
                <CircleDashed className="size-4 text-moderate" />
              ) : (
                <AlertTriangle className="size-4 text-high" />
              )}
              {row.label}
            </span>
            <span className="num text-xs text-muted-foreground">{row.value}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 space-y-2">
        {DATA_WARNINGS.map((w) => (
          <p
            key={w}
            className="flex items-start gap-2 rounded-md border border-moderate/35 bg-moderate/8 px-3 py-2 text-xs text-moderate"
          >
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
            <span className="text-foreground/85">{w}</span>
          </p>
        ))}
      </div>
    </Panel>
  );
}
