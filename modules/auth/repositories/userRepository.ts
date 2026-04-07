import { prisma } from "@/lib/prisma";
import type { AuthUser, UserRepository, UserWithPassword } from "../types";

export const userRepository: UserRepository = {
  async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<AuthUser> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
      },
      select: { id: true, name: true, email: true },
    });
    return user;
  },

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, passwordHash: true },
    });
  },
};
