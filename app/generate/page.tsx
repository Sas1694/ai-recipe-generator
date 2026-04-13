"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "./components/ImageUploader";
import { IngredientListEditor } from "./components/IngredientListEditor";
import { detectIngredientsAction } from "@/modules/ingredient-detection/actions/detectIngredientsAction";
import { generateRecipeAction } from "@/modules/recipe/actions/generateRecipeAction";
import type { RecipeDTO } from "@/modules/recipe/types";

type Step = "upload" | "review" | "generating" | "result";

export default function GeneratePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<RecipeDTO | null>(null);

  async function handleImageSelected(imageBase64: string) {
    setError(null);
    setLoading(true);

    const result = await detectIngredientsAction(imageBase64);

    if (result.success) {
      setIngredients(result.data);
      setStep("review");
    } else {
      setError(result.error);
    }

    setLoading(false);
  }

  async function handleConfirm(confirmedIngredients: string[]) {
    setError(null);
    setStep("generating");

    const result = await generateRecipeAction(confirmedIngredients);

    if (result.success) {
      setRecipe(result.data);
      setStep("result");
    } else {
      setError(result.error);
      setStep("review");
    }
  }

  function handleBack() {
    setStep("upload");
    setIngredients([]);
    setError(null);
    setRecipe(null);
  }

  function handleStartOver() {
    setStep("upload");
    setIngredients([]);
    setError(null);
    setRecipe(null);
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

        {step === "generating" && (
          <div className="flex flex-col items-center space-y-4 py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground/20 border-t-foreground" />
            <p className="text-sm text-foreground/60">
              Generating your recipe...
            </p>
          </div>
        )}

        {step === "result" && recipe && (
          <div className="space-y-6">
            <div className="rounded-lg border border-foreground/10 p-5 space-y-4">
              <h2 className="text-xl font-bold">{recipe.title}</h2>
              <p className="text-sm text-foreground/70">{recipe.description}</p>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/50 mb-2">
                  Ingredients
                </h3>
                <ul className="space-y-1">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium">{ing.name}</span>
                      <span className="text-foreground/50">
                        {" "}
                        — {ing.quantity} {ing.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/50 mb-2">
                  Steps
                </h3>
                <ol className="space-y-2">
                  {recipe.steps.map((s) => (
                    <li key={s.stepNumber} className="text-sm">
                      <span className="font-medium mr-2">
                        {s.stepNumber}.
                      </span>
                      {s.instruction}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push(`/recipes/${recipe.id}`)}
                className="flex-1 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                View Full Recipe
              </button>
              <button
                type="button"
                onClick={handleStartOver}
                className="flex-1 rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
