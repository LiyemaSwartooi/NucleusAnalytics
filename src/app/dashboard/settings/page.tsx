"use client";
import DashboardLayout from "@/components/dashboard/layout";
import { useData } from "@/context/data-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { hasData } = useData();

  if (!hasData) {
    return (
      <DashboardLayout>
        <div className="min-h-full bg-gradient-to-br from-slate-50 to-white p-8">
          <div className="h-[70vh] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-lg font-semibold text-slate-900">No data available</h1>
              <p className="mt-1 text-sm text-slate-600">Upload your datasets in the Overview to access settings.</p>
              <Link href="/dashboard" className="inline-flex mt-4 h-9 items-center rounded-md bg-blue-600 px-4 text-white hover:bg-blue-700">Go to Overview</Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-full bg-gradient-to-br from-slate-50 to-white p-8">
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl p-6">
          <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
          <p className="mt-2 text-slate-600">Configure visualization preferences and defaults.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-900">Theme</label>
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm">Light</Button>
                <Button variant="outline" size="sm">Dark</Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-900">Chart density</label>
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm">Comfortable</Button>
                <Button variant="outline" size="sm">Compact</Button>
              </div>
            </div>
            {!hasData && (
              <div className="mt-4 text-sm text-slate-600">
                Upload data in the Overview to enable data-specific settings.
                <Link href="/dashboard" className="ml-2 underline">Go to Overview</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

