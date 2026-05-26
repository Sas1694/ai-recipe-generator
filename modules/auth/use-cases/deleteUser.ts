import type { UserRepository } from "@/modules/auth/types";

export async function deleteUser(
  userId: string,
  { userRepository }: { userRepository: UserRepository }
): Promise<void> {
  await userRepository.deleteUser(userId);
}
