import type { RecipeDTO, RecipeRepository } from "../types";

export async function listUserRecipes(
  userId: string,
  deps: { recipeRepository: Pick<RecipeRepository, "findByUserId"> }
): Promise<RecipeDTO[]> {
  if (!userId.trim()) {
    throw new Error("User ID is required");
  }

  return deps.recipeRepository.findByUserId(userId);
}
