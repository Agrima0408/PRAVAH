import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, Droplets, MapPin, Plus, Waves } from "lucide-react";
import { AppShell } from "@/components/hydro/AppShell";
import { SectionHeading } from "@/components/hydro/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BLOCKAGE_CONDITION_OPTIONS,
  FLOOD_SEVERITY_OPTIONS,
  ROAD_CONDITION_OPTIONS,
  WATER_ACCUMULATION_OPTIONS,
  ZONES,
  ZONE_COORDS,
  type CitizenReport,
  type DrainageCitizenReport,
  type FloodCitizenReport,
} from "@/lib/hydro/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/citizen-reports")({
  head: () => ({
    meta: [
      { title: "Citizen Reports | Pravah" },
      {
        name: "description",
        content: "Community-submitted flood & drainage incidents, AI-clustered for verification.",
      },
    ],
  }),
  component: CitizenReportsPage,
});

type Filter = "all" | "flood" | "drainage" | "unverified";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "flood", label: "Flood" },
  { id: "drainage", label: "Drainage" },
  { id: "unverified", label: "Unverified" },
];

function zoneName(zoneId: string) {
  return (
    ZONES.find((z) => z.id === zoneId)
      ?.name.split("—")[0]
      ?.trim() ?? zoneId
  );
}

let nextId = 1;

function CitizenReportsPage() {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [floodOpen, setFloodOpen] = useState(false);
  const [drainOpen, setDrainOpen] = useState(false);

  const filtered = useMemo(() => {
    switch (filter) {
      case "flood":
        return reports.filter((r) => r.kind === "flood");
      case "drainage":
        return reports.filter((r) => r.kind === "drainage");
      case "unverified":
        return reports.filter((r) => !r.verified);
      default:
        return reports;
    }
  }, [reports, filter]);

  return (
    <AppShell breadcrumb="Citizen Reports">
      <div className="flex flex-col gap-3">
        <SectionHeading
          title="Citizen Reports"
          subtitle="Community-submitted flood & drainage incidents, AI-clustered for verification"
          action={
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-low/15 text-low hover:bg-low/25"
                onClick={() => setFloodOpen(true)}
              >
                <Plus className="size-3.5" />
                Report Flood
              </Button>
              <Button size="sm" variant="outline" onClick={() => setDrainOpen(true)}>
                <Plus className="size-3.5" />
                Report Drainage Issue
              </Button>
            </div>
          }
        />

        <div className="inline-flex w-fit gap-1 rounded-lg border border-border bg-popover p-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
                filter === f.id
                  ? "bg-low/15 text-low"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="panel flex min-h-[140px] items-center justify-center p-6 text-center text-sm text-muted-foreground">
            {reports.length === 0
              ? 'No reports yet. Tap "Report Flood" to add the first one.'
              : "No reports match this filter."}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((r) => (
              <ReportCard
                key={r.id}
                report={r}
                onVerify={() =>
                  setReports((rs) => rs.map((x) => (x.id === r.id ? { ...x, verified: true } : x)))
                }
              />
            ))}
          </div>
        )}
      </div>

      <ReportFloodDialog
        open={floodOpen}
        onOpenChange={setFloodOpen}
        onSubmit={(report) => setReports((rs) => [report, ...rs])}
      />
      <ReportDrainageDialog
        open={drainOpen}
        onOpenChange={setDrainOpen}
        onSubmit={(report) => setReports((rs) => [report, ...rs])}
      />
    </AppShell>
  );
}

