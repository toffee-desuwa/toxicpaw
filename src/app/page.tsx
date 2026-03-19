"use client";

import { Scanner } from "@/components/scanner";
import { AnalysisView } from "@/components/analysis";
import { PetProfileForm } from "@/components/profile";
import { HistoryList, ComparisonView } from "@/components/history";
import { LandingPage } from "@/components/landing";
import { useTranslation } from "@/lib/i18n";
import { useAppState } from "./useAppState";

export default function Home() {
  const {
    state,
    analysisResult,
    errorMessage,
    petProfile,
    historyEntries,
    savedToHistory,
    compareMode,
    comparisonPair,
    selectedHistoryEntry,
    handleStartScan,
    handleProfileSave,
    handleProfileSkip,
    handleReset,
    handleImageConfirmed,
    handleSaveToHistory,
    handleOpenHistory,
    handleHistorySelect,
    handleHistoryDelete,
    handleHistoryClear,
    handleCompare,
    toggleCompareMode,
  } = useAppState();

  const { t: tc } = useTranslation("common");
  const { t: ta } = useTranslation("analysis");
  const { t: th } = useTranslation("history");
  const { t: ts } = useTranslation("scanner");

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
            {tc("backToHistory")}
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
            {tc("back")}
          </button>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-100">
              {th("title")}
            </h2>
            {historyEntries.length >= 2 && (
              <button
                type="button"
                onClick={toggleCompareMode}
                className={`text-sm font-semibold transition-colors ${
                  compareMode ? "text-red-400" : "text-neutral-500 hover:text-neutral-200"
                }`}
                data-testid="compare-toggle"
              >
                {compareMode ? th("cancel") : th("compare")}
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
            {tc("back")}
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
            {ta("analyzing")}
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            {ta("analyzingSubtext")}
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
            {ta("scanFailed")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={handleStartScan}
            className="mt-8 rounded-full bg-red-500 px-10 py-3.5 font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-400 active:scale-[0.98]"
          >
            {ta("tryAgain")}
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
            {tc("back")}
          </button>
          <h2 className="mb-6 text-xl font-bold text-neutral-100">
            {ts("title")}
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
