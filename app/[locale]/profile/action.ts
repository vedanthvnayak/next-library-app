"use server";
import { DrizzleManager } from "@/db/drizzleDbConnection";
import { UserRepository } from "@/repository/user.repository";

const userRepository = new UserRepository();

export async function uploadProfileImage(email: string, url: string) {
  try {
    await userRepository.updateProfileImageByEmail(email, url);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user", error);
    return { success: false, error: error.message };
  }
}
