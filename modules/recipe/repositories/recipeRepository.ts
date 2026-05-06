import { prisma } from "@/lib/prisma";
import type {
  GeneratedRecipe,
  RecipeDTO,
  RecipeRepository,
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
    try {
      const recipe = await prisma.recipe.findFirst({
        where: { ingredientHash: hash },
        include: recipeIncludes,
      });
      return recipe ? toRecipeDTO(recipe) : null;
    } catch {
      throw new Error("Failed to search recipe cache");
    }
  },

  async createRecipe(
    data: GeneratedRecipe,
    ingredientHash: string
  ): Promise<RecipeDTO> {
    try {
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
    } catch (error) {
      // Handle race condition: another request created the recipe first
      const isPrismaUniqueError =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002";

      if (isPrismaUniqueError) {
        try {
          const existing = await prisma.recipe.findFirst({
            where: { ingredientHash },
            include: recipeIncludes,
          });
          if (existing) {
            return toRecipeDTO(existing);
          }
        } catch {
          throw new Error("Failed to create recipe");
        }
      }
      throw new Error("Failed to create recipe");
    }
  },

  async countUserRecipesToday(userId: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    try {
      return await prisma.userRecipe.count({
        where: {
          userId,
          savedAt: { gte: startOfDay },
        },
      });
    } catch {
      throw new Error("Failed to count daily recipes");
    }
  },

  async findById(id: string): Promise<RecipeDTO | null> {
    try {
      const recipe = await prisma.recipe.findUnique({
        where: { id },
        include: recipeIncludes,
      });
      return recipe ? toRecipeDTO(recipe) : null;
    } catch {
      throw new Error("Failed to retrieve recipe");
    }
  },

  async findByUserId(userId: string): Promise<RecipeDTO[]> {
    try {
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
    } catch {
      throw new Error("Failed to retrieve user recipes");
    }
  },

  async isLinkedToUser(recipeId: string, userId: string): Promise<boolean> {
    try {
      const link = await prisma.userRecipe.findUnique({
        where: { userId_recipeId: { userId, recipeId } },
        select: { id: true },
      });
      return link !== null;
    } catch {
      throw new Error("Failed to check recipe ownership");
    }
  },

  async atomicLinkUserToRecipeWithDailyLimit(
    userId: string,
    recipeId: string,
    dailyLimit: number
  ): Promise<void> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    try {
      await prisma.$transaction(
        async (tx) => {
          const count = await tx.userRecipe.count({
            where: { userId, savedAt: { gte: startOfDay } },
          });

          if (count >= dailyLimit) {
            throw new Error("Daily recipe limit reached");
          }

          try {
            await tx.userRecipe.create({ data: { userId, recipeId } });
          } catch (error) {
            const isPrismaUniqueError =
              typeof error === "object" &&
              error !== null &&
              "code" in error &&
              (error as { code: string }).code === "P2002";
            if (isPrismaUniqueError) {
              return; // Already linked, not a new recipe for today
            }
            throw error;
          }
        },
        { isolationLevel: "Serializable" }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to link recipe to user");
    }
  },
};
