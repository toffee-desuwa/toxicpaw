export {
  loadHistory,
  saveToHistory,
  deleteFromHistory,
  clearHistory,
  getHistoryEntry,
  HISTORY_STORAGE_KEY,
  MAX_HISTORY_ENTRIES,
} from "./storage";
export type { ScanHistoryEntry, ComparisonPair } from "./types";
