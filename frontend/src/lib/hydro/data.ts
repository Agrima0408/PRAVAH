/**
 * HYDROPULSE mock data layer.
 *
 * Every export here is intentionally shaped like an API response so that each
 * getter can later be swapped for a fetch/server-function call without touching
 * component code. Geometry is expressed in the map's own 1000x640 coordinate
 * space (see components/hydro/CityMap.tsx).
 */

export type RiskLevel = "low" | "moderate" | "high" | "critical";
export type ForecastStep = 0 | 15 | 30 | 45 | 60;
export const FORECAST_STEPS: ForecastStep[] = [0, 15, 30, 45, 60];

export const RISK_LABEL: Record<RiskLevel, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
  critical: "Critical",
};

export const RISK_ORDER: RiskLevel[] = ["low", "moderate", "high", "critical"];

export const CITY = {
  name: "Gorakhpur",
  state: "Uttar Pradesh",
  wards: 80,
  population: "1.32 M",
};

export interface ZoneFactor {
  label: string;
  value: number;
}

export interface ZoneForecast {
  level: RiskLevel;
  probability: number;
  depthMin: number;
  depthMax: number;
  confidence: number;
}

export interface Zone {
  id: string;
  name: string;
  kind: "residential" | "commercial" | "industrial" | "institutional" | "transport";
  polygon: string;
  labelAt: [number, number];
  elevation: "Low" | "Moderate" | "High";
  surface: string;
  drainId: string;
  drainUtilisation: number;
  nearestSensor: string;
  observedLevelCm: number;
  onsetMinutes: number;
  riskScore: number;
  factors: ZoneFactor[];
  primaryContributor: string;
  forecast: Record<ForecastStep, ZoneForecast>;
}

const fc = (
  entries: Array<[RiskLevel, number, number, number, number]>,
): Record<ForecastStep, ZoneForecast> => {
  const out = {} as Record<ForecastStep, ZoneForecast>;
  FORECAST_STEPS.forEach((step, i) => {
    const [level, probability, depthMin, depthMax, confidence] = entries[i]!;
    out[step] = { level, probability, depthMin, depthMax, confidence };
  });
  return out;
};

