"use server";

import { auth, signOut } from "@/shared/auth/auth";
import { deleteUser } from "@/modules/auth/use-cases/deleteUser";
import { userRepository } from "@/modules/auth/repositories/userRepository";
import type { ActionResponse } from "@/shared/types/common";

export async function deleteAccountAction(): Promise<ActionResponse<void>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "authRequired" };
  }

  try {
    await deleteUser(session.user.id, { userRepository });
  } catch {
    return { success: false, error: "registrationFailed" };
  }

  await signOut({ redirectTo: "/" });
  return { success: true, data: undefined };
}
