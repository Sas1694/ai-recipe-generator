import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteUser } from "@/modules/auth/use-cases/deleteUser";
import type { UserRepository } from "@/modules/auth/types";

describe("deleteUser", () => {
  const mockUserRepository: UserRepository = {
    createUser: vi.fn(),
    findByEmail: vi.fn(),
    deleteUser: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should call userRepository.deleteUser with the provided userId", async () => {
    vi.mocked(mockUserRepository.deleteUser).mockResolvedValue(undefined);

    await deleteUser("user-123", { userRepository: mockUserRepository });

    expect(mockUserRepository.deleteUser).toHaveBeenCalledWith("user-123");
    expect(mockUserRepository.deleteUser).toHaveBeenCalledTimes(1);
  });

  it("should propagate errors from userRepository.deleteUser", async () => {
    const expectedError = new Error("Database connection failed");
    vi.mocked(mockUserRepository.deleteUser).mockRejectedValue(expectedError);

    await expect(
      deleteUser("user-123", { userRepository: mockUserRepository })
    ).rejects.toThrow("Database connection failed");

    expect(mockUserRepository.deleteUser).toHaveBeenCalledWith("user-123");
  });
});
