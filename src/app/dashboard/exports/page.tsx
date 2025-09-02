"use client";
import DashboardLayout from "@/components/dashboard/layout";
import { useData } from "@/context/data-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { exportToCSV, generateMarkdownSummary, exportText } from "@/lib/data-pipeline";

export default function ExportsPage() {
  const { hasData, processed } = useData();

  if (!hasData) {
    return (
      <DashboardLayout>
        <div className="min-h-full bg-gradient-to-br from-slate-50 to-white p-8">
          <div className="h-[70vh] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-lg font-semibold text-slate-900">No data available</h1>
              <p className="mt-1 text-sm text-slate-600">Upload your datasets in the Overview to export visualizations and results.</p>
              <Link href="/dashboard" className="inline-flex mt-4 h-9 items-center rounded-md bg-blue-600 px-4 text-white hover:bg-blue-700">Go to Overview</Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleExportMerged = () => {
    if (!processed?.timeSeries?.length) return;
    const rows = processed.timeSeries.map(r => ({
      country: processed.country,
      year: r.year,
      social: r.social,
      labour: r.labour,
    }));
    exportToCSV("merged_timeseries.csv", rows);
  };
  const handleExportSummary = () => {
    if (!processed) return;
    exportText("analysis_summary.md", generateMarkdownSummary(processed));
  };

  const exportChartAsPNG = async (elementId: string, filename: string) => {
    const node = document.getElementById(elementId);
    if (!node) return;
    const dataUrl = await htmlToImage.toPng(node as HTMLElement);
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  return (
    <DashboardLayout>
      <div className="min-h-full bg-gradient-to-br from-slate-50 to-white p-8">
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl p-6">
          <h1 className="text-2xl font-semibold text-slate-900">Data Exports</h1>
          <p className="mt-2 text-slate-600">Download figures and processed data for your report.</p>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <Button onClick={() => exportChartAsPNG('ts-chart', 'time_series.png')} variant="outline" className="justify-start"><Download className="h-4 w-4 mr-2" /> Export time series (PNG)</Button>
            <Button onClick={() => exportChartAsPNG('scatter-chart', 'scatter.png')} variant="outline" className="justify-start"><Download className="h-4 w-4 mr-2" /> Export scatter (PNG)</Button>
            <Button onClick={handleExportMerged} variant="outline" className="justify-start"><Download className="h-4 w-4 mr-2" /> Export merged data (CSV)</Button>
            <Button onClick={handleExportSummary} variant="outline" className="justify-start"><Download className="h-4 w-4 mr-2" /> Export analysis summary (MD)</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

