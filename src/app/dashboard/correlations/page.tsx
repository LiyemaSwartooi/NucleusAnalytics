"use client";
import DashboardLayout from "@/components/dashboard/layout";
import { useData } from "@/context/data-context";
import Link from "next/link";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Build a simple display using overall correlation and rolling windows if available later.

export default function CorrelationsPage() {
  const { hasData, processed } = useData();

  if (!hasData) {
    return (
      <DashboardLayout>
        <div className="min-h-full bg-gradient-to-br from-slate-50 to-white p-8">
          <div className="h-[70vh] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-lg font-semibold text-slate-900">No data available</h1>
              <p className="mt-1 text-sm text-slate-600">Upload your datasets in the Overview to generate correlation analysis.</p>
              <Link href="/dashboard" className="inline-flex mt-4 h-9 items-center rounded-md bg-blue-600 px-4 text-white hover:bg-blue-700">Go to Overview</Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const correlationData = processed?.timeSeries?.length
    ? [
        { 
          period: "Overall", 
          correlation: Number((processed.correlationR ?? 0).toFixed(3)),
          rSquared: Number((processed.ols?.rSquared ?? 0).toFixed(3)),
          slope: processed.ols?.slope ? Number(processed.ols.slope.toExponential(2)) : 0
        },
      ]
    : [];

  return (
    <DashboardLayout>
      <div className="min-h-full bg-gradient-to-br from-slate-50 to-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-900">Correlation Analysis</h1>
            <p className="mt-2 text-slate-600">Pearson correlation using uploaded data{processed?.ols?.rSquared != null ? ` • OLS R² ${processed.ols.rSquared.toFixed(2)}` : ''}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Correlation Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Correlation Coefficient</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={correlationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="period" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis domain={[-1, 1]} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                    <Bar dataKey="correlation" name="Correlation Coefficient">
                      {correlationData.map((row, i) => (
                        <Cell key={i} fill={row.correlation >= 0 ? "#10b981" : "#ef4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Research Findings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Research Findings</h3>
              <div className="space-y-4">
                {processed?.correlationR != null && (
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{processed.correlationR.toFixed(3)}</div>
                    <div className="text-sm text-slate-600">Pearson Correlation</div>
                    <div className="mt-2 text-sm text-slate-700">
                      {processed.correlationR < -0.1 ? (
                        <span className="text-red-600">Weak negative relationship</span>
                      ) : processed.correlationR > 0.1 ? (
                        <span className="text-green-600">Weak positive relationship</span>
                      ) : (
                        <span className="text-slate-500">No significant relationship</span>
                      )}
                    </div>
                  </div>
                )}
                
                {processed?.ols?.rSquared != null && (
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{processed.ols.rSquared.toFixed(3)}</div>
                    <div className="text-sm text-slate-600">R-squared (Explained Variance)</div>
                  </div>
                )}

                {processed?.ols && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-slate-600">Intercept</div>
                      <div className="text-base font-medium text-slate-900">{processed.ols.intercept == null ? '—' : processed.ols.intercept.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Slope</div>
                      <div className="text-base font-medium text-slate-900">{processed.ols.slope == null ? '—' : processed.ols.slope.toExponential(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">R²</div>
                      <div className="text-base font-medium text-slate-900">{processed.ols.rSquared == null ? '—' : processed.ols.rSquared.toFixed(2)}</div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-2">Policy Interpretation</h4>
                  <div className="text-sm text-slate-700 space-y-2">
                    {processed?.correlationR != null && processed.correlationR < -0.1 ? (
                      <>
                        <p>• Higher social protection expenditure does not correspond to higher labour market participation</p>
                        <p>• May reflect structural unemployment challenges or work disincentive effects</p>
                        <p>• Consider redesigning programs to enhance work incentives</p>
                      </>
                    ) : (
                      <p>• Relationship requires further investigation with additional control variables</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

