"use server";

import { auth } from "@/shared/auth/auth";
import { listUserRecipes } from "@/modules/recipe/use-cases/listUserRecipes";
import { recipeRepository } from "@/modules/recipe/repositories/recipeRepository";
import type { ActionResponse } from "@/shared/types/common";
import type { PaginatedRecipeList, RecipeListParams } from "@/modules/recipe/types";

export async function listUserRecipesAction(
  params?: RecipeListParams
): Promise<ActionResponse<PaginatedRecipeList>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "authRequired" };
  }

  try {
    const data = await listUserRecipes(session.user.id, { recipeRepository }, params);
    return { success: true, data };
  } catch {
    return { success: false, error: "recipeFetchFailed" };
  }
}
