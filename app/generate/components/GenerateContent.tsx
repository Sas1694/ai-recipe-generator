"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "./ImageUploader";
import { IngredientListEditor } from "./IngredientListEditor";
import { detectIngredientsAction } from "@/modules/ingredient-detection/actions/detectIngredientsAction";
import { generateRecipeAction } from "@/modules/recipe/actions/generateRecipeAction";
import { ChefHat, CheckCircle2 } from "lucide-react";
import type { RecipeDTO } from "@/modules/recipe/types";

type Step = "upload" | "review" | "generating" | "result";

const STEPS: { key: Step; label: string }[] = [
  { key: "upload", label: "Upload" },
  { key: "review", label: "Review" },
  { key: "generating", label: "Generate" },
  { key: "result", label: "Done" },
];

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center justify-center gap-1">
      {STEPS.map((step, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={step.key} className="flex items-center gap-1">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                done
                  ? "bg-orange-500 text-white"
                  : active
                  ? "bg-orange-500/12 text-orange-600 ring-2 ring-orange-500/30"
                  : "bg-zinc-100 text-zinc-400"
              }`}
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`text-xs font-medium hidden sm:block ${
                active ? "text-zinc-800" : "text-zinc-400"
              }`}
            >
              {step.label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px w-5 sm:w-8 mx-0.5 ${
                  i < idx ? "bg-orange-400/60" : "bg-zinc-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

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
    <div className="w-full max-w-lg space-y-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Generate a Recipe
        </h1>
        <StepIndicator current={step} />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Upload */}
      {step === "upload" && (
        <ImageUploader onImageSelected={handleImageSelected} loading={loading} />
      )}

      {/* Review */}
      {step === "review" && (
        <div className="space-y-4">
          <IngredientListEditor
            ingredients={ingredients}
            onConfirm={handleConfirm}
          />
          <button
            type="button"
            onClick={handleBack}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-800"
          >
            ← Upload different photo
          </button>
        </div>
      )}

      {/* Generating */}
      {step === "generating" && (
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-5 py-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10">
              <ChefHat className="h-8 w-8 animate-pulse text-orange-500" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-zinc-800">Crafting your recipe…</p>
              <p className="mt-1 text-sm text-zinc-500">This takes a few seconds</p>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
            <div className="h-5 w-2/3 rounded-lg bg-zinc-100 animate-pulse" />
            <div className="h-4 w-full rounded-lg bg-zinc-100 animate-pulse" />
            <div className="h-4 w-4/5 rounded-lg bg-zinc-100 animate-pulse" />
            <div className="space-y-2 pt-2">
              <div className="h-3 w-1/3 rounded-lg bg-zinc-100 animate-pulse" />
              <div className="h-4 w-full rounded-lg bg-zinc-100 animate-pulse" />
              <div className="h-4 w-full rounded-lg bg-zinc-100 animate-pulse" />
              <div className="h-4 w-4/5 rounded-lg bg-zinc-100 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {step === "result" && recipe && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-zinc-100 bg-gradient-to-br from-orange-50 to-amber-50/50 px-6 py-5">
              <h2 className="text-xl font-bold text-zinc-900">{recipe.title}</h2>
              <p className="mt-1 text-sm text-zinc-600">{recipe.description}</p>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  Ingredients
                </h3>
                <ul className="space-y-1.5">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-baseline gap-2 text-sm">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                      <span className="font-medium text-zinc-800">{ing.name}</span>
                      <span className="text-zinc-400">
                        {ing.quantity} {ing.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  Steps
                </h3>
                <ol className="space-y-3">
                  {recipe.steps.map((s) => (
                    <li key={s.stepNumber} className="flex gap-3 text-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-xs font-bold text-orange-600">
                        {s.stepNumber}
                      </span>
                      <p className="text-zinc-700 leading-relaxed pt-0.5">
                        {s.instruction}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/recipes/${recipe.id}`)}
              className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-colors hover:bg-orange-400"
            >
              View Full Recipe
            </button>
            <button
              onClick={handleStartOver}
              className="flex-1 rounded-xl border border-zinc-200 bg-white py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-800"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
