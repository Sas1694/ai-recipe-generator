"use server";

import { z } from "zod";
import { getRecipe } from "@/modules/recipe/use-cases/getRecipe";
import { recipeRepository } from "@/modules/recipe/repositories/recipeRepository";
import type { ActionResponse } from "@/shared/types/common";
import type { RecipeDTO } from "@/modules/recipe/types";

const getRecipeSchema = z.object({
  id: z.string().uuid(),
});

export async function getRecipeAction(
  id: string
): Promise<ActionResponse<RecipeDTO>> {
  const parsed = getRecipeSchema.safeParse({ id });
  if (!parsed.success) {
    return { success: false, error: "invalidRecipeId" };
  }

  try {
    const recipe = await getRecipe(parsed.data.id, { recipeRepository });
    return { success: true, data: recipe };
  } catch {
    return { success: false, error: "invalidRecipeId" };
  }
}
