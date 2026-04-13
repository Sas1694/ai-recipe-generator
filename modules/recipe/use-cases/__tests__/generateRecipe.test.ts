import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateRecipe } from "@/modules/recipe/use-cases/generateRecipe";
import type {
  RecipeGeneratorService,
  RecipeRepository,
  RecipeDTO,
  GeneratedRecipe,
} from "@/modules/recipe/types";

describe("generateRecipe", () => {
  const mockRecipeGeneratorService: RecipeGeneratorService = {
    generateRecipe: vi.fn(),
  };

  const mockRecipeRepository: RecipeRepository = {
    findByIngredientHash: vi.fn(),
    createRecipe: vi.fn(),
    linkUserToRecipe: vi.fn(),
    countUserRecipesToday: vi.fn(),
    findById: vi.fn(),
    findByUserId: vi.fn(),
  };

  const deps = {
    recipeGeneratorService: mockRecipeGeneratorService,
    recipeRepository: mockRecipeRepository,
  };

  const sampleGeneratedRecipe: GeneratedRecipe = {
    title: "Tomato Cheese Omelette",
    description: "A simple and delicious omelette",
    visualDescription:
      "A golden omelette filled with melted cheese and fresh tomato slices",
    ingredients: [
      { name: "egg", quantity: "3", unit: "units" },
      { name: "tomato", quantity: "1", unit: "unit" },
      { name: "cheese", quantity: "50", unit: "g" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Beat the eggs in a bowl" },
      { stepNumber: 2, instruction: "Add diced tomato and cheese" },
      { stepNumber: 3, instruction: "Cook in a pan over medium heat" },
    ],
  };

  const sampleRecipeDTO: RecipeDTO = {
    id: "recipe-uuid-123",
    title: sampleGeneratedRecipe.title,
    description: sampleGeneratedRecipe.description,
    visualDescription: sampleGeneratedRecipe.visualDescription,
    ingredientHash: "some-hash",
    createdAt: new Date("2026-04-13"),
    ingredients: sampleGeneratedRecipe.ingredients,
    steps: sampleGeneratedRecipe.steps,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should generate a new recipe, store it, and link it to the user", async () => {
    vi.mocked(mockRecipeRepository.countUserRecipesToday).mockResolvedValue(0);
    vi.mocked(mockRecipeRepository.findByIngredientHash).mockResolvedValue(
      null
    );
    vi.mocked(
      mockRecipeGeneratorService.generateRecipe
    ).mockResolvedValue(sampleGeneratedRecipe);
    vi.mocked(mockRecipeRepository.createRecipe).mockResolvedValue(
      sampleRecipeDTO
    );

    const result = await generateRecipe(
      ["egg", "tomato", "cheese"],
      "user-123",
      deps
    );

    expect(result).toEqual(sampleRecipeDTO);
    expect(mockRecipeRepository.countUserRecipesToday).toHaveBeenCalledWith(
      "user-123"
    );
    expect(mockRecipeRepository.findByIngredientHash).toHaveBeenCalled();
    expect(mockRecipeGeneratorService.generateRecipe).toHaveBeenCalledWith([
      "egg",
      "tomato",
      "cheese",
    ]);
    expect(mockRecipeRepository.createRecipe).toHaveBeenCalled();
    expect(mockRecipeRepository.linkUserToRecipe).toHaveBeenCalledWith(
      "user-123",
      "recipe-uuid-123"
    );
  });

  it("should return a cached recipe without calling the LLM when ingredientHash matches", async () => {
    vi.mocked(mockRecipeRepository.countUserRecipesToday).mockResolvedValue(0);
    vi.mocked(mockRecipeRepository.findByIngredientHash).mockResolvedValue(
      sampleRecipeDTO
    );

    const result = await generateRecipe(
      ["cheese", "egg", "tomato"],
      "user-456",
      deps
    );

    expect(result).toEqual(sampleRecipeDTO);
    expect(mockRecipeGeneratorService.generateRecipe).not.toHaveBeenCalled();
    expect(mockRecipeRepository.createRecipe).not.toHaveBeenCalled();
    expect(mockRecipeRepository.linkUserToRecipe).toHaveBeenCalledWith(
      "user-456",
      "recipe-uuid-123"
    );
  });

  it("should throw an error when the user has reached the daily recipe limit", async () => {
    vi.mocked(mockRecipeRepository.countUserRecipesToday).mockResolvedValue(5);

    await expect(
      generateRecipe(["egg", "tomato"], "user-123", deps)
    ).rejects.toThrow("Daily recipe limit reached");

    expect(mockRecipeRepository.findByIngredientHash).not.toHaveBeenCalled();
    expect(mockRecipeGeneratorService.generateRecipe).not.toHaveBeenCalled();
  });

  it("should throw an error when ingredients list is empty", async () => {
    await expect(generateRecipe([], "user-123", deps)).rejects.toThrow(
      "Ingredients are required"
    );

    expect(mockRecipeRepository.countUserRecipesToday).not.toHaveBeenCalled();
  });

  it("should link a cached recipe to the user without duplicating UserRecipe", async () => {
    vi.mocked(mockRecipeRepository.countUserRecipesToday).mockResolvedValue(2);
    vi.mocked(mockRecipeRepository.findByIngredientHash).mockResolvedValue(
      sampleRecipeDTO
    );

    const result = await generateRecipe(["egg", "tomato", "cheese"], "user-789", deps);

    expect(result).toEqual(sampleRecipeDTO);
    expect(mockRecipeRepository.linkUserToRecipe).toHaveBeenCalledWith(
      "user-789",
      "recipe-uuid-123"
    );
    expect(mockRecipeRepository.linkUserToRecipe).toHaveBeenCalledTimes(1);
  });
});
