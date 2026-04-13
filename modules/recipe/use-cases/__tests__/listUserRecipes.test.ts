import { describe, it, expect, vi, beforeEach } from "vitest";
import { listUserRecipes } from "@/modules/recipe/use-cases/listUserRecipes";
import type { RecipeRepository, RecipeDTO } from "@/modules/recipe/types";

describe("listUserRecipes", () => {
  const mockRecipeRepository: Pick<RecipeRepository, "findByUserId"> = {
    findByUserId: vi.fn(),
  };

  const deps = { recipeRepository: mockRecipeRepository };

  const sampleRecipes: RecipeDTO[] = [
    {
      id: "recipe-1",
      title: "Omelette",
      description: "Simple egg omelette",
      visualDescription: "A golden omelette",
      ingredientHash: "hash-1",
      createdAt: new Date("2026-04-13"),
      ingredients: [{ name: "egg", quantity: "3", unit: "units" }],
      steps: [{ stepNumber: 1, instruction: "Beat and cook eggs" }],
    },
    {
      id: "recipe-2",
      title: "Salad",
      description: "Fresh tomato salad",
      visualDescription: "A colorful salad",
      ingredientHash: "hash-2",
      createdAt: new Date("2026-04-12"),
      ingredients: [{ name: "tomato", quantity: "2", unit: "units" }],
      steps: [{ stepNumber: 1, instruction: "Slice tomatoes" }],
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return a list of recipes for the user", async () => {
    vi.mocked(mockRecipeRepository.findByUserId).mockResolvedValue(
      sampleRecipes
    );

    const result = await listUserRecipes("user-123", deps);

    expect(result).toEqual(sampleRecipes);
    expect(mockRecipeRepository.findByUserId).toHaveBeenCalledWith("user-123");
  });

  it("should return an empty array when user has no recipes", async () => {
    vi.mocked(mockRecipeRepository.findByUserId).mockResolvedValue([]);

    const result = await listUserRecipes("user-123", deps);

    expect(result).toEqual([]);
  });

  it("should throw an error when userId is empty", async () => {
    await expect(listUserRecipes("", deps)).rejects.toThrow(
      "User ID is required"
    );

    expect(mockRecipeRepository.findByUserId).not.toHaveBeenCalled();
  });
});
