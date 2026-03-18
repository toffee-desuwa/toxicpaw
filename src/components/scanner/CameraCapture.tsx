"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onError: (message: string) => void;
}

export function CameraCapture({ onCapture, onError }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsReady(true);
        }
      } catch (err) {
        if (cancelled) return;
        if (err instanceof DOMException) {
          if (err.name === "NotAllowedError") {
            onError("Camera access denied. Please allow camera permissions or upload an image.");
          } else if (err.name === "NotFoundError") {
            onError("No camera found on this device. Please upload an image instead.");
          } else {
            onError("Could not access camera. Please upload an image instead.");
          }
        } else {
          onError("Could not access camera. Please upload an image instead.");
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [onError]);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    onCapture(dataUrl);

    // Stop camera after capture
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, [onCapture]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-full overflow-hidden rounded-2xl bg-black">
        <video
          ref={videoRef}
          data-testid="camera-video"
          autoPlay
          playsInline
          muted
          className="h-auto w-full"
        />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
            Starting camera...
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleCapture}
        disabled={!isReady}
        className="mt-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-red-500 shadow-lg transition-transform active:scale-90 disabled:opacity-40"
        aria-label="Capture"
      >
        <div className="h-6 w-6 rounded-full bg-white" />
      </button>
    </div>
  );
}
