import type {
  RecipeDTO,
  RecipeGeneratorService,
  RecipeRepository,
} from "../types";
import { DAILY_RECIPE_LIMIT } from "@/shared/config/limits";

export async function computeIngredientHash(
  ingredients: string[],
  locale = "en"
): Promise<string> {
  const normalized = ingredients.map((i) => i.toLowerCase().trim()).sort();
  const joined = `${locale}:${normalized.join(",")}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(joined);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function generateRecipe(
  ingredients: string[],
  userId: string,
  deps: {
    recipeGeneratorService: RecipeGeneratorService;
    recipeRepository: RecipeRepository;
  },
  locale = "en"
): Promise<RecipeDTO> {
  if (!ingredients.length) {
    throw new Error("Ingredients are required");
  }

  const ingredientHash = await computeIngredientHash(ingredients, locale);

  // Check cache
  const cached = await deps.recipeRepository.findByIngredientHash(ingredientHash);
  if (cached) {
    await deps.recipeRepository.atomicLinkUserToRecipeWithDailyLimit(userId, cached.id, DAILY_RECIPE_LIMIT);
    return cached;
  }

  // Generate via LLM
  const generatedRecipe =
    await deps.recipeGeneratorService.generateRecipe(ingredients, locale);

  // Persist
  const savedRecipe = await deps.recipeRepository.createRecipe(
    generatedRecipe,
    ingredientHash
  );

  // Link to user (atomic check included)
  await deps.recipeRepository.atomicLinkUserToRecipeWithDailyLimit(userId, savedRecipe.id, DAILY_RECIPE_LIMIT);

  return savedRecipe;
}
