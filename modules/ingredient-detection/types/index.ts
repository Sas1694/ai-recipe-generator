export interface ImageData {
  base64: string;
  mimeType: string;
}

export interface VisionModelService {
  detectIngredients(image: ImageData, locale?: string): Promise<string[]>;
}
