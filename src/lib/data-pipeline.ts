/*
  Client-side data ingestion and processing utilities.
  - Parse CSV (PapaParse) and Excel (xlsx)
  - Detect dataset types (Social Protection vs Labour Participation)
  - Filter for South Africa, align by year, aggregate duplicates
  - Compute time series, growth, scatter and overall correlation
*/

import Papa from "papaparse";
import * as XLSX from "xlsx";

export type RawRow = Record<string, unknown>;

export type ParsedDatasets = {
  socialProtection: RawRow[];
  labourParticipation: RawRow[];
  gdp?: RawRow[];
  population?: RawRow[];
};

export type TimeSeriesPoint = {
  year: number;
  social: number; // expenditure (raw units)
  labour: number; // percentage
};

export type ProcessedData = {
  country: string;
  years: number[];
  timeSeries: TimeSeriesPoint[];
  socialGrowthYoY: Array<{ year: number; value: number }>; // percentage
  labourChangeYoY: Array<{ year: number; value: number }>; // percentage points
  scatter: Array<{ x: number; y: number; year: number }>;
  correlationR: number | null;
  normalizationAvailable?: {
    percentGDP: boolean;
    perCapita: boolean;
  };
  normalized?: {
    percentGDPSeries?: TimeSeriesPoint[];
    perCapitaSeries?: TimeSeriesPoint[];
  };
  pipelineStats?: {
    socialRows: number;
    labourRows: number;
    gdpRows: number;
    populationRows: number;
    yearsAligned: number;
    firstYear?: number;
    lastYear?: number;
  };
  ols?: {
    intercept: number | null;
    slope: number | null;
    rSquared: number | null;
  };
};

export const REQUIRED_COLUMNS = [
  "REF_AREA",
  "REF_AREA_LABEL",
  "INDICATOR",
  "TIME_PERIOD",
  "OBS_VALUE",
];

export function hasRequiredColumns(rows: RawRow[]): boolean {
  if (!rows.length) return false;
  const keys = Object.keys(rows[0]);
  return REQUIRED_COLUMNS.every((k) => keys.includes(k));
}

export function missingColumns(rows: RawRow[]): string[] {
  if (!rows.length) return REQUIRED_COLUMNS;
  const keys = Object.keys(rows[0]);
  return REQUIRED_COLUMNS.filter((k) => !keys.includes(k));
}

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/\s+|_/g, "");
}

function normalizeRows(rows: RawRow[]): RawRow[] {
  const mapped: RawRow[] = [];
  for (const r of rows) {
    const nr: RawRow = { ...r };
    for (const [k, v] of Object.entries(r)) {
      const nk = normalizeKey(k);
      if (nk === "value" || nk === "obsvalue") nr["OBS_VALUE"] = v as unknown;
      if (nk === "timeperiod" || nk === "year" || nk === "time") nr["TIME_PERIOD"] = v as unknown;
      if (nk === "refarealabel" || nk === "country" || nk === "countryname") nr["REF_AREA_LABEL"] = typeof v === 'string' ? (v as string).trim() : v;
      if (nk === "refarea" || nk === "countrycode" || nk === "iso3") nr["REF_AREA"] = v as unknown;
      if (nk === "indicator" || nk === "indicatorcode") nr["INDICATOR"] = v as unknown;
    }
    mapped.push(nr);
  }
  return mapped;
}

function parseCSV(file: File): Promise<RawRow[]> {
  return new Promise((resolve, reject) => {
    const papaCompat = Papa as unknown as {
      parse<T>(input: unknown, config: {
        header: boolean;
        dynamicTyping: boolean;
        skipEmptyLines: boolean;
        complete: (results: { data: T[] }) => void;
        error: (err: unknown) => void;
      }): void;
    };
    papaCompat.parse<RawRow>(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results: { data: RawRow[] }) => resolve(results.data || []),
      error: (err: unknown) => reject(err as Error),
    });
  });
}

async function parseXLSX(file: File): Promise<RawRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheet = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheet];
  return XLSX.utils.sheet_to_json(sheet) as RawRow[];
}

