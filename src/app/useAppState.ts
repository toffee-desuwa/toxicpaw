"use client";

import { useState, useCallback, useEffect } from "react";
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

export type AppState =
  | "idle"
  | "profile"
  | "scanning"
  | "analyzing"
  | "results"
  | "history"
  | "history-detail"
  | "comparing"
  | "error";

export function useAppState() {
  const [state, setState] = useState<AppState>("idle");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [petProfile, setPetProfile] = useState<PetProfile | null>(null);
  const [historyEntries, setHistoryEntries] = useState<ScanHistoryEntry[]>([]);
  const [savedToHistory, setSavedToHistory] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [comparisonPair, setComparisonPair] = useState<
    [ScanHistoryEntry, ScanHistoryEntry] | null
  >(null);
  const [selectedHistoryEntry, setSelectedHistoryEntry] =
    useState<ScanHistoryEntry | null>(null);

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

  const toggleCompareMode = useCallback(() => {
    setCompareMode((prev) => !prev);
  }, []);

  return {
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
  };
}
