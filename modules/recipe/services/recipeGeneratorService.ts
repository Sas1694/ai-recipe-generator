import { generateRecipeFromIngredients } from "@/shared/ai/recipeClient";
import type { RecipeGeneratorService } from "../types";

export const recipeGeneratorService: RecipeGeneratorService = {
  generateRecipe: (ingredients: string[], locale?: string) =>
    generateRecipeFromIngredients(ingredients, locale),
};
