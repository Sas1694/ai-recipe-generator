import type { PaginatedRecipeList, RecipeListParams, RecipeRepository } from "../types";

export async function listUserRecipes(
  userId: string,
  deps: { recipeRepository: Pick<RecipeRepository, "findByUserId"> },
  params?: RecipeListParams
): Promise<PaginatedRecipeList> {
  if (!userId.trim()) {
    throw new Error("User ID is required");
  }

  const normalizedPage = !params?.page || params.page <= 0 ? 1 : params.page;

  return deps.recipeRepository.findByUserId(userId, {
    page: normalizedPage,
    ...(params?.query !== undefined && { query: params.query }),
  });
}
