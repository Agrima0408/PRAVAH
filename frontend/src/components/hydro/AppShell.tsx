import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  BarChart3,
  ChevronRight,
  Clock,
  Database,
  FlaskConical,
  House,
  LayoutDashboard,
  MapPinned,
  Radio,
  Route as RouteIcon,
  Search,
  Settings,
  ShieldAlert,
  Truck,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CITY, CITY_STATUS } from "@/lib/hydro/data";

const MONITOR_NAV = [
  { to: "/", label: "Command Center", icon: LayoutDashboard },
  { to: "/forecast", label: "Forecast", icon: Clock },
  { to: "/simulator", label: "Scenario Simulator", icon: FlaskConical },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/sensors", label: "Data & Sensors", icon: Database },
] as const;

const COMMUNITY_NAV = [
  { to: "/citizen-reports", label: "Citizen Reports", icon: MapPinned },
] as const;

const RESPONSE_NAV = [
  { to: "/authority-alerts", label: "Authority Alerts", icon: ShieldAlert },
  { to: "/safe-routes", label: "Safe Routes", icon: RouteIcon },
  { to: "/shelters", label: "Shelters", icon: House },
  { to: "/resources", label: "Resources", icon: Truck },
] as const;

function Clockface() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return <span className="num text-xs text-muted-foreground">--:--:-- IST</span>;
  }
  return (
    <span className="num text-xs text-muted-foreground">
      {now.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} ·{" "}
      {now.toLocaleTimeString("en-IN", { hour12: false })} IST
    </span>
  );
}

export function AppShell({ breadcrumb, children }: { breadcrumb: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="hidden w-[272px] shrink-0 flex-col border-r border-border bg-navigation md:flex">
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-primary/40 bg-primary text-primary-foreground shadow-glow">
            <Waves className="size-5" strokeWidth={2.5} />
          </span>
          <span className="min-w-0">
            <span className="block font-navigation text-base font-semibold text-foreground">
              Pravah
            </span>
            <span className="block truncate font-navigation-mono text-[9px] font-medium tracking-[0.12em] text-primary uppercase">
              Flood Intelligence
            </span>
          </span>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 font-navigation">
          <div className="space-y-1">
            <p className="px-3 pb-2 pt-2 font-navigation-mono text-[10px] font-medium tracking-[0.18em] text-navigation-label uppercase">
              Monitor
            </p>
            {MONITOR_NAV.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "group flex min-h-10 items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                    active
                      ? "border-primary/45 bg-primary/10 text-primary"
                      : "border-transparent text-navigation-foreground hover:bg-navigation-hover hover:text-foreground",
                  )}
                >
                  <Icon className="size-[18px] shrink-0" strokeWidth={1.8} />
                  <span className="truncate">{label}</span>
                  {active ? (
                    <span className="ml-auto size-1.5 shrink-0 rounded-full bg-primary" />
                  ) : null}
                </Link>
              );
            })}
          </div>

          <div className="mt-5 space-y-1">
            <p className="px-3 pb-2 font-navigation-mono text-[10px] font-medium tracking-[0.18em] text-navigation-label uppercase">
              Community
            </p>
            {COMMUNITY_NAV.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "group flex min-h-10 items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                    active
                      ? "border-primary/45 bg-primary/10 text-primary"
                      : "border-transparent text-navigation-foreground hover:bg-navigation-hover hover:text-foreground",
                  )}
                >
                  <Icon className="size-[18px] shrink-0" strokeWidth={1.8} />
                  <span className="truncate">{label}</span>
                  {active ? (
                    <span className="ml-auto size-1.5 shrink-0 rounded-full bg-primary" />
                  ) : null}
                </Link>
              );
            })}
          </div>

          <div className="mt-5 space-y-1">
            <p className="px-3 pb-2 font-navigation-mono text-[10px] font-medium tracking-[0.18em] text-navigation-label uppercase">
              Response
            </p>
            {RESPONSE_NAV.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "group flex min-h-10 items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                    active
                      ? "border-primary/45 bg-primary/10 text-primary"
                      : "border-transparent text-navigation-foreground hover:bg-navigation-hover hover:text-foreground",
                  )}
                >
                  <Icon className="size-[18px] shrink-0" strokeWidth={1.8} />
                  <span className="truncate">{label}</span>
                  {active ? (
                    <span className="ml-auto size-1.5 shrink-0 rounded-full bg-primary" />
                  ) : null}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="space-y-3 border-t border-border p-3 font-navigation">
          <Button
            variant="ghost"
            className="h-9 w-full justify-start gap-2.5 px-3 text-navigation-foreground hover:bg-navigation-hover hover:text-foreground"
          >
            <Settings className="size-4" /> Settings
          </Button>
          <div className="rounded-lg border border-border bg-panel/70 px-3 py-2.5">
            <p className="label-xs">System Status</p>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <Activity className="size-3.5 text-low" />
              <span className="text-foreground/85">All services nominal</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-xs">
              <Radio className="size-3.5 text-primary" />
              <span className="num text-muted-foreground">
                {CITY_STATUS.sensorsOnline}/{CITY_STATUS.sensorsTotal} sensors online
              </span>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="grid h-14 shrink-0 grid-cols-[1fr_minmax(240px,420px)_1fr] items-center gap-4 border-b border-border bg-navigation px-4">
          <div className="flex items-center gap-2 md:hidden">
            <Waves className="size-5 text-primary" />
            <span className="text-sm font-bold tracking-[0.16em]">PRAVAH</span>
          </div>
          <div className="hidden min-w-0 items-center gap-1.5 text-xs md:flex">
            <span className="text-muted-foreground">Pravah</span>
            <ChevronRight className="size-3.5 text-muted-foreground/60" />
            <span className="truncate font-medium text-foreground">{breadcrumb}</span>
          </div>

          <label className="relative block w-full">
            <span className="sr-only">Search area</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-navigation-label" />
            <input
              type="search"
              placeholder="Search area — Betiahata, Golghar, Sector 17..."
              className="h-10 w-full rounded-lg border border-border-strong bg-background/45 pl-10 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-navigation-label focus:border-primary/70 focus:ring-2 focus:ring-primary/15"
            />
          </label>

          <div className="ml-auto flex min-w-0 items-center gap-3">
            <span className="hidden xl:inline-flex">
              <Clockface />
            </span>
            <span className="flex items-center gap-1.5 rounded-md border border-low/40 bg-low/10 px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-low uppercase">
              <span className="live-dot size-1.5 rounded-full bg-current" />
              Live
            </span>
            <span className="hidden text-xs text-muted-foreground lg:inline">
              Last updated 2 min ago
            </span>
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-border bg-surface px-2 py-2 md:hidden">
          {MONITOR_NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium",
                pathname === to
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </Link>
          ))}
        </nav>

        <main className="min-h-0 flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
