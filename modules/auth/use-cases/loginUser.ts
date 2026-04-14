import type {
  AuthUser,
  LoginInput,
  UserRepository,
  AuthService,
} from "../types";

export async function loginUser(
  input: LoginInput,
  deps: { userRepository: UserRepository; authService: AuthService }
): Promise<AuthUser> {
  const { email, password } = input;
  const { userRepository, authService } = deps;

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValid = await authService.verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  return { id: user.id, name: user.name, email: user.email };
}
