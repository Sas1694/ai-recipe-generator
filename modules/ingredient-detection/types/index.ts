export interface VisionModelService {
  detectIngredients(imageBase64: string): Promise<string[]>;
}
