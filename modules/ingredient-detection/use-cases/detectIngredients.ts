import type { VisionModelService } from "../types";

export async function detectIngredients(
  imageBase64: string,
  deps: { visionModelService: VisionModelService }
): Promise<string[]> {
  if (!imageBase64.trim()) {
    throw new Error("Image data is required");
  }

  const rawIngredients =
    await deps.visionModelService.detectIngredients(imageBase64);

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
