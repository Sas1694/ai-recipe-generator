import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./authConfig";
import { loginUser } from "@/modules/auth/use-cases/loginUser";
import { userRepository } from "@/modules/auth/repositories/userRepository";
import { authService } from "@/modules/auth/services/authService";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await loginUser(
          { email, password },
          { userRepository, authService }
        );

        return user;
      },
    }),
  ],
});
