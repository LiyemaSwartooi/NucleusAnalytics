"use client";
import DashboardLayout from "@/components/dashboard/layout";
import { useData } from "@/context/data-context";
import Link from "next/link";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from "recharts";
import React from "react";

// Data will be sourced from processed context

export default function TimeSeriesPage() {
  const { hasData, processed } = useData();
  const [mode, setMode] = React.useState<"raw" | "percentGDP" | "perCapita">("raw");

  if (!hasData) {
    return (
      <DashboardLayout>
        <div className="min-h-full bg-gradient-to-br from-slate-50 to-white p-8">
          <div className="h-[70vh] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-lg font-semibold text-slate-900">No data available</h1>
              <p className="mt-1 text-sm text-slate-600">Upload your datasets in the Overview to generate time series charts.</p>
              <Link href="/dashboard" className="inline-flex mt-4 h-9 items-center rounded-md bg-blue-600 px-4 text-white hover:bg-blue-700">Go to Overview</Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  const timeSeriesData = processed?.timeSeries ?? [];
  const socialGrowth = processed?.socialGrowthYoY ?? [];
  const labourChange = processed?.labourChangeYoY ?? [];
  const yearLabel = processed?.years?.length ? `${processed.years[0]}-${processed.years[processed.years.length - 1]}` : '';

  const canGDP = !!processed?.normalized?.percentGDPSeries?.length;
  const canPerCapita = !!processed?.normalized?.perCapitaSeries?.length;
  const chartData = mode === 'percentGDP' ? (processed?.normalized?.percentGDPSeries ?? [])
                   : mode === 'perCapita' ? (processed?.normalized?.perCapitaSeries ?? [])
                   : (timeSeriesData);

  return (
    <DashboardLayout>
      <div className="min-h-full bg-gradient-to-br from-slate-50 to-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-900">Time Series Analysis</h1>
            <p className="mt-2 text-slate-600">Temporal patterns in social protection expenditure and labour force participation</p>
          </div>

          {/* Main Time Series Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Social Protection vs Labour Participation Trends</h2>
              <p className="text-sm text-slate-600">{processed?.country} {yearLabel}</p>
              <div className="mt-2 text-sm text-slate-500">
                {processed?.correlationR != null && (
                  <span>Correlation: {processed.correlationR.toFixed(3)} • </span>
                )}
                {processed?.ols?.rSquared != null && (
                  <span>R² {processed.ols.rSquared.toFixed(3)} • </span>
                )}
                <span>Dual Y-axis: Social Protection (left) • Labour Participation (right)</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-slate-600">Normalization</div>
              <div className="inline-flex items-center rounded-md border border-slate-300 bg-white p-0.5 shadow-sm">
                <button type="button" onClick={() => setMode('raw')} className={`px-3 py-1.5 text-sm rounded ${mode==='raw' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'}`}>Raw</button>
                <button type="button" onClick={() => canGDP && setMode('percentGDP')} disabled={!canGDP} className={`px-3 py-1.5 text-sm rounded ${mode==='percentGDP' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-50'} ${!canGDP ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>% GDP</button>
                <button type="button" onClick={() => canPerCapita && setMode('perCapita')} disabled={!canPerCapita} className={`px-3 py-1.5 text-sm rounded ${mode==='perCapita' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-50'} ${!canPerCapita ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Per Capita</button>
              </div>
            </div>
            <div className="h-96" id="time-series-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                      value: mode === 'percentGDP' ? 'Social Protection (% GDP)' : mode === 'perCapita' ? 'Social Protection (per capita)' : 'Social Protection (units)', 
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
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                    name={mode==='percentGDP' ? 'Social Protection (% GDP)' : mode==='perCapita' ? 'Social Protection (per capita)' : 'Social Protection (units)'}
                  />
                  <Line 
                    yAxisId="right"
                    dataKey="labour" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                    name="Labour Participation (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Growth Rate Analysis */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Social Protection Growth */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Social Protection Growth Rate</h3>
                <p className="text-sm text-slate-600">Year-over-year percentage change</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={socialGrowth} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="year" 
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      formatter={(value: number | string) => [`${value}%`, 'Growth Rate']}
                    />
                    <Area 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      fill="#3b82f6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Labour Participation Growth */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Labour Participation Change</h3>
                <p className="text-sm text-slate-600">Year-over-year percentage point change</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={labourChange} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="year" 
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      formatter={(value: number | string) => [`${value}pp`, 'Change']}
                    />
                    <Area 
                      dataKey="value" 
                      stroke="#10b981" 
                      fill="#10b981"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Key Observations */}
          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Temporal Observations</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Social Protection Trends</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Steady increase from 2015-2019 (average 11.3% growth)</li>
                  <li>• Sharp spike in 2020 (+26.5% due to COVID-19 response)</li>
                  <li>• Moderated growth 2021-2022 (~8% annually)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Labour Participation Patterns</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Relatively stable around 58% (2015-2019)</li>
                  <li>• Significant drop in 2020 to 56.5%</li>
                  <li>• Gradual recovery but below pre-pandemic levels</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