export async function parseUploadedFiles(files: File[]): Promise<ParsedDatasets> {
  const rowsPerFile = await Promise.all(
    files.map(async (f) => {
      const isExcel =
        f.type === "application/vnd.ms-excel" ||
        f.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        f.name.endsWith(".xlsx") ||
        f.name.endsWith(".xls");
      const parsedRows = isExcel ? await parseXLSX(f) : await parseCSV(f);
      const rows = normalizeRows(parsedRows);
      return { file: f, rows };
    })
  );

  // Concatenate rows across files by detected type.
  const social: RawRow[] = [];
  const labour: RawRow[] = [];
  const gdp: RawRow[] = [];
  const population: RawRow[] = [];

  for (const { file, rows } of rowsPerFile) {
    if (!hasRequiredColumns(rows)) continue;
    const indicatorValues = new Set(
      rows
        .map((r) => String(r["INDICATOR"] || "").toUpperCase())
        .filter(Boolean)
    );
    const fileName = file.name.toUpperCase();

    const looksSocial =
      fileName.includes("SOC_PRO") ||
      [...indicatorValues].some((v) => v.includes("SOC_PRO") || v.includes("COFOG") || v.includes("SOCIAL"));
    const looksLabour =
      fileName.includes("HCP") ||
      [...indicatorValues].some((v) => v.includes("HCP") || v.includes("LABOUR") || v.includes("LABOR"));
    const looksGDP =
      fileName.includes("GDP") ||
      [...indicatorValues].some((v) => v.includes("GDP"));
    const looksPOP =
      fileName.includes("POP") || fileName.includes("POPULATION") ||
      [...indicatorValues].some((v) => v.includes("POP") || v.includes("POPULATION"));

    // Fallback heuristic: range check on OBS_VALUE (labour likely 0-100)
    const sampleValues = rows
      .slice(0, 10)
      .map((r) => Number(r["OBS_VALUE"]))
      .filter((n) => Number.isFinite(n));
    const inPercentRange = sampleValues.length
      ? sampleValues.every((n) => n >= 0 && n <= 100)
      : false;

    if (looksSocial && !inPercentRange) social.push(...rows);
    else if (looksGDP) gdp.push(...rows);
    else if (looksPOP) population.push(...rows);
    else if (looksLabour || inPercentRange) labour.push(...rows);
    else {
      // If ambiguous, attempt to decide by magnitude
      const mean =
        sampleValues.reduce((a, b) => a + b, 0) / Math.max(sampleValues.length, 1);
      if (mean > 1000) social.push(...rows);
      else labour.push(...rows);
    }
  }

  return { socialProtection: social, labourParticipation: labour, gdp, population };
}

function toYear(n: unknown): number | null {
  const num = Number(n);
  return Number.isFinite(num) ? (num | 0) : null;
}

function toNumber(n: unknown): number | null {
  const num = Number(n);
  return Number.isFinite(num) ? Number(num) : null;
}

function groupMeanByYear(rows: RawRow[], country: string): Map<number, number> {
  const acc = new Map<number, { sum: number; count: number }>();
  for (const r of rows) {
    const rowCountry = String(r["REF_AREA_LABEL"] || r["REF_AREA"] || "").trim();
    if (rowCountry && rowCountry.toLowerCase() !== country.toLowerCase()) continue;
    const year = toYear(r["TIME_PERIOD"]);
    const value = toNumber(r["OBS_VALUE"]);
    if (year == null || value == null) continue;
    const prev = acc.get(year) || { sum: 0, count: 0 };
    prev.sum += value;
    prev.count += 1;
    acc.set(year, prev);
  }
  const mean = new Map<number, number>();
  acc.forEach((v, k) => {
    mean.set(k, v.sum / v.count);
  });
  return mean;
}

function computeCorrelation(x: number[], y: number[]): number | null {
  const n = Math.min(x.length, y.length);
  if (n < 3) return null;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let denx = 0;
  let deny = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx;
    const dy = y[i] - my;
    num += dx * dy;
    denx += dx * dx;
    deny += dy * dy;
  }
  const den = Math.sqrt(denx * deny);
  return den === 0 ? null : num / den;
}

