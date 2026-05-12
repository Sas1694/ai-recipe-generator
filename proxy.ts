import NextAuth from "next-auth";
import { authConfig } from "@/shared/auth/authConfig";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18n = createIntlMiddleware(routing);
const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
  return handleI18n(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
