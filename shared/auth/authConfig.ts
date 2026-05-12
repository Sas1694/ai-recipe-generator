import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Match /generate, /recipes (default locale) and /{locale}/generate, /{locale}/recipes
      const isProtected =
        /^\/(generate|recipes)(\/.*)?$/.test(pathname) ||
        /^\/[a-z]{2}\/(generate|recipes)(\/.*)?$/.test(pathname);

      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL("/auth/login", nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
