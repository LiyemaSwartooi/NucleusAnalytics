"use client";
import DashboardLayout from "@/components/dashboard/layout";
import { useData } from "@/context/data-context";
import Link from "next/link";
import { Database, FileSpreadsheet, GitBranch, CheckCircle } from "lucide-react";

export default function DataPipelinePage() {
  const { hasData, processed } = useData();

  if (!hasData) {
    return (
      <DashboardLayout>
        <div className="min-h-full bg-gradient-to-br from-slate-50 to-white p-8">
          <div className="h-[70vh] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-lg font-semibold text-slate-900">No data available</h1>
              <p className="mt-1 text-sm text-slate-600">Upload your datasets in the Overview to generate the pipeline steps.</p>
              <Link href="/dashboard" className="inline-flex mt-4 h-9 items-center rounded-md bg-blue-600 px-4 text-white hover:bg-blue-700">Go to Overview</Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  const pipelineSteps = [
    {
      id: 1,
      title: "Data Loading",
      description: "Load datasets from World Bank sources",
      status: "completed",
      icon: Database,
      details: `Inputs • Social Protection (COFOG 710) & Labour Participation (%)`
    },
    {
      id: 2,
      title: "Data Cleaning",
      description: "Normalize schema and handle missing values",
      status: "completed",
      icon: FileSpreadsheet,
      details: "Standardized columns (REF_AREA, TIME_PERIOD, OBS_VALUE); dropped invalid rows"
    },
    {
      id: 3,
      title: "Data Alignment",
      description: "Align datasets by TIME_PERIOD and country",
      status: "completed",
      icon: GitBranch,
      details: processed?.pipelineStats ? `Overlap ${processed.pipelineStats.yearsAligned} years • ${processed.pipelineStats.firstYear}–${processed.pipelineStats.lastYear}` : "Aligned years computed"
    },
    {
      id: 4,
      title: "Analysis Ready",
      description: "Compute scatter, correlation (Pearson), and OLS",
      status: "completed",
      icon: CheckCircle,
      details: processed?.ols ? `r = ${processed.correlationR?.toFixed(2) ?? 'N/A'} • R² = ${processed.ols.rSquared?.toFixed(2) ?? 'N/A'}` : "Correlation and OLS available"
    }
  ];

  return (
    <DashboardLayout>
      <div className="min-h-full bg-gradient-to-br from-slate-50 to-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-900">Data Pipeline</h1>
            <p className="mt-2 text-slate-600">Process flow from raw data to analysis-ready datasets</p>
          </div>

          {processed?.pipelineStats && (
            <div className="mb-6 grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="text-sm text-slate-600">Rows</div>
                <div className="mt-2 text-sm text-slate-700 space-y-1">
                  <div>Social Protection: <span className="font-medium">{processed.pipelineStats.socialRows}</span></div>
                  <div>Labour Participation: <span className="font-medium">{processed.pipelineStats.labourRows}</span></div>
                  <div>GDP: <span className="font-medium">{processed.pipelineStats.gdpRows}</span></div>
                  <div>Population: <span className="font-medium">{processed.pipelineStats.populationRows}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="text-sm text-slate-600">Alignment</div>
                <div className="mt-2 text-sm text-slate-700 space-y-1">
                  <div>Aligned years: <span className="font-medium">{processed.pipelineStats.yearsAligned}</span></div>
                  <div>Coverage: <span className="font-medium">{processed.pipelineStats.firstYear}–{processed.pipelineStats.lastYear}</span></div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {pipelineSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Completed
                        </span>
                      </div>
                      <p className="mt-2 text-slate-600">{step.description}</p>
                      <p className="mt-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">{step.details}</p>
                    </div>
                  </div>
                  {index < pipelineSteps.length - 1 && (
                    <div className="ml-6 mt-4 h-8 w-0.5 bg-slate-200"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