function computeOLS(x: number[], y: number[]): { intercept: number | null; slope: number | null; r2: number | null } {
  const n = Math.min(x.length, y.length);
  if (n < 3) return { intercept: null, slope: null, r2: null };
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0, ssTot = 0, ssRes = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx;
    num += dx * (y[i] - my);
    den += dx * dx;
  }
  if (den === 0) return { intercept: null, slope: null, r2: null };
  const slope = num / den;
  const intercept = my - slope * mx;
  for (let i = 0; i < n; i++) {
    const yi = intercept + slope * x[i];
    ssTot += (y[i] - my) ** 2;
    ssRes += (y[i] - yi) ** 2;
  }
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;
  return { intercept, slope, r2 };
}

export function processDatasets(
  datasets: ParsedDatasets,
  country: string = "South Africa"
): ProcessedData {
  const socialByYear = groupMeanByYear(datasets.socialProtection, country);
  const labourByYear = groupMeanByYear(datasets.labourParticipation, country);
  const gdpByYear = datasets.gdp ? groupMeanByYear(datasets.gdp, country) : new Map<number, number>();
  const popByYear = datasets.population ? groupMeanByYear(datasets.population, country) : new Map<number, number>();

  const years = [...socialByYear.keys()].filter((y) => labourByYear.has(y)).sort((a, b) => a - b);

  const timeSeries: TimeSeriesPoint[] = years.map((year) => ({
    year,
    social: socialByYear.get(year) as number,
    labour: labourByYear.get(year) as number,
  }));

  const socialGrowthYoY: Array<{ year: number; value: number }> = [];
  const labourChangeYoY: Array<{ year: number; value: number }> = [];
  for (let i = 1; i < timeSeries.length; i++) {
    const prev = timeSeries[i - 1];
    const curr = timeSeries[i];
    // More robust growth calculation
    const growth = prev.social === 0 ? 
      (curr.social === 0 ? 0 : 100) : 
      ((curr.social - prev.social) / Math.abs(prev.social)) * 100;
    const change = curr.labour - prev.labour; // percentage points
    socialGrowthYoY.push({ 
      year: curr.year, 
      value: Number(growth.toFixed(2)) 
    });
    labourChangeYoY.push({ 
      year: curr.year, 
      value: Number(change.toFixed(2)) 
    });
  }

  const scatter = timeSeries.map((p) => ({ x: p.social, y: p.labour, year: p.year }));
  const correlationR = computeCorrelation(
    timeSeries.map((p) => p.social),
    timeSeries.map((p) => p.labour)
  );
  const olsLine = computeOLS(
    timeSeries.map((p) => p.social),
    timeSeries.map((p) => p.labour)
  );

  // Normalization if auxiliary data available
  let percentGDPSeries: TimeSeriesPoint[] | undefined;
  let perCapitaSeries: TimeSeriesPoint[] | undefined;
  if (gdpByYear.size) {
    percentGDPSeries = years
      .filter((y) => gdpByYear.has(y) && socialByYear.has(y) && labourByYear.has(y))
      .map((year) => {
        const socialValue = socialByYear.get(year)!;
        const gdpValue = gdpByYear.get(year)!;
        const labourValue = labourByYear.get(year)!;
        return {
          year,
          social: gdpValue > 0 ? (socialValue / gdpValue) * 100 : 0,
          labour: labourValue,
        };
      });
  }
  if (popByYear.size) {
    perCapitaSeries = years
      .filter((y) => popByYear.has(y) && socialByYear.has(y) && labourByYear.has(y))
      .map((year) => {
        const socialValue = socialByYear.get(year)!;
        const popValue = popByYear.get(year)!;
        const labourValue = labourByYear.get(year)!;
        return {
          year,
          social: popValue > 0 ? socialValue / popValue : 0,
          labour: labourValue,
        };
      });
  }

  return {
    country,
    years,
    timeSeries,
    socialGrowthYoY,
    labourChangeYoY,
    scatter,
    correlationR,
    pipelineStats: {
      socialRows: datasets.socialProtection.length,
      labourRows: datasets.labourParticipation.length,
      gdpRows: datasets.gdp?.length ?? 0,
      populationRows: datasets.population?.length ?? 0,
      yearsAligned: years.length,
      firstYear: years[0],
      lastYear: years[years.length - 1],
    },
    ols: {
      intercept: olsLine.intercept,
      slope: olsLine.slope,
      rSquared: olsLine.r2,
    },
    normalizationAvailable: {
      percentGDP: !!percentGDPSeries?.length,
      perCapita: !!perCapitaSeries?.length,
    },
    normalized: {
      percentGDPSeries,
      perCapitaSeries,
    },
  };
}

