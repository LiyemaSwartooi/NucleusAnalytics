"use client";
import Link from "next/link";
import { ArrowRight, BarChart3, Database, PieChart, TrendingUp, Users, Target, Shield, Zap, CheckCircle, Globe, Award, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)]">
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white font-inter">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 bg-white border-b border-slate-100">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]" aria-hidden="true" />
        <div className="relative w-full px-6 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                <Database className="w-4 h-4 mr-2" />
                NDTA 631 • Nucleus Analytics
              </div>
              <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">
                Social Protection &{" "}
                <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Labour Force Participation
                </span>
              </h1>
              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                Group project for NDTA 631: Data Analysis & Visualization. We investigate whether movements in Social Protection (COFOG 710) expenditure co-vary with Labour Force Participation Rate (%) for South Africa (2000–2023) and peer economies, using Pearson correlation and OLS regression.
              </p>
              <div className="grid gap-3 pt-2">
                <div className="flex items-start space-x-3 group">
                  <div className="flex-shrink-0 w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-blue-100 transition-colors">
                    <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 text-sm">Interactive Data Visualization</h3>
                    <p className="text-slate-600 text-sm">Dynamic charts and correlation analysis tools</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group">
                  <div className="flex-shrink-0 w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-blue-100 transition-colors">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 text-sm">Evidence-Based Policy Insights</h3>
                    <p className="text-slate-600 text-sm">Statistical analysis supporting policy development</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <Button asChild size="default" className="text-sm px-6">
                  <Link href="/dashboard">
                    View Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="default" className="text-sm px-6">
                  <Link href="#problem">Explore Research</Link>
                </Button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-xl" />
                <div className="relative p-6 space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div>
                      <div className="text-xl font-bold text-blue-600">2000-2023</div>
                      <div className="text-xs text-slate-600">Data Coverage Period</div>
                    </div>
                    <Database className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">World Bank / ILO</div>
                      <div className="text-xs text-slate-600">BOOST (COFOG 710) • LFP (SL.TLF.CACT.ZS)</div>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Statistical Rigor</div>
                      <div className="text-xs text-slate-600">Pearson correlation, OLS, normalization</div>
                    </div>
                    <Target className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Policy Impact</div>
                      <div className="text-xs text-slate-600">Evidence-Based Recommendations</div>
                    </div>
                    <Award className="h-4 w-4 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section id="problem" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="w-full px-6 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200/60">
                <Target className="w-4 h-4 mr-2" />
                Problem Statement / Research Question
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-slate-900 leading-tight">
                Do movements in Social Protection (COFOG 710) expenditure co-vary with Labour Force Participation Rate (%) for South Africa?
              </h2>
              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                This matters for South Africa’s policy design given persistently high unemployment and low labour-market absorption. We evaluate the relationship using national expenditure and participation data over 2000–2023 and benchmark against peer economies.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="relative p-6 bg-white rounded-xl border border-slate-200">
                <div className="text-sm text-slate-700">
                  <p className="mb-2"><strong>Scope:</strong> South Africa (primary), with comparator context.</p>
                  <p className="mb-2"><strong>Methods:</strong> Cleaning, alignment by year/country, normalization (%GDP, per-capita), Pearson correlation, OLS.</p>
                  <p className=""><strong>Note:</strong> Correlation ≠ Causation; results are interpreted cautiously.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Datasets */}
      <section id="datasets" className="py-16 bg-white border-b border-slate-100">
        <div className="w-full px-6 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                <Database className="w-4 h-4 mr-2" />
                Social Protection — COFOG 710
              </div>
              <ul className="text-slate-700 text-sm space-y-2">
                <li>• Source: World Bank / BOOST (GFS COFOG 710)</li>
                <li>• Variables: REF_AREA, REF_AREA_LABEL, INDICATOR, TIME_PERIOD, OBS_VALUE</li>
                <li>• Unit: Local currency (national)</li>
                <li>• Coverage: Annual, 2000–2023 (varies)</li>
              </ul>
            </div>
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <Users className="w-4 h-4 mr-2" />
                Labour Force Participation (%)
              </div>
              <ul className="text-slate-700 text-sm space-y-2">
                <li>• Source: World Bank / ILO modeled estimates (SL.TLF.CACT.ZS)</li>
                <li>• Variables: REF_AREA, REF_AREA_LABEL, INDICATOR, TIME_PERIOD, OBS_VALUE</li>
                <li>• Unit: Percentage of ages 15+</li>
                <li>• Coverage: Annual, 1990–2023 (varies)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Overview */}
      <section id="methodology" className="py-16 bg-white border-b border-slate-100">
        <div className="w-full px-6 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                <Database className="w-4 h-4 mr-2" />
                Pipeline & Methods
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-slate-900 leading-tight">
                Data-Driven Policy Analysis Framework
              </h2>
              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                Load → Clean → Align → Normalize → Analyze → Visualize. We align South Africa’s social-protection expenditure with labour participation by year, then compute Pearson correlation and OLS. Optional normalization: %GDP and per-capita when auxiliary data are supplied.
              </p>
              <div className="grid gap-3 pt-2">
                <div className="flex items-start space-x-3 group">
                  <div className="flex-shrink-0 w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-blue-100 transition-colors">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 text-sm">Comprehensive Data Pipeline</h3>
                    <p className="text-slate-600 text-sm">Robust cleaning, schema normalization, and alignment by country/year</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group">
                  <div className="flex-shrink-0 w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-blue-100 transition-colors">
                    <Target className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 text-sm">Statistical Rigor</h3>
                    <p className="text-slate-600 text-sm">Pearson correlation, OLS regression, time-series analysis</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-xl" />
                <div className="relative p-6 space-y-4">
                  <div className="flex items-center justify-between py-2.5 border-b border-slate-200">
                    <span className="text-sm font-medium text-slate-600">Time Series Analysis</span>
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between py-2.5 border-b border-slate-200">
                    <span className="text-sm font-medium text-slate-600">Comparative Studies</span>
                    <Users className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex items-center justify-between py-2.5 border-b border-slate-200">
                    <span className="text-sm font-medium text-slate-600">Correlation Analysis</span>
                    <PieChart className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-sm font-medium text-slate-600">Policy Insights</span>
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Findings */}
      <section id="findings" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="w-full px-6 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-amber-500/5 rounded-xl" />
                <div className="relative p-6 space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div>
                      <div className="text-xl font-bold text-red-600">-0.22</div>
                      <div className="text-xs text-slate-600">Correlation Coefficient</div>
                    </div>
                    <TrendingUp className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">p &lt; 0.05</div>
                      <div className="text-xs text-slate-600">Statistical Significance</div>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">23 Years</div>
                      <div className="text-xs text-slate-600">Data Coverage Period</div>
                    </div>
                    <Database className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                <Award className="w-4 h-4 mr-2" />
                Research Findings
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-slate-900 leading-tight">
                Key Statistical Insights & Policy Implications
              </h2>
              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                A weak negative relationship is observed between social protection expenditure and labour participation. Social spending increased markedly post-2015 while participation remained relatively stable.
              </p>
              <div className="grid gap-3 pt-2">
                <div className="flex items-start space-x-3 group">
                  <div className="flex-shrink-0 w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-red-100 transition-colors">
                    <TrendingUp className="w-3.5 h-3.5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 text-sm">Weak Negative Correlation Identified</h3>
                    <p className="text-slate-600 text-sm">As spending rises, participation dips slightly on average</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group">
                  <div className="flex-shrink-0 w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-amber-100 transition-colors">
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 text-sm">Policy Design Considerations</h3>
                    <p className="text-slate-600 text-sm">Consider conditional transfers and active labour-market linkages</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="w-full px-6 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <Zap className="w-4 h-4 mr-2" />
                Platform Capabilities
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-slate-900 leading-tight">
                Advanced Analytics & Visualization Suite
              </h2>
              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                Comprehensive data analysis platform designed for researchers, policymakers, and analysts 
                working with complex socio-economic datasets and policy evaluation frameworks.
              </p>
              <div className="grid gap-3 pt-2">
                <div className="flex items-start space-x-3 group">
                  <div className="flex-shrink-0 w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-emerald-100 transition-colors">
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 text-sm">Interactive Data Visualization</h3>
                    <p className="text-slate-600 text-sm">Dynamic charts, time-series analysis, and correlation mapping tools</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group">
                  <div className="flex-shrink-0 w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-emerald-100 transition-colors">
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 text-sm">Multi-Format Data Processing</h3>
                    <p className="text-slate-600 text-sm">Support for CSV, Excel, and World Bank API data integration</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-xl" />
                <div className="relative p-6 space-y-4">
                  <div className="flex items-center justify-between py-2.5 border-b border-slate-200">
                    <span className="text-sm font-medium text-slate-600">Real-time Processing</span>
                    <Zap className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex items-center justify-between py-2.5 border-b border-slate-200">
                    <span className="text-sm font-medium text-slate-600">Export & Sharing</span>
                    <Globe className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between py-2.5 border-b border-slate-200">
                    <span className="text-sm font-medium text-slate-600">Correlation Analysis</span>
                    <Target className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-sm font-medium text-slate-600">Statistical Testing</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations & Next Steps */}
      <section id="limitations" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="w-full px-6 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200/60">
                <AlertCircle className="w-4 h-4 mr-2" />
                Limitations & Next Steps
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-slate-900 leading-tight">Key Limitations</h2>
              <ul className="text-slate-700 text-sm space-y-2">
                <li>• Data gaps and missing years reduce robustness</li>
                <li>• National-currency comparability; consider %GDP/per-capita normalization</li>
                <li>• Omitted variables (GDP, unemployment, education) may bias results</li>
                <li>• Correlation does not imply causation</li>
              </ul>
            </div>
            <div className="lg:col-span-5">
              <div className="p-6 bg-white rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Recommendations</h3>
                <ul className="text-slate-700 text-sm space-y-2">
                  <li>• Link transfers to skills and employment (conditional cash transfers)</li>
                  <li>• Expand analysis with controls and causal methods (IV, DiD)</li>
                  <li>• Conduct microdata analysis to understand demographic heterogeneity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* References */}
      <section id="references" className="py-16 bg-white border-b border-slate-100">
        <div className="w-full px-6 lg:px-16">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">References</h2>
            <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
              <li>Kingdon, G. & Knight, J. (2007). Unemployment in South Africa, 1995–2003. Journal of African Economies, 16(5), 813–848. https://doi.org/10.1093/jae/ejm016</li>
              <li>Posel, D., Fairburn, J., Lund, F. (2006). Labour migration and households: social pension and labour supply. Economic Modelling, 23(5), 836–853. https://doi.org/10.1016/j.econmod.2005.10.010</li>
              <li>Ardington, C., Case, A., Hosegood, V. (2009). Labour supply responses to large social transfers. AEJ: Applied Economics, 1(1), 22–48. https://doi.org/10.1257/app.1.1.22</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="w-full px-6 lg:px-16 text-center">
          <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-4">
            Explore the Interactive Dashboard
          </h2>
          <p className="text-lg text-blue-100 mb-6 leading-relaxed">
            Dive deeper into the data with interactive visualizations, time-series charts, 
            and detailed correlation analysis.
          </p>
          <Button asChild size="default" variant="secondary" className="text-sm px-6">
            <Link href="/dashboard">
              Open Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
      </main>
    </div>
  );
}
