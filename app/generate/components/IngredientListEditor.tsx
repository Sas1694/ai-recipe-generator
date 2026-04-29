"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

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
        <p className="mt-1 text-sm text-muted-foreground">
          Edit the list before generating your recipe
        </p>
      </div>

      <div className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <div
            key={ingredient}
            className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 shadow-sm"
          >
            <span className="text-sm font-medium">{ingredient}</span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="ml-2 rounded p-0.5 text-muted-foreground hover:text-destructive"
              aria-label={`Remove ${ingredient}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {ingredients.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          No ingredients yet. Add some below.
        </p>
      )}

      <div className="flex gap-2">
        <Input
          type="text"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add ingredient…"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAdd}
          disabled={!newIngredient.trim()}
        >
          Add
        </Button>
      </div>

      <Button
        type="button"
        className="w-full"
        onClick={() => onConfirm(ingredients)}
        disabled={ingredients.length === 0}
      >
        Confirm ingredients ({ingredients.length})
      </Button>
    </div>
  );
}

