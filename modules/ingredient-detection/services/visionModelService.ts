import { detectIngredientsFromImage } from "@/shared/ai/visionClient";
import type { VisionModelService, ImageData } from "../types";

export const visionModelService: VisionModelService = {
  detectIngredients: (image: ImageData) =>
    detectIngredientsFromImage(image.base64, image.mimeType),
};
