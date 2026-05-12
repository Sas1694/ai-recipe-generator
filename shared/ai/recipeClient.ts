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
  servings: z.number().int().min(1).max(12),
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

Generate a realistic, cookable recipe using ONLY the provided ingredients.

INPUT:
The user provides a JSON array of normalized ingredient strings.
Example:
["egg", "tomato", "cheese"]

INGREDIENT RULES:
- Use ONLY provided ingredients.
- Allowed pantry items: water, salt, pepper, oil.
- Do NOT add extra ingredients, sauces, herbs, or condiments.
- Prefer simple realistic recipes over creative unrealistic ones.

CULINARY REALISM:
- The recipe must follow real cooking practices.
- Avoid strange, unsafe, or unnatural ingredient usage.
- Use ingredients appropriately for the dish type.
- Liquids must be cooked or logically integrated when necessary.
- The final dish should resemble something a real person would cook and eat.

Examples:
- Valid: simmering lentils in broth, melting cheese, sautéing vegetables
- Invalid: raw beer in burgers, dry stews, unnecessary water, incoherent combinations

RECIPE PRIORITIZATION:
- ALWAYS prefer a well-known, classic, or internationally recognized recipe over an invented one.
- If the provided ingredients match a famous dish (e.g., omelette, carbonara, tortilla española, guacamole), use that dish as the basis.
- Only invent a recipe if no recognizable dish can be reasonably made with the given ingredients.

RECIPE QUALITY:
- Keep instructions clear, concise, and logically ordered.
- Quantities must be realistic.
- Avoid redundant or unnecessary steps.

DISH CONSISTENCY:
- The final dish appearance must match the recipe.
- Soups/stews must contain visible liquid.
- Fried foods should appear crispy.
- Melted ingredients should appear melted.
- Sauced dishes should visibly contain sauce or coating.

VISUAL DESCRIPTION:
Generate a "visualDescription" describing ONLY the final plated dish.

Rules:
- Focus only on visual appearance.
- Mention important visible ingredients, textures, sauces, broth, moisture, crispiness, or melted elements when relevant.
- Ensure consistency with the recipe.
- Keep concise (1–3 sentences).
- No instructions, quantities, taste, smell, or photography terms.

SERVINGS:
- Estimate the realistic number of people the recipe serves based on the quantities and dish type.
- Use a number between 1 and 6 for household recipes.
- Common values: 1–2 for individual/couple dishes, 4 for family meals, 6 for larger batches.
- Be consistent with the ingredient quantities in the recipe.

NORMALIZATION:
- Ingredient names must remain lowercase.
- Avoid duplicates.

OUTPUT:
Return ONLY valid JSON with this structure:

{
  "title": "string",
  "description": "string",
  "visualDescription": "string",
  "servings": number,
  "ingredients": [
    {
      "name": "string",
      "quantity": "string",
      "unit": "string"
    }
  ],
  "steps": [
    {
      "stepNumber": number,
      "instruction": "string"
    }
  ]
}

ADDITIONAL RULES:
- stepNumber starts at 1 and increments sequentially.
- Each step should contain one clear action.
- Keep title and description short and natural.

FAILSAFE:
If ingredients are empty or unusable, still return valid minimal JSON using only pantry items.`;

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
