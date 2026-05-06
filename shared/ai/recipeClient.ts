import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import { openai } from "@/shared/ai/openaiClient";
import type { GeneratedRecipe } from "@/modules/recipe/types";
// Mock import — used when MOCK_AI=true in .env.local
import { generateRecipeFromIngredients as generateRecipeMock } from "@/shared/ai/mocks/recipeClientMock";

const generatedRecipeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  visualDescription: z.string().min(1),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1),
        quantity: z.string().min(1),
        unit: z.string().min(1),
      })
    )
    .min(1),
  steps: z
    .array(
      z.object({
        stepNumber: z.number().int().positive(),
        instruction: z.string().min(1),
      })
    )
    .min(1),
});

const RECIPE_GENERATION_PROMPT = `You are a professional chef and structured recipe generator.
Your task is to generate a high-quality cooking recipe based ONLY on the ingredients provided by the user.

You must strictly follow these rules:

INPUT FORMAT:
The user will provide the ingredients as a JSON array of strings.
Each item represents a single ingredient.
Ingredients are already normalized (lowercase, singular).
You must interpret this array correctly and use it as the ONLY source of ingredients.

INGREDIENT CONSTRAINTS:
- Use ONLY the provided ingredients.
- You MAY include basic pantry items: water, salt, pepper, oil.
- Do NOT introduce new ingredients outside of these.
- If the ingredient list is limited, create a simple recipe.

RECIPE QUALITY:
- The recipe must be realistic and cookable.
- Avoid unnecessary complexity.
- Ensure steps are logically ordered.
- Use clear, concise, and professional cooking instructions.

NORMALIZATION:
- Ingredient names must be lowercase.
- Avoid duplicates.
- Quantities must be realistic and consistent.

VISUAL DESCRIPTION:
- visualDescription must describe ONLY the final plated dish.
- Focus on how the dish looks visually, not how it is cooked.
- Mention key visible ingredients when appropriate.
- Describe composition, textures, and presentation.
- Keep it concise (1–2 sentences).
- Do NOT include quantities or instructions.
- The description must be suitable for generating an image.

ADDITIONAL RULES:
- stepNumber must start at 1 and increment sequentially.
- Do NOT skip numbers.
- Each step must contain a single clear action.
- The description should be short (1–2 sentences).
- Title should be appealing but concise.

FAILSAFE:
- If the ingredient list is empty or unusable, still return a schema-valid minimal recipe.
- The fallback recipe must include a non-empty title, description, and visualDescription.
- The fallback recipe must include at least one ingredient and at least one step.
- Use only allowed pantry items for the fallback recipe: water, salt, pepper, oil.`;

export async function generateRecipeFromIngredients(
  ingredients: string[]
): Promise<GeneratedRecipe> {
  if (process.env.MOCK_AI === "true") {
    return generateRecipeMock(ingredients);
  }

  const response = await openai.responses.parse({
    model: "gpt-4o-mini",
    input: [
      {
        role: "developer",
        content: RECIPE_GENERATION_PROMPT,
      },
      {
        role: "user",
        content: JSON.stringify(ingredients),
      },
    ],
    text: {
      format: zodTextFormat(generatedRecipeSchema, "recipe"),
    },
  });

  if (response.output_parsed === null) {
    throw new Error("Failed to get recipe from model");
  }

  return response.output_parsed;
}
