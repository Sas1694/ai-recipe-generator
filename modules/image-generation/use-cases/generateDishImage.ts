import type {
  RecipeImageDTO,
  ImageGenerationService,
  RecipeImageRepository,
  RecipeSource,
} from "../types";

export async function generateDishImage(
  recipeId: string,
  deps: {
    recipeSource: RecipeSource;
    imageGenerationService: ImageGenerationService;
    recipeImageRepository: RecipeImageRepository;
  }
): Promise<RecipeImageDTO> {
  const recipe = await deps.recipeSource.findById(recipeId);
  if (!recipe) {
    throw new Error("Recipe not found");
  }

  if (!recipe.visualDescription) {
    throw new Error("Recipe has no visual description");
  }

  const existing = await deps.recipeImageRepository.findByRecipeId(recipeId);
  if (existing) {
    return existing;
  }

  const generated = await deps.imageGenerationService.generateDishImage(
    recipe.visualDescription,
    recipeId
  );

  return deps.recipeImageRepository.save({
    recipeId,
    imageUrl: generated.imageUrl,
    prompt: generated.prompt,
    model: generated.model,
  });
}
