"use client";

import { useState } from "react";

interface IngredientListEditorProps {
  ingredients: string[];
  onConfirm: (ingredients: string[]) => void;
}

export function IngredientListEditor({
  ingredients: initialIngredients,
  onConfirm,
}: IngredientListEditorProps) {
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
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Review ingredients</h2>
        <p className="mt-1 text-sm text-foreground/60">
          Edit the list before generating your recipe
        </p>
      </div>

      <div className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <div
            key={ingredient}
            className="flex items-center justify-between rounded-md border border-foreground/20 px-3 py-2"
          >
            <span className="text-sm">{ingredient}</span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-sm text-red-500 hover:text-red-700"
              aria-label={`Remove ${ingredient}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {ingredients.length === 0 && (
        <p className="text-center text-sm text-foreground/40">
          No ingredients yet. Add some below.
        </p>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add ingredient..."
          className="flex-1 rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm focus:border-foreground/40 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newIngredient.trim()}
          className="rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Add
        </button>
      </div>

      <button
        type="button"
        onClick={() => onConfirm(ingredients)}
        disabled={ingredients.length === 0}
        className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        Confirm ingredients ({ingredients.length})
      </button>
    </div>
  );
}
