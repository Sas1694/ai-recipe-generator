/**
 * Type-safe localStorage utilities for the recipe generation flow.
 * Stores and retrieves ingredient state to allow users to resume
 * recipe generation from step 2 without re-detecting ingredients.
 * 
 * User isolation: Each state is tied to a specific userId to prevent
 * cross-user data leaks when users switch accounts in the same browser.
 */

const STORAGE_KEY = "ai-recipe-generator:generate-state";

export interface GenerateState {
  userId: string;
  ingredients: string[];
}

/**
 * Saves the generate state (userId + ingredients) to localStorage.
 * Overwrites any existing state.
 */
export function saveGenerateState(state: GenerateState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // Silently fail if localStorage is not available (SSR, privacy mode, etc.)
    console.error("Failed to save generate state to localStorage:", error);
  }
}

/**
 * Retrieves the generate state from localStorage for a specific user.
 * Returns null if:
 * - No state exists
 * - Data is invalid or malformed
 * - userId does not match the stored userId (prevents cross-user leaks)
 */
export function getGenerateState(userId: string): GenerateState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);

    // Validate structure
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("userId" in parsed) ||
      !("ingredients" in parsed) ||
      typeof parsed.userId !== "string" ||
      !Array.isArray(parsed.ingredients)
    ) {
      return null;
    }

    // Verify userId matches (privacy/security check)
    if (parsed.userId !== userId) {
      return null;
    }

    return parsed as GenerateState;
  } catch (error) {
    // Return null on JSON parse error or any other error
    console.error("Failed to parse generate state from localStorage:", error);
    return null;
  }
}

/**
 * Clears the generate state from localStorage.
 * Safe to call even if no state exists.
 */
export function clearGenerateState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Silently fail if localStorage is not available
    console.error("Failed to clear generate state from localStorage:", error);
  }
}
