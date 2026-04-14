import { z } from "zod";
import { openai } from "@/shared/ai/openaiClient";

const INGREDIENT_DETECTION_PROMPT = `You are a food ingredient detection system. Given an image, analyze its contents to detect and list all observable food ingredients using the following strict rules:

- Only include edible ingredients visible or clearly indicated in the image (e.g., via packaging text).
- Ignore all brand names, logos, or non-ingredient text.
- Use packaging ingredient lists if visible, but only extract actual food components.
- Normalize all ingredient names: use singular, lowercase form (e.g., "egg" not "eggs", "tomato" not "tomatoes").
- Do not include duplicates—ensure each ingredient appears only once.
- Be conservative: only include ingredients you are highly confident are present; if unsure, omit the ingredient.
- Do not include preparation terms (e.g., "grated", "sliced")—focus on the core ingredient.
- Do not include packaging materials (e.g., "plastic", "foil").
- Always return ONLY a JSON array of strings with the detected ingredient names.

For complex packaging, prioritize package ingredient lists, but confirm that ingredients match visible evidence when possible. If no ingredients are confidently detected, return an empty JSON array.

Output Format:
- Return a JSON object with a single key "ingredients" containing an array of strings.
- Each string must be a single normalized ingredient name.
- Do not include any explanatory text, comments, or extra fields.

Example output:
{"ingredients": ["egg", "tomato", "cheese", "milk"]}`;

const ingredientsResponseSchema = z.object({
  ingredients: z.array(z.string()),
});

export async function detectIngredientsFromImage(
  imageBase64: string,
  mimeType: string
): Promise<string[]> {
  const response = /* { output_text: "{\"ingredients\": [\"egg\", \"tomato\", \"cheese\", \"milk\"]}" }; */await openai.responses.create({
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
  });

  const content = response.output_text;
  if (!content) {
    throw new Error("Failed to parse model response");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Failed to parse model response");
  }

  const result = ingredientsResponseSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error("Failed to parse model response");
  }

  return result.data.ingredients;
}
