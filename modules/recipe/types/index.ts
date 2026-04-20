// ─── Generated Recipe (LLM output) ──────────────────────────────────────────

export interface GeneratedRecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface GeneratedRecipeStep {
  stepNumber: number;
  instruction: string;
}

export interface GeneratedRecipe {
  title: string;
  description: string;
  visualDescription: string;
  ingredients: GeneratedRecipeIngredient[];
  steps: GeneratedRecipeStep[];
}

// ─── Recipe DTO (transport to UI) ───────────────────────────────────────────

export interface RecipeDTO {
  id: string;
  title: string;
  description: string;
  visualDescription: string;
  ingredientHash: string;
  createdAt: Date;
  ingredients: GeneratedRecipeIngredient[];
  steps: GeneratedRecipeStep[];
}

// ─── Service Interface ──────────────────────────────────────────────────────

export interface RecipeGeneratorService {
  generateRecipe(ingredients: string[]): Promise<GeneratedRecipe>;
}

// ─── Repository Interface ───────────────────────────────────────────────────

export interface RecipeRepository {
  findByIngredientHash(hash: string): Promise<RecipeDTO | null>;
  createRecipe(
    data: GeneratedRecipe,
    ingredientHash: string
  ): Promise<RecipeDTO>;
  linkUserToRecipe(userId: string, recipeId: string): Promise<void>;
  countUserRecipesToday(userId: string): Promise<number>;
  findById(id: string): Promise<RecipeDTO | null>;
  findByUserId(userId: string): Promise<RecipeDTO[]>;
}
