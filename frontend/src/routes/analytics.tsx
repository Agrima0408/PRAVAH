import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/hydro/AppShell";
import {
  DataTag,
  Metric,
  Panel,
  SectionHeading,
} from "@/components/hydro/primitives";

import {
  RISK_DISTRIBUTION,
  TIME_SERIES,
  VULNERABLE_AREAS,
} from "@/lib/hydro/data";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Urban Flood Analytics | Pravah" },
      {
        name: "description",
        content:
          "Flood analytics for city authorities: rainfall and water-level trends, prediction vs observed accuracy, risk distribution and ranked vulnerable areas.",
      },
      { property: "og:title", content: "Urban Flood Analytics | Pravah" },
      {
        property: "og:description",
        content:
          "Review model accuracy, rainfall trends and the most vulnerable wards over the last six hours.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border-strong)",
    borderRadius: 8,
    fontSize: 12,
  },
  labelStyle: {
    color: "var(--muted-foreground)",
  },
};

interface DashboardMetricsApiResponse {
  averageRainfallMmPerHour: number;
  rainfallPeriod: string;
  maximumWaterLevelCm: number;
  maximumWaterLocation: string;
  maximumWaterSensor: string;
  criticalEvents: number;
  predictionAccuracy: number | null;
}

const DASHBOARD_METRICS_API_URL =
  "https://pravah-ergp.onrender.com/api/dashboard-metrics";

