import type { RecipeDTO, RecipeRepository } from "../types";

export async function getRecipe(
  id: string,
  deps: { recipeRepository: Pick<RecipeRepository, "findById"> }
): Promise<RecipeDTO> {
  if (!id.trim()) {
    throw new Error("Recipe ID is required");
  }

  const recipe = await deps.recipeRepository.findById(id);
  if (!recipe) {
    throw new Error("Recipe not found");
  }

  return recipe;
}
