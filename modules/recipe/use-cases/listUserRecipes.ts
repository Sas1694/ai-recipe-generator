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
  const repoParams = {
    page: normalizedPage,
    ...(params?.query !== undefined && { query: params.query }),
  };

  const result = await deps.recipeRepository.findByUserId(userId, repoParams);

  if (result.totalPages > 0 && normalizedPage > result.totalPages) {
    return deps.recipeRepository.findByUserId(userId, { ...repoParams, page: 1 });
  }

  return result;
}
