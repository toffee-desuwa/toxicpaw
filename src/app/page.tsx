"use client";

import { useState, useCallback } from "react";
import { Scanner } from "@/components/scanner";
import { AnalysisView } from "@/components/analysis";
import { extractIngredients } from "@/lib/ocr";
import { analyzeIngredients } from "@/lib/analyzer";
import type { AnalysisResult } from "@/lib/analyzer/types";

type AppState = "idle" | "scanning" | "analyzing" | "results" | "error";

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleStartScan = useCallback(() => {
    setState("scanning");
    setAnalysisResult(null);
    setErrorMessage("");
  }, []);

  const handleReset = useCallback(() => {
    setState("idle");
    setAnalysisResult(null);
    setErrorMessage("");
  }, []);

  const handleImageConfirmed = useCallback(async (imageDataUrl: string) => {
    setState("analyzing");

    const extraction = await extractIngredients(imageDataUrl);

    if (!extraction.success) {
      setErrorMessage(extraction.error ?? "Failed to extract ingredients.");
      setState("error");
      return;
    }

    const result = analyzeIngredients(extraction.ingredients);
    setAnalysisResult(result);
    setState("results");
  }, []);

  // Results view
  if (state === "results" && analysisResult) {
    return (
      <main className="min-h-dvh">
        <AnalysisView result={analysisResult} onScanAnother={handleReset} />
      </main>
    );
  }

  // Analyzing spinner
  if (state === "analyzing") {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center px-4">
        <div className="text-center">
          <div
            className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-neutral-700 border-t-red-500"
            role="status"
            aria-label="Analyzing"
          />
          <p className="mt-4 text-lg text-neutral-300">Analyzing ingredients…</p>
          <p className="mt-1 text-sm text-neutral-500">
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
          <p className="text-4xl">⚠️</p>
          <h2 className="mt-4 text-xl font-semibold text-neutral-200">
            Scan Failed
          </h2>
          <p className="mt-2 text-sm text-neutral-400">{errorMessage}</p>
          <button
            type="button"
            onClick={handleStartScan}
            className="mt-6 rounded-full bg-red-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-red-400 active:scale-95"
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
            className="mb-6 text-sm text-neutral-400 hover:text-neutral-200"
          >
            &larr; Back
          </button>
          <h2 className="mb-6 text-xl font-semibold text-neutral-200">
            Scan Ingredient Label
          </h2>
          <Scanner onImageConfirmed={handleImageConfirmed} />
        </div>
      </main>
    );
  }

  // Landing / idle state
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          🐾 Toxic<span className="text-red-500">Paw</span>
        </h1>
        <p className="mt-3 text-lg text-neutral-400">
          Scan your pet food label. Get an instant safety grade.
        </p>
        <button
          onClick={handleStartScan}
          className="mt-8 rounded-full bg-red-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-transform active:scale-95"
          type="button"
        >
          Scan Label
        </button>
      </div>
    </main>
  );
}
