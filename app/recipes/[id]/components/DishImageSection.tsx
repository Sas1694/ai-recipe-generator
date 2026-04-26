"use client";

import { useState } from "react";
import Image from "next/image";
import { generateDishImageAction } from "@/modules/image-generation/actions/generateDishImageAction";
import type { RecipeImageDTO } from "@/modules/image-generation/types";

interface DishImageSectionProps {
  recipeId: string;
  initialImage: RecipeImageDTO | null;
}

export function DishImageSection({
  recipeId,
  initialImage,
}: DishImageSectionProps) {
  const [image, setImage] = useState<RecipeImageDTO | null>(initialImage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setIsLoading(true);
    setError(null);

    const result = await generateDishImageAction(recipeId);

    if (result.success) {
      setImage(result.data);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Dish Image</h2>

      {image ? (
        <div className="overflow-hidden rounded-lg border border-foreground/10">
          <Image
            src={image.imageUrl}
            alt="AI-generated dish image"
            width={1024}
            height={1024}
            className="w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-foreground/50">
            No image generated yet. Generate a visual image of this dish.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Generating…" : "Generate Dish Image"}
          </button>
        </div>
      )}

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
