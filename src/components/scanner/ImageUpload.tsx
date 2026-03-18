"use client";

import { useRef, useCallback } from "react";

interface ImageUploadProps {
  onImageSelected: (imageDataUrl: string) => void;
}

export function ImageUpload({ onImageSelected }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onImageSelected(reader.result);
        }
      };
      reader.readAsDataURL(file);
    },
    [onImageSelected]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex flex-col items-center rounded-2xl border-2 border-dashed border-neutral-600 p-8 transition-colors hover:border-neutral-400"
    >
      <input
        ref={inputRef}
        data-testid="file-input"
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <svg
        className="mb-3 h-10 w-10 text-neutral-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-full bg-neutral-700 px-6 py-3 font-medium text-white transition-colors hover:bg-neutral-600 active:scale-95"
      >
        Upload Photo
      </button>
      <p className="mt-2 text-sm text-neutral-500">
        or drag and drop an image here
      </p>
    </div>
  );
}
