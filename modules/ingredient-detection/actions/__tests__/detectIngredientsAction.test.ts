import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-intl/server", () => ({
  getLocale: vi.fn().mockResolvedValue("en"),
}));

vi.mock("@/shared/auth/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/modules/recipe/repositories/recipeRepository", () => ({
  recipeRepository: {
    countUserRecipesToday: vi.fn(),
  },
}));

vi.mock("@/modules/ingredient-detection/use-cases/detectIngredients", () => ({
  detectIngredients: vi.fn(),
}));

vi.mock("@/modules/ingredient-detection/services/visionModelService", () => ({
  visionModelService: { detectIngredients: vi.fn() },
}));

import type { Session } from "next-auth";
import { auth } from "@/shared/auth/auth";
import { recipeRepository } from "@/modules/recipe/repositories/recipeRepository";
import { detectIngredients } from "@/modules/ingredient-detection/use-cases/detectIngredients";
import { detectIngredientsAction } from "@/modules/ingredient-detection/actions/detectIngredientsAction";
import { DAILY_RECIPE_LIMIT, MAX_IMAGE_SIZE_BYTES } from "@/shared/config/limits";

const mockedAuth = vi.mocked(auth as unknown as () => Promise<Session | null>);

function createImageFormData(options?: {
  type?: string;
  sizeBytes?: number;
}): FormData {
  const type = options?.type ?? "image/jpeg";
  const sizeBytes = options?.sizeBytes ?? 100;
  const file = new File([new Uint8Array(sizeBytes)], "test.jpg", { type });
  const fd = new FormData();
  fd.append("image", file);
  return fd;
}

describe("detectIngredientsAction", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return an error when the user is not authenticated", async () => {
    mockedAuth.mockResolvedValue(null);

    const result = await detectIngredientsAction(createImageFormData());

    expect(result).toEqual({ success: false, error: "authRequired" });
    expect(recipeRepository.countUserRecipesToday).not.toHaveBeenCalled();
    expect(detectIngredients).not.toHaveBeenCalled();
  });

  it("should return an error when the daily recipe limit has been reached", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "user-123" } } as unknown as Session);
    vi.mocked(recipeRepository.countUserRecipesToday).mockResolvedValue(
      DAILY_RECIPE_LIMIT
    );

    const result = await detectIngredientsAction(createImageFormData());

    expect(result).toEqual({
      success: false,
      error: "dailyLimitReached",
    });
    expect(recipeRepository.countUserRecipesToday).toHaveBeenCalledWith(
      "user-123"
    );
    expect(detectIngredients).not.toHaveBeenCalled();
  });

  it("should return an error for an unsupported image format", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "user-123" } } as unknown as Session);
    vi.mocked(recipeRepository.countUserRecipesToday).mockResolvedValue(0);

    const result = await detectIngredientsAction(
      createImageFormData({ type: "image/tiff" })
    );

    expect(result.success).toBe(false);
    expect(result.success === false && result.error).toBe("invalidInput");
    expect(detectIngredients).not.toHaveBeenCalled();
  });

  it("should return an error when the image exceeds the size limit", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "user-123" } } as unknown as Session);
    vi.mocked(recipeRepository.countUserRecipesToday).mockResolvedValue(0);

    const result = await detectIngredientsAction(
      createImageFormData({ sizeBytes: MAX_IMAGE_SIZE_BYTES + 1 })
    );

    expect(result.success).toBe(false);
    expect(result.success === false && result.error).toBe("invalidInput");
    expect(detectIngredients).not.toHaveBeenCalled();
  });

  it("should detect ingredients and return them when auth and limit are valid", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "user-123" } } as unknown as Session);
    vi.mocked(recipeRepository.countUserRecipesToday).mockResolvedValue(0);
    vi.mocked(detectIngredients).mockResolvedValue(["egg", "tomato", "cheese"]);

    const result = await detectIngredientsAction(createImageFormData());

    expect(result).toEqual({ success: true, data: ["egg", "tomato", "cheese"] });
    expect(detectIngredients).toHaveBeenCalled();
  });

  it("should return an error when ingredient detection fails", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "user-123" } } as unknown as Session);
    vi.mocked(recipeRepository.countUserRecipesToday).mockResolvedValue(0);
    vi.mocked(detectIngredients).mockRejectedValue(
      new Error("Vision model unavailable")
    );

    const result = await detectIngredientsAction(createImageFormData());

    expect(result).toEqual({
      success: false,
      error: "ingredientDetectionFailed",
    });
  });
});
