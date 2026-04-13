"use server";

import { z } from "zod";
import { getRecipe } from "@/modules/recipe/use-cases/getRecipe";
import { recipeRepository } from "@/modules/recipe/repositories/recipeRepository";
import type { ActionResponse } from "@/shared/types/common";
import type { RecipeDTO } from "@/modules/recipe/types";

const getRecipeSchema = z.object({
  id: z.string().uuid("Invalid recipe ID"),
});

export async function getRecipeAction(
  id: string
): Promise<ActionResponse<RecipeDTO>> {
  const parsed = getRecipeSchema.safeParse({ id });
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false, error: firstError };
  }

  try {
    const recipe = await getRecipe(parsed.data.id, { recipeRepository });
    return { success: true, data: recipe };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get recipe";
    return { success: false, error: message };
  }
}