export const ZONES: Zone[] = [
  {
    id: "sector-17",
    name: "Sector 17",
    kind: "residential",
    polygon: "352,196 512,178 556,286 470,352 366,332 330,254",
    labelAt: [432, 262],
    elevation: "Low",
    surface: "Highly Impervious",
    drainId: "D-17",
    drainUtilisation: 91,
    nearestSensor: "W-012",
    observedLevelCm: 28,
    onsetMinutes: 18,
    riskScore: 91,
    factors: [
      { label: "Rainfall Intensity", value: 92 },
      { label: "Drainage Overload", value: 87 },
      { label: "Low Elevation", value: 74 },
      { label: "Impervious Surface", value: 68 },
      { label: "Historical Flood Vulnerability", value: 52 },
    ],
    primaryContributor:
      "Drainage capacity is predicted to be exceeded due to intense rainfall over the Rapti sub-catchment.",
    forecast: fc([
      ["high", 71, 18, 26, 88],
      ["high", 79, 24, 33, 86],
      ["critical", 87, 32, 45, 84],
      ["critical", 92, 38, 52, 79],
      ["critical", 94, 44, 61, 73],
    ]),
  },
  {
    id: "river-road",
    name: "River Road",
    kind: "transport",
    polygon: "556,286 700,246 762,330 690,414 578,388 470,352",
    labelAt: [630, 330],
    elevation: "Low",
    surface: "Impervious",
    drainId: "D-21",
    drainUtilisation: 86,
    nearestSensor: "W-018",
    observedLevelCm: 24,
    onsetMinutes: 26,
    riskScore: 86,
    factors: [
      { label: "River Backflow Pressure", value: 89 },
      { label: "Drainage Overload", value: 78 },
      { label: "Low Elevation", value: 81 },
      { label: "Impervious Surface", value: 61 },
      { label: "Historical Flood Vulnerability", value: 66 },
    ],
    primaryContributor:
      "Rapti river stage is rising faster than the outfall can discharge, causing backflow into the D-21 trunk drain.",
    forecast: fc([
      ["moderate", 54, 12, 18, 87],
      ["high", 68, 19, 27, 85],
      ["high", 78, 26, 35, 84],
      ["critical", 85, 33, 44, 80],
      ["critical", 89, 38, 50, 75],
    ]),
  },
  {
    id: "zone-b",
    name: "Zone B — Betiahata",
    kind: "commercial",
    polygon: "230,330 366,332 470,352 434,470 300,486 214,420",
    labelAt: [336, 412],
    elevation: "Moderate",
    surface: "Moderately Impervious",
    drainId: "D-09",
    drainUtilisation: 74,
    nearestSensor: "W-021",
    observedLevelCm: 17,
    onsetMinutes: 34,
    riskScore: 78,
    factors: [
      { label: "Rainfall Intensity", value: 84 },
      { label: "Drainage Overload", value: 69 },
      { label: "Low Elevation", value: 48 },
      { label: "Impervious Surface", value: 72 },
      { label: "Historical Flood Vulnerability", value: 44 },
    ],
    primaryContributor:
      "Market-area runoff coefficient is high; secondary drains reach capacity ~30 minutes after peak rainfall.",
    forecast: fc([
      ["moderate", 42, 8, 14, 89],
      ["moderate", 55, 14, 20, 87],
      ["high", 68, 21, 28, 79],
      ["high", 74, 26, 35, 76],
      ["critical", 82, 31, 41, 71],
    ]),
  },
  {
    id: "medical-college",
    name: "Medical College Road",
    kind: "institutional",
    polygon: "700,246 852,214 900,318 762,330",
    labelAt: [802, 274],
    elevation: "Moderate",
    surface: "Impervious",
    drainId: "D-04",
    drainUtilisation: 62,
    nearestSensor: "W-006",
    observedLevelCm: 12,
    onsetMinutes: 41,
    riskScore: 64,
    factors: [
      { label: "Rainfall Intensity", value: 76 },
      { label: "Drainage Overload", value: 54 },
      { label: "Low Elevation", value: 38 },
      { label: "Impervious Surface", value: 64 },
      { label: "Historical Flood Vulnerability", value: 31 },
    ],
    primaryContributor:
      "Localised ponding near hospital access ramps; pump station 02 currently absorbing peak inflow.",
    forecast: fc([
      ["low", 24, 4, 8, 91],
      ["moderate", 38, 8, 13, 88],
      ["moderate", 49, 13, 19, 85],
      ["high", 63, 18, 26, 78],
      ["high", 70, 22, 31, 72],
    ]),
  },
  {
    id: "eastern-corridor",
    name: "Eastern Corridor",
    kind: "industrial",
    polygon: "762,330 900,318 926,446 800,494 690,414",
    labelAt: [816, 400],
    elevation: "Low",
    surface: "Highly Impervious",
    drainId: "D-21",
    drainUtilisation: 69,
    nearestSensor: "W-030",
    observedLevelCm: 14,
    onsetMinutes: 47,
    riskScore: 69,
    factors: [
      { label: "Rainfall Intensity", value: 71 },
      { label: "Drainage Overload", value: 74 },
      { label: "Low Elevation", value: 66 },
      { label: "Impervious Surface", value: 79 },
      { label: "Historical Flood Vulnerability", value: 38 },
    ],
    primaryContributor:
      "Industrial hardstanding generates rapid runoff that concentrates at the D-21 eastern junction.",
    forecast: fc([
      ["low", 21, 3, 7, 90],
      ["moderate", 34, 7, 12, 87],
      ["moderate", 47, 12, 19, 83],
      ["high", 61, 19, 27, 74],
      ["high", 72, 25, 34, 68],
    ]),
  },
  {
    id: "north-ward",
    name: "North Ward 12",
    kind: "residential",
    polygon: "252,120 400,96 512,178 352,196 330,254 240,232",
    labelAt: [340, 160],
    elevation: "High",
    surface: "Semi-Pervious",
    drainId: "D-02",
    drainUtilisation: 41,
    nearestSensor: "W-003",
    observedLevelCm: 6,
    onsetMinutes: 68,
    riskScore: 38,
    factors: [
      { label: "Rainfall Intensity", value: 62 },
      { label: "Drainage Overload", value: 31 },
      { label: "Low Elevation", value: 18 },
      { label: "Impervious Surface", value: 34 },
      { label: "Historical Flood Vulnerability", value: 22 },
    ],
    primaryContributor:
      "Elevated ward with spare drain capacity; risk stays low unless rainfall exceeds 95 mm/hr.",
    forecast: fc([
      ["low", 11, 1, 4, 93],
      ["low", 16, 2, 6, 92],
      ["low", 22, 4, 9, 90],
      ["moderate", 33, 7, 13, 85],
      ["moderate", 41, 10, 17, 80],
    ]),
  },
  {
    id: "south-basin",
    name: "South Basin",
    kind: "residential",
    polygon: "300,486 434,470 578,388 690,414 800,494 640,566 420,580",
    labelAt: [540, 500],
    elevation: "Low",
    surface: "Moderately Impervious",
    drainId: "D-09",
    drainUtilisation: 83,
    nearestSensor: "W-025",
    observedLevelCm: 21,
    onsetMinutes: 29,
    riskScore: 74,
    factors: [
      { label: "Rainfall Intensity", value: 80 },
      { label: "Drainage Overload", value: 82 },
      { label: "Low Elevation", value: 88 },
      { label: "Impervious Surface", value: 55 },
      { label: "Historical Flood Vulnerability", value: 71 },
    ],
    primaryContributor:
      "Topographic sink: runoff from three upstream wards converges before reaching pump station 03.",
    forecast: fc([
      ["moderate", 48, 11, 17, 88],
      ["high", 62, 17, 25, 85],
      ["high", 73, 24, 33, 81],
      ["critical", 84, 31, 42, 76],
      ["critical", 88, 36, 48, 70],
    ]),
  },
  {
    id: "west-cantt",
    name: "West Cantonment",
    kind: "institutional",
    polygon: "140,214 240,232 330,254 230,330 214,420 122,360",
    labelAt: [212, 306],
    elevation: "Moderate",
    surface: "Semi-Pervious",
    drainId: "D-02",
    drainUtilisation: 52,
    nearestSensor: "W-009",
    observedLevelCm: 9,
    onsetMinutes: 58,
    riskScore: 46,
    factors: [
      { label: "Rainfall Intensity", value: 64 },
      { label: "Drainage Overload", value: 44 },
      { label: "Low Elevation", value: 33 },
      { label: "Impervious Surface", value: 41 },
      { label: "Historical Flood Vulnerability", value: 28 },
    ],
    primaryContributor:
      "Green cover keeps infiltration high; only underpasses are expected to accumulate water.",
    forecast: fc([
      ["low", 14, 2, 5, 92],
      ["low", 20, 4, 8, 91],
      ["moderate", 31, 7, 12, 87],
      ["moderate", 39, 10, 16, 83],
      ["high", 58, 16, 23, 76],
    ]),
  },
];

