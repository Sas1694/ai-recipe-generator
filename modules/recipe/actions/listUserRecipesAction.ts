"use server";

import { auth } from "@/shared/auth/auth";
import { listUserRecipes } from "@/modules/recipe/use-cases/listUserRecipes";
import { recipeRepository } from "@/modules/recipe/repositories/recipeRepository";
import type { ActionResponse } from "@/shared/types/common";
import type { RecipeDTO } from "@/modules/recipe/types";

export async function listUserRecipesAction(): Promise<
  ActionResponse<RecipeDTO[]>
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "authRequired" };
  }

  try {
    const recipes = await listUserRecipes(session.user.id, {
      recipeRepository,
    });
    return { success: true, data: recipes };
  } catch {
    return { success: false, error: "recipeFetchFailed" };
  }
}
