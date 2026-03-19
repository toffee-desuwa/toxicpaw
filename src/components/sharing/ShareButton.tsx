/**
 * F010 - Share Button (i18n F019)
 *
 * Generates an image from the ShareCard DOM element via html2canvas,
 * then shares via Web Share API (mobile) or downloads the image (fallback).
 */

"use client";

import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import type { AnalysisResult } from "@/lib/analyzer/types";
import { useTranslation } from "@/lib/i18n";
import { ShareCard } from "./ShareCard";

interface ShareButtonProps {
  result: AnalysisResult;
  foodName?: string;
}

async function captureCardAsBlob(element: HTMLElement): Promise<Blob> {
  const canvas = await html2canvas(element, {
    backgroundColor: "#171717", // neutral-900
    scale: 2, // retina quality
    useCORS: true,
    logging: false,
  });

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate image"));
      },
      "image/png",
      1.0,
    );
  });
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ShareButton({ result, foodName }: ShareButtonProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const { t } = useTranslation("sharing");

  const handleShare = useCallback(async () => {
    if (!cardRef.current || sharing) return;

    setSharing(true);
    try {
      const blob = await captureCardAsBlob(cardRef.current);
      const file = new File([blob], "toxicpaw-result.png", {
        type: "image/png",
      });

      const shareText = `${foodName ? foodName + ": " : ""}Grade ${result.grade} (${result.score}/100) - ${result.verdict}`;

      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          title: t("shareTitle"),
          text: shareText,
          files: [file],
        });
      } else {
        downloadBlob(blob, "toxicpaw-result.png");
      }

      setShared(true);
      setTimeout(() => setShared(false), 3000);
    } catch (err) {
      // User cancelled share or error — silently handle
      if (err instanceof Error && err.name !== "AbortError") {
        // Fallback: try download if share failed
        try {
          if (cardRef.current) {
            const blob = await captureCardAsBlob(cardRef.current);
            downloadBlob(blob, "toxicpaw-result.png");
            setShared(true);
            setTimeout(() => setShared(false), 3000);
          }
        } catch {
          // Give up silently
        }
      }
    } finally {
      setSharing(false);
    }
  }, [sharing, result, foodName, t]);

  return (
    <>
      {/* Hidden card for capture */}
      <div
        style={{ position: "absolute", left: "-9999px", top: 0 }}
        aria-hidden="true"
      >
        <ShareCard ref={cardRef} result={result} foodName={foodName} />
      </div>

      {/* Share button */}
      <button
        type="button"
        onClick={handleShare}
        disabled={sharing}
        className="w-full rounded-full bg-red-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-red-400 active:scale-95 disabled:opacity-50"
        data-testid="share-button"
      >
        {sharing ? t("generating") : shared ? t("shared") : t("shareResult")}
      </button>
    </>
  );
}
