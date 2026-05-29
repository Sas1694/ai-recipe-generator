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
  password: z.string().min(6),
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
    const hasTermsError = parsed.error.issues.some(
      (i) => i.path[0] === "termsAccepted"
    );
    return {
      success: false,
      error: hasTermsError ? "termsRequired" : "invalidInput",
    };
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
