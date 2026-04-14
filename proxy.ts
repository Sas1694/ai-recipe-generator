import NextAuth from "next-auth";
import { authConfig } from "@/shared/auth/authConfig";

const { auth } = NextAuth(authConfig);

export const proxy = auth;

export const config = {
  matcher: ["/generate/:path*", "/recipes/:path*"],
};
