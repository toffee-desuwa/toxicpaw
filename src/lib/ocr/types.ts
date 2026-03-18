/**
 * F004 - OCR Ingredient Extraction Types
 *
 * Design decisions:
 * 1. Keep OCR and parsing separate - OCR returns raw text, parser structures it
 * 2. Confidence threshold at 60% - below this, text is unreliable
 * 3. Support both English and Chinese ingredient lists
 */

/** Raw result from OCR engine */
export interface OcrResult {
  /** Full extracted text from the image */
  rawText: string;
  /** OCR confidence score 0-100 */
  confidence: number;
  /** Detected language hint */
  language: 'eng' | 'chi' | 'mixed' | 'unknown';
}

/** A single parsed ingredient from the ingredient list */
export interface ParsedIngredient {
  /** Original text as it appeared on the label */
  original: string;
  /** Cleaned/normalized name for matching against knowledge base */
  normalized: string;
  /** Position in the ingredient list (0-based, first = most abundant) */
  position: number;
}

/** Result of the full OCR + parsing pipeline */
export interface ExtractionResult {
  /** Whether extraction succeeded */
  success: boolean;
  /** Parsed ingredient list, ordered by position on label */
  ingredients: ParsedIngredient[];
  /** Raw OCR text for debugging */
  rawText: string;
  /** OCR confidence 0-100 */
  confidence: number;
  /** Error message if extraction failed */
  error?: string;
}
