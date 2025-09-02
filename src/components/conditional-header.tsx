"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";

export function ConditionalHeader() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) {
    return null;
  }

  return <SiteHeader />;
}
