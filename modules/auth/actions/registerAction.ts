"use server";

import { z } from "zod";
import { registerUser } from "@/modules/auth/use-cases/registerUser";
import { userRepository } from "@/modules/auth/repositories/userRepository";
import { authService } from "@/modules/auth/services/authService";
import type { ActionResponse } from "@/shared/types/common";
import type { AuthUser } from "@/modules/auth/types";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "passwordTooShort")
    .regex(/[A-Z]/, "passwordNoUppercase")
    .regex(/[0-9]/, "passwordNoNumber")
    .regex(/[^A-Za-z0-9]/, "passwordNoSpecial"),
  termsAccepted: z.literal("on"),
});

export async function registerAction(
  formData: FormData
): Promise<ActionResponse<AuthUser>> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    termsAccepted: formData.get("termsAccepted"),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    // Check for specific validation errors
    const hasTermsError = parsed.error.issues.some(
      (i) => i.path[0] === "termsAccepted"
    );
    if (hasTermsError) {
      return { success: false, error: "termsRequired" };
    }

    // Check for password-specific errors
    const passwordError = parsed.error.issues.find(
      (i) => i.path[0] === "password"
    );
    if (passwordError && passwordError.message) {
      // Return the specific password error key from Zod validation
      return { success: false, error: passwordError.message };
    }

    // Generic fallback
    return { success: false, error: "invalidInput" };
  }

  try {
    const user = await registerUser(parsed.data, {
      userRepository,
      authService,
    });
    return { success: true, data: user };
  } catch {
    return { success: false, error: "registrationFailed" };
  }
}
