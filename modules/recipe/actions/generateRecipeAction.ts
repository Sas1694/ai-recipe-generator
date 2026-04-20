"use server";

import { z } from "zod";
import { auth } from "@/shared/auth/auth";
import { generateRecipe } from "@/modules/recipe/use-cases/generateRecipe";
import { recipeGeneratorService } from "@/modules/recipe/services/recipeGeneratorService";
import { recipeRepository } from "@/modules/recipe/repositories/recipeRepository";
import type { ActionResponse } from "@/shared/types/common";
import type { RecipeDTO } from "@/modules/recipe/types";

const generateRecipeSchema = z.object({
  ingredients: z
    .array(z.string().min(1, "Ingredient cannot be empty"))
    .min(1, "At least one ingredient is required")
    .max(20, "Too many ingredients (max 20)"),
});

export async function generateRecipeAction(
  ingredients: string[]
): Promise<ActionResponse<RecipeDTO>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Authentication required" };
  }

  const parsed = generateRecipeSchema.safeParse({ ingredients });
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false, error: firstError };
  }

  try {
    const recipe = await generateRecipe(
      parsed.data.ingredients,
      session.user.id,
      { recipeGeneratorService, recipeRepository }
    );
    return { success: true, data: recipe };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Recipe generation failed";
    return { success: false, error: message };
  }
}
