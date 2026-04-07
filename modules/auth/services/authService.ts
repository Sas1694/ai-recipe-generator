import bcrypt from "bcryptjs";
import type { AuthService } from "../types";

const SALT_ROUNDS = 10;

export const authService: AuthService = {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },
};
