/**
 * F009 - Scan History and Comparison Types
 *
 * Pre-implementation thinking:
 * 1. What does this feature do? Store scan results in localStorage so users can view
 *    past scans and compare two foods side by side.
 * 2. Key design decisions:
 *    - Store full AnalysisResult per entry (needed for comparison)
 *    - No image storage (data URLs would bloat localStorage ~5MB limit)
 *    - Max 50 history entries to prevent localStorage overflow
 *    - Each entry gets a UUID and timestamp for identification
 * 3. What could go wrong? localStorage full, corrupt data, stale entries
 * 4. Simplest approach: array in localStorage, LIFO ordering, prune oldest on overflow
 * 5. Acceptance criteria: save/load/delete works, comparison shows two side by side
 */

import type { AnalysisResult } from "../analyzer/types";

/** A saved scan history entry */
export interface ScanHistoryEntry {
  /** Unique identifier */
  id: string;
  /** ISO timestamp of when the scan was performed */
  scannedAt: string;
  /** Optional user-provided name for the food */
  foodName: string;
  /** The full analysis result */
  result: AnalysisResult;
}

/** Comparison of two scan history entries */
export interface ComparisonPair {
  left: ScanHistoryEntry;
  right: ScanHistoryEntry;
}
