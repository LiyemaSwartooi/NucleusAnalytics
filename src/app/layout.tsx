import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ConditionalHeader } from "@/components/conditional-header";
import { ConditionalFooter } from "@/components/conditional-footer";
import { DataProvider } from "@/context/data-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NDTA 631 • Nucleus Analytics — Social Protection & Labour Participation (South Africa)",
  description:
    "Group project for NDTA 631: Data Analysis & Visualization. Investigates whether social protection (COFOG 710) spending co-varies with labour force participation (ILO modeled estimates) for South Africa (2000–2023), including correlation and OLS analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-inter antialiased bg-white text-slate-900" suppressHydrationWarning>
        <DataProvider>
          <ConditionalHeader />
          <main>{children}</main>
          <ConditionalFooter />
          <Toaster />
        </DataProvider>
      </body>
    </html>
  );
}
