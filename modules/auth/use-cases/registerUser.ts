import type {
  AuthUser,
  RegisterInput,
  UserRepository,
  AuthService,
} from "../types";

export async function registerUser(
  input: RegisterInput,
  deps: { userRepository: UserRepository; authService: AuthService }
): Promise<AuthUser> {
  const { name, email, password } = input;
  const { userRepository, authService } = deps;

  if (!name.trim() || !email.trim() || !password.trim()) {
    throw new Error("Name, email, and password are required");
  }

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash = await authService.hashPassword(password);

  return userRepository.createUser({ name, email, passwordHash });
}
