import { z } from "zod";

const isMockAI = process.env.MOCK_AI === "true";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  // Not required when MOCK_AI=true — AI clients are bypassed
  OPENAI_API_KEY: isMockAI
    ? z.string().optional().default("mock")
    : z.string().min(1, "OPENAI_API_KEY is required"),
  BLOB_READ_WRITE_TOKEN: isMockAI
    ? z.string().optional().default("mock")
    : z.string().min(1, "BLOB_READ_WRITE_TOKEN is required"),
  MOCK_AI: z.enum(["true", "false"]).optional(),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors;
    const missing = Object.entries(formatted)
      .map(([key, errors]) => `  ${key}: ${errors?.join(", ")}`)
      .join("\n");

    throw new Error(
      `❌ Missing or invalid environment variables:\n${missing}`
    );
  }

  return result.data;
}

export const env = validateEnv();
