import { put } from "@vercel/blob";
import {
  generateImageFromDescription,
  IMAGE_MODEL,
} from "@/shared/ai/imageClient";
import type { ImageGenerationService, GeneratedImageResult } from "../types";

const DISH_IMAGE_PROMPT = `You are a professional food photography image generator.

Your task is to generate a highly realistic image of a finished dish based ONLY on the following visual description.

VISUAL DESCRIPTION:
"{visual_description}"

INSTRUCTIONS:
- The image must represent the final plated dish exactly as described.
- Focus on realism and natural appearance.
- The dish should look appetizing and professionally presented.

STYLE AND COMPOSITION:
- Food photography, high-end, realistic
- Natural lighting, soft shadows
- Shot with a shallow depth of field
- Sharp focus on the dish, slightly blurred background
- Clean and minimal composition
- Plate centered or slightly off-center (rule of thirds)

DETAILS:
- Clearly show textures (crispy, creamy, juicy, etc.)
- Use realistic colors (avoid oversaturation)
- Include subtle imperfections to enhance realism
- Ensure ingredients mentioned are visibly present

BACKGROUND:
- Neutral or kitchen-like background
- Avoid clutter
- No distracting elements

CAMERA:
- DSLR-style photography
- 50mm or 85mm lens look
- High resolution

NEGATIVE CONSTRAINTS:
- No text
- No watermark
- No artificial or cartoon style
- No unrealistic lighting or colors
- No extra ingredients not implied in the description

OUTPUT:
- A single high-quality realistic image of the dish`;

function buildPrompt(visualDescription: string): string {
  return DISH_IMAGE_PROMPT.replace("{visual_description}", visualDescription);
}

export const imageGenerationService: ImageGenerationService = {
  async generateDishImage(
    visualDescription: string,
    recipeId: string
  ): Promise<GeneratedImageResult> {
    const prompt = buildPrompt(visualDescription);

    // Skip OpenAI + Vercel Blob when MOCK_AI=true
    if (process.env.MOCK_AI === "true") {
      console.log("[MOCK] imageGenerationService.generateDishImage called for recipe:", recipeId);
      return {
        imageUrl: "/mock-dish.svg",
        prompt,
        model: `${IMAGE_MODEL}-mock`,
      };
    }

    const imageBuffer = await generateImageFromDescription(prompt);

    const environment = process.env.NODE_ENV ?? "development";
    const imageId = crypto.randomUUID();
    const blobPath = `${environment}/dish-images/${recipeId}/${imageId}.png`;

    const blob = await put(blobPath, imageBuffer, {
      access: "public",
      contentType: "image/png",
    });

    return {
      imageUrl: blob.url,
      prompt,
      model: IMAGE_MODEL,
    };
  },
};
