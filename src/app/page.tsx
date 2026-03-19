"use client";

import { useState, useCallback, useEffect } from "react";
import { Scanner } from "@/components/scanner";
import { AnalysisView } from "@/components/analysis";
import { PetProfileForm } from "@/components/profile";
import { HistoryList, ComparisonView } from "@/components/history";
import { LandingPage } from "@/components/landing";
import { extractIngredients } from "@/lib/ocr";
import { analyzeIngredients } from "@/lib/analyzer";
import { saveProfile, loadProfile } from "@/lib/profile";
import {
  loadHistory,
  saveToHistory,
  deleteFromHistory,
  clearHistory,
} from "@/lib/history";
import type { AnalysisResult } from "@/lib/analyzer/types";
import type { PetProfile } from "@/lib/profile/types";
import type { ScanHistoryEntry } from "@/lib/history/types";

type AppState =
  | "idle"
  | "profile"
  | "scanning"
  | "analyzing"
  | "results"
  | "history"
  | "history-detail"
  | "comparing"
  | "error";

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [petProfile, setPetProfile] = useState<PetProfile | null>(null);
  const [historyEntries, setHistoryEntries] = useState<ScanHistoryEntry[]>([]);
  const [savedToHistory, setSavedToHistory] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [comparisonPair, setComparisonPair] = useState<
    [ScanHistoryEntry, ScanHistoryEntry] | null
  >(null);
  const [selectedHistoryEntry, setSelectedHistoryEntry] =
    useState<ScanHistoryEntry | null>(null);

  // Load saved profile on mount
  useEffect(() => {
    const saved = loadProfile();
    if (saved) setPetProfile(saved);
  }, []);

  const refreshHistory = useCallback(() => {
    setHistoryEntries(loadHistory());
  }, []);

  const handleStartScan = useCallback(() => {
    setState("profile");
    setAnalysisResult(null);
    setErrorMessage("");
    setSavedToHistory(false);
  }, []);

  const handleProfileSave = useCallback((profile: PetProfile) => {
    setPetProfile(profile);
    saveProfile(profile);
    setState("scanning");
  }, []);

  const handleProfileSkip = useCallback(() => {
    setState("scanning");
  }, []);

  const handleReset = useCallback(() => {
    setState("idle");
    setAnalysisResult(null);
    setErrorMessage("");
    setSavedToHistory(false);
    setCompareMode(false);
    setComparisonPair(null);
    setSelectedHistoryEntry(null);
  }, []);

  const handleImageConfirmed = useCallback(async (imageDataUrl: string) => {
    setState("analyzing");

    const extraction = await extractIngredients(imageDataUrl);

    if (!extraction.success) {
      setErrorMessage(extraction.error ?? "Failed to extract ingredients.");
      setState("error");
      return;
    }

    const result = analyzeIngredients(
      extraction.ingredients,
      petProfile ?? undefined
    );
    setAnalysisResult(result);
    setState("results");
  }, [petProfile]);

  const handleSaveToHistory = useCallback(
    (foodName: string) => {
      if (!analysisResult) return;
      saveToHistory(analysisResult, foodName);
      setSavedToHistory(true);
    },
    [analysisResult]
  );

  const handleOpenHistory = useCallback(() => {
    refreshHistory();
    setState("history");
    setCompareMode(false);
    setComparisonPair(null);
  }, [refreshHistory]);

  const handleHistorySelect = useCallback((entry: ScanHistoryEntry) => {
    setSelectedHistoryEntry(entry);
    setAnalysisResult(entry.result);
    setState("history-detail");
  }, []);

  const handleHistoryDelete = useCallback(
    (id: string) => {
      deleteFromHistory(id);
      refreshHistory();
    },
    [refreshHistory]
  );

  const handleHistoryClear = useCallback(() => {
    clearHistory();
    refreshHistory();
  }, [refreshHistory]);

  const handleCompare = useCallback(
    (pair: [ScanHistoryEntry, ScanHistoryEntry]) => {
      setComparisonPair(pair);
      setState("comparing");
    },
    []
  );

  // Comparison view
  if (state === "comparing" && comparisonPair) {
    return (
      <main className="min-h-dvh">
        <ComparisonView
          left={comparisonPair[0]}
          right={comparisonPair[1]}
          onClose={handleOpenHistory}
        />
      </main>
    );
  }

  // History detail (viewing a past scan)
  if (state === "history-detail" && analysisResult) {
    return (
      <main className="min-h-dvh">
        <div className="mx-auto max-w-md px-4 pt-10">
          <button
            type="button"
            onClick={handleOpenHistory}
            className="mb-4 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-200"
          >
            &larr; Back to History
          </button>
          {selectedHistoryEntry?.foodName && (
            <h2 className="mb-4 text-xl font-bold text-neutral-100">
              {selectedHistoryEntry.foodName}
            </h2>
          )}
        </div>
        <AnalysisView result={analysisResult} onScanAnother={handleReset} saved />
      </main>
    );
  }

  // Results view
  if (state === "results" && analysisResult) {
    return (
      <main className="min-h-dvh">
        <AnalysisView
          result={analysisResult}
          onScanAnother={handleReset}
          onSaveToHistory={handleSaveToHistory}
          saved={savedToHistory}
        />
      </main>
    );
  }

  // History view
  if (state === "history") {
    return (
      <main className="flex min-h-dvh flex-col px-4 pt-12 pb-8">
        <div className="mx-auto w-full max-w-md">
          <button
            type="button"
            onClick={handleReset}
            className="mb-6 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-200"
          >
            &larr; Back
          </button>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-100">
              Scan History
            </h2>
            {historyEntries.length >= 2 && (
              <button
                type="button"
                onClick={() => setCompareMode((prev) => !prev)}
                className={`text-sm font-semibold transition-colors ${
                  compareMode ? "text-red-400" : "text-neutral-500 hover:text-neutral-200"
                }`}
                data-testid="compare-toggle"
              >
                {compareMode ? "Cancel" : "Compare"}
              </button>
            )}
          </div>
          <HistoryList
            entries={historyEntries}
            onSelect={handleHistorySelect}
            onDelete={handleHistoryDelete}
            onClear={handleHistoryClear}
            compareMode={compareMode}
            onCompare={handleCompare}
          />
        </div>
      </main>
    );
  }

  // Profile step
  if (state === "profile") {
    return (
      <main className="flex min-h-dvh flex-col px-4 pt-12 pb-8">
        <div className="mx-auto w-full max-w-md">
          <button
            type="button"
            onClick={handleReset}
            className="mb-6 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-200"
          >
            &larr; Back
          </button>
          <PetProfileForm
            onSave={handleProfileSave}
            onSkip={handleProfileSkip}
            initialProfile={petProfile ?? undefined}
          />
        </div>
      </main>
    );
  }

  // Analyzing spinner
  if (state === "analyzing") {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center px-4">
        <div className="text-center">
          <div
            className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-neutral-800 border-t-red-500"
            role="status"
            aria-label="Analyzing"
          />
          <p className="mt-6 text-xl font-bold text-neutral-100">
            Analyzing ingredients…
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Reading label and grading safety
          </p>
        </div>
      </main>
    );
  }

  // Error state
  if (state === "error") {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <p className="text-5xl">⚠️</p>
          <h2 className="mt-5 text-2xl font-bold text-neutral-100">
            Scan Failed
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={handleStartScan}
            className="mt-8 rounded-full bg-red-500 px-10 py-3.5 font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-400 active:scale-[0.98]"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // Scanning mode
  if (state === "scanning") {
    return (
      <main className="flex min-h-dvh flex-col px-4 pt-12 pb-8">
        <div className="mx-auto w-full max-w-md">
          <button
            type="button"
            onClick={handleReset}
            className="mb-6 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-200"
          >
            &larr; Back
          </button>
          <h2 className="mb-6 text-xl font-bold text-neutral-100">
            Scan Ingredient Label
          </h2>
          <Scanner onImageConfirmed={handleImageConfirmed} />
        </div>
      </main>
    );
  }

  // Landing / idle state
  return (
    <main className="min-h-dvh">
      <LandingPage onStartScan={handleStartScan} onViewHistory={handleOpenHistory} />
    </main>
  );
}
