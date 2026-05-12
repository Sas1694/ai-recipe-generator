"use server";

import { z } from "zod";
import { auth } from "@/shared/auth/auth";
import { getLocale } from "next-intl/server";
import { generateRecipe } from "@/modules/recipe/use-cases/generateRecipe";
import { recipeGeneratorService } from "@/modules/recipe/services/recipeGeneratorService";
import { recipeRepository } from "@/modules/recipe/repositories/recipeRepository";
import type { ActionResponse } from "@/shared/types/common";
import type { RecipeDTO } from "@/modules/recipe/types";

const generateRecipeSchema = z.object({
  ingredients: z
    .array(z.string().min(1))
    .min(1)
    .max(20),
});

export async function generateRecipeAction(
  ingredients: string[]
): Promise<ActionResponse<RecipeDTO>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "authRequired" };
  }

  const parsed = generateRecipeSchema.safeParse({ ingredients });
  if (!parsed.success) {
    return { success: false, error: "invalidInput" };
  }

  const locale = await getLocale();

  try {
    const recipe = await generateRecipe(
      parsed.data.ingredients,
      session.user.id,
      { recipeGeneratorService, recipeRepository },
      locale
    );
    return { success: true, data: recipe };
  } catch {
    return { success: false, error: "recipeGenerationFailed" };
  }
}
