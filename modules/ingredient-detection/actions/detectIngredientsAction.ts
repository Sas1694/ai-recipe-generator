"use server";

import { z } from "zod";
import { detectIngredients } from "@/modules/ingredient-detection/use-cases/detectIngredients";
import { visionModelService } from "@/modules/ingredient-detection/services/visionModelService";
import type { ActionResponse } from "@/shared/types/common";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

const detectIngredientsSchema = z.object({
  imageBase64: z
    .string()
    .min(1, "Image is required")
    .max(MAX_IMAGE_SIZE, "Image is too large (max 4MB)"),
});

export async function detectIngredientsAction(
  imageBase64: string
): Promise<ActionResponse<string[]>> {
  const parsed = detectIngredientsSchema.safeParse({ imageBase64 });
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false, error: firstError };
  }

  try {
    const ingredients = await detectIngredients(parsed.data.imageBase64, {
      visionModelService,
    });
    return { success: true, data: ingredients };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Ingredient detection failed";
    return { success: false, error: message };
  }
}
