"use client";

import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";
import {
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGE_SIZE_MB,
  SUPPORTED_FORMATS_LABEL,
  SUPPORTED_MIME_TYPES,
} from "@/shared/config/limits";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  loading: boolean;
}

export function ImageUploader({ onImageSelected, loading }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function processFile(file: File) {
    setError(null);
    if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
      setError(`Unsupported format. Use ${SUPPORTED_FORMATS_LABEL}.`);
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError(`Image must be under ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    if (!objectUrl.startsWith("blob:")) return;
    setPreview(objectUrl);
    onImageSelected(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleReset() {
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 shadow-sm">
            <img
              src={preview}
              alt="Ingredient preview"
              className="h-64 w-full object-cover"
            />
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-orange-500" />
                <p className="text-xs font-medium text-zinc-600">
                  Detecting ingredients…
                </p>
              </div>
            )}
          </div>
          {!loading && (
            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-800"
            >
              Choose a different photo
            </button>
          )}
        </div>
      ) : (
        <label
          className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 transition-all duration-200 ${
            isDragging
              ? "border-orange-400 bg-orange-50"
              : "border-zinc-200 bg-white hover:border-orange-300 hover:bg-orange-50/40"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
              isDragging ? "bg-orange-100" : "bg-zinc-100"
            }`}
          >
            <UploadCloud
              className={`h-7 w-7 transition-colors ${
                isDragging ? "text-orange-500" : "text-zinc-400"
              }`}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-zinc-700">
              Drop a photo here, or{" "}
              <span className="text-orange-500">browse</span>
            </p>
            <p className="mt-1 text-xs text-zinc-400">{`${SUPPORTED_FORMATS_LABEL} · max ${MAX_IMAGE_SIZE_MB}MB`}</p>
          </div>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-600">
              {error}
            </p>
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
    </div>
  );
}