export function exportToCSV(filename: string, rows: Array<Record<string, unknown>>) {
  const headers = rows.length ? Object.keys(rows[0]) : [];
  const csv = [headers.join(",")]
    .concat(
      rows.map((r) => headers.map((h) => JSON.stringify((r as Record<string, unknown>)[h] ?? "")).join(","))
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateMarkdownSummary(p: ProcessedData): string {
  const r = p.correlationR == null ? "N/A" : p.correlationR.toFixed(2);
  const start = p.years[0];
  const end = p.years[p.years.length - 1];
  // Compute extremes
  let maxSocialYoY = { year: 0, value: -Infinity };
  p.socialGrowthYoY.forEach((g) => { if (g.value > maxSocialYoY.value) maxSocialYoY = g; });
  let minLabourChange = { year: 0, value: Infinity };
  p.labourChangeYoY.forEach((g) => { if (g.value < minLabourChange.value) minLabourChange = g; });

  // Calculate overall trends
  const socialStart = p.timeSeries[0]?.social || 0;
  const socialEnd = p.timeSeries[p.timeSeries.length - 1]?.social || 0;
  const socialTrend = socialEnd > socialStart ? "increased significantly" : "decreased";
  
  const labourStart = p.timeSeries[0]?.labour || 0;
  const labourEnd = p.timeSeries[p.timeSeries.length - 1]?.labour || 0;
  const labourRange = Math.max(...p.timeSeries.map(t => t.labour)) - Math.min(...p.timeSeries.map(t => t.labour));
  const labourTrend = labourRange < 10 ? "remained relatively stable" : "showed significant variation";

  return [
    `# NDTA Analytics Summary - ${p.country}`,
    ``,
    `## Key Findings`,
    `- **Coverage**: ${start}–${end} (${p.years.length} years)`,
    `- **Pearson correlation**: ${r} (${parseFloat(r) < -0.1 ? 'weak negative relationship' : parseFloat(r) > 0.1 ? 'weak positive relationship' : 'no significant relationship'})`,
    `- **Social Protection Expenditure**: ${socialTrend} between ${start}–${end}`,
    `- **Labour Force Participation**: ${labourTrend} with minor fluctuations`,
    `- **Peak Social Protection YoY Growth**: ${isFinite(maxSocialYoY.value) ? maxSocialYoY.value.toFixed(2) + '%' : 'N/A'} in ${maxSocialYoY.year || 'N/A'}`,
    `- **Largest Labour Participation Change**: ${isFinite(minLabourChange.value) ? minLabourChange.value.toFixed(2) + 'pp' : 'N/A'} in ${minLabourChange.year || 'N/A'}`,
    ``,
    `## Interpretation`,
    `${parseFloat(r) < -0.1 ? 
      '- **Negative correlation**: Higher social protection expenditure does not correspond to higher labour market participation\n- Possible explanations: Increased social protection may reduce work incentives, or structural issues (job scarcity, education gaps) dominate\n- **Policy implication**: Social protection policies are essential for welfare but may need redesign to enhance work incentives' :
      '- The relationship between social protection and labour participation requires further investigation with additional control variables'
    }`,
    ``,
    `## Research Context`,
    `- This analysis investigates whether changes in government social-protection spending (COFOG 710) co-vary with Labour Force Participation Rate (%)`,
    `- Findings align with South African policy challenges: high unemployment and low labour-market absorption rates`,
    `- **Important**: Correlation ≠ Causation. Consider controls (GDP, unemployment rates, education levels, income inequality)`,
    ``,
    `## Data Notes`,
    `- Social protection expenditure in local currency (${p.pipelineStats?.socialRows || 0} data points)`,
    `- Labour participation as percentage of working-age population (${p.pipelineStats?.labourRows || 0} data points)`,
    `- ${p.pipelineStats?.yearsAligned || 0} years successfully aligned between datasets`,
  ].join("\n");
}

export function exportText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


