"use server";
import { DrizzleManager } from "@/db/drizzleDbConnection";
import { IUser } from "@/repository/models/user.model";
import { UserRepository } from "@/repository/user.repository";

const userRepository = new UserRepository();

export async function deleteUser(id: number) {
  try {
    await userRepository.delete(id);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user", error);
    return { success: false, error: error.message };
  }
}

export async function getUserInfo(id: number) {
  try {
    const userInDb = await userRepository.getById(id);
    return { userData: userInDb, success: true };
  } catch (error) {
    console.error("Failed to get user details", error);
    return { success: false, error: error.message };
  }
}
export async function updateUserInfo(userData: IUser) {
  try {
    await userRepository.update(userData.userid, userData);
    return { success: true };
  } catch (error) {
    console.error("Failed to update book details", error);
    return { success: false, error: error.message };
  }
}

export async function addUser(userData: IUser) {
  try {
    await userRepository.create(userData);
    return { success: true };
  } catch (error) {
    console.error("Failed to insert user details", error);
    return { success: false, error: error.message };
  }
}

export async function updateUserNameAndPassword(
  email: string,
  newName: string,
  newPassword?: string // Optional parameter
) {
  try {
    // Fetch the user by email
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    // If newPassword is provided, hash it; otherwise, use the existing password
    const updatedData = {
      userid: user.userid,
      username: newName,
      email: user.email,
      password: newPassword ? newPassword : user.password,
      role: user.role,
      profileimage: user.profileimage || "",
    };

    // Update user information
    await updateUserInfo(updatedData);

    return { success: true };
  } catch (error) {
    console.error("Failed to update user details", error);
    return { success: false, error: error.message };
  }
}