function ChartFrame({
  title,
  tag,
  children,
}: {
  title: string;
  tag?: "OBSERVED" | "PREDICTED";
  children: React.ReactNode;
}) {
  return (
    <Panel
      title={title}
      action={tag ? <DataTag kind={tag} /> : undefined}
      bodyClassName="p-3"
    >
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children as never}
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function AnalyticsPage() {
  const [metrics, setMetrics] =
    useState<DashboardMetricsApiResponse | null>(null);

  const [metricsLoading, setMetricsLoading] =
    useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setMetricsLoading(true);

        const response =
          await fetch(DASHBOARD_METRICS_API_URL);

        if (!response.ok) {
          throw new Error(
            `Dashboard metrics request failed with status ${response.status}`,
          );
        }

        const data =
          (await response.json()) as DashboardMetricsApiResponse;

        console.log(
          "Dashboard Metrics API response:",
          data,
        );

        setMetrics(data);
      } catch (error) {
        console.error(
          "Failed to load dashboard metrics:",
          error,
        );

        setMetrics(null);
      } finally {
        setMetricsLoading(false);
      }
    }

    loadMetrics();
  }, []);

  return (
    <AppShell breadcrumb="Analytics">
      <div className="flex flex-col gap-3">

        <SectionHeading
          title="Urban Flood Analytics"
          subtitle="Six-hour retrospective across rainfall, water level, model accuracy and ward vulnerability."
          action={<DataTag kind="OBSERVED" />}
        />

        {/* Analytics KPI Cards */}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

          <Metric
            label="Average Rainfall"
            value={
              metricsLoading
                ? "--"
                : metrics
                  ? metrics.averageRainfallMmPerHour.toFixed(1)
                  : "N/A"
            }
            unit="mm/hr"
            tone="primary"
            sub={
              metricsLoading
                ? "Loading backend data..."
                : metrics
                  ? metrics.rainfallPeriod
                  : "Backend data unavailable"
            }
          />

          <Metric
            label="Maximum Water Level"
            value={
              metricsLoading
                ? "--"
                : metrics
                  ? metrics.maximumWaterLevelCm.toFixed(1)
                  : "N/A"
            }
            unit="cm"
            tone="high"
            sub={
              metricsLoading
                ? "Loading backend data..."
                : metrics
                  ? `${metrics.maximumWaterSensor} · ${metrics.maximumWaterLocation}`
                  : "Backend data unavailable"
            }
          />

          <Metric
            label="Critical Events"
            value={
              metricsLoading
                ? "--"
                : metrics
                  ? metrics.criticalEvents
                  : "N/A"
            }
            tone="critical"
            sub={
              metricsLoading
                ? "Loading backend data..."
                : metrics
                  ? "Current threshold breaches"
                  : "Backend data unavailable"
            }
          />

          <Metric
            label="Prediction Accuracy"
            value={
              metricsLoading
                ? "--"
                : metrics?.predictionAccuracy !== null &&
                    metrics?.predictionAccuracy !== undefined
                  ? metrics.predictionAccuracy
                  : "N/A"
            }
            unit={
              metrics?.predictionAccuracy !== null &&
              metrics?.predictionAccuracy !== undefined
                ? "%"
                : undefined
            }
            sub={
              metricsLoading
                ? "Loading backend data..."
                : metrics?.predictionAccuracy !== null &&
                    metrics?.predictionAccuracy !== undefined
                  ? "±5 cm tolerance"
                  : "Historical validation data required"
            }
          />

        </div>

        {/* Charts */}

        <div className="grid gap-3 lg:grid-cols-2">

          <ChartFrame
            title="Rainfall Intensity Over Time"
            tag="OBSERVED"
          >
            <AreaChart
              data={TIME_SERIES}
              margin={{
                top: 8,
                right: 8,
                left: -12,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="grad-rain"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="var(--border)"
                vertical={false}
              />

              <XAxis
                dataKey="t"
                {...axis}
              />

              <YAxis
                {...axis}
                unit=""
              />

              <Tooltip {...tooltipStyle} />

              <Area
                type="monotone"
                dataKey="rainfall"
                name="Rainfall (mm/hr)"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#grad-rain)"
              />
            </AreaChart>
          </ChartFrame>

          <ChartFrame
            title="Water Level Over Time"
            tag="OBSERVED"
          >
            <LineChart
              data={TIME_SERIES}
              margin={{
                top: 8,
                right: 8,
                left: -12,
                bottom: 0,
              }}
            >
              <CartesianGrid
                stroke="var(--border)"
                vertical={false}
              />

              <XAxis
                dataKey="t"
                {...axis}
              />

              <YAxis {...axis} />

              <Tooltip {...tooltipStyle} />

              <Line
                type="monotone"
                dataKey="waterLevel"
                name="Water level (cm)"
                stroke="var(--chart-4)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartFrame>

          <ChartFrame title="Prediction vs Actual">
            <LineChart
              data={TIME_SERIES}
              margin={{
                top: 8,
                right: 8,
                left: -12,
                bottom: 0,
              }}
            >
              <CartesianGrid
                stroke="var(--border)"
                vertical={false}
              />

              <XAxis
                dataKey="t"
                {...axis}
              />

              <YAxis {...axis} />

              <Tooltip {...tooltipStyle} />

              <Legend
                wrapperStyle={{
                  fontSize: 11,
                }}
              />

              <Line
                type="monotone"
                dataKey="predicted"
                name="Predicted depth (cm)"
                stroke="var(--predicted)"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="observed"
                name="Observed level (cm)"
                stroke="var(--observed)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartFrame>

          <ChartFrame title="Risk Distribution">
            <BarChart
              data={RISK_DISTRIBUTION}
              margin={{
                top: 8,
                right: 8,
                left: -12,
                bottom: 0,
              }}
            >
              <CartesianGrid
                stroke="var(--border)"
                vertical={false}
              />

              <XAxis
                dataKey="level"
                {...axis}
              />

              <YAxis {...axis} />

              <Tooltip {...tooltipStyle} />

              <Bar
                dataKey="areas"
                name="Areas"
                radius={[4, 4, 0, 0]}
              >
                {RISK_DISTRIBUTION.map((r) => (
                  <Cell
                    key={r.key}
                    fill={`var(--${r.key})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartFrame>

        </div>

        {/* Vulnerable Areas */}

        <Panel
          title="Most Vulnerable Areas"
          action={<DataTag kind="PREDICTED" />}
          bodyClassName="p-0"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">

              <thead>
                <tr className="border-b border-border">

                  <th className="label-xs px-4 py-2.5 text-left">
                    Rank
                  </th>

                  <th className="label-xs px-4 py-2.5 text-left">
                    Area
                  </th>

                  <th className="label-xs px-4 py-2.5 text-right">
                    Risk Score
                  </th>

                  <th className="label-xs px-4 py-2.5 text-right">
                    Expected Depth
                  </th>

                  <th className="label-xs px-4 py-2.5 text-right">
                    Confidence
                  </th>

                </tr>
              </thead>

              <tbody>

                {VULNERABLE_AREAS.map((r) => (
                  <tr
                    key={r.zoneId}
                    className="border-b border-border/50 transition-colors last:border-0 hover:bg-muted/50"
                  >

                    <td className="num px-4 py-3 text-sm text-muted-foreground">
                      {String(r.rank).padStart(2, "0")}
                    </td>

                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {r.area}
                    </td>

                    <td className="px-4 py-3 text-right">

                      <span className="inline-flex items-center gap-2">

                        <span className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">

                          <span
                            className="block h-full rounded-full"
                            style={{
                              width: `${r.riskScore}%`,
                              background:
                                r.riskScore >= 84
                                  ? "var(--critical)"
                                  : r.riskScore >= 66
                                    ? "var(--high)"
                                    : r.riskScore >= 44
                                      ? "var(--moderate)"
                                      : "var(--low)",
                            }}
                          />

                        </span>

                        <span
                          className={cn(
                            "num text-sm font-semibold",
                            r.riskScore >= 84
                              ? "text-critical"
                              : r.riskScore >= 66
                                ? "text-high"
                                : r.riskScore >= 44
                                  ? "text-moderate"
                                  : "text-low",
                          )}
                        >
                          {r.riskScore}
                        </span>

                      </span>

                    </td>

                    <td className="num px-4 py-3 text-right text-sm">
                      {r.depth} cm
                    </td>

                    <td className="num px-4 py-3 text-right text-sm text-observed">
                      {r.confidence}%
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          </div>
        </Panel>

      </div>
    </AppShell>
  );
}