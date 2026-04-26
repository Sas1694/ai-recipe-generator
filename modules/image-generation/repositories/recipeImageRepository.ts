import { prisma } from "@/lib/prisma";
import type { RecipeImageDTO, RecipeImageRepository } from "../types";

function toRecipeImageDTO(image: {
  id: string;
  recipeId: string;
  imageUrl: string;
  prompt: string;
  model: string;
  createdAt: Date;
}): RecipeImageDTO {
  return {
    id: image.id,
    recipeId: image.recipeId,
    imageUrl: image.imageUrl,
    prompt: image.prompt,
    model: image.model,
    createdAt: image.createdAt,
  };
}

export const recipeImageRepository: RecipeImageRepository = {
  async save(data: {
    recipeId: string;
    imageUrl: string;
    prompt: string;
    model: string;
  }): Promise<RecipeImageDTO> {
    const image = await prisma.recipeImage.create({
      data: {
        recipeId: data.recipeId,
        imageUrl: data.imageUrl,
        prompt: data.prompt,
        model: data.model,
      },
    });

    return toRecipeImageDTO(image);
  },

  async findByRecipeId(recipeId: string): Promise<RecipeImageDTO | null> {
    const image = await prisma.recipeImage.findFirst({
      where: { recipeId },
      orderBy: { createdAt: "desc" },
    });

    return image ? toRecipeImageDTO(image) : null;
  },
};
