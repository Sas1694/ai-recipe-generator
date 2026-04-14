export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserWithPassword {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export interface UserRepository {
  createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<AuthUser>;
  findByEmail(email: string): Promise<UserWithPassword | null>;
}

export interface AuthService {
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
}
