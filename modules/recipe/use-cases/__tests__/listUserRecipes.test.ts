import { describe, it, expect, vi, beforeEach } from "vitest";
import { listUserRecipes } from "@/modules/recipe/use-cases/listUserRecipes";
import type { RecipeRepository, RecipeDTO, PaginatedRecipeList } from "@/modules/recipe/types";

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
      servings: 4,
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
      servings: 4,
      createdAt: new Date("2026-04-12"),
      ingredients: [{ name: "tomato", quantity: "2", unit: "units" }],
      steps: [{ stepNumber: 1, instruction: "Slice tomatoes" }],
    },
  ];

  const paginatedResult: PaginatedRecipeList = {
    recipes: sampleRecipes,
    total: 2,
    page: 1,
    totalPages: 1,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return paginated recipes for the user", async () => {
    vi.mocked(mockRecipeRepository.findByUserId).mockResolvedValue(
      paginatedResult
    );

    const result = await listUserRecipes("user-123", deps);

    expect(result.recipes).toEqual(sampleRecipes);
    expect(mockRecipeRepository.findByUserId).toHaveBeenCalledWith("user-123", { page: 1 });
  });

  it("should return correct pagination metadata", async () => {
    const multiPageResult: PaginatedRecipeList = {
      recipes: sampleRecipes,
      total: 25,
      page: 2,
      totalPages: 3,
    };
    vi.mocked(mockRecipeRepository.findByUserId).mockResolvedValue(multiPageResult);

    const result = await listUserRecipes("user-123", deps, { page: 2 });

    expect(result.total).toBe(25);
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(3);
    expect(mockRecipeRepository.findByUserId).toHaveBeenCalledWith("user-123", { page: 2 });
  });

  it("should pass query to repository for title filtering", async () => {
    const filteredResult: PaginatedRecipeList = {
      recipes: [sampleRecipes[0]],
      total: 1,
      page: 1,
      totalPages: 1,
    };
    vi.mocked(mockRecipeRepository.findByUserId).mockResolvedValue(filteredResult);

    const result = await listUserRecipes("user-123", deps, { query: "Omelette" });

    expect(result.recipes).toHaveLength(1);
    expect(mockRecipeRepository.findByUserId).toHaveBeenCalledWith("user-123", {
      page: 1,
      query: "Omelette",
    });
  });

  it("should return empty recipes array when query has no matches", async () => {
    const emptyResult: PaginatedRecipeList = {
      recipes: [],
      total: 0,
      page: 1,
      totalPages: 0,
    };
    vi.mocked(mockRecipeRepository.findByUserId).mockResolvedValue(emptyResult);

    const result = await listUserRecipes("user-123", deps, { query: "nonexistent" });

    expect(result.recipes).toEqual([]);
    expect(result.total).toBe(0);
  });

  it("should default to page 1 when no params are given", async () => {
    vi.mocked(mockRecipeRepository.findByUserId).mockResolvedValue(paginatedResult);

    await listUserRecipes("user-123", deps);

    expect(mockRecipeRepository.findByUserId).toHaveBeenCalledWith("user-123", { page: 1 });
  });

  it("should normalize an invalid page (<=0) to page 1", async () => {
    vi.mocked(mockRecipeRepository.findByUserId).mockResolvedValue(paginatedResult);

    await listUserRecipes("user-123", deps, { page: -3 });

    expect(mockRecipeRepository.findByUserId).toHaveBeenCalledWith("user-123", { page: 1 });
  });

  it("should return empty recipes when user has no recipes", async () => {
    const noRecipes: PaginatedRecipeList = { recipes: [], total: 0, page: 1, totalPages: 0 };
    vi.mocked(mockRecipeRepository.findByUserId).mockResolvedValue(noRecipes);

    const result = await listUserRecipes("user-123", deps);

    expect(result.recipes).toEqual([]);
  });

  it("should throw an error when userId is empty", async () => {
    await expect(listUserRecipes("", deps)).rejects.toThrow(
      "User ID is required"
    );

    expect(mockRecipeRepository.findByUserId).not.toHaveBeenCalled();
  });

  it("should throw an error when userId contains only whitespace", async () => {
    await expect(listUserRecipes("   ", deps)).rejects.toThrow(
      "User ID is required"
    );

    expect(mockRecipeRepository.findByUserId).not.toHaveBeenCalled();
  });

  it("should propagate error when the repository fails", async () => {
    vi.mocked(mockRecipeRepository.findByUserId).mockRejectedValue(
      new Error("Database connection lost")
    );

    await expect(listUserRecipes("user-123", deps)).rejects.toThrow(
      "Database connection lost"
    );
  });
});
