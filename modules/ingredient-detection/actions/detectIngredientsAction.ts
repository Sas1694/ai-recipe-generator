"use server";

import { z } from "zod";
import { detectIngredients } from "@/modules/ingredient-detection/use-cases/detectIngredients";
import { visionModelService } from "@/modules/ingredient-detection/services/visionModelService";
import type { ActionResponse } from "@/shared/types/common";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

function getRawBase64ImageData(imageBase64: string): string {
  const trimmed = imageBase64.trim();
  const dataUrlMatch = trimmed.match(/^data:[^;]+;base64,(.+)$/);
  return dataUrlMatch ? dataUrlMatch[1] : trimmed;
}

function getDecodedImageSizeInBytes(imageBase64: string): number | null {
  try {
    const rawBase64 = getRawBase64ImageData(imageBase64);

    if (rawBase64.length === 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(rawBase64)) {
      return null;
    }

    return Buffer.from(rawBase64, "base64").length;
  } catch {
    return null;
  }
}

const detectIngredientsSchema = z.object({
  imageBase64: z
    .string()
    .min(1, "Image is required")
    .refine((value) => getDecodedImageSizeInBytes(value) !== null, {
      message: "Image must be valid base64",
    })
    .refine((value) => {
      const sizeInBytes = getDecodedImageSizeInBytes(value);
      return sizeInBytes !== null && sizeInBytes <= MAX_IMAGE_SIZE;
    }, "Image is too large (max 4MB)"),
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
