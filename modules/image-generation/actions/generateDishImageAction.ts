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
  recipeId: z.string().uuid(),
});

export async function generateDishImageAction(
  recipeId: string
): Promise<ActionResponse<RecipeImageDTO>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "authRequired" };
  }

  const parsed = generateDishImageSchema.safeParse({ recipeId });
  if (!parsed.success) {
    return { success: false, error: "invalidInput" };
  }

  try {
    const image = await generateDishImage(parsed.data.recipeId, session.user.id, {
      recipeSource: recipeRepository,
      imageGenerationService,
      recipeImageRepository,
    });
    return { success: true, data: image };
  } catch {
    return { success: false, error: "imageGenerationFailed" };
  }
}