export const ZONE_BY_ID = Object.fromEntries(ZONES.map((z) => [z.id, z]));

/** River polyline + drainage network + road network in map space. */
export const RIVER_PATH =
  "M 60 470 C 200 430 300 520 430 500 C 560 480 640 380 760 400 C 860 416 920 372 980 392";

export interface Drain {
  id: string;
  name: string;
  path: string;
  load: number;
  status: "normal" | "stressed" | "exceeded";
}

export const DRAINS: Drain[] = [
  { id: "D-02", name: "Cantt Branch Drain", path: "M 190 180 L 250 260 L 240 360", load: 52, status: "normal" },
  { id: "D-04", name: "Medical Link Drain", path: "M 860 240 L 790 300 L 770 340", load: 62, status: "normal" },
  {
    id: "D-09",
    name: "Betiahata Secondary",
    path: "M 300 340 L 360 430 L 470 494 L 600 520",
    load: 83,
    status: "stressed",
  },
  {
    id: "D-17",
    name: "Sector 17 Trunk Drain",
    path: "M 372 210 L 430 270 L 480 330 L 540 400 L 610 470",
    load: 94,
    status: "exceeded",
  },
  {
    id: "D-21",
    name: "Eastern Outfall",
    path: "M 900 340 L 800 380 L 700 400 L 620 450 L 540 500",
    load: 88,
    status: "stressed",
  },
];

export interface RoadSegment {
  id: string;
  name: string;
  path: string;
  zoneId: string;
  /** Impact severity at each forecast step. */
  severity: Record<ForecastStep, RiskLevel | null>;
}

const rs = (entries: Array<RiskLevel | null>): Record<ForecastStep, RiskLevel | null> => {
  const out = {} as Record<ForecastStep, RiskLevel | null>;
  FORECAST_STEPS.forEach((s, i) => (out[s] = entries[i] ?? null));
  return out;
};

export const ROADS: RoadSegment[] = [
  {
    id: "RD-101",
    name: "Golghar – Sector 17 Link",
    path: "M 340 216 L 430 250 L 500 300",
    zoneId: "sector-17",
    severity: rs(["high", "high", "critical", "critical", "critical"]),
  },
  {
    id: "RD-104",
    name: "River Road Causeway",
    path: "M 500 300 L 610 300 L 700 330 L 780 350",
    zoneId: "river-road",
    severity: rs(["moderate", "high", "high", "critical", "critical"]),
  },
  {
    id: "RD-112",
    name: "Betiahata Market Street",
    path: "M 260 370 L 340 400 L 430 430",
    zoneId: "zone-b",
    severity: rs([null, "moderate", "high", "high", "critical"]),
  },
  {
    id: "RD-118",
    name: "South Basin Underpass",
    path: "M 400 520 L 500 510 L 600 520 L 690 500",
    zoneId: "south-basin",
    severity: rs(["moderate", "high", "high", "critical", "critical"]),
  },
  {
    id: "RD-121",
    name: "Eastern Corridor Service Road",
    path: "M 780 350 L 850 390 L 890 440",
    zoneId: "eastern-corridor",
    severity: rs([null, null, "moderate", "high", "high"]),
  },
  {
    id: "RD-130",
    name: "Medical College Approach",
    path: "M 740 260 L 800 250 L 870 240",
    zoneId: "medical-college",
    severity: rs([null, null, "moderate", "moderate", "high"]),
  },
  {
    id: "RD-140",
    name: "North Ward Ring Road",
    path: "M 280 140 L 360 130 L 460 160",
    zoneId: "north-ward",
    severity: rs([null, null, null, "moderate", "moderate"]),
  },
];

