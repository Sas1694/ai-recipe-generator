import type {
  RecipeDTO,
  RecipeGeneratorService,
  RecipeRepository,
} from "../types";

const DAILY_RECIPE_LIMIT = 5;

export async function computeIngredientHash(
  ingredients: string[]
): Promise<string> {
  const normalized = ingredients.map((i) => i.toLowerCase().trim()).sort();
  const joined = normalized.join(",");
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
  }
): Promise<RecipeDTO> {
  if (!ingredients.length) {
    throw new Error("Ingredients are required");
  }

  const todayCount = await deps.recipeRepository.countUserRecipesToday(userId);
  if (todayCount >= DAILY_RECIPE_LIMIT) {
    throw new Error("Daily recipe limit reached");
  }

  const ingredientHash = await computeIngredientHash(ingredients);

  // Check cache
  const cached = await deps.recipeRepository.findByIngredientHash(ingredientHash);
  if (cached) {
    await deps.recipeRepository.linkUserToRecipe(userId, cached.id);
    return cached;
  }

  // Generate via LLM
  const generatedRecipe =
    await deps.recipeGeneratorService.generateRecipe(ingredients);

  // Persist
  const savedRecipe = await deps.recipeRepository.createRecipe(
    generatedRecipe,
    ingredientHash
  );

  // Link to user
  await deps.recipeRepository.linkUserToRecipe(userId, savedRecipe.id);

  return savedRecipe;
}
