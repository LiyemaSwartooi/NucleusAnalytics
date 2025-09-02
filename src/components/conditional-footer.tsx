"use client";
import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Don't show footer on dashboard pages
  if (pathname.startsWith("/dashboard")) {
    return null;
  }
  
  return <Footer />;
}
