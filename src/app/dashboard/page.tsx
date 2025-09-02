"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, ScatterChart, Scatter, Cell } from "recharts";
import * as htmlToImage from "html-to-image";
import { TrendingDown, TrendingUp, BarChart3, Users, Calendar, Download, RefreshCw, Upload, FileSpreadsheet, CheckCircle, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/layout";
import { useData } from "@/context/data-context";
import { parseUploadedFiles, processDatasets, hasRequiredColumns, missingColumns } from "@/lib/data-pipeline";
import { toast } from "sonner";

// Charts will use processed data from context

export default function DashboardPage() {
  const { hasData, setHasData, setUploadedFiles, setParsed, setProcessed, processed, parsed } = useData();
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [country, setCountry] = useState("South Africa");
  const [normMode, setNormMode] = useState<"raw" | "percentGDP" | "perCapita">("raw");
  const [isRecomputing, setIsRecomputing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      file.type === 'text/csv' || 
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    if (validFiles.length !== files.length) {
      toast.error("Please upload only CSV or Excel files");
      return;
    }
    // Just save files; processing will start when user clicks the button
    setLocalFiles(validFiles);
  };

  const handleStartProcessing = async () => {
    if (localFiles.length < 2) {
      toast.error("Please upload at least 2 files (Social Protection and Labour Participation)");
      return;
    }
    setIsProcessing(true);
    try {
      const toastId = toast.loading("Parsing and processing files…");
      const parsed = await parseUploadedFiles(localFiles);
      // Basic schema validation: ensure each parsed group has required columns
      const groups = [parsed.socialProtection, parsed.labourParticipation];
      for (const rows of groups) {
        if (rows.length && !hasRequiredColumns(rows)) {
          const miss = missingColumns(rows);
          throw new Error(`Missing required columns: ${miss.join(', ')}`);
        }
      }
      const processed = processDatasets(parsed, country);
      if (!processed.timeSeries.length) {
        toast.error("No overlapping years after alignment. Check YEAR and COUNTRY columns.", { id: toastId });
        setIsProcessing(false);
        return;
      }
      setParsed(parsed);
      setProcessed(processed);
      setHasData(true);
      setUploadedFiles(localFiles.map(f => ({ name: f.name, size: f.size })));
      toast.success(`Processed ${localFiles.length} file(s) successfully (aligned years: ${processed.years.length})`, { id: toastId });
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed to process files. Please check formats and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Re-process when country changes
  useEffect(() => {
    if (!parsed || !hasData) return;
    (async () => {
      try {
        setIsRecomputing(true);
        toast.message(`Recomputing for ${country}…`, { duration: 1500 });
        const p = processDatasets(parsed, country);
        setProcessed(p);
      } finally {
        setIsRecomputing(false);
        toast.success("Updated charts", { duration: 1200 });
      }
    })();
  }, [country, parsed, hasData, setProcessed]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.type === 'text/csv' || 
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    );
    if (validFiles.length !== files.length) {
      toast.error("Please upload only CSV or Excel files");
      return;
    }
    setLocalFiles(validFiles);
  };

  const correlationValue = processed?.correlationR != null ? processed.correlationR : null;
  const yearsLabel = processed?.years?.length ? `${processed.years[0]}-${processed.years[processed.years.length - 1]}` : "";
  const stats = [
    {
      label: "Correlation Coefficient",
      value: correlationValue != null ? correlationValue.toFixed(2) : "—",
      change: correlationValue != null ? (correlationValue >= 0 ? "+" : "") + (correlationValue * 100).toFixed(0) + "%" : "—",
      trend: correlationValue != null ? (correlationValue >= 0 ? "up" : "down") : "stable",
      icon: correlationValue != null && correlationValue >= 0 ? TrendingUp : TrendingDown,
      description: "Social Protection vs Labour Participation"
    },
    {
      label: "Time Period Coverage",
      value: processed?.years?.length ? `${processed.years.length} Years` : "—",
      change: yearsLabel || "—",
      trend: "stable",
      icon: Calendar,
      description: "Continuous data availability"
    },
    {
      label: "Country",
      value: processed?.country ?? "—",
      change: "",
      trend: "stable",
      icon: Users,
      description: "Current focus"
    },
    {
      label: "Data Points",
      value: processed?.timeSeries?.length ? String(processed.timeSeries.length) : "—",
      change: "",
      trend: "up",
      icon: BarChart3,
      description: "Merged time-series rows"
    }
  ];

  return (
    <DashboardLayout>
      <div className="min-h-full bg-gradient-to-br from-slate-50 to-white font-inter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Analytics Dashboard</h1>
            <p className="mt-2 text-slate-600">Social Protection & Labour Force Participation Analysis</p>
          </div>
          {hasData && (
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Button variant="outline" size="sm" className="cursor-pointer">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="cursor-pointer" onClick={async () => {
                const node = document.querySelector('#ts-chart') as HTMLElement | null;
                if (!node) return;
                try {
                  const dataUrl = await htmlToImage.toPng(node);
                  const link = document.createElement('a');
                  link.download = 'time_series.png';
                  link.href = dataUrl;
                  link.click();
                } catch {
                  toast.error('Failed to export chart');
                }
              }}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="destructive" size="sm" className="cursor-pointer" onClick={() => {
                // Clear all current data and localStorage keys
                try {
                  localStorage.removeItem("ndta_has_data");
                  localStorage.removeItem("ndta_uploaded_files");
                  localStorage.removeItem("ndta_processed_summary");
                } catch {}
                setParsed(undefined);
                setProcessed(undefined);
                setUploadedFiles([]);
                setHasData(false);
                setLocalFiles([]);
                toast.success("Cleared previous data. Please upload new files.");
                // Scroll to upload
                const el = document.querySelector('#upload-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>
                <Trash2 className="h-4 w-4 mr-2" />
                Re-upload & Clear
              </Button>
            </div>
          )}
        </div>

        {hasData && (
          <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600">Country</div>
              <select
                className="w-48 h-9 rounded-md border border-slate-300 bg-white px-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                aria-label="Select country"
              >
                <option value="South Africa">South Africa</option>
                <option value="Brazil">Brazil</option>
                <option value="India">India</option>
                <option value="Kenya">Kenya</option>
              </select>
              {isRecomputing && (
                <div className="flex items-center text-xs text-slate-500">
                  <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500"></span>
                  Recomputing…
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600">Normalization</div>
              <div className="inline-flex items-center rounded-md border border-slate-300 bg-white p-0.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => setNormMode('raw')}
                  className={`px-3 py-1.5 text-sm rounded ${normMode==='raw' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
                >
                  Raw
                </button>
                <button
                  type="button"
                  onClick={() => processed?.normalizationAvailable?.percentGDP && setNormMode('percentGDP')}
                  disabled={!processed?.normalizationAvailable?.percentGDP}
                  className={`px-3 py-1.5 text-sm rounded ${normMode==='percentGDP' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-50'} ${!processed?.normalizationAvailable?.percentGDP ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  % GDP
                </button>
                <button
                  type="button"
                  onClick={() => processed?.normalizationAvailable?.perCapita && setNormMode('perCapita')}
                  disabled={!processed?.normalizationAvailable?.perCapita}
                  className={`px-3 py-1.5 text-sm rounded ${normMode==='perCapita' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-50'} ${!processed?.normalizationAvailable?.perCapita ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  Per Capita
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section - Show when no data */}
        {!hasData && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="grid gap-6 items-start">
                {/* Full-width Dropzone */}
                <div className="col-span-full" id="upload-section">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Upload your data files</h2>
                      <p className="text-sm text-slate-600">CSV or Excel (.csv, .xlsx, .xls). Max 10MB each.</p>
                    </div>
                  </div>

                  <div
                    className="border border-dashed border-slate-300 rounded-xl overflow-hidden cursor-pointer hover:border-blue-400 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center justify-center text-center w-full min-h-[160px] sm:min-h-[200px] lg:min-h-[240px] p-3">
                      <FileSpreadsheet className="h-10 w-10 text-slate-400" />
                      <h3 className="mt-3 text-xl font-semibold text-slate-900">Drag & drop files here</h3>
                      <p className="text-sm text-slate-600">or click to browse (.csv, .xlsx, .xls)</p>
                      <Button size="sm" className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"><Upload className="h-4 w-4 mr-2" />Choose Files</Button>
                      <input ref={fileInputRef} type="file" multiple accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" />
                    </div>
                  </div>

                  {localFiles.length > 0 && (
                    <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                      <div className="text-slate-700">
                        {localFiles.length} file(s) selected. Click Start Processing to continue.
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" onClick={handleStartProcessing} disabled={isProcessing}>
                        {isProcessing ? (
                          <span className="flex items-center"><span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"></span>Processing…</span>
                        ) : (
                          <span className="flex items-center"><Upload className="h-4 w-4 mr-2" />Start Processing</span>
                        )}
                      </Button>
                    </div>
                  )}

                  {localFiles.length > 0 && !isProcessing && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center mb-2 text-sm font-medium text-green-800">
                        <CheckCircle className="h-4 w-4 mr-2" /> Files ready for processing
                      </div>
                      <ul className="space-y-1 text-xs text-green-700">
                        {localFiles.map((file, index) => (
                          <li key={index} className="flex items-center">
                            <FileSpreadsheet className="h-3.5 w-3.5 mr-2" />
                            {file.name} ({(file.size / 1024).toFixed(1)} KB)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Guidance cards */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Expected Files</h3>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• Social Protection Expenditure (COFOG 710)</li>
                      <li>• Labour Force Participation Rate (%)</li>
                      <li>• Years column (e.g., 2000–2023)</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">We will generate</h3>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• Time series trends</li>
                      <li>• Correlation and scatter analysis</li>
                      <li>• Exportable visualizations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content - Show when data is available */}
        {hasData && (
          <>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.trend === "up";
            const isNegative = stat.trend === "down";
            
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isPositive ? "bg-emerald-100" : isNegative ? "bg-red-100" : "bg-blue-100"
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      isPositive ? "text-emerald-600" : isNegative ? "text-red-600" : "text-blue-600"
                    }`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    isPositive ? "text-emerald-600" : isNegative ? "text-red-600" : "text-slate-500"
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                  <p className="text-sm font-medium text-slate-700">{stat.label}</p>
                  <p className="text-xs text-slate-500">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Time Series Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Time Series Analysis</h3>
                <p className="text-sm text-slate-600">Social Protection Expenditure vs Labour Participation Rate</p>
              </div>
            </div>
            <div className="h-80" id="ts-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={
                  normMode === 'percentGDP' ? (processed?.normalized?.percentGDPSeries ?? []) :
                  normMode === 'perCapita' ? (processed?.normalized?.perCapitaSeries ?? []) :
                  (processed?.timeSeries ?? [])
                } margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="year" 
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    yAxisId="left"
                    orientation="left"
                    stroke="#3b82f6"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    label={{ 
                      value: normMode === 'percentGDP' ? 'Social Protection (% GDP)' :
                             normMode === 'perCapita' ? 'Social Protection (per capita)' : 
                             'Social Protection (units)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#3b82f6' }
                    }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#10b981"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    label={{ 
                      value: 'Labour Participation (%)', 
                      angle: 90, 
                      position: 'insideRight',
                      style: { textAnchor: 'middle', fill: '#10b981' }
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: number | string, name: string) => [
                      typeof value === 'number' ? value.toFixed(2) : value,
                      name
                    ]}
                  />
                  <Line 
                    yAxisId="left"
                    dataKey="social" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} 
                    name={normMode==='percentGDP' ? 'Social Protection (% GDP)' : normMode==='perCapita' ? 'Social Protection (per capita)' : 'Social Protection (units)'} 
                  />
                  <Line 
                    yAxisId="right"
                    dataKey="labour" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} 
                    name="Labour Participation (%)" 
                  />
                </LineChart>
              </ResponsiveContainer>
              {isRecomputing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl">
                  <div className="flex items-center text-sm text-slate-600 bg-white border border-slate-200 rounded-md px-3 py-2 shadow-sm">
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500"></span>
                    Updating chart…
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Correlation Analysis */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Correlation Analysis</h3>
                <p className="text-sm text-slate-600">Period-based correlation coefficients</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processed?.correlationR != null ? [{ period: 'Overall', correlation: Number(processed.correlationR.toFixed(2)) }] : []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="period" 
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[-1, 1]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar dataKey="correlation" name="Correlation Coefficient">
                    {(processed?.correlationR != null ? [processed.correlationR] : []).map((v, i) => (
                      <Cell key={`cell-${i}`} fill={v >= 0 ? '#10b981' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {isRecomputing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl">
                  <div className="flex items-center text-sm text-slate-600 bg-white border border-slate-200 rounded-md px-3 py-2 shadow-sm">
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500"></span>
                    Updating chart…
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scatter Plot */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Relationship Scatter Plot</h3>
              <p className="text-sm text-slate-600">Social Protection Expenditure vs Labour Force Participation</p>
            </div>
          </div>
          <div className="h-96" id="scatter-chart">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="x" 
                  name="Social Protection Expenditure"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  dataKey="y" 
                  name="Labour Participation Rate"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number | string, name: string) => [
                    typeof value === 'number' ? value.toFixed(2) : value,
                    name === 'x' ? 'Social Protection' : 'Labour Participation'
                  ]}
                />
                <Scatter data={processed?.scatter ?? []} fill="#8b5cf6" />
                {(() => {
                  const slope = processed?.ols?.slope ?? null;
                  const intercept = processed?.ols?.intercept ?? null;
                  const pts = processed?.scatter ?? [];
                  const hasOLS = slope != null && intercept != null && Number.isFinite(slope) && Number.isFinite(intercept) && pts.length;
                  if (!hasOLS) return null;
                  const minX = Math.min(...pts.map(p => p.x));
                  const maxX = Math.max(...pts.map(p => p.x));
                  const lineData = [
                    { x: minX, y: (intercept as number) + (slope as number) * minX },
                    { x: maxX, y: (intercept as number) + (slope as number) * maxX },
                  ];
                  return (
                    <Scatter data={lineData} line={{ stroke: '#ef4444', strokeWidth: 2 }} shape="circle" fill="transparent" />
                  );
                })()}
              </ScatterChart>
            </ResponsiveContainer>
            {isRecomputing && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl">
                <div className="flex items-center text-sm text-slate-600 bg-white border border-slate-200 rounded-md px-3 py-2 shadow-sm">
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500"></span>
                  Updating chart…
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-center">
            <p className="text-sm text-slate-600">
              <strong>Research Note:</strong> The negative correlation (-0.22) suggests that increased social protection expenditure 
              is associated with decreased labour force participation. However, correlation does not imply causation, and further 
              analysis with control variables is recommended.
            </p>
          </div>
        </div>
          </>
        )}
        </div>
      </div>
    </DashboardLayout>
  );
}

