import type { GeneratedRecipe } from "@/modules/recipe/types";

/**
 * Development mock for the recipe client.
 * Activated when MOCK_AI=true in .env.local.
 * Returns a hardcoded recipe without calling OpenAI.
 */
export async function generateRecipeFromIngredients(
  ingredients: string[]
): Promise<GeneratedRecipe> {
  console.log("[MOCK] recipeClient.generateRecipeFromIngredients called with:", ingredients);

  return {
    title: "Mock Tomato & Cheese Omelette",
    description:
      "A quick and delicious mock omelette generated for development purposes.",
    visualDescription:
      "A golden folded omelette with melted cheese and fresh tomato chunks, served on a white ceramic plate.",
    ingredients: ingredients.map((name, i) => ({
      name,
      quantity: String(i + 1),
      unit: "unit",
    })),
    steps: [
      { stepNumber: 1, instruction: "Beat the eggs in a bowl until fluffy." },
      { stepNumber: 2, instruction: "Heat olive oil in a non-stick pan over medium heat." },
      { stepNumber: 3, instruction: "Pour the egg mixture into the pan." },
      { stepNumber: 4, instruction: "Add the remaining ingredients and fold the omelette." },
      { stepNumber: 5, instruction: "Serve immediately on a warm plate." },
    ],
  };
}
