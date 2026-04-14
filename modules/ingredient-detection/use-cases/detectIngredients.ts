import type { ImageData, VisionModelService } from "../types";

export async function detectIngredients(
  image: ImageData,
  deps: { visionModelService: VisionModelService }
): Promise<string[]> {
  if (!image.base64.trim()) {
    throw new Error("Image data is required");
  }

  const rawIngredients =
    await deps.visionModelService.detectIngredients(image);

  // Normalize: lowercase + deduplicate
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const ingredient of rawIngredients) {
    const lower = ingredient.toLowerCase().trim();
    if (lower && !seen.has(lower)) {
      seen.add(lower);
      normalized.push(lower);
    }
  }

  return normalized;
}