export interface WaterSensor {
  id: string;
  location: string;
  zoneId: string;
  at: [number, number];
  levelCm: number;
  thresholdCm: number;
  risk: RiskLevel;
  status: "live" | "delayed" | "offline";
  updated: string;
  trend: "rising" | "steady" | "falling";
}

export const WATER_SENSORS: WaterSensor[] = [
  { id: "W-012", location: "Sector 17", zoneId: "sector-17", at: [438, 268], levelCm: 42, thresholdCm: 45, risk: "critical", status: "live", updated: "1 min ago", trend: "rising" },
  { id: "W-018", location: "River Road", zoneId: "river-road", at: [634, 328], levelCm: 31, thresholdCm: 45, risk: "high", status: "live", updated: "1 min ago", trend: "rising" },
  { id: "W-021", location: "Betiahata", zoneId: "zone-b", at: [336, 412], levelCm: 22, thresholdCm: 40, risk: "moderate", status: "live", updated: "2 min ago", trend: "rising" },
  { id: "W-025", location: "South Basin", zoneId: "south-basin", at: [540, 500], levelCm: 27, thresholdCm: 40, risk: "high", status: "live", updated: "1 min ago", trend: "rising" },
  { id: "W-030", location: "Eastern Corridor", zoneId: "eastern-corridor", at: [816, 400], levelCm: 15, thresholdCm: 40, risk: "moderate", status: "live", updated: "3 min ago", trend: "steady" },
  { id: "W-006", location: "Medical College Rd", zoneId: "medical-college", at: [802, 274], levelCm: 12, thresholdCm: 35, risk: "low", status: "live", updated: "2 min ago", trend: "steady" },
  { id: "W-009", location: "West Cantonment", zoneId: "west-cantt", at: [212, 306], levelCm: 9, thresholdCm: 35, risk: "low", status: "live", updated: "2 min ago", trend: "steady" },
  { id: "W-003", location: "North Ward 12", zoneId: "north-ward", at: [340, 160], levelCm: 6, thresholdCm: 35, risk: "low", status: "delayed", updated: "11 min ago", trend: "steady" },
];

export interface RainSensor {
  id: string;
  location: string;
  at: [number, number];
  rainfall: number;
  status: "live" | "delayed" | "offline";
  updated: string;
}

export const RAIN_SENSORS: RainSensor[] = [
  { id: "R-001", location: "Sector 17", at: [400, 232], rainfall: 72, status: "live", updated: "1 min ago" },
  { id: "R-004", location: "Golghar", at: [520, 250], rainfall: 68, status: "live", updated: "1 min ago" },
  { id: "R-009", location: "Betiahata", at: [300, 400], rainfall: 64, status: "live", updated: "2 min ago" },
  { id: "R-014", location: "River Road", at: [680, 300], rainfall: 76, status: "live", updated: "1 min ago" },
  { id: "R-017", location: "South Basin", at: [500, 540], rainfall: 70, status: "live", updated: "2 min ago" },
  { id: "R-021", location: "Medical College Rd", at: [840, 260], rainfall: 58, status: "live", updated: "3 min ago" },
  { id: "R-023", location: "North Ward 12", at: [300, 130], rainfall: 49, status: "delayed", updated: "14 min ago" },
  { id: "R-028", location: "Eastern Corridor", at: [880, 420], rainfall: 61, status: "live", updated: "2 min ago" },
];

export interface Pump {
  id: string;
  name: string;
  zone: string;
  capacity: string;
  operational: boolean;
  load: number;
}

export const PUMPS: Pump[] = [
  { id: "P-01", name: "Pump Station 01", zone: "Sector 17", capacity: "1,200 L/s", operational: true, load: 86 },
  { id: "P-02", name: "Pump Station 02", zone: "Medical College Rd", capacity: "900 L/s", operational: true, load: 64 },
  { id: "P-03", name: "Pump Station 03", zone: "South Basin", capacity: "1,500 L/s", operational: true, load: 78 },
  { id: "P-04", name: "Pump Station 04", zone: "Eastern Corridor", capacity: "1,100 L/s", operational: false, load: 0 },
];

export interface Alert {
  id: string;
  level: RiskLevel;
  title: string;
  location: string;
  detail: string;
  tag: "OBSERVED" | "PREDICTED";
  age: string;
}

