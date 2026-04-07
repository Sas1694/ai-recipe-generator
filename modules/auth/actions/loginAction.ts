"use server";

import { z } from "zod";
import { signIn } from "@/shared/auth/auth";
import { loginUser } from "@/modules/auth/use-cases/loginUser";
import { userRepository } from "@/modules/auth/repositories/userRepository";
import { authService } from "@/modules/auth/services/authService";
import type { ActionResponse } from "@/shared/types/common";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export async function loginAction(
  formData: FormData
): Promise<ActionResponse<null>> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false, error: firstError };
  }

  try {
    await loginUser(parsed.data, { userRepository, authService });
  } catch {
    return { success: false, error: "Invalid email or password" };
  }

  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirect: false,
  });

  return { success: true, data: null };
}
