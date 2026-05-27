import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  saveGenerateState,
  getGenerateState,
  clearGenerateState,
} from "@/lib/localStorage";

const STORAGE_KEY = "ai-recipe-generator:generate-state";
const TEST_USER_ID = "user-123";
const ANOTHER_USER_ID = "user-456";

describe("localStorage utility", () => {
  let localStorageMock: Record<string, string>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Create a fresh mock for each test
    localStorageMock = {};

    const mockStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
      get length() {
        return Object.keys(localStorageMock).length;
      },
      key: vi.fn((index: number) => {
        const keys = Object.keys(localStorageMock);
        return keys[index] || null;
      }),
    };

    vi.stubGlobal("localStorage", mockStorage);
    
    // Suppress console.error during tests
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    consoleErrorSpy.mockRestore();
  });

  describe("saveGenerateState", () => {
    it("should save ingredients and userId to localStorage", () => {
      const ingredients = ["tomato", "cheese", "onion"];

      saveGenerateState({ userId: TEST_USER_ID, ingredients });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify({ userId: TEST_USER_ID, ingredients })
      );
      expect(localStorageMock[STORAGE_KEY]).toBe(
        JSON.stringify({ userId: TEST_USER_ID, ingredients })
      );
    });

    it("should overwrite existing data when called multiple times", () => {
      const firstIngredients = ["tomato", "cheese"];
      const secondIngredients = ["potato", "carrot", "garlic"];

      saveGenerateState({ userId: TEST_USER_ID, ingredients: firstIngredients });
      saveGenerateState({ userId: TEST_USER_ID, ingredients: secondIngredients });

      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
      expect(localStorageMock[STORAGE_KEY]).toBe(
        JSON.stringify({ userId: TEST_USER_ID, ingredients: secondIngredients })
      );
    });

    it("should save empty ingredients array", () => {
      const ingredients: string[] = [];

      saveGenerateState({ userId: TEST_USER_ID, ingredients });

      expect(localStorageMock[STORAGE_KEY]).toBe(
        JSON.stringify({ userId: TEST_USER_ID, ingredients })
      );
    });
  });

  describe("getGenerateState", () => {
    it("should return null when localStorage is empty", () => {
      const result = getGenerateState(TEST_USER_ID);

      expect(result).toBeNull();
      expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it("should return parsed ingredients when valid data exists and userId matches", () => {
      const ingredients = ["tomato", "cheese", "onion"];
      localStorageMock[STORAGE_KEY] = JSON.stringify({ userId: TEST_USER_ID, ingredients });

      const result = getGenerateState(TEST_USER_ID);

      expect(result).toEqual({ userId: TEST_USER_ID, ingredients });
    });

    it("should return null when userId does not match", () => {
      const ingredients = ["tomato", "cheese", "onion"];
      localStorageMock[STORAGE_KEY] = JSON.stringify({ userId: TEST_USER_ID, ingredients });

      const result = getGenerateState(ANOTHER_USER_ID);

      expect(result).toBeNull();
    });

    it("should return null when localStorage contains invalid JSON", () => {
      localStorageMock[STORAGE_KEY] = "{ invalid json }";

      const result = getGenerateState(TEST_USER_ID);

      expect(result).toBeNull();
    });

    it("should return null when localStorage contains malformed data structure", () => {
      localStorageMock[STORAGE_KEY] = JSON.stringify({ wrongKey: "value" });

      const result = getGenerateState(TEST_USER_ID);

      expect(result).toBeNull();
    });

    it("should return null when ingredients is not an array", () => {
      localStorageMock[STORAGE_KEY] = JSON.stringify({ userId: TEST_USER_ID, ingredients: "not-an-array" });

      const result = getGenerateState(TEST_USER_ID);

      expect(result).toBeNull();
    });

    it("should return null when userId is missing from stored data", () => {
      const ingredients = ["tomato", "cheese"];
      localStorageMock[STORAGE_KEY] = JSON.stringify({ ingredients });

      const result = getGenerateState(TEST_USER_ID);

      expect(result).toBeNull();
    });

    it("should handle empty ingredients array correctly when userId matches", () => {
      const ingredients: string[] = [];
      localStorageMock[STORAGE_KEY] = JSON.stringify({ userId: TEST_USER_ID, ingredients });

      const result = getGenerateState(TEST_USER_ID);

      expect(result).toEqual({ userId: TEST_USER_ID, ingredients: [] });
    });

    it("should return null when ingredients array contains non-string elements (objects)", () => {
      localStorageMock[STORAGE_KEY] = JSON.stringify({ userId: TEST_USER_ID, ingredients: [{}] });

      const result = getGenerateState(TEST_USER_ID);

      expect(result).toBeNull();
    });

    it("should return null when ingredients array contains non-string elements (numbers)", () => {
      localStorageMock[STORAGE_KEY] = JSON.stringify({ userId: TEST_USER_ID, ingredients: [1, 2, 3] });

      const result = getGenerateState(TEST_USER_ID);

      expect(result).toBeNull();
    });

    it("should return null when ingredients array contains mixed types", () => {
      localStorageMock[STORAGE_KEY] = JSON.stringify({ userId: TEST_USER_ID, ingredients: ["tomato", 123, null] });

      const result = getGenerateState(TEST_USER_ID);

      expect(result).toBeNull();
    });
  });

  describe("clearGenerateState", () => {
    it("should remove the key from localStorage", () => {
      const ingredients = ["tomato", "cheese"];
      localStorageMock[STORAGE_KEY] = JSON.stringify({ ingredients });

      clearGenerateState();

      expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
      expect(localStorageMock[STORAGE_KEY]).toBeUndefined();
    });

    it("should not throw when clearing non-existent key", () => {
      expect(() => clearGenerateState()).not.toThrow();
      expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });
  });
});
