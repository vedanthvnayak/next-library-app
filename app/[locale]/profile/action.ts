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
export async function fetchWalletBalanceByEmail(email: string) {
  try {
    const balance = await userRepository.getWalletAmountByEmail(email);
    return { success: true, amount: balance };
  } catch (error) {
    console.error("Failed to fetch amount", error);
    return { success: false, error: error.message };
  }
}
export async function topUpWallet(email: string, amount: number) {
  "use server";
  try {
    const updatedBalance = await userRepository.addToWalletByEmail(
      email,
      amount
    );
    return { success: true, newBalance: updatedBalance };
  } catch (error) {
    console.error("Failed to top up wallet", error);
    return { success: false, error: error.message };
  }
}
