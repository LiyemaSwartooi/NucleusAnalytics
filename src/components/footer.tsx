"use client";
import Link from "next/link";
import { Database, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="w-full px-6 lg:px-16 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand & Description */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-semibold">NDTA Analytics</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Advanced data analysis platform for social protection and labour market research, 
              supporting evidence-based policy development across South Africa and beyond.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="text-slate-300 hover:text-blue-400 transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/correlations" className="text-slate-300 hover:text-blue-400 transition-colors text-sm">
                  Correlations
                </Link>
              </li>
              <li>
                <Link href="/dashboard/scatter" className="text-slate-300 hover:text-blue-400 transition-colors text-sm">
                  Scatter Analysis
                </Link>
              </li>
              <li>
                <Link href="/dashboard/findings" className="text-slate-300 hover:text-blue-400 transition-colors text-sm">
                  Key Findings
                </Link>
              </li>
              <li>
                <Link href="/dashboard/exports" className="text-slate-300 hover:text-blue-400 transition-colors text-sm">
                  Data Exports
                </Link>
              </li>
            </ul>
          </div>

          {/* Research */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Research</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#problem" className="text-slate-300 hover:text-blue-400 transition-colors text-sm">
                  Problem Statement
                </Link>
              </li>
              <li>
                <Link href="/#datasets" className="text-slate-300 hover:text-blue-400 transition-colors text-sm">
                  Datasets
                </Link>
              </li>
              <li>
                <Link href="/#methodology" className="text-slate-300 hover:text-blue-400 transition-colors text-sm">
                  Pipeline & Methods
                </Link>
              </li>
              <li>
                <Link href="/#findings" className="text-slate-300 hover:text-blue-400 transition-colors text-sm">
                  Findings
                </Link>
              </li>
              <li>
                <Link href="/#limitations" className="text-slate-300 hover:text-blue-400 transition-colors text-sm">
                  Limitations & Recommendations
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact & Support</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-slate-300">Email</div>
                  <a href="mailto:contact@ndta-analytics.org" className="text-sm text-blue-400 hover:text-blue-300">
                    contact@ndta-analytics.org
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-slate-300">Phone</div>
                  <a href="tel:+27123456789" className="text-sm text-blue-400 hover:text-blue-300">
                    +27 12 345 6789
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-slate-300">Location</div>
                  <div className="text-sm text-slate-400">Cape Town, South Africa</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="w-full px-6 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-slate-400">
                © 2024 NDTA Analytics. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  Data Usage
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <span>Powered by</span>
              <span className="text-blue-400 font-medium">World Bank Data</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