function ReportCard({ report, onVerify }: { report: CitizenReport; onVerify: () => void }) {
  const isFlood = report.kind === "flood";
  return (
    <div className="panel flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          {isFlood ? (
            <Waves className="size-4 shrink-0 text-observed" />
          ) : (
            <Droplets className="size-4 shrink-0 text-predicted" />
          )}
          {isFlood ? "Flood Report" : "Drainage Issue"} — {zoneName(report.zoneId)}
        </h3>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
            report.verified
              ? "border-low/40 bg-low/10 text-low"
              : "border-moderate/40 bg-moderate/10 text-moderate",
          )}
        >
          {report.verified ? "Verified" : "Unverified"}
        </span>
      </div>

      <dl className="space-y-1.5 text-sm">
        {isFlood ? (
          <>
            <Row label="Severity" value={(report as FloodCitizenReport).severity} />
            <Row label="Water Depth" value={`${(report as FloodCitizenReport).depthCm} cm`} />
            <Row label="Road Condition" value={(report as FloodCitizenReport).roadCondition} />
          </>
        ) : (
          <>
            <Row label="Blockage" value={(report as DrainageCitizenReport).blockage} />
            <Row
              label="Water Accumulation"
              value={(report as DrainageCitizenReport).waterAccumulation}
            />
          </>
        )}
      </dl>

      {report.description ? (
        <p className="text-xs text-foreground/80">{report.description}</p>
      ) : null}

      <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-2.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="size-3" />
          {report.coords[0].toFixed(4)}, {report.coords[1].toFixed(4)}
        </span>
        <span>{report.reportedAgo}</span>
      </div>

      {!report.verified ? (
        <Button size="sm" variant="outline" onClick={onVerify}>
          <CheckCircle2 className="size-3.5" />
          Mark Verified
        </Button>
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
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

function ReportFloodDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (report: FloodCitizenReport) => void;
}) {
  const [zoneId, setZoneId] = useState(ZONES[0]!.id);
  const [severity, setSeverity] = useState<(typeof FLOOD_SEVERITY_OPTIONS)[number]>(
    FLOOD_SEVERITY_OPTIONS[0],
  );
  const [depthCm, setDepthCm] = useState("20");
  const [roadCondition, setRoadCondition] = useState<(typeof ROAD_CONDITION_OPTIONS)[number]>(
    ROAD_CONDITION_OPTIONS[0],
  );
  const [description, setDescription] = useState("");

  function submit() {
    onSubmit({
      id: `CR-${nextId++}`,
      kind: "flood",
      zoneId,
      severity,
      depthCm: Number(depthCm) || 0,
      roadCondition,
      description,
      coords: ZONE_COORDS[zoneId] ?? [26.76, 83.37],
      verified: false,
      reportedAgo: "Just now",
    });
    setDescription("");
    setDepthCm("20");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Flood</DialogTitle>
          <DialogDescription>
            Your report is analyzed by AI and cross-checked with nearby submissions before
            verification.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Field label="Report Type">
            <Select value="flood" disabled>
              <SelectTrigger>
                <SelectValue placeholder="Flood Report" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flood">Flood Report</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Area">
            <Select value={zoneId} onValueChange={setZoneId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ZONES.map((z) => (
                  <SelectItem key={z.id} value={z.id}>
                    {zoneName(z.id)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Flood Severity">
            <Select value={severity} onValueChange={(v) => setSeverity(v as typeof severity)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FLOOD_SEVERITY_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Estimated Water Depth (cm)">
            <Input
              type="number"
              min={0}
              value={depthCm}
              onChange={(e) => setDepthCm(e.target.value)}
            />
          </Field>

          <Field label="Road Condition">
            <Select
              value={roadCondition}
              onValueChange={(v) => setRoadCondition(v as typeof roadCondition)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROAD_CONDITION_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Photograph">
            <Input type="file" accept="image/*" />
          </Field>

          <Field label="GPS Location">
            <p className="flex items-center gap-1.5 text-sm text-foreground/85">
              <MapPin className="size-3.5 text-critical" />
              {(ZONE_COORDS[zoneId] ?? [26.76, 83.37]).join(", ")}{" "}
              <span className="text-xs text-muted-foreground">(auto-detected)</span>
            </p>
          </Field>

          <Field label="Description">
            <Textarea
              placeholder="Describe what you're seeing..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>

          <Button className="h-11 bg-low/15 text-low hover:bg-low/25" onClick={submit}>
            Submit Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ReportDrainageDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (report: DrainageCitizenReport) => void;
}) {
  const [zoneId, setZoneId] = useState(ZONES[0]!.id);
  const [blockage, setBlockage] = useState<(typeof BLOCKAGE_CONDITION_OPTIONS)[number]>(
    BLOCKAGE_CONDITION_OPTIONS[0],
  );
  const [waterAccumulation, setWaterAccumulation] = useState<
    (typeof WATER_ACCUMULATION_OPTIONS)[number]
  >(WATER_ACCUMULATION_OPTIONS[0]);
  const [description, setDescription] = useState("");

  function submit() {
    onSubmit({
      id: `CR-${nextId++}`,
      kind: "drainage",
      zoneId,
      blockage,
      waterAccumulation,
      description,
      coords: ZONE_COORDS[zoneId] ?? [26.76, 83.37],
      verified: false,
      reportedAgo: "Just now",
    });
    setDescription("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Drainage Issue</DialogTitle>
          <DialogDescription>
            Your report is analyzed by AI and cross-checked with nearby submissions before
            verification.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Field label="Report Type">
            <Select value="drainage" disabled>
              <SelectTrigger>
                <SelectValue placeholder="Drainage Issue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drainage">Drainage Issue</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Area">
            <Select value={zoneId} onValueChange={setZoneId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ZONES.map((z) => (
                  <SelectItem key={z.id} value={z.id}>
                    {zoneName(z.id)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Blockage Condition">
            <Select value={blockage} onValueChange={(v) => setBlockage(v as typeof blockage)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BLOCKAGE_CONDITION_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Water Accumulation">
            <Select
              value={waterAccumulation}
              onValueChange={(v) => setWaterAccumulation(v as typeof waterAccumulation)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WATER_ACCUMULATION_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Photograph">
            <Input type="file" accept="image/*" />
          </Field>

          <Field label="GPS Location">
            <p className="flex items-center gap-1.5 text-sm text-foreground/85">
              <MapPin className="size-3.5 text-critical" />
              {(ZONE_COORDS[zoneId] ?? [26.76, 83.37]).join(", ")}{" "}
              <span className="text-xs text-muted-foreground">(auto-detected)</span>
            </p>
          </Field>

          <Field label="Description">
            <Textarea
              placeholder="Describe what you're seeing..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>

          <Button className="h-11 bg-low/15 text-low hover:bg-low/25" onClick={submit}>
            Submit Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
