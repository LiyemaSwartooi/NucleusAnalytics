"use client";
import DashboardLayout from "@/components/dashboard/layout";
import { useData } from "@/context/data-context";
import { generateMarkdownSummary } from "@/lib/data-pipeline";
import Link from "next/link";
import { TrendingDown, AlertCircle, Lightbulb, Target } from "lucide-react";

export default function FindingsPage() {
  const { hasData, processed } = useData();

  if (!hasData) {
    return (
      <DashboardLayout>
        <div className="min-h-full bg-gradient-to-br from-slate-50 to-white p-8">
          <div className="h-[70vh] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-lg font-semibold text-slate-900">No data available</h1>
              <p className="mt-1 text-sm text-slate-600">Upload your datasets in the Overview to generate findings.</p>
              <Link href="/dashboard" className="inline-flex mt-4 h-9 items-center rounded-md bg-blue-600 px-4 text-white hover:bg-blue-700">Go to Overview</Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  const findings = [
    {
      type: "primary",
      icon: TrendingDown,
      title: "Weak Negative Correlation",
      description: `Pearson correlation coefficient of ${processed?.correlationR?.toFixed(3) || 'N/A'} between social protection expenditure and labour force participation`,
      significance: processed?.ols?.rSquared ? `R² = ${processed.ols.rSquared.toFixed(3)}` : "Statistical Analysis",
      color: "red"
    },
    {
      type: "insight",
      icon: Lightbulb,
      title: "Policy Implications",
      description: "Current social protection design may inadvertently reduce work incentives, requiring policy refinement",
      significance: "High Impact",
      color: "amber"
    },
    {
      type: "limitation",
      icon: AlertCircle,
      title: "Data Limitations",
      description: "Missing variables and currency comparability issues suggest need for expanded microdata analysis",
      significance: "Moderate",
      color: "slate"
    }
  ];

  const recommendations = [
    {
      title: "Conditional Cash Transfers",
      description: "Implement work-linked social protection programs to maintain incentives for labour market participation.",
      priority: "High"
    },
    {
      title: "Microdata Analysis",
      description: "Conduct individual-level analysis to understand demographic-specific impacts of social protection.",
      priority: "Medium"
    },
    {
      title: "Causal Inference",
      description: "Apply instrumental variables or difference-in-differences methods to establish causality.",
      priority: "High"
    }
  ];

  return (
    <DashboardLayout>
      <div className="min-h-full bg-gradient-to-br from-slate-50 to-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-900">Key Findings</h1>
            <p className="mt-2 text-slate-600">Research insights and policy recommendations</p>
          </div>

          {/* Key Findings */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {findings.map((finding, index) => {
              const Icon = finding.icon;
              const colorClasses = {
                red: "bg-red-100 text-red-600 border-red-200",
                amber: "bg-amber-100 text-amber-600 border-amber-200",
                slate: "bg-slate-100 text-slate-600 border-slate-200"
              };
              
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[finding.color as keyof typeof colorClasses]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{finding.title}</h3>
                  <p className="text-slate-600 mb-4">{finding.description}</p>
                  <div className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded">
                    {finding.significance}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
            <div className="flex items-center mb-6">
              <Target className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-slate-900">Policy Recommendations</h2>
            </div>
            
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-6 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-slate-900">{rec.title}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      rec.priority === 'High' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-slate-600">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Research Context */}
          <div className="mt-8 grid lg:grid-cols-2 gap-8">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Research Context</h3>
              <div className="text-sm text-slate-700 space-y-3">
                <p><strong>Research Question:</strong> Do year-to-year movements in Social Protection (COFOG 710) expenditure co-vary with Labour Force Participation Rate (%) for South Africa?</p>
                
                <p><strong>Data Sources:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Social Protection: World Bank / BOOST (COFOG 710)</li>
                  <li>Labour Participation: World Bank / ILO estimates</li>
                </ul>

                <p><strong>Policy Relevance:</strong> Critical for South Africa given high unemployment and low labour absorption rates. Helps design interventions balancing income support with work incentives.</p>
              </div>
            </div>

            <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">Limitations & Next Steps</h3>
              <div className="text-sm text-amber-800 space-y-3">
                <p><strong>Current Limitations:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Correlation ≠ Causation</li>
                  <li>Missing controls (GDP, unemployment, education)</li>
                  <li>National currency comparability issues</li>
                </ul>

                <p><strong>Recommended Research:</strong> Apply causal inference methods (IV, DiD), expand to microdata analysis, include control variables for comprehensive policy evaluation.</p>
              </div>
            </div>
          </div>

          {/* Auto Summary */}
          {processed && (
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Detailed Analysis Summary</h3>
              <pre className="whitespace-pre-wrap text-sm text-blue-900">{generateMarkdownSummary(processed)}</pre>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