export const ALERTS: Alert[] = [
  {
    id: "A-1",
    level: "critical",
    title: "Severe water accumulation detected",
    location: "Sector 17",
    detail: "Sensor W-012 at 42 cm · predicted depth 32–45 cm",
    tag: "OBSERVED",
    age: "2 min ago",
  },
  {
    id: "A-2",
    level: "high",
    title: "Drain capacity exceeded",
    location: "Drain D-17",
    detail: "Current load 94% · overflow expected in 12 min",
    tag: "OBSERVED",
    age: "7 min ago",
  },
  {
    id: "A-3",
    level: "moderate",
    title: "Heavy rainfall forecast",
    location: "Rapti sub-catchment",
    detail: "88 mm/hr cell arriving in ~25 min",
    tag: "PREDICTED",
    age: "9 min ago",
  },
  {
    id: "A-4",
    level: "high",
    title: "Road closure recommended",
    location: "South Basin Underpass",
    detail: "Predicted depth 31–42 cm at +45 min",
    tag: "PREDICTED",
    age: "12 min ago",
  },
];

export interface ForecastSummaryRow {
  step: ForecastStep;
  headline: string;
  affectedAreaKm2: number;
  criticalRoads: number;
  avgDepthCm: number;
  confidence: number;
}

export const FORECAST_SUMMARY: ForecastSummaryRow[] = [
  { step: 0, headline: "Localised accumulation in Sector 17 and South Basin.", affectedAreaKm2: 3.2, criticalRoads: 7, avgDepthCm: 28, confidence: 91 },
  { step: 15, headline: "Moderate flooding expected across the central corridor.", affectedAreaKm2: 3.9, criticalRoads: 11, avgDepthCm: 29, confidence: 88 },
  { step: 30, headline: "3 additional road segments at risk; Betiahata escalates to High.", affectedAreaKm2: 4.8, criticalRoads: 17, avgDepthCm: 31, confidence: 84 },
  { step: 45, headline: "Critical threshold likely exceeded in Sector 17.", affectedAreaKm2: 5.9, criticalRoads: 22, avgDepthCm: 36, confidence: 79 },
  { step: 60, headline: "Flooding may spread toward the eastern corridor.", affectedAreaKm2: 7.1, criticalRoads: 26, avgDepthCm: 41, confidence: 73 },
];

export const FORECAST_BY_STEP = Object.fromEntries(
  FORECAST_SUMMARY.map((r) => [r.step, r]),
) as Record<ForecastStep, ForecastSummaryRow>;

export const CITY_STATUS = {
  riskLevel: "high" as RiskLevel,
  criticalAreas: 12,
  sensorsOnline: 48,
  sensorsTotal: 52,
  rainfallIntensity: 72,
  rainfall1h: 46,
  modelRun: "2 minutes ago",
  dataQuality: "High",
};

/** Analytics time series — last 6 hours at 30-minute resolution. */
export interface SeriesPoint {
  t: string;
  rainfall: number;
  waterLevel: number;
  predicted: number;
  observed: number;
}

export const TIME_SERIES: SeriesPoint[] = [
  { t: "14:00", rainfall: 12, waterLevel: 6, predicted: 7, observed: 6 },
  { t: "14:30", rainfall: 21, waterLevel: 9, predicted: 11, observed: 9 },
  { t: "15:00", rainfall: 34, waterLevel: 14, predicted: 15, observed: 14 },
  { t: "15:30", rainfall: 47, waterLevel: 19, predicted: 21, observed: 19 },
  { t: "16:00", rainfall: 58, waterLevel: 25, predicted: 27, observed: 25 },
  { t: "16:30", rainfall: 64, waterLevel: 31, predicted: 34, observed: 31 },
  { t: "17:00", rainfall: 69, waterLevel: 36, predicted: 39, observed: 36 },
  { t: "17:30", rainfall: 74, waterLevel: 41, predicted: 44, observed: 41 },
  { t: "18:00", rainfall: 78, waterLevel: 46, predicted: 50, observed: 46 },
  { t: "18:30", rainfall: 72, waterLevel: 51, predicted: 54, observed: 51 },
  { t: "19:00", rainfall: 68, waterLevel: 54, predicted: 58, observed: 54 },
  { t: "19:30", rainfall: 72, waterLevel: 53, predicted: 56, observed: 53 },
];

export const RISK_DISTRIBUTION = [
  { level: "Low", areas: 34, key: "low" as RiskLevel },
  { level: "Moderate", areas: 21, key: "moderate" as RiskLevel },
  { level: "High", areas: 13, key: "high" as RiskLevel },
  { level: "Critical", areas: 12, key: "critical" as RiskLevel },
];

export const ANALYTICS_KPIS = {
  avgRainfall: 68,
  maxWaterLevel: 54,
  criticalEvents: 12,
  predictionAccuracy: 89,
};

