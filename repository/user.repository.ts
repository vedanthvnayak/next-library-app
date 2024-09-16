import bcrypt from "bcrypt";
import { IRepository } from "@/repository/models/repository";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq, like, sql } from "drizzle-orm";
import { usersTable } from "@/db/drizzle/schema";
import { IUserBase, IUser } from "@/repository/models/user.model";
import { IPagedResponse, IPageRequest } from "./models/pagination.model";

export class UserRepository implements IRepository<IUserBase, IUser> {
  constructor(private readonly db: MySql2Database<Record<string, unknown>>) {}

  /**
   * Creates a new user and adds them to the repository.
   * @param {IUserBase} data - The base data for the user to be created.
   * @returns {Promise<IUser>} The created user with assigned ID.
   */
  async create(data: IUserBase): Promise<IUser> {
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.passwordHash, saltRounds);

    // Prepare user data with hashed password
    const user = {
      username: data.username,
      email: data.email,
      passwordHash,
      role: data.role,
    };

    try {
      const [insertedUserId] = await this.db
        .insert(usersTable)
        .values(user)
        .$returningId();

      if (insertedUserId) {
        const insertedUser = await this.db
          .select()
          .from(usersTable)
          .where(eq(usersTable.userId, insertedUserId.userId))
          .execute();

        if (insertedUser.length > 0) {
          return insertedUser[0] as IUser;
        } else {
          throw new Error("Failed to retrieve the inserted user.");
        }
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
    const saltRounds = 10;
    data.passwordHash = await bcrypt.hash(data.passwordHash, saltRounds);
    try {
      const [result] = await this.db
        .update(usersTable)
        .set(data)
        .where(eq(usersTable.userId, id))
        .execute();

      if (result.affectedRows > 0) {
        const [updatedUser] = await this.db
          .select()
          .from(usersTable)
          .where(eq(usersTable.userId, id))
          .execute();

        return updatedUser as IUser;
      } else {
        console.log("Unable to update the user: User not found.");
        return null;
      }
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    }
  }

  /**
   * Deletes a user from the repository.
   * @param {number} id - The ID of the user to delete.
   * @returns {Promise<IUser | null>} The deleted user or null if the user was not found.
   */
  async delete(id: number): Promise<IUser | null> {
    try {
      const [deletingUser] = await this.db
        .select()
        .from(usersTable)
        .where(eq(usersTable.userId, id))
        .execute();

      if (deletingUser) {
        await this.db
          .delete(usersTable)
          .where(eq(usersTable.userId, id))
          .execute();
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
      const [user] = await this.db
        .select()
        .from(usersTable)
        .where(eq(usersTable.userId, id))
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
      searchWhereClause = sql`${usersTable.username} LIKE ${search} OR ${usersTable.email} LIKE ${search} OR ${usersTable.userId} LIKE ${search}`;
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
        orderByClause = sql`${usersTable.userId} ASC`;
        break;
      case "id-desc":
        orderByClause = sql`${usersTable.userId} DESC`;
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
    const items: IUser[] = (await this.db
      .select()
      .from(usersTable)
      .where(searchWhereClause)
      .orderBy(orderByClause)
      .offset(params.offset)
      .limit(params.limit)) as IUser[];

    // Count total items matching the search criteria
    const [{ count: total }] = await this.db
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
      const [user] = await this.db
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
      const result = await (await this.db)
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
      // Find the user by email
      const [user] = await this.db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .execute();

      if (!user) {
        console.log("User not found with the provided email.");
        return null;
      }

      // Update the username
      const [result] = await this.db
        .update(usersTable)
        .set({ username: newUsername })
        .where(eq(usersTable.email, email))
        .execute();

      if (result.affectedRows > 0) {
        // Fetch the updated user
        const [updatedUser] = await this.db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, email))
          .execute();

        return updatedUser as IUser;
      } else {
        console.log("Unable to update the username.");
        return null;
      }
    } catch (err) {
      console.error("Error updating username:", err);
      throw err;
    }
  }
}
