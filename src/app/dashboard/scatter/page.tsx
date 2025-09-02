"use client";
import DashboardLayout from "@/components/dashboard/layout";
import { useData } from "@/context/data-context";
import Link from "next/link";
import { ResponsiveContainer, ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

// Data provided by processed context

export default function ScatterPage() {
  const { hasData, processed } = useData();

  if (!hasData) {
    return (
      <DashboardLayout>
        <div className="min-h-full bg-gradient-to-br from-slate-50 to-white p-8">
          <div className="h-[70vh] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-lg font-semibold text-slate-900">No data available</h1>
              <p className="mt-1 text-sm text-slate-600">Upload your datasets in the Overview to generate scatter analysis.</p>
              <Link href="/dashboard" className="inline-flex mt-4 h-9 items-center rounded-md bg-blue-600 px-4 text-white hover:bg-blue-700">Go to Overview</Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const scatterData = processed?.scatter ?? [];
  const slope = processed?.ols?.slope ?? null;
  const intercept = processed?.ols?.intercept ?? null;
  const hasOLS = slope != null && intercept != null && Number.isFinite(slope) && Number.isFinite(intercept);
  const minX = scatterData.length ? Math.min(...scatterData.map(p => p.x)) : 0;
  const maxX = scatterData.length ? Math.max(...scatterData.map(p => p.x)) : 1;
  const olsLineData = hasOLS ? [
    { x: minX, y: (intercept as number) + (slope as number) * minX },
    { x: maxX, y: (intercept as number) + (slope as number) * maxX },
  ] : [];
  return (
    <DashboardLayout>
      <div className="min-h-full bg-gradient-to-br from-slate-50 to-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-900">Scatter Analysis</h1>
            <p className="mt-2 text-slate-600">Social Protection vs Labour Participation</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="h-96" id="scatter-chart">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="x" name="Social Protection" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="y" name="Labour Participation" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(v, n) => [typeof v === 'number' ? v.toFixed(2) : v, n === 'x' ? 'Social Protection' : 'Labour Participation']} contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  <Scatter data={scatterData} fill="#8b5cf6" />
                  {hasOLS && (
                    <Scatter data={olsLineData} line={{ stroke: '#ef4444', strokeWidth: 2 }} shape="circle" fill="transparent" />
                  )}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

