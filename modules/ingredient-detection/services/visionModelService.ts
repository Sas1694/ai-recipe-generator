import { detectIngredientsFromImage } from "@/shared/ai/visionClient";
import type { VisionModelService } from "../types";

export const visionModelService: VisionModelService = {
  detectIngredients: (imageBase64: string) =>
    detectIngredientsFromImage(imageBase64),
};
