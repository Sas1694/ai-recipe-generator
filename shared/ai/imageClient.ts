import { openai } from "@/shared/ai/openaiClient";

export const IMAGE_MODEL = "gpt-image-1-mini";

export async function generateImageFromDescription(
  prompt: string
): Promise<Buffer> {
  const response = await openai.images.generate({
    model: IMAGE_MODEL,
    prompt,
    n: 1,
    size: "1024x1024",
    quality: "medium",
  });

  const base64 = (response.data?.[0] as { b64_json?: string } | undefined)
    ?.b64_json;
  if (!base64) {
    throw new Error("No image data returned from model");
  }

  return Buffer.from(base64, "base64");
}
