import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateDishImage } from "@/modules/image-generation/use-cases/generateDishImage";
import type {
  ImageGenerationService,
  RecipeImageRepository,
  RecipeImageDTO,
  RecipeSource,
  GeneratedImageResult,
} from "@/modules/image-generation/types";

describe("generateDishImage", () => {
  const mockRecipeSource: RecipeSource = {
    findById: vi.fn(),
  };

  const mockImageGenerationService: ImageGenerationService = {
    generateDishImage: vi.fn(),
  };

  const mockRecipeImageRepository: RecipeImageRepository = {
    save: vi.fn(),
    findByRecipeId: vi.fn(),
  };

  const deps = {
    recipeSource: mockRecipeSource,
    imageGenerationService: mockImageGenerationService,
    recipeImageRepository: mockRecipeImageRepository,
  };

  const sampleRecipe = {
    id: "recipe-uuid-123",
    visualDescription:
      "A golden omelette filled with melted cheese and fresh tomato slices, served on a white plate",
  };

  const sampleGeneratedImage: GeneratedImageResult = {
    imageUrl: "https://blob.example.com/production/dish-images/recipe-uuid-123/img-uuid.png",
    prompt: "You are a professional food photography image generator...",
    model: "gpt-image-1",
  };

  const sampleRecipeImageDTO: RecipeImageDTO = {
    id: "image-uuid-456",
    recipeId: "recipe-uuid-123",
    imageUrl: sampleGeneratedImage.imageUrl,
    prompt: sampleGeneratedImage.prompt,
    model: sampleGeneratedImage.model,
    createdAt: new Date("2026-04-26"),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should generate an image, upload it, and save the reference to the DB", async () => {
    vi.mocked(mockRecipeSource.findById).mockResolvedValue(sampleRecipe);
    vi.mocked(mockRecipeImageRepository.findByRecipeId).mockResolvedValue(null);
    vi.mocked(mockImageGenerationService.generateDishImage).mockResolvedValue(
      sampleGeneratedImage
    );
    vi.mocked(mockRecipeImageRepository.save).mockResolvedValue(
      sampleRecipeImageDTO
    );

    const result = await generateDishImage("recipe-uuid-123", deps);

    expect(result).toEqual(sampleRecipeImageDTO);
    expect(mockRecipeSource.findById).toHaveBeenCalledWith("recipe-uuid-123");
    expect(mockImageGenerationService.generateDishImage).toHaveBeenCalledWith(
      sampleRecipe.visualDescription,
      "recipe-uuid-123"
    );
    expect(mockRecipeImageRepository.save).toHaveBeenCalledWith({
      recipeId: "recipe-uuid-123",
      imageUrl: sampleGeneratedImage.imageUrl,
      prompt: sampleGeneratedImage.prompt,
      model: sampleGeneratedImage.model,
    });
  });

  it("should return the existing image without calling the service if one already exists", async () => {
    vi.mocked(mockRecipeSource.findById).mockResolvedValue(sampleRecipe);
    vi.mocked(mockRecipeImageRepository.findByRecipeId).mockResolvedValue(
      sampleRecipeImageDTO
    );

    const result = await generateDishImage("recipe-uuid-123", deps);

    expect(result).toEqual(sampleRecipeImageDTO);
    expect(mockImageGenerationService.generateDishImage).not.toHaveBeenCalled();
    expect(mockRecipeImageRepository.save).not.toHaveBeenCalled();
  });

  it("should throw an error when the recipe is not found", async () => {
    vi.mocked(mockRecipeSource.findById).mockResolvedValue(null);

    await expect(generateDishImage("non-existent-id", deps)).rejects.toThrow(
      "Recipe not found"
    );

    expect(mockImageGenerationService.generateDishImage).not.toHaveBeenCalled();
  });

  it("should throw an error when the recipe has no visual description", async () => {
    vi.mocked(mockRecipeSource.findById).mockResolvedValue({
      id: "recipe-uuid-123",
      visualDescription: "",
    });

    await expect(generateDishImage("recipe-uuid-123", deps)).rejects.toThrow(
      "Recipe has no visual description"
    );

    expect(mockImageGenerationService.generateDishImage).not.toHaveBeenCalled();
  });

  it("should propagate errors from the image generation service", async () => {
    vi.mocked(mockRecipeSource.findById).mockResolvedValue(sampleRecipe);
    vi.mocked(mockRecipeImageRepository.findByRecipeId).mockResolvedValue(null);
    vi.mocked(mockImageGenerationService.generateDishImage).mockRejectedValue(
      new Error("Image model unavailable")
    );

    await expect(generateDishImage("recipe-uuid-123", deps)).rejects.toThrow(
      "Image model unavailable"
    );

    expect(mockRecipeImageRepository.save).not.toHaveBeenCalled();
  });
});
