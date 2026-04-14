"use client";

import { useState } from "react";
import { ImageUploader } from "./components/ImageUploader";
import { IngredientListEditor } from "./components/IngredientListEditor";
import { detectIngredientsAction } from "@/modules/ingredient-detection/actions/detectIngredientsAction";

type Step = "upload" | "review";

export default function GeneratePage() {
  const [step, setStep] = useState<Step>("upload");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImageSelected(file: File) {
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    const result = await detectIngredientsAction(formData);

    if (result.success) {
      setIngredients(result.data);
      setStep("review");
    } else {
      setError(result.error);
    }

    setLoading(false);
  }

  function handleConfirm(confirmedIngredients: string[]) {
    // Phase 4 will handle recipe generation here
    console.log("Confirmed ingredients:", confirmedIngredients);
  }

  function handleBack() {
    setStep("upload");
    setIngredients([]);
    setError(null);
  }

  return (
    <main className="flex min-h-full items-start justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Generate Recipe</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Upload a photo of your ingredients to get started
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {step === "upload" && (
          <ImageUploader
            onImageSelected={handleImageSelected}
            loading={loading}
          />
        )}

        {step === "review" && (
          <div className="space-y-4">
            <IngredientListEditor
              ingredients={ingredients}
              onConfirm={handleConfirm}
            />
            <button
              type="button"
              onClick={handleBack}
              className="w-full rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
            >
              ← Upload different photo
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
