"use server";

import { z } from "zod";
import { detectIngredients } from "@/modules/ingredient-detection/use-cases/detectIngredients";
import { visionModelService } from "@/modules/ingredient-detection/services/visionModelService";
import type { ActionResponse } from "@/shared/types/common";
import { MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB, SUPPORTED_FORMATS_LABEL, SUPPORTED_MIME_TYPES } from "@/shared/config/limits";

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => SUPPORTED_MIME_TYPES.includes(file.type), `Unsupported image format. Use ${SUPPORTED_FORMATS_LABEL}`)
  .refine(
    (file) => file.size <= MAX_IMAGE_SIZE_BYTES,
    `Image is too large (max ${MAX_IMAGE_SIZE_MB}MB)`
  );

export async function detectIngredientsAction(
  formData: FormData
): Promise<ActionResponse<string[]>> {
  const file = formData.get("image");

  const parsed = imageFileSchema.safeParse(file);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false, error: firstError };
  }

  try {
    const buffer = Buffer.from(await parsed.data.arrayBuffer());
    const base64 = buffer.toString("base64");

    const ingredients = await detectIngredients(
      { base64, mimeType: parsed.data.type },
      { visionModelService }
    );
    return { success: true, data: ingredients };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Ingredient detection failed";
    return { success: false, error: message };
  }
}
