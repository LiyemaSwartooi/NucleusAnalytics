"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, Home, Menu } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900">NDTA Analytics</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
            <Link
              href="/#problem"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Problem
            </Link>
            <Link
              href="/#datasets"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Datasets
            </Link>
            <Link
              href="/#methodology"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Pipeline
            </Link>
            <Link
              href="/#findings"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Findings
            </Link>
            <Link
              href="/#limitations"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Limitations
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button asChild size="sm">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-2">
            <div className="flex flex-col space-y-1">
              <Link
                href="/"
                className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:text-slate-900 hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
              <Link
                href="/#problem"
                className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:text-slate-900 hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Problem
              </Link>
              <Link
                href="/#datasets"
                className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:text-slate-900 hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Datasets
              </Link>
              <Link
                href="/#methodology"
                className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:text-slate-900 hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pipeline
              </Link>
              <Link
                href="/#findings"
                className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:text-slate-900 hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Findings
              </Link>
              <Link
                href="/#limitations"
                className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:text-slate-900 hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Limitations
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:text-slate-900 hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

