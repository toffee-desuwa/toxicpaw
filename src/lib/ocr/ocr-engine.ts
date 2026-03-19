/**
 * OCR Engine - wraps Tesseract.js for ingredient label text extraction.
 *
 * Uses client-side Tesseract.js with eng+chi_sim languages for bilingual support.
 * The worker is created on-demand and reused for performance.
 */

import type { OcrResult } from './types';
import { detectLanguage } from './parser';

/** Minimum confidence threshold (0-100) to consider OCR successful */
const MIN_CONFIDENCE = 60;

/**
 * Extract text from an image using Tesseract.js OCR.
 *
 * @param imageDataUrl - Base64 data URL of the image (from camera/upload)
 * @returns OcrResult with raw text, confidence, and language
 */
export async function recognizeText(imageDataUrl: string): Promise<OcrResult> {
  const Tesseract = (await import('tesseract.js')).default;
  const result = await Tesseract.recognize(imageDataUrl, 'eng+chi_sim', {
    logger: () => {}, // suppress logs
  });

  const rawText = result.data.text.trim();
  const confidence = Math.round(result.data.confidence);
  const language = detectLanguage(rawText);

  return {
    rawText,
    confidence,
    language,
  };
}

/**
 * Check if OCR result meets minimum quality threshold.
 */
export function isConfident(result: OcrResult): boolean {
  return result.confidence >= MIN_CONFIDENCE && result.rawText.length > 0;
}

export { MIN_CONFIDENCE };
