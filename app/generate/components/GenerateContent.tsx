"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "./ImageUploader";
import { IngredientListEditor } from "./IngredientListEditor";
import { detectIngredientsAction } from "@/modules/ingredient-detection/actions/detectIngredientsAction";
import { generateRecipeAction } from "@/modules/recipe/actions/generateRecipeAction";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { RecipeDTO } from "@/modules/recipe/types";

type Step = "upload" | "review" | "generating" | "result";

export function GenerateContent() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<RecipeDTO | null>(null);

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
    <div className="w-full max-w-lg space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Generate Recipe</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload a photo of your ingredients to get started
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {step === "upload" && (
        <ImageUploader onImageSelected={handleImageSelected} loading={loading} />
      )}

      {step === "review" && (
        <div className="space-y-4">
          <IngredientListEditor
            ingredients={ingredients}
            onConfirm={handleConfirm}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleBack}
          >
            ← Upload different photo
          </Button>
        </div>
      )}

      {step === "generating" && (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <p className="text-sm text-muted-foreground">Generating your recipe…</p>
          </div>
          <div className="rounded-xl border p-5 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>
      )}

      {step === "result" && recipe && (
        <div className="space-y-6">
          <div className="rounded-xl border p-5 space-y-4">
            <h2 className="text-xl font-bold">{recipe.title}</h2>
            <p className="text-sm text-muted-foreground">{recipe.description}</p>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Ingredients
              </h3>
              <ul className="space-y-1">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium">{ing.name}</span>
                    <span className="text-muted-foreground">
                      {" "}— {ing.quantity} {ing.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Steps
              </h3>
              <ol className="space-y-2">
                {recipe.steps.map((s) => (
                  <li key={s.stepNumber} className="flex gap-2 text-sm">
                    <span className="font-semibold shrink-0">{s.stepNumber}.</span>
                    {s.instruction}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={() => router.push(`/recipes/${recipe.id}`)}
            >
              View Full Recipe
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleStartOver}>
              Start Over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
