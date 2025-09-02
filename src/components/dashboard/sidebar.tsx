"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Database, 
  TrendingUp, 
  FileText, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  PieChart,
  LineChart,
  Download
} from "lucide-react";
// import { Button } from "@/components/ui/button";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: <BarChart3 className="w-5 h-5" />,
    href: "/dashboard"
  },
  {
    id: "data-pipeline",
    label: "Data Pipeline",
    icon: <Database className="w-5 h-5" />,
    href: "/dashboard/pipeline"
  },
  {
    id: "time-series",
    label: "Time Series",
    icon: <LineChart className="w-5 h-5" />,
    href: "/dashboard/time-series"
  },
  {
    id: "correlations",
    label: "Correlations",
    icon: <TrendingUp className="w-5 h-5" />,
    href: "/dashboard/correlations"
  },
  {
    id: "scatter-plots",
    label: "Scatter Analysis",
    icon: <PieChart className="w-5 h-5" />,
    href: "/dashboard/scatter"
  },
  {
    id: "findings",
    label: "Key Findings",
    icon: <FileText className="w-5 h-5" />,
    href: "/dashboard/findings"
  },
  {
    id: "exports",
    label: "Data Exports",
    icon: <Download className="w-5 h-5" />,
    href: "/dashboard/exports"
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/dashboard/settings"
  }
];

export default function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900">NDTA Analytics</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 px-3 py-2 cursor-pointer rounded-md flex items-center justify-center"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1 flex-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
                         <Link
               key={item.id}
               href={item.href}
               className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer relative group ${
                 isActive
                   ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 cursor-pointer'
                   : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer'
               }`}
            >
              <div className={`transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
              }`}>
                {item.icon}
              </div>
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      isActive 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <div className="space-y-1">
          <Link
            href="/help"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer relative group ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            {!isCollapsed && <span>Help & Support</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Help & Support
              </div>
            )}
          </Link>
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer relative group w-full ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            {!isCollapsed && <span>Back to Home</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Back to Home
              </div>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
