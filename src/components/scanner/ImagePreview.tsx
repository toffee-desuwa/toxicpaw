"use client";

interface ImagePreviewProps {
  src: string;
  onRetake: () => void;
  onConfirm: () => void;
}

export function ImagePreview({ src, onRetake, onConfirm }: ImagePreviewProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full overflow-hidden rounded-2xl bg-black">
        <img
          src={src}
          alt="Captured ingredient label"
          className="h-auto w-full object-contain"
        />
      </div>
      <div className="mt-4 flex w-full gap-3">
        <button
          type="button"
          onClick={onRetake}
          className="flex-1 rounded-full border-2 border-neutral-600 px-6 py-3 font-medium text-neutral-300 transition-colors hover:border-neutral-400 active:scale-95"
        >
          Retake
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 rounded-full bg-red-500 px-6 py-3 font-semibold text-white shadow-lg transition-transform active:scale-95"
        >
          Analyze
        </button>
      </div>
    </div>
  );
}
