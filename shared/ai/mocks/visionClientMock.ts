/**
 * Development mock for the vision client.
 * Activated when MOCK_AI=true in .env.local.
 * Returns a hardcoded list of ingredients without calling OpenAI.
 */
export async function detectIngredientsFromImage(
  _imageBase64: string,
  _mimeType: string
): Promise<string[]> {
  console.log("[MOCK] visionClient.detectIngredientsFromImage called");
  return ["tomato", "egg", "cheese", "onion", "olive oil"];
}
