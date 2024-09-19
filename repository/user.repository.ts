import bcrypt from "bcrypt";
import { IRepository } from "@/repository/models/repository";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq, like, sql } from "drizzle-orm";
import { users as usersTable } from "@/db/drizzle/schema";
import { IUserBase, IUser } from "@/repository/models/user.model";
import { IPagedResponse, IPageRequest } from "./models/pagination.model";
import { db } from "@/db/db";
import { profile } from "console";
export class UserRepository implements IRepository<IUserBase, IUser> {
  constructor(private readonly db: MySql2Database<Record<string, unknown>>) {}

  /**
   * Creates a new user and adds them to the repository.
   * @param {IUserBase} data - The base data for the user to be created.
   * @returns {Promise<IUser>} The created user with assigned ID.
   */
  async create(data: IUserBase): Promise<IUser> {
    console.log(data);
    const saltRounds = 10;

    // Ensure you're hashing the plain password, not an already hashed one
    if (!data.password) {
      throw new Error("Password is required for user creation");
    }

    // Hash the plain text password
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    // Prepare the user data with the hashed password
    const user = {
      username: data.username,
      email: data.email,
      password: passwordHash,
      role: data.role,
      profileimage: data.profileimage || "", // Default to empty string if not provided
    };

    try {
      // Insert the user and return the inserted row
      const [insertedUser] = await db
        .insert(usersTable)
        .values(user)
        .returning({
          userid: usersTable.userid,
          username: usersTable.username,
          email: usersTable.email,
          role: usersTable.role,
          profileimage: usersTable.profileimage,
        });

      if (insertedUser) {
        return insertedUser as IUser;
      } else {
        throw new Error("Failed to insert user.");
      }
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  }

  /**
   * Updates an existing user in the repository.
   * @param {number} id - The ID of the user to update.
   * @param {IUser} data - The new data for the user.
   * @returns {Promise<IUser | null>} The updated user or null if the user was not found.
   */
  async update(id: number, data: IUser): Promise<IUser | null> {
    try {
      // Hash the password before updating
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(data.password, saltRounds);

      // Prepare the updated user data with hashed password
      const updatedData = {
        ...data,
        password: passwordHash, // Update password with hashed version
      };

      // Perform the update query and return the updated user
      const [updatedUser] = await db
        .update(usersTable)
        .set(updatedData)
        .where(eq(usersTable.userid, id))
        .returning({
          userid: usersTable.userid,
          username: usersTable.username,
          email: usersTable.email,
          role: usersTable.role,
          profileimage: usersTable.profileimage,
        });

      // Check if update was successful and return the updated user
      if (updatedUser) {
        return updatedUser as IUser;
      } else {
        console.log("Unable to update the user: User not found.");
        return null;
      }
    } catch (err) {
      console.error("Error updating user:", err);
      throw new Error("User update failed.");
    }
  }

  /**
   * Deletes a user from the repository.
   * @param {number} id - The ID of the user to delete.
   * @returns {Promise<IUser | null>} The deleted user or null if the user was not found.
   */
  async delete(id: number): Promise<IUser | null> {
    try {
      const [deletingUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.userid, id))
        .execute();

      if (deletingUser) {
        await db.delete(usersTable).where(eq(usersTable.userid, id)).execute();
        return deletingUser as IUser;
      } else {
        console.log("User does not exist.");
        return null;
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      throw err;
    }
  }

  /**
   * Retrieves a user by their ID.
   * @param {number} id - The ID of the user to retrieve.
   * @returns {Promise<IUser | null>} The user with the specified ID or null if not found.
   */
  async getById(id: number): Promise<IUser | null> {
    try {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.userid, id))
        .execute();

      return user as IUser;
    } catch (err) {
      console.error("Error fetching user:", err);
      throw err;
    }
  }

  /**
   * Lists users with optional search, pagination, and filters.
   * @param {object} params - The parameters for listing users.
   * @param {number} [params.limit=10] - The maximum number of users to return.
   * @param {number} [params.offset=0] - The number of users to skip.
   * @param {string} [params.search] - Optional search keyword for filtering users by username or email.
   * @returns {Promise<{items: IUser[], pagination: {offset: number, limit: number, total: number, hasNext: boolean, hasPrevious: boolean}}>}
   */
  async list(params: IPageRequest): Promise<IPagedResponse<IUser> | undefined> {
    let searchWhereClause;
    let orderByClause;

    // Construct the search WHERE clause
    if (params.search) {
      const search = `%${params.search.toLowerCase()}%`;
      searchWhereClause = sql`${usersTable.username} LIKE ${search} OR ${usersTable.email} LIKE ${search} OR ${usersTable.userid} LIKE ${search}`;
    }

    // Determine the ORDER BY clause based on the sort parameter
    switch (params.sort) {
      case "username-asc":
        orderByClause = sql`${usersTable.username} ASC`;
        break;
      case "username-desc":
        orderByClause = sql`${usersTable.username} DESC`;
        break;
      case "email-asc":
        orderByClause = sql`${usersTable.email} ASC`;
        break;
      case "email-desc":
        orderByClause = sql`${usersTable.email} DESC`;
        break;
      case "id-asc":
        orderByClause = sql`${usersTable.userid} ASC`;
        break;
      case "id-desc":
        orderByClause = sql`${usersTable.userid} DESC`;
        break;
      case "role-asc":
        orderByClause = sql`${usersTable.role} ASC`;
        break;
      case "role-desc":
        orderByClause = sql`${usersTable.role} DESC`;
        break;
      default:
        orderByClause = sql`${usersTable.username} ASC`; // Default sorting
    }

    // Fetch items with search and sorting
    const items: IUser[] = (await db
      .select()
      .from(usersTable)
      .where(searchWhereClause)
      .orderBy(orderByClause)
      .offset(params.offset)
      .limit(params.limit)) as IUser[];

    // Count total items matching the search criteria
    const [{ count: total }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(usersTable)
      .where(searchWhereClause);

    return {
      items,
      pagination: {
        offset: params.offset,
        limit: params.limit,
        total,
      },
    };
  }

  async findByEmail(email: string) {
    try {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .execute();
      return user;
    } catch (err) {
      throw err;
    }
  }

  async getTotalUserCount(): Promise<number> {
    try {
      const result = await (await db)
        .select({ count: sql`COUNT(*)` })
        .from(usersTable);
      return result[0].count as number;
    } catch (err) {
      throw err;
    }
  }
  async updateUsernameByEmail(
    email: string,
    newUsername: string
  ): Promise<IUser | null> {
    try {
      // Check if the user exists by email
      const [existingUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .execute();

      if (!existingUser) {
        console.log("User not found with the provided email.");
        return null;
      }

      // Update the username and return the updated user data
      const [updatedUser] = await db
        .update(usersTable)
        .set({ username: newUsername })
        .where(eq(usersTable.email, email))
        .returning({
          userid: usersTable.userid,
          username: usersTable.username,
          email: usersTable.email,
          role: usersTable.role,
          profileimage: usersTable.profileimage,
        });

      // Ensure the update was successful
      if (!updatedUser) {
        console.log("Unable to update the username.");
        return null;
      }

      // Return the updated user as IUser
      return updatedUser as IUser;
    } catch (err) {
      console.error("Error updating username:", err);
      throw new Error("Failed to update the username.");
    }
  }
  /**
   * Updates the profile image URL for a user using their email.
   * @param {string} email - The email of the user to update.
   * @param {string} newProfileImageUrl - The new URL for the profile image.
   * @returns {Promise<IUser | null>} The updated user or null if the user was not found.
   */
  async updateProfileImageByEmail(
    email: string,
    newProfileImageUrl: string
  ): Promise<IUser | null> {
    try {
      // Check if the user exists by email
      const [existingUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .execute();

      if (!existingUser) {
        console.log("User not found with the provided email.");
        return null;
      }

      // Update the profile image URL and return the updated user data
      const [updatedUser] = await db
        .update(usersTable)
        .set({ profileimage: newProfileImageUrl })
        .where(eq(usersTable.email, email))
        .returning({
          userid: usersTable.userid,
          username: usersTable.username,
          email: usersTable.email,
          role: usersTable.role,
          profileimage: usersTable.profileimage,
        });

      // Ensure the update was successful
      if (!updatedUser) {
        console.log("Unable to update the profile image URL.");
        return null;
      }

      // Return the updated user as IUser
      return updatedUser as IUser;
    } catch (err) {
      console.error("Error updating profile image URL:", err);
      throw new Error("Failed to update the profile image URL.");
    }
  }
}