export const VULNERABLE_AREAS = ZONES.slice()
  .sort((a, b) => b.riskScore - a.riskScore)
  .map((z, i) => ({
    rank: i + 1,
    area: z.name,
    zoneId: z.id,
    riskScore: z.riskScore,
    depth: z.forecast[30].depthMax,
    confidence: z.forecast[30].confidence,
  }));

export interface DataHealthRow {
  id: string;
  label: string;
  state: "healthy" | "degraded" | "warning";
  value: string;
}

export const DATA_HEALTH: DataHealthRow[] = [
  { id: "rain", label: "Rainfall Network", state: "healthy", value: "Healthy · 7/8 reporting" },
  { id: "water", label: "Water Sensors", state: "healthy", value: "48 / 52 Online" },
  { id: "drainage", label: "Drainage Monitoring", state: "healthy", value: "Operational" },
  { id: "satellite", label: "Satellite Data", state: "degraded", value: "Updated 18 min ago" },
  { id: "model", label: "AI Prediction Model", state: "healthy", value: "Running · run #4,182" },
];

export const DATA_WARNINGS = [
  "Rainfall sensor R-023 has not updated for 14 minutes.",
  "Water sensor W-003 reporting on a delayed uplink (11 min).",
  "Satellite composite is 18 minutes old — confidence downgraded in northern wards.",
];

/* ------------------------------- simulation ------------------------------- */

export type DrainState = "normal" | "partial" | "severe";

export interface ScenarioInput {
  rainfallDelta: number; // -20 | 0 | 20 | 50 (%)
  pumpFailures: string[]; // pump ids simulated as failed
  drainStates: Record<string, DrainState>;
  durationMinutes: 15 | 30 | 60 | 120;
}

export interface ScenarioMetrics {
  affectedAreaKm2: number;
  criticalRoads: number;
  avgDepthCm: number;
  peopleExposed: number;
}

export interface ScenarioResult {
  baseline: ScenarioMetrics;
  simulated: ScenarioMetrics;
  zoneLevels: Record<string, RiskLevel>;
  recommendation: { action: string; impact: string; secondary: string };
  confidence: number;
}

const DRAIN_WEIGHT: Record<DrainState, number> = { normal: 0, partial: 0.18, severe: 0.42 };

const levelFromScore = (score: number): RiskLevel =>
  score >= 84 ? "critical" : score >= 66 ? "high" : score >= 44 ? "moderate" : "low";

export function runScenario(input: ScenarioInput): ScenarioResult {
  const durationFactor = { 15: 0.72, 30: 1, 60: 1.28, 120: 1.55 }[input.durationMinutes];
  const rainFactor = 1 + input.rainfallDelta / 100;
  const pumpFactor = 1 + input.pumpFailures.length * 0.16;
  const drainFactor =
    1 +
    Object.values(input.drainStates).reduce((sum, s) => sum + DRAIN_WEIGHT[s], 0);

  const stress = rainFactor * pumpFactor * drainFactor * durationFactor;

  const baseline: ScenarioMetrics = {
    affectedAreaKm2: 3.2,
    criticalRoads: 7,
    avgDepthCm: 28,
    peopleExposed: 41_000,
  };

  const simulated: ScenarioMetrics = {
    affectedAreaKm2: Math.round(baseline.affectedAreaKm2 * Math.pow(stress, 1.35) * 10) / 10,
    criticalRoads: Math.round(baseline.criticalRoads * Math.pow(stress, 1.6)),
    avgDepthCm: Math.round(baseline.avgDepthCm * Math.pow(stress, 0.85)),
    peopleExposed: Math.round((baseline.peopleExposed * Math.pow(stress, 1.2)) / 500) * 500,
  };

  const zoneLevels = Object.fromEntries(
    ZONES.map((z) => [z.id, levelFromScore(z.riskScore * Math.pow(stress, 0.55))]),
  ) as Record<string, RiskLevel>;

  const failed = input.pumpFailures.length;
  const worstDrain = Object.entries(input.drainStates).find(([, s]) => s === "severe")?.[0];

  const recommendation = failed
    ? {
        action: `Activate Pump Station 04 and reroute load from ${input.pumpFailures.join(", ")}.`,
        impact: "Reduce affected area by approximately 21%.",
        secondary: "Pre-position 2 dewatering units at South Basin Underpass.",
      }
    : worstDrain
      ? {
          action: `Deploy desilting crew to drain ${worstDrain} within 20 minutes.`,
          impact: "Restore ~35% of trunk discharge capacity and cut peak depth by 9 cm.",
          secondary: "Close Betiahata Market Street to through traffic during clearance.",
        }
      : {
          action: "Hold current posture; raise Sector 17 to standby response.",
          impact: "No additional assets required at this rainfall level.",
          secondary: "Re-run simulation if rainfall exceeds 85 mm/hr.",
        };

  return {
    baseline,
    simulated,
    zoneLevels,
    recommendation,
    confidence: Math.max(58, Math.round(86 - failed * 4 - (input.durationMinutes > 60 ? 8 : 0))),
  };
}

