import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRecipe } from "@/modules/recipe/use-cases/getRecipe";
import type { RecipeRepository, RecipeDTO } from "@/modules/recipe/types";

describe("getRecipe", () => {
  const mockRecipeRepository: Pick<RecipeRepository, "findById"> = {
    findById: vi.fn(),
  };

  const deps = { recipeRepository: mockRecipeRepository };

  const sampleRecipeDTO: RecipeDTO = {
    id: "recipe-uuid-123",
    title: "Tomato Cheese Omelette",
    description: "A simple and delicious omelette",
    visualDescription: "A golden omelette with cheese and tomato",
    ingredientHash: "some-hash",
    createdAt: new Date("2026-04-13"),
    ingredients: [{ name: "egg", quantity: "3", unit: "units" }],
    steps: [{ stepNumber: 1, instruction: "Beat the eggs" }],
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return a recipe when found", async () => {
    vi.mocked(mockRecipeRepository.findById).mockResolvedValue(sampleRecipeDTO);

    const result = await getRecipe("recipe-uuid-123", deps);

    expect(result).toEqual(sampleRecipeDTO);
    expect(mockRecipeRepository.findById).toHaveBeenCalledWith(
      "recipe-uuid-123"
    );
  });

  it("should throw an error when recipe is not found", async () => {
    vi.mocked(mockRecipeRepository.findById).mockResolvedValue(null);

    await expect(getRecipe("nonexistent-id", deps)).rejects.toThrow(
      "Recipe not found"
    );
  });

  it("should throw an error when id is empty", async () => {
    await expect(getRecipe("", deps)).rejects.toThrow("Recipe ID is required");

    expect(mockRecipeRepository.findById).not.toHaveBeenCalled();
  });
});
