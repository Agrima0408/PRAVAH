import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/hydro/data";
import { RISK_LABEL } from "@/lib/hydro/data";
import { riskBg, riskBorder, riskText } from "@/lib/hydro/ui";

export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("panel flex min-h-0 flex-col", className)}>
      {title ? (
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <h2 className="label-xs text-foreground/80">{title}</h2>
          {action}
        </header>
      ) : null}
      <div className={cn("min-h-0 flex-1 p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export function RiskBadge({
  level,
  className,
  size = "md",
}: {
  level: RiskLevel;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-semibold tracking-wider uppercase",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs",
        riskBg[level],
        riskBorder[level],
        riskText[level],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {RISK_LABEL[level]}
    </span>
  );
}

const TAG_STYLES = {
  LIVE: "border-primary/40 bg-primary/10 text-primary",
  OBSERVED: "border-observed/40 bg-observed/10 text-observed",
  PREDICTED: "border-predicted/40 bg-predicted/10 text-predicted",
  SIMULATED: "border-simulated/40 bg-simulated/10 text-simulated",
  BASELINE: "border-border-strong bg-muted text-muted-foreground",
} as const;

export function DataTag({
  kind,
  className,
}: {
  kind: keyof typeof TAG_STYLES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.14em] uppercase",
        TAG_STYLES[kind],
        className,
      )}
    >
      {kind === "LIVE" ? <span className="live-dot size-1.5 rounded-full bg-current" /> : null}
      {kind}
    </span>
  );
}

export function Metric({
  label,
  value,
  unit,
  sub,
  tone = "default",
  tag,
  className,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  sub?: ReactNode;
  tone?: "default" | RiskLevel | "primary";
  tag?: keyof typeof TAG_STYLES;
  className?: string;
}) {
  const toneClass =
    tone === "default"
      ? "text-foreground"
      : tone === "primary"
        ? "text-primary"
        : riskText[tone];

  return (
    <div
      className={cn(
        "panel relative overflow-hidden px-4 py-3",
        tone !== "default" && tone !== "primary" ? riskBorder[tone] : null,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="label-xs">{label}</p>
        {tag ? <DataTag kind={tag} /> : null}
      </div>
      <p className={cn("num mt-2 text-2xl leading-none font-semibold", toneClass)}>
        {value}
        {unit ? <span className="ml-1 text-sm font-medium text-muted-foreground">{unit}</span> : null}
      </p>
      {sub ? <p className="mt-1.5 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

export function FactorBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-foreground/85">{label}</span>
        <span className="num text-muted-foreground">{value}%</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, color-mix(in oklch, var(--primary) 55%, transparent), var(--primary))`,
          }}
        />
      </div>
    </div>
  );
}

export function KeyValue({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 py-2 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="num text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-lg font-semibold tracking-[0.06em] text-foreground uppercase">
          {title}
        </h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
