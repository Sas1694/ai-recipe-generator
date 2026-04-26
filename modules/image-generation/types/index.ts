// ─── Recipe Image DTO (transport to UI) ──────────────────────────────────────

export interface RecipeImageDTO {
  id: string;
  recipeId: string;
  imageUrl: string;
  prompt: string;
  model: string;
  createdAt: Date;
}

// ─── Generated Image Result (service output) ─────────────────────────────────

export interface GeneratedImageResult {
  imageUrl: string;
  prompt: string;
  model: string;
}

// ─── Service Interface ────────────────────────────────────────────────────────

export interface ImageGenerationService {
  generateDishImage(
    visualDescription: string,
    recipeId: string
  ): Promise<GeneratedImageResult>;
}

// ─── Repository Interface ─────────────────────────────────────────────────────

export interface RecipeImageRepository {
  save(data: {
    recipeId: string;
    imageUrl: string;
    prompt: string;
    model: string;
  }): Promise<RecipeImageDTO>;
  findByRecipeId(recipeId: string): Promise<RecipeImageDTO | null>;
}

// ─── Recipe Source (minimal interface to avoid cross-module coupling) ─────────

export interface RecipeSource {
  findById(id: string): Promise<{ id: string; visualDescription: string } | null>;
  isLinkedToUser(recipeId: string, userId: string): Promise<boolean>;
}
