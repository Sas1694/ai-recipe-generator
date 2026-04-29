"use client";

import { useState } from "react";
import Image from "next/image";
import { generateDishImageAction } from "@/modules/image-generation/actions/generateDishImageAction";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <p className="text-center text-sm text-muted-foreground">
            Generating dish image…
          </p>
        </div>
      )}

      {!isLoading && image && (
        <div className="overflow-hidden rounded-xl border shadow-sm">
          <Image
            src={image.imageUrl}
            alt="AI-generated dish image"
            width={1024}
            height={1024}
            className="w-full object-cover"
          />
        </div>
      )}

      {!isLoading && !image && (
        <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed p-6">
          <p className="text-sm text-muted-foreground">
            No image generated yet. Generate a visual of this dish using AI.
          </p>
          <Button onClick={handleGenerate} disabled={isLoading}>
            Generate Dish Image
          </Button>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
