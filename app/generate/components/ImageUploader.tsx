"use client";

import { useState, useRef } from "react";
import { MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB, SUPPORTED_FORMATS_LABEL, SUPPORTED_MIME_TYPES } from "@/shared/config/limits";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  loading: boolean;
}

export function ImageUploader({ onImageSelected, loading }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
      setError(`Unsupported image format. Use ${SUPPORTED_FORMATS_LABEL}.`);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError(`Image must be under ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onImageSelected(file);
  }

  function handleReset() {
    setPreview(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Upload ingredient photo</h2>
        <p className="mt-1 text-sm text-foreground/60">
          Take a photo of your fridge, pantry, or ingredients
        </p>
      </div>

      {preview ? (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-lg border border-foreground/20">
            <img
              src={preview}
              alt="Ingredient preview"
              className="h-64 w-full object-cover"
            />
          </div>
          {!loading && (
            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
            >
              Choose another photo
            </button>
          )}
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-foreground/20 p-8 transition-colors hover:border-foreground/40">
          <svg
            className="mb-3 h-10 w-10 text-foreground/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <span className="text-sm font-medium">Click to upload an image</span>
          <span className="mt-1 text-xs text-foreground/60">{`${SUPPORTED_FORMATS_LABEL} up to ${MAX_IMAGE_SIZE_MB}MB`}</span>
          {error && (
            <span className="mt-2 text-xs text-red-500">{error}</span>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={SUPPORTED_MIME_TYPES.join(",")}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-foreground/60">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Detecting ingredients...
        </div>
      )}
    </div>
  );
}
