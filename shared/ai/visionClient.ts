import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import { openai } from "@/shared/ai/openaiClient";

const ingredientDetectionSchema = z.object({
  ingredients: z.array(z.string()),
});

const INGREDIENT_DETECTION_PROMPT = `You are a food ingredient detection system. Given an image, analyze its contents to detect and list all observable food ingredients using the following strict rules:

- Only include edible ingredients visible or clearly indicated in the image (e.g., via packaging text).
- Ignore all brand names, logos, or non-ingredient text.
- Use packaging ingredient lists if visible, but only extract actual food components.
- Normalize all ingredient names: use singular, lowercase form (e.g., "egg" not "eggs", "tomato" not "tomatoes").
- Do not include duplicates—ensure each ingredient appears only once.
- Be conservative: only include ingredients you are highly confident are present; if unsure, omit the ingredient.
- Do not include preparation terms (e.g., "grated", "sliced")—focus on the core ingredient.
- Do not include packaging materials (e.g., "plastic", "foil").

For complex packaging, prioritize package ingredient lists, but confirm that ingredients match visible evidence when possible. If no ingredients are confidently detected, return an empty array.`;

export async function detectIngredientsFromImage(
  imageBase64: string,
  mimeType: string
): Promise<string[]> {
  const response = await openai.responses.parse({
    model: "gpt-4o-mini",
    input: [{
        role: "user",
        content: [
            { type: "input_text", text: INGREDIENT_DETECTION_PROMPT },
            {
                type: "input_image",
                image_url: `data:${mimeType};base64,${imageBase64}`,
                detail: "original"
            },
        ],
    }],
    text: {
      format: zodTextFormat(ingredientDetectionSchema, "ingredients"),
    },
  });

  if (response.output_parsed === null) {
    throw new Error("Failed to parse model response");
  }

  return response.output_parsed.ingredients;
}