export const pct = (from: number, to: number) => Math.round(((to - from) / from) * 100);

/* ------------------------------- authority response ------------------------------- */

export interface AuthorityAlert {
  id: string;
  zoneId: string;
  level: RiskLevel;
  title: string;
  location: string;
  floodProbability: number;
  citizenReports: number;
  roadBlockages: number;
  drainageCapacity: "Nominal" | "Strained" | "Exceeded";
  trend: "Increasing" | "Decreasing" | "Stable";
  recommended: string;
}

export const AUTHORITY_ALERTS: AuthorityAlert[] = [
  {
    id: "AA-1",
    zoneId: "sector-17",
    level: "critical",
    title: "Elevated Risk Alert — Sector 17",
    location: "Sector 17",
    floodProbability: 91,
    citizenReports: 6,
    roadBlockages: 2,
    drainageCapacity: "Exceeded",
    trend: "Increasing",
    recommended: "Dispatch response team and issue a public alert immediately.",
  },
  {
    id: "AA-2",
    zoneId: "river-road",
    level: "high",
    title: "Elevated Risk Alert — River Road",
    location: "River Road",
    floodProbability: 82,
    citizenReports: 3,
    roadBlockages: 1,
    drainageCapacity: "Strained",
    trend: "Increasing",
    recommended: "Dispatch response team; monitor the causeway closely.",
  },
  {
    id: "AA-3",
    zoneId: "zone-b",
    level: "high",
    title: "Elevated Risk Alert — Zone B, Betiahata",
    location: "Zone B — Betiahata",
    floodProbability: 74,
    citizenReports: 4,
    roadBlockages: 1,
    drainageCapacity: "Strained",
    trend: "Stable",
    recommended: "Monitor closely and prepare resources.",
  },
  {
    id: "AA-4",
    zoneId: "south-basin",
    level: "moderate",
    title: "Elevated Risk Alert — South Basin",
    location: "South Basin",
    floodProbability: 69,
    citizenReports: 2,
    roadBlockages: 1,
    drainageCapacity: "Nominal",
    trend: "Decreasing",
    recommended: "Monitor closely; underpass remains passable.",
  },
];

/* ------------------------------- safe routes ------------------------------- */

export type DestinationType = "Nearest Shelter" | "Nearest Relief Centre" | "Medical Facility";

export const DESTINATION_TYPES: DestinationType[] = [
  "Nearest Shelter",
  "Nearest Relief Centre",
  "Medical Facility",
];

export interface RouteStep {
  instruction: string;
  roadId?: string;
}

export interface SafeRoute {
  distanceKm: number;
  etaMinutes: number;
  roadsAvoided: string[];
  steps: RouteStep[];
}

/** Deterministic mock routing: avoids any road segment at high/critical severity at step 0. */
export function calculateSafeRoute(fromZoneId: string, destinationName: string): SafeRoute {
  const from = ZONES.find((z) => z.id === fromZoneId) ?? ZONES[0]!;
  const blocked = ROADS.filter((r) => r.severity[0] === "high" || r.severity[0] === "critical");
  const clear = ROADS.filter((r) => r.severity[0] !== "high" && r.severity[0] !== "critical");

  const via = clear.length ? clear[(fromZoneId.length + destinationName.length) % clear.length]! : undefined;

  return {
    distanceKm: Math.round((2.4 + (from.riskScore % 5) * 0.6) * 10) / 10,
    etaMinutes: Math.round(9 + (from.riskScore % 5) * 2.5),
    roadsAvoided: blocked.map((r) => r.name),
    steps: [
      { instruction: `Depart ${from.name.split("—")[0]!.trim()}, head toward the main arterial road.` },
      ...(via ? [{ instruction: `Continue via ${via.name}, currently clear.`, roadId: via.id }] : []),
      { instruction: `Arrive at ${destinationName}.` },
    ],
  };
}

/* ------------------------------- shelters ------------------------------- */

export interface Shelter {
  id: string;
  name: string;
  zoneId: string;
  capacity: number;
  occupied: number;
  foodWater: "Available" | "Limited";
  medicalSupport: "Available" | "Not on-site";
  accessibility: string;
}

