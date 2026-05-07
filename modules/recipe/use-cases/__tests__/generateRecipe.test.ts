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
    atomicLinkUserToRecipeWithDailyLimit: vi.fn(),
    countUserRecipesToday: vi.fn(),
    findById: vi.fn(),
    findByUserId: vi.fn(),
    isLinkedToUser: vi.fn(),
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
    vi.mocked(mockRecipeRepository.findByIngredientHash).mockResolvedValue(
      null
    );
    vi.mocked(
      mockRecipeGeneratorService.generateRecipe
    ).mockResolvedValue(sampleGeneratedRecipe);
    vi.mocked(mockRecipeRepository.createRecipe).mockResolvedValue(
      sampleRecipeDTO
    );
    vi.mocked(mockRecipeRepository.atomicLinkUserToRecipeWithDailyLimit).mockResolvedValue(undefined);

    const result = await generateRecipe(
      ["egg", "tomato", "cheese"],
      "user-123",
      deps
    );

    expect(result).toEqual(sampleRecipeDTO);
    expect(mockRecipeRepository.findByIngredientHash).toHaveBeenCalled();
    expect(mockRecipeGeneratorService.generateRecipe).toHaveBeenCalledWith([
      "egg",
      "tomato",
      "cheese",
    ]);
    expect(mockRecipeRepository.createRecipe).toHaveBeenCalled();
    expect(mockRecipeRepository.atomicLinkUserToRecipeWithDailyLimit).toHaveBeenCalledWith(
      "user-123",
      "recipe-uuid-123",
      5
    );
  });

  it("should return a cached recipe without calling the LLM when ingredientHash matches", async () => {
    vi.mocked(mockRecipeRepository.findByIngredientHash).mockResolvedValue(
      sampleRecipeDTO
    );
    vi.mocked(mockRecipeRepository.atomicLinkUserToRecipeWithDailyLimit).mockResolvedValue(undefined);

    const result = await generateRecipe(
      ["cheese", "egg", "tomato"],
      "user-456",
      deps
    );

    expect(result).toEqual(sampleRecipeDTO);
    expect(mockRecipeGeneratorService.generateRecipe).not.toHaveBeenCalled();
    expect(mockRecipeRepository.createRecipe).not.toHaveBeenCalled();
    expect(mockRecipeRepository.atomicLinkUserToRecipeWithDailyLimit).toHaveBeenCalledWith(
      "user-456",
      "recipe-uuid-123",
      5
    );
  });

  it("should throw an error when ingredients list is empty", async () => {
    await expect(generateRecipe([], "user-123", deps)).rejects.toThrow(
      "Ingredients are required"
    );
  });

  it("should link a cached recipe to the user without duplicating UserRecipe", async () => {
    vi.mocked(mockRecipeRepository.findByIngredientHash).mockResolvedValue(
      sampleRecipeDTO
    );
    vi.mocked(mockRecipeRepository.atomicLinkUserToRecipeWithDailyLimit).mockResolvedValue(undefined);

    const result = await generateRecipe(["egg", "tomato", "cheese"], "user-789", deps);

    expect(result).toEqual(sampleRecipeDTO);
    expect(mockRecipeRepository.atomicLinkUserToRecipeWithDailyLimit).toHaveBeenCalledWith(
      "user-789",
      "recipe-uuid-123",
      5
    );
    expect(mockRecipeRepository.atomicLinkUserToRecipeWithDailyLimit).toHaveBeenCalledTimes(1);
  });

  it("should propagate error when the LLM service fails", async () => {
    vi.mocked(mockRecipeRepository.findByIngredientHash).mockResolvedValue(null);
    vi.mocked(mockRecipeGeneratorService.generateRecipe).mockRejectedValue(
      new Error("LLM service unavailable")
    );

    await expect(
      generateRecipe(["egg", "tomato"], "user-123", deps)
    ).rejects.toThrow("LLM service unavailable");

    expect(mockRecipeRepository.createRecipe).not.toHaveBeenCalled();
    expect(mockRecipeRepository.atomicLinkUserToRecipeWithDailyLimit).not.toHaveBeenCalled();
  });

  it("should propagate error when createRecipe repository call fails", async () => {
    vi.mocked(mockRecipeRepository.findByIngredientHash).mockResolvedValue(null);
    vi.mocked(mockRecipeGeneratorService.generateRecipe).mockResolvedValue(sampleGeneratedRecipe);
    vi.mocked(mockRecipeRepository.createRecipe).mockRejectedValue(
      new Error("Database write failed")
    );

    await expect(
      generateRecipe(["egg", "tomato", "cheese"], "user-123", deps)
    ).rejects.toThrow("Database write failed");

    expect(mockRecipeRepository.atomicLinkUserToRecipeWithDailyLimit).not.toHaveBeenCalled();
  });

  it("should propagate error when atomicLinkUserToRecipeWithDailyLimit fails", async () => {
    vi.mocked(mockRecipeRepository.findByIngredientHash).mockResolvedValue(null);
    vi.mocked(mockRecipeGeneratorService.generateRecipe).mockResolvedValue(sampleGeneratedRecipe);
    vi.mocked(mockRecipeRepository.createRecipe).mockResolvedValue(sampleRecipeDTO);
    vi.mocked(mockRecipeRepository.atomicLinkUserToRecipeWithDailyLimit).mockRejectedValue(
      new Error("Daily recipe limit reached")
    );

    await expect(
      generateRecipe(["egg", "tomato", "cheese"], "user-123", deps)
    ).rejects.toThrow("Daily recipe limit reached");
  });
});
