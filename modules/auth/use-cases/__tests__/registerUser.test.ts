import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerUser } from "@/modules/auth/use-cases/registerUser";
import type { UserRepository, AuthService } from "@/modules/auth/types";

describe("registerUser", () => {
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

  it("should register a new user and return user data", async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(mockAuthService.hashPassword).mockResolvedValue("hashed_password");
    vi.mocked(mockUserRepository.createUser).mockResolvedValue({
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
    });

    const result = await registerUser(
      { name: "John Doe", email: "john@example.com", password: "securePass123" },
      { userRepository: mockUserRepository, authService: mockAuthService }
    );

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("john@example.com");
    expect(mockAuthService.hashPassword).toHaveBeenCalledWith("securePass123");
    expect(mockUserRepository.createUser).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      passwordHash: "hashed_password",
    });
    expect(result).toEqual({
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
    });
  });

  it("should throw an error if email already exists", async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue({
      id: "existing-user",
      name: "Existing User",
      email: "john@example.com",
      passwordHash: "some_hash",
    });

    await expect(
      registerUser(
        { name: "John Doe", email: "john@example.com", password: "securePass123" },
        { userRepository: mockUserRepository, authService: mockAuthService }
      )
    ).rejects.toThrow("Email already registered");

    expect(mockAuthService.hashPassword).not.toHaveBeenCalled();
    expect(mockUserRepository.createUser).not.toHaveBeenCalled();
  });

  it("should throw an error if input data is invalid", async () => {
    await expect(
      registerUser(
        { name: "", email: "", password: "" },
        { userRepository: mockUserRepository, authService: mockAuthService }
      )
    ).rejects.toThrow("Name, email, and password are required");

    expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
  });
});