export const SHELTERS: Shelter[] = [
  {
    id: "SH-1",
    name: "Sector 17 Relief Centre",
    zoneId: "sector-17",
    capacity: 500,
    occupied: 452,
    foodWater: "Available",
    medicalSupport: "Available",
    accessibility: "Wheelchair accessible",
  },
  {
    id: "SH-2",
    name: "Golghar Community Hall",
    zoneId: "river-road",
    capacity: 260,
    occupied: 140,
    foodWater: "Available",
    medicalSupport: "Not on-site",
    accessibility: "Ground floor",
  },
  {
    id: "SH-3",
    name: "Betiahata Govt. School Shelter",
    zoneId: "zone-b",
    capacity: 400,
    occupied: 388,
    foodWater: "Available",
    medicalSupport: "Available",
    accessibility: "Ramp available",
  },
  {
    id: "SH-4",
    name: "Zoo Bazar Municipal Shelter",
    zoneId: "south-basin",
    capacity: 180,
    occupied: 52,
    foodWater: "Limited",
    medicalSupport: "Not on-site",
    accessibility: "Stairs only",
  },
  {
    id: "SH-5",
    name: "Medical College Relief Camp",
    zoneId: "medical-college",
    capacity: 320,
    occupied: 210,
    foodWater: "Available",
    medicalSupport: "Available",
    accessibility: "Wheelchair accessible",
  },
];

export const shelterPctFull = (s: Shelter) => Math.round((s.occupied / s.capacity) * 100);

/* ------------------------------- resources ------------------------------- */

export type ResourceStatus = "Available" | "Deployed" | "Maintenance";

export interface ResourceAsset {
  id: string;
  name: string;
  type: string;
  zoneId: string;
  status: ResourceStatus;
}

export const RESOURCES: ResourceAsset[] = [
  { id: "RS-1", name: "Rescue Boat 01", type: "Rescue Boat", zoneId: "sector-17", status: "Deployed" },
  { id: "RS-2", name: "Rescue Boat 02", type: "Rescue Boat", zoneId: "river-road", status: "Available" },
  { id: "RS-3", name: "Ambulance GKP-04", type: "Ambulance", zoneId: "zone-b", status: "Available" },
  { id: "RS-4", name: "Ambulance GKP-07", type: "Ambulance", zoneId: "medical-college", status: "Available" },
  { id: "RS-5", name: "NDRF Team Alpha", type: "Emergency Team", zoneId: "sector-17", status: "Deployed" },
  { id: "RS-6", name: "SDRF Team Bravo", type: "Emergency Team", zoneId: "south-basin", status: "Available" },
  { id: "RS-7", name: "Mobile Pump Unit 01", type: "Water Pump", zoneId: "sector-17", status: "Deployed" },
  { id: "RS-8", name: "Mobile Pump Unit 02", type: "Water Pump", zoneId: "eastern-corridor", status: "Available" },
  { id: "RS-9", name: "Medical Response Unit 3", type: "Medical Team", zoneId: "medical-college", status: "Available" },
  { id: "RS-10", name: "GDA Maintenance Crew C", type: "Drainage Maintenance Team", zoneId: "north-ward", status: "Available" },
  { id: "RS-11", name: "Relief Supply Truck 02", type: "Food/Water Supply", zoneId: "west-cantt", status: "Available" },
  { id: "RS-12", name: "Volunteer Group — Ward 12", type: "Volunteers", zoneId: "north-ward", status: "Available" },
];

/* ------------------------------- citizen reports ------------------------------- */

/** Approximate GPS coordinates for each zone, used to simulate "auto-detected"
 *  location on citizen report submissions. */
export const ZONE_COORDS: Record<string, [number, number]> = {
  "sector-17": [26.755, 83.3697],
  "river-road": [26.748, 83.3775],
  "zone-b": [26.7515, 83.3625],
  "medical-college": [26.7395, 83.3805],
  "eastern-corridor": [26.746, 83.395],
  "north-ward": [26.771, 83.37],
  "south-basin": [26.73, 83.368],
  "west-cantt": [26.755, 83.345],
};

export const FLOOD_SEVERITY_OPTIONS = ["Waterlogging", "Ankle Deep", "Knee Deep", "Waist Deep", "Impassable"] as const;
export const ROAD_CONDITION_OPTIONS = ["Passable", "Difficult", "Blocked"] as const;
export const BLOCKAGE_CONDITION_OPTIONS = ["Blocked drain", "Partially blocked", "Overflowing", "No visible issue"] as const;
export const WATER_ACCUMULATION_OPTIONS = ["Low", "Moderate", "High", "Severe"] as const;

export interface FloodCitizenReport {
  id: string;
  kind: "flood";
  zoneId: string;
  severity: (typeof FLOOD_SEVERITY_OPTIONS)[number];
  depthCm: number;
  roadCondition: (typeof ROAD_CONDITION_OPTIONS)[number];
  description: string;
  coords: [number, number];
  verified: boolean;
  reportedAgo: string;
}

export interface DrainageCitizenReport {
  id: string;
  kind: "drainage";
  zoneId: string;
  blockage: (typeof BLOCKAGE_CONDITION_OPTIONS)[number];
  waterAccumulation: (typeof WATER_ACCUMULATION_OPTIONS)[number];
  description: string;
  coords: [number, number];
  verified: boolean;
  reportedAgo: string;
}

export type CitizenReport = FloodCitizenReport | DrainageCitizenReport;
