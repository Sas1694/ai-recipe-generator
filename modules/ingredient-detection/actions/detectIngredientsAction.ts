"use server";

import { z } from "zod";
import { auth } from "@/shared/auth/auth";
import { getLocale } from "next-intl/server";
import { detectIngredients } from "@/modules/ingredient-detection/use-cases/detectIngredients";
import { visionModelService } from "@/modules/ingredient-detection/services/visionModelService";
import { recipeRepository } from "@/modules/recipe/repositories/recipeRepository";
import type { ActionResponse } from "@/shared/types/common";
import { MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB, SUPPORTED_FORMATS_LABEL, SUPPORTED_MIME_TYPES, DAILY_RECIPE_LIMIT } from "@/shared/config/limits";

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
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "authRequired" };
  }

  const todayCount = await recipeRepository.countUserRecipesToday(session.user.id);
  if (todayCount >= DAILY_RECIPE_LIMIT) {
    return { success: false, error: "dailyLimitReached" };
  }

  const file = formData.get("image");

  const parsed = imageFileSchema.safeParse(file);
  if (!parsed.success) {
    return { success: false, error: "invalidInput" };
  }

  const locale = await getLocale();

  try {
    const buffer = Buffer.from(await parsed.data.arrayBuffer());
    const base64 = buffer.toString("base64");

    const ingredients = await detectIngredients(
      { base64, mimeType: parsed.data.type },
      { visionModelService },
      locale
    );
    return { success: true, data: ingredients };
  } catch {
    return { success: false, error: "ingredientDetectionFailed" };
  }
}
