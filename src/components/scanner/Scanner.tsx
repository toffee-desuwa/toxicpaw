"use client";

import { useState, useCallback } from "react";
import { CameraCapture } from "./CameraCapture";
import { ImageUpload } from "./ImageUpload";
import { ImagePreview } from "./ImagePreview";

type ScannerState = "capture" | "preview";

interface ScannerProps {
  onImageConfirmed: (imageDataUrl: string) => void;
}

export function Scanner({ onImageConfirmed }: ScannerProps) {
  const [state, setState] = useState<ScannerState>("capture");
  const [imageData, setImageData] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const hasCamera = typeof navigator !== "undefined" && !!navigator.mediaDevices;

  const handleImage = useCallback((dataUrl: string) => {
    setImageData(dataUrl);
    setState("preview");
  }, []);

  const handleCameraError = useCallback((message: string) => {
    setCameraError(message);
  }, []);

  const handleRetake = useCallback(() => {
    setImageData(null);
    setState("capture");
    setCameraError(null);
  }, []);

  const handleConfirm = useCallback(() => {
    if (imageData) {
      onImageConfirmed(imageData);
    }
  }, [imageData, onImageConfirmed]);

  if (state === "preview" && imageData) {
    return (
      <ImagePreview
        src={imageData}
        onRetake={handleRetake}
        onConfirm={handleConfirm}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {hasCamera && !cameraError && (
        <CameraCapture onCapture={handleImage} onError={handleCameraError} />
      )}
      {cameraError && (
        <p className="text-center text-sm text-amber-400">{cameraError}</p>
      )}
      <div className="relative">
        {hasCamera && !cameraError && (
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-700" />
            <span className="text-sm text-neutral-500">or</span>
            <div className="h-px flex-1 bg-neutral-700" />
          </div>
        )}
        <ImageUpload onImageSelected={handleImage} />
      </div>
    </div>
  );
}
