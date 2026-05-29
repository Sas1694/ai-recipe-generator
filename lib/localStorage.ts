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
 * Generic helper: Safely reads from localStorage, returning null if unavailable.
 * Used by other localStorage utilities.
 */
export function getLocalStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("Failed to read from localStorage:", error);
    return null;
  }
}

/**
 * Generic helper: Safely writes to localStorage, failing silently if unavailable.
 * Used by other localStorage utilities.
 */
export function setLocalStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error("Failed to write to localStorage:", error);
  }
}

/**
 * Generic helper: Safely removes from localStorage, failing silently if unavailable.
 * Used by other localStorage utilities.
 */
export function removeLocalStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to remove from localStorage:", error);
  }
}

/**
 * Saves the generate state (userId + ingredients) to localStorage.
 * Overwrites any existing state.
 */
export function saveGenerateState(state: GenerateState): void {
  setLocalStorageItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * Retrieves the generate state from localStorage for a specific user.
 * Returns null if:
 * - No state exists
 * - Data is invalid or malformed
 * - userId does not match the stored userId (prevents cross-user leaks)
 */
export function getGenerateState(userId: string): GenerateState | null {
  const stored = getLocalStorageItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
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

    // Validate that every ingredient is a string
    if (!parsed.ingredients.every((item: unknown) => typeof item === "string")) {
      return null;
    }

    // Verify userId matches (privacy/security check)
    if (parsed.userId !== userId) {
      return null;
    }

    return parsed as GenerateState;
  } catch (error) {
    // Return null on JSON parse error
    console.error("Failed to parse generate state from localStorage:", error);
    return null;
  }
}

/**
 * Clears the generate state from localStorage.
 * Safe to call even if no state exists.
 */
export function clearGenerateState(): void {
  removeLocalStorageItem(STORAGE_KEY);
}
