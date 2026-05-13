"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Plus, Sparkles } from "lucide-react";

interface IngredientListEditorProps {
  ingredients: string[];
  onConfirm: (ingredients: string[]) => void;
}

export function IngredientListEditor({
  ingredients: initialIngredients,
  onConfirm,
}: IngredientListEditorProps) {
  const t = useTranslations("ingredientEditor");
  const [ingredients, setIngredients] = useState<string[]>(initialIngredients);
  const [newIngredient, setNewIngredient] = useState("");

  function handleAdd() {
    const trimmed = newIngredient.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setNewIngredient("");
    }
  }

  function handleRemove(index: number) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-lg font-bold text-zinc-900">
          {t("title")}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          {t("subtitle")}
        </p>
      </div>

      {/* Chip grid */}
      <div className="min-h-[80px] rounded-2xl border border-zinc-200 bg-white p-4">
        {ingredients.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <Sparkles className="h-5 w-5 text-zinc-300" />
            <p className="text-sm text-zinc-400">{t("empty")}</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <span
                key={`${ingredient}-${index}`}
                className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700"
              >
                {ingredient}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  aria-label={t("removeAriaLabel", { ingredient })}
                  className="mt-px text-orange-400 transition-colors hover:text-orange-600 active:text-orange-600 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Add input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("placeholder")}
          className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-400/15"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newIngredient.trim()}
          aria-label={t("addAriaLabel")}
          className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition-colors hover:border-orange-400 hover:text-orange-500 active:border-orange-400 active:text-orange-500 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Confirm button */}
      <button
        type="button"
        onClick={() => onConfirm(ingredients)}
        disabled={ingredients.length === 0}
        className="w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-orange-400 active:bg-orange-400 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
      >
        {t("confirmButton", { count: ingredients.length })}
      </button>
    </div>
  );
}


