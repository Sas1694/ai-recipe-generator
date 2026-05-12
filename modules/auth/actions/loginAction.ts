"use server";

import { z } from "zod";
import { signIn } from "@/shared/auth/auth";
import type { ActionResponse } from "@/shared/types/common";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
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
    return { success: false, error: "invalidInput" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch {
    return { success: false, error: "invalidCredentials" };
  }

  return { success: true, data: null };
}
