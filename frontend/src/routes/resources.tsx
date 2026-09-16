import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/hydro/AppShell";
import { Metric, SectionHeading } from "@/components/hydro/primitives";
import { Button } from "@/components/ui/button";
import { CITY, RESOURCES, SHELTERS, ZONES, type ResourceStatus } from "@/lib/hydro/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Emergency Resource Allocation | Pravah" },
      { name: "description", content: "Deploy and track response assets across the city." },
    ],
  }),
  component: ResourcesPage,
});

const STATUS_STYLE: Record<ResourceStatus, string> = {
  Available: "border-low/40 bg-low/10 text-low",
  Deployed: "border-moderate/40 bg-moderate/10 text-moderate",
  Maintenance: "border-critical/40 bg-critical/10 text-critical",
};

function ResourcesPage() {
  const [statusOverrides, setStatusOverrides] = useState<Record<string, ResourceStatus>>({});

  const resources = RESOURCES.map((r) => ({ ...r, status: statusOverrides[r.id] ?? r.status }));
  const available = resources.filter((r) => r.status === "Available").length;
  const deployed = resources.filter((r) => r.status === "Deployed").length;

  const zoneName = (zoneId: string) =>
    ZONES.find((z) => z.id === zoneId)
      ?.name.split("—")[0]
      ?.trim() ?? zoneId;

  return (
    <AppShell breadcrumb="Resources">
      <div className="flex flex-col gap-3">
        <SectionHeading
          title="Emergency Resource Allocation"
          subtitle={`Deploy and track response assets across ${CITY.name}`}
          action={
            <Button
              size="sm"
              className="bg-primary/15 text-primary hover:bg-primary/25"
              onClick={() => {
                const idle = resources.find((r) => r.status === "Available");
                if (idle) setStatusOverrides((s) => ({ ...s, [idle.id]: "Deployed" }));
              }}
            >
              <Plus className="size-3.5" />
              Deploy Resource
            </Button>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Total Assets" value={resources.length} />
          <Metric label="Available" value={available} tone="low" />
          <Metric label="Deployed" value={deployed} tone="moderate" />
          <Metric label="Active Shelters" value={SHELTERS.length} />
        </div>

        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <Th>Asset</Th>
                <Th>Type</Th>
                <Th>Base / Current Area</Th>
                <Th>Status</Th>
                <Th className="text-right">Action</Th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{zoneName(r.zoneId)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                        STATUS_STYLE[r.status],
                      )}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="text-xs font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
                      disabled={r.status === "Maintenance"}
                      onClick={() =>
                        setStatusOverrides((s) => ({
                          ...s,
                          [r.id]: r.status === "Available" ? "Deployed" : "Available",
                        }))
                      }
                    >
                      {r.status === "Available" ? "Deploy" : "Recall"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

function Th({ children, className }: { children: ReactNode; className?: string }) {
  return <th className={cn("label-xs px-4 py-2.5 font-medium", className)}>{children}</th>;
}
