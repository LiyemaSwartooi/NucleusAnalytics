"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { ParsedDatasets, ProcessedData } from "@/lib/data-pipeline";

type DataContextValue = {
  hasData: boolean;
  uploadedFiles: Array<{ name: string; size: number }>;
  parsed?: ParsedDatasets;
  processed?: ProcessedData;
  setHasData: (v: boolean) => void;
  setUploadedFiles: (files: Array<{ name: string; size: number }>) => void;
  setParsed: (p?: ParsedDatasets) => void;
  setProcessed: (p?: ProcessedData) => void;
};

const DataContext = createContext<DataContextValue | undefined>(undefined);

const LS_KEY = "ndta_has_data";
const LS_FILES_KEY = "ndta_uploaded_files";
const LS_PROCESSED_KEY = "ndta_processed_summary";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [hasData, setHasDataState] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFilesState] = useState<Array<{ name: string; size: number }>>([]);
  const [parsed, setParsedState] = useState<ParsedDatasets | undefined>(undefined);
  const [processed, setProcessedState] = useState<ProcessedData | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(LS_KEY);
    const filesRaw = localStorage.getItem(LS_FILES_KEY);
    const processedRaw = localStorage.getItem(LS_PROCESSED_KEY);
    if (raw === "true") setHasDataState(true);
    if (filesRaw) {
      try {
        const parsed = JSON.parse(filesRaw);
        if (Array.isArray(parsed)) setUploadedFilesState(parsed);
      } catch {}
    }
    if (processedRaw) {
      try {
        const parsed = JSON.parse(processedRaw);
        setProcessedState(parsed);
        if (parsed?.timeSeries?.length) setHasDataState(true);
      } catch {}
    }
  }, []);

  const setHasData = (v: boolean) => {
    setHasDataState(v);
    if (typeof window !== "undefined") localStorage.setItem(LS_KEY, String(v));
  };

  const setUploadedFiles = (files: Array<{ name: string; size: number }>) => {
    setUploadedFilesState(files);
    if (typeof window !== "undefined") localStorage.setItem(LS_FILES_KEY, JSON.stringify(files));
  };

  const setParsed = (p?: ParsedDatasets) => setParsedState(p);
  const setProcessed = (p?: ProcessedData) => {
    setProcessedState(p);
    try {
      if (typeof window !== "undefined") {
        if (p) localStorage.setItem(LS_PROCESSED_KEY, JSON.stringify(p));
        else localStorage.removeItem(LS_PROCESSED_KEY);
      }
    } catch {}
  };

  const value = useMemo(
    () => ({ hasData, uploadedFiles, parsed, processed, setHasData, setUploadedFiles, setParsed, setProcessed }),
    [hasData, uploadedFiles, parsed, processed]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

