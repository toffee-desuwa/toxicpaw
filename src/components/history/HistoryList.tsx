/**
 * F009 - Scan History List Component
 *
 * Displays a scrollable list of past scans with grade badges and timestamps.
 * Supports selection for comparison mode and deletion of entries.
 */

"use client";

import { useState } from "react";
import type { ScanHistoryEntry } from "@/lib/history/types";
import type { Grade } from "@/lib/analyzer/types";

const GRADE_COLORS: Record<Grade, string> = {
  A: "bg-emerald-500",
  B: "bg-lime-500",
  C: "bg-amber-500",
  D: "bg-orange-500",
  F: "bg-red-600",
};

interface HistoryListProps {
  entries: ScanHistoryEntry[];
  onSelect: (entry: ScanHistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  /** When in compare mode, track selected entries */
  compareMode?: boolean;
  onCompare?: (entries: [ScanHistoryEntry, ScanHistoryEntry]) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  const hours = d.getHours().toString().padStart(2, "0");
  const mins = d.getMinutes().toString().padStart(2, "0");
  return `${month}/${day} ${hours}:${mins}`;
}

export function HistoryList({
  entries,
  onSelect,
  onDelete,
  onClear,
  compareMode = false,
  onCompare,
}: HistoryListProps) {
  const [selected, setSelected] = useState<string[]>([]);

  function handleToggleSelect(entry: ScanHistoryEntry): void {
    if (!compareMode) {
      onSelect(entry);
      return;
    }

    setSelected((prev) => {
      const isSelected = prev.includes(entry.id);
      if (isSelected) {
        return prev.filter((id) => id !== entry.id);
      }
      const next = [...prev, entry.id];
      if (next.length === 2 && onCompare) {
        const pair = next.map(
          (id) => entries.find((e) => e.id === id)!
        ) as [ScanHistoryEntry, ScanHistoryEntry];
        onCompare(pair);
        return [];
      }
      return next;
    });
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12" data-testid="history-empty">
        <p className="text-3xl">📋</p>
        <p className="mt-3 text-neutral-400">No scans yet</p>
        <p className="mt-1 text-sm text-neutral-500">
          Scan a pet food label to see results here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3" data-testid="history-list">
      {compareMode && (
        <p className="text-sm text-neutral-400 text-center">
          Select 2 foods to compare ({selected.length}/2 selected)
        </p>
      )}

      {entries.map((entry) => {
        const isSelected = selected.includes(entry.id);
        return (
          <div
            key={entry.id}
            className={`flex items-center gap-3 rounded-xl bg-neutral-800/60 px-4 py-3 transition-colors ${
              isSelected ? "ring-2 ring-red-500" : ""
            }`}
            data-testid="history-entry"
          >
            <button
              type="button"
              onClick={() => handleToggleSelect(entry)}
              className="flex flex-1 items-center gap-3 text-left"
              data-testid="history-entry-button"
            >
              {/* Mini grade badge */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${GRADE_COLORS[entry.result.grade]} text-white font-bold text-lg`}
              >
                {entry.result.grade}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-neutral-200">
                  {entry.foodName || "Unnamed Food"}
                </p>
                <p className="text-xs text-neutral-500">
                  {formatDate(entry.scannedAt)} · Score: {entry.result.score}
                  /100
                </p>
              </div>
            </button>

            {!compareMode && (
              <button
                type="button"
                onClick={() => onDelete(entry.id)}
                className="shrink-0 p-2 text-neutral-500 hover:text-red-400"
                aria-label={`Delete ${entry.foodName || "scan"}`}
                data-testid="history-delete"
              >
                ✕
              </button>
            )}
          </div>
        );
      })}

      {entries.length > 0 && !compareMode && (
        <button
          type="button"
          onClick={onClear}
          className="mt-2 text-sm text-neutral-500 hover:text-red-400"
          data-testid="history-clear"
        >
          Clear All History
        </button>
      )}
    </div>
  );
}
