"use server";

import { signOut } from "@/shared/auth/auth";

export async function logoutAction() {
  await signOut({ redirect: false });
}
