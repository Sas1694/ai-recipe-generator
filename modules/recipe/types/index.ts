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
  servings: number;
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
  servings: number;
  createdAt: Date;
  ingredients: GeneratedRecipeIngredient[];
  steps: GeneratedRecipeStep[];
}

// ─── Pagination & Search ────────────────────────────────────────────────────

export interface RecipeListParams {
  page?: number;
  query?: string;
}

export interface PaginatedRecipeList {
  recipes: RecipeDTO[];
  total: number;
  page: number;
  totalPages: number;
}

// ─── Service Interface ──────────────────────────────────────────────────────

export interface RecipeGeneratorService {
  generateRecipe(ingredients: string[], locale?: string): Promise<GeneratedRecipe>;
}

// ─── Repository Interface ───────────────────────────────────────────────────

export interface RecipeRepository {
  findByIngredientHash(hash: string): Promise<RecipeDTO | null>;
  createRecipe(
    data: GeneratedRecipe,
    ingredientHash: string
  ): Promise<RecipeDTO>;
  atomicLinkUserToRecipeWithDailyLimit(
    userId: string,
    recipeId: string,
    dailyLimit: number
  ): Promise<void>;
  countUserRecipesToday(userId: string): Promise<number>;
  findById(id: string): Promise<RecipeDTO | null>;
  findByUserId(userId: string, params?: RecipeListParams): Promise<PaginatedRecipeList>;
  isLinkedToUser(recipeId: string, userId: string): Promise<boolean>;
}
