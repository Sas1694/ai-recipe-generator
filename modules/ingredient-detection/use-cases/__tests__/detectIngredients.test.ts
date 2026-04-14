import { describe, it, expect, vi, beforeEach } from "vitest";
import { detectIngredients } from "@/modules/ingredient-detection/use-cases/detectIngredients";
import type { VisionModelService } from "@/modules/ingredient-detection/types";

const testImage = { base64: "valid-base64-image-data", mimeType: "image/jpeg" };

describe("detectIngredients", () => {
  const mockVisionModelService: VisionModelService = {
    detectIngredients: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return a normalized list of ingredients on successful detection", async () => {
    vi.mocked(mockVisionModelService.detectIngredients).mockResolvedValue([
      "Egg",
      "Tomato",
      "CHEESE",
      "tomato",
      "eggs",
    ]);

    const result = await detectIngredients(testImage, {
      visionModelService: mockVisionModelService,
    });

    expect(mockVisionModelService.detectIngredients).toHaveBeenCalledWith(
      testImage
    );
    expect(result).toEqual(["egg", "tomato", "cheese", "eggs"]);
  });

  it("should throw an error if image data is empty", async () => {
    await expect(
      detectIngredients({ base64: "", mimeType: "image/jpeg" }, {
        visionModelService: mockVisionModelService,
      })
    ).rejects.toThrow("Image data is required");

    expect(mockVisionModelService.detectIngredients).not.toHaveBeenCalled();
  });

  it("should handle malformed service response gracefully", async () => {
    vi.mocked(mockVisionModelService.detectIngredients).mockRejectedValue(
      new Error("Failed to parse model response")
    );

    await expect(
      detectIngredients(testImage, {
        visionModelService: mockVisionModelService,
      })
    ).rejects.toThrow("Failed to parse model response");
  });
});
