"use server";

import { z } from "zod";
import { registerUser } from "@/modules/auth/use-cases/registerUser";
import { userRepository } from "@/modules/auth/repositories/userRepository";
import { authService } from "@/modules/auth/services/authService";
import type { ActionResponse } from "@/shared/types/common";
import type { AuthUser } from "@/modules/auth/types";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerAction(
  formData: FormData
): Promise<ActionResponse<AuthUser>> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false, error: firstError };
  }

  try {
    const user = await registerUser(parsed.data, {
      userRepository,
      authService,
    });
    return { success: true, data: user };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    return { success: false, error: message };
  }
}
