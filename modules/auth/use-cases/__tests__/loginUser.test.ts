import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginUser } from "@/modules/auth/use-cases/loginUser";
import type { UserRepository, AuthService } from "@/modules/auth/types";

describe("loginUser", () => {
  const mockUserRepository: UserRepository = {
    createUser: vi.fn(),
    findByEmail: vi.fn(),
  };

  const mockAuthService: AuthService = {
    hashPassword: vi.fn(),
    verifyPassword: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return user data with valid credentials", async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue({
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      passwordHash: "hashed_password",
    });
    vi.mocked(mockAuthService.verifyPassword).mockResolvedValue(true);

    const result = await loginUser(
      { email: "john@example.com", password: "securePass123" },
      { userRepository: mockUserRepository, authService: mockAuthService }
    );

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("john@example.com");
    expect(mockAuthService.verifyPassword).toHaveBeenCalledWith(
      "securePass123",
      "hashed_password"
    );
    expect(result).toEqual({
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
    });
  });

  it("should throw an error if email is not found", async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

    await expect(
      loginUser(
        { email: "unknown@example.com", password: "securePass123" },
        { userRepository: mockUserRepository, authService: mockAuthService }
      )
    ).rejects.toThrow("Invalid email or password");

    expect(mockAuthService.verifyPassword).not.toHaveBeenCalled();
  });

  it("should throw an error if password is incorrect", async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue({
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      passwordHash: "hashed_password",
    });
    vi.mocked(mockAuthService.verifyPassword).mockResolvedValue(false);

    await expect(
      loginUser(
        { email: "john@example.com", password: "wrongPassword" },
        { userRepository: mockUserRepository, authService: mockAuthService }
      )
    ).rejects.toThrow("Invalid email or password");
  });
});
