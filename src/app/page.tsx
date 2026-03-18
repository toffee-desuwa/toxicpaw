"use client";

import { useState, useCallback } from "react";
import { Scanner } from "@/components/scanner";

export default function Home() {
  const [scanning, setScanning] = useState(false);
  const [confirmedImage, setConfirmedImage] = useState<string | null>(null);

  const handleStartScan = useCallback(() => {
    setScanning(true);
    setConfirmedImage(null);
  }, []);

  const handleImageConfirmed = useCallback((imageDataUrl: string) => {
    setConfirmedImage(imageDataUrl);
    setScanning(false);
  }, []);

  // Image confirmed — placeholder for OCR step (F004)
  if (confirmedImage) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h2 className="text-xl font-semibold text-neutral-200">
            Image captured!
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            OCR analysis coming soon...
          </p>
          <img
            src={confirmedImage}
            alt="Captured label"
            className="mt-4 w-full rounded-2xl"
          />
          <button
            type="button"
            onClick={handleStartScan}
            className="mt-6 rounded-full bg-neutral-700 px-8 py-3 font-medium text-white transition-colors hover:bg-neutral-600 active:scale-95"
          >
            Scan Another
          </button>
        </div>
      </main>
    );
  }

  // Scanning mode
  if (scanning) {
    return (
      <main className="flex min-h-dvh flex-col px-4 pt-12 pb-8">
        <div className="mx-auto w-full max-w-md">
          <button
            type="button"
            onClick={() => setScanning(false)}
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
