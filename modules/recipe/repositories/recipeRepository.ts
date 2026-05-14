import { prisma } from "@/lib/prisma";
import { RECIPES_PER_PAGE } from "@/shared/config/limits";
import type {
  GeneratedRecipe,
  PaginatedRecipeList,
  RecipeDTO,
  RecipeListParams,
  RecipeRepository,
} from "../types";

function toRecipeDTO(recipe: {
  id: string;
  title: string;
  description: string;
  visualDescription: string;
  ingredientHash: string;
  servings: number;
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
    servings: recipe.servings,
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
          servings: data.servings,
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

  async findByUserId(
    userId: string,
    params?: RecipeListParams
  ): Promise<PaginatedRecipeList> {
    const page = params?.page ?? 1;
    const query = params?.query;

    const where = {
      userId,
      ...(query ? { recipe: { title: { contains: query, mode: "insensitive" as const } } } : {}),
    };

    try {
      const [userRecipes, total] = await Promise.all([
        prisma.userRecipe.findMany({
          where,
          orderBy: { savedAt: "desc" },
          skip: (page - 1) * RECIPES_PER_PAGE,
          take: RECIPES_PER_PAGE,
          include: {
            recipe: {
              include: recipeIncludes,
            },
          },
        }),
        prisma.userRecipe.count({ where }),
      ]);

      return {
        recipes: userRecipes.map((ur) => toRecipeDTO(ur.recipe)),
        total,
        page,
        totalPages: Math.ceil(total / RECIPES_PER_PAGE),
      };
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
          const existing = await tx.userRecipe.findUnique({
            where: { userId_recipeId: { userId, recipeId } },
            select: { id: true },
          });

          if (existing) {
            return; // Already linked, no quota consumed
          }

          const count = await tx.userRecipe.count({
            where: { userId, savedAt: { gte: startOfDay } },
          });

          if (count >= dailyLimit) {
            throw new Error("Daily recipe limit reached");
          }

          await tx.userRecipe.create({ data: { userId, recipeId } });
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
