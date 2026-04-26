"use server";

import { z } from "zod";
import { auth } from "@/shared/auth/auth";
import { generateDishImage } from "@/modules/image-generation/use-cases/generateDishImage";
import { imageGenerationService } from "@/modules/image-generation/services/imageGenerationService";
import { recipeImageRepository } from "@/modules/image-generation/repositories/recipeImageRepository";
import { recipeRepository } from "@/modules/recipe/repositories/recipeRepository";
import type { ActionResponse } from "@/shared/types/common";
import type { RecipeImageDTO } from "@/modules/image-generation/types";

const generateDishImageSchema = z.object({
  recipeId: z.string().uuid("Invalid recipe ID"),
});

export async function generateDishImageAction(
  recipeId: string
): Promise<ActionResponse<RecipeImageDTO>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Authentication required" };
  }

  const parsed = generateDishImageSchema.safeParse({ recipeId });
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false, error: firstError };
  }

  try {
    const image = await generateDishImage(parsed.data.recipeId, session.user.id, {
      recipeSource: recipeRepository,
      imageGenerationService,
      recipeImageRepository,
    });
    return { success: true, data: image };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Image generation failed";
    return { success: false, error: message };
  }
}
