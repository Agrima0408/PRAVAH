import type { RiskLevel } from "./data";

/** Token-backed helpers so components never hardcode colors. */
export const riskVar = (level: RiskLevel) => `var(--${level})`;

export const riskText: Record<RiskLevel, string> = {
  low: "text-low",
  moderate: "text-moderate",
  high: "text-high",
  critical: "text-critical",
};

export const riskBorder: Record<RiskLevel, string> = {
  low: "border-low/40",
  moderate: "border-moderate/40",
  high: "border-high/40",
  critical: "border-critical/50",
};

export const riskBg: Record<RiskLevel, string> = {
  low: "bg-low/12",
  moderate: "bg-moderate/12",
  high: "bg-high/12",
  critical: "bg-critical/14",
};

export const confidenceBand = (v: number): "high" | "moderate" | "low" =>
  v >= 85 ? "high" : v >= 72 ? "moderate" : "low";

export const CONFIDENCE_VAR: Record<"high" | "moderate" | "low", string> = {
  high: "var(--observed)",
  moderate: "var(--predicted)",
  low: "var(--simulated)",
};
