import { prisma } from "@/lib/prisma";
import type {
  RecipeRepository,
  RecipeDTO,
  GeneratedRecipe,
} from "../types";

function toRecipeDTO(recipe: {
  id: string;
  title: string;
  description: string;
  visualDescription: string;
  ingredientHash: string;
  createdAt: Date;
  ingredients: { name: string; quantity: string; unit: string }[];
  steps: { stepNumber: number; instruction: string }[];
}): RecipeDTO {
  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    visualDescription: recipe.visualDescription,
    ingredientHash: recipe.ingredientHash,
    createdAt: recipe.createdAt,
    ingredients: recipe.ingredients.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      unit: i.unit,
    })),
    steps: recipe.steps
      .sort((a, b) => a.stepNumber - b.stepNumber)
      .map((s) => ({
        stepNumber: s.stepNumber,
        instruction: s.instruction,
      })),
  };
}

const recipeIncludes = {
  ingredients: { select: { name: true, quantity: true, unit: true } },
  steps: { select: { stepNumber: true, instruction: true } },
} as const;

export const recipeRepository: RecipeRepository = {
  async findByIngredientHash(hash: string): Promise<RecipeDTO | null> {
    const recipe = await prisma.recipe.findFirst({
      where: { ingredientHash: hash },
      include: recipeIncludes,
    });

    return recipe ? toRecipeDTO(recipe) : null;
  },

  async createRecipe(
    data: GeneratedRecipe,
    ingredientHash: string
  ): Promise<RecipeDTO> {
    const recipe = await prisma.recipe.create({
      data: {
        title: data.title,
        description: data.description,
        visualDescription: data.visualDescription,
        ingredientHash,
        ingredients: {
          create: data.ingredients.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            unit: i.unit,
          })),
        },
        steps: {
          create: data.steps.map((s) => ({
            stepNumber: s.stepNumber,
            instruction: s.instruction,
          })),
        },
      },
      include: recipeIncludes,
    });

    return toRecipeDTO(recipe);
  },

  async linkUserToRecipe(userId: string, recipeId: string): Promise<void> {
    try {
      await prisma.userRecipe.create({
        data: { userId, recipeId },
      });
    } catch (error: unknown) {
      // Ignore unique constraint violation (user already linked)
      if (
        error instanceof Error &&
        error.message.includes("Unique constraint")
      ) {
        return;
      }
      throw error;
    }
  },

  async countUserRecipesToday(userId: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return prisma.userRecipe.count({
      where: {
        userId,
        savedAt: { gte: startOfDay },
      },
    });
  },

  async findById(id: string): Promise<RecipeDTO | null> {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: recipeIncludes,
    });

    return recipe ? toRecipeDTO(recipe) : null;
  },

  async findByUserId(userId: string): Promise<RecipeDTO[]> {
    const userRecipes = await prisma.userRecipe.findMany({
      where: { userId },
      orderBy: { savedAt: "desc" },
      include: {
        recipe: {
          include: recipeIncludes,
        },
      },
    });

    return userRecipes.map((ur) => toRecipeDTO(ur.recipe));
  },
};
