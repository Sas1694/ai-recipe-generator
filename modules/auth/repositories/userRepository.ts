import { prisma } from "@/lib/prisma";
import type { AuthUser, UserRepository, UserWithPassword } from "../types";

export const userRepository: UserRepository = {
  async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<AuthUser> {
    try {
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash: data.passwordHash,
        },
        select: { id: true, name: true, email: true },
      });
      return user;
    } catch (error) {
      const isPrismaUniqueError =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002";
      if (isPrismaUniqueError) {
        throw new Error("Email already registered");
      }
      throw new Error("Failed to create user");
    }
  },

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    try {
      return await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true, passwordHash: true },
      });
    } catch {
      throw new Error("Failed to retrieve user");
    }
  },
};
