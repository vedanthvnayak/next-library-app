import {
  IPageRequest,
  IPagedResponse,
} from "@/repository/models/pagination.model";
import { IRepository } from "./models/repository";
import { ITransaction } from "@/repository/models/transactions.model";
import { transactionsTable } from "@/db/drizzle/schema";
import { and, eq, like, sql, desc } from "drizzle-orm";
import { MySql2Database } from "drizzle-orm/mysql2";

export class TransactionRepository
  implements IRepository<ITransaction, ITransaction>
{
  constructor(private readonly db: MySql2Database<Record<string, unknown>>) {}

  async create(data: ITransaction): Promise<ITransaction> {
    try {
      const [result] = await this.db
        .insert(transactionsTable)
        .values(data)
        .$returningId();
      if (result) {
        return data;
      }
    } catch (err) {
      console.error("Error creating transaction:", err);
      throw err;
    }
  }

  async update(
    id: number,
    data: Partial<ITransaction>
  ): Promise<ITransaction | null> {
    try {
      const result = await this.db
        .update(transactionsTable)
        .set(data)
        .where(eq(transactionsTable.transactionId, id))
        .execute();

      if (result) {
        const [updatedTransaction] = await this.db
          .select()
          .from(transactionsTable)
          .where(eq(transactionsTable.transactionId, id))
          .execute();

        return updatedTransaction as ITransaction;
      } else {
        console.log("Unable to update the transaction");
        return null;
      }
    } catch (err) {
      console.error("Error updating transaction:", err);
      return null;
    }
  }

  async delete(id: number): Promise<ITransaction | null> {
    try {
      const [deletingTransaction] = await this.db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.transactionId, id))
        .execute();

      if (deletingTransaction) {
        const result = await this.db
          .delete(transactionsTable)
          .where(eq(transactionsTable.transactionId, id))
          .execute();

        if (result) {
          return deletingTransaction as ITransaction;
        } else {
          console.error("Deletion unsuccessful");
          return null;
        }
      } else {
        console.error("Transaction does not exist");
        return null;
      }
    } catch (err) {
      console.error("Error deleting transaction:", err);
      throw err;
    }
  }

  async getById(id: number): Promise<ITransaction | null> {
    try {
      const [transaction] = await this.db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.transactionId, id))
        .execute();

      return transaction as ITransaction;
    } catch (err) {
      console.error("Error retrieving transaction:", err);
      throw err;
    }
  }

  async list(
    params: IPageRequest
  ): Promise<IPagedResponse<ITransaction> | undefined> {
    let searchWhereClause;

    if (params.search) {
      const search = `%${params.search.toLowerCase()}%`;
      searchWhereClause = sql`${transactionsTable.transactionId} LIKE ${search} OR ${transactionsTable.status} LIKE ${search}`;
    }

    const items: ITransaction[] = (await this.db
      .select()
      .from(transactionsTable)
      .where(searchWhereClause)
      .offset(params.offset)
      .limit(params.limit)
      .orderBy(desc(transactionsTable.transactionId))
      .execute()) as ITransaction[];

    const [{ count: total }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(transactionsTable)
      .where(searchWhereClause)
      .execute();

    return {
      items,
      pagination: {
        offset: params.offset,
        limit: params.limit,
        total,
      },
    };
  }

  async searchByKeyword(keyword: string): Promise<ITransaction[]> {
    try {
      const results = await this.db
        .select()
        .from(transactionsTable)
        .where(like(transactionsTable.status, `%${keyword}%`))
        .limit(100)
        .execute();

      return results as ITransaction[];
    } catch (err) {
      console.error("Error searching transactions:", err);
      throw err;
    }
  }

  async getTopFourTransaction(): Promise<ITransaction[]> {
    try {
      const results = await this.db
        .select()
        .from(transactionsTable)
        .limit(4)
        .execute();

      return results as ITransaction[];
    } catch (err) {
      console.error("Error retrieving top four transactions:", err);
      throw err;
    }
  }

  async getPendingRequestCount(): Promise<number> {
    try {
      const result = await this.db
        .select({ count: sql`COUNT(*)` })
        .from(transactionsTable)
        .where(eq(transactionsTable.status, "pending"));

      return Number(result[0].count);
    } catch (err) {
      console.error("Error retrieving pending request count:", err);
      throw err;
    }
  }

  async getTotalTransactionCount(): Promise<number> {
    try {
      const result = await this.db
        .select({ count: sql`COUNT(*)` })
        .from(transactionsTable)
        .execute();

      return result[0].count as number;
    } catch (err) {
      console.error("Error retrieving total transaction count:", err);
      throw err;
    }
  }

  async listNonPending(
    params: IPageRequest
  ): Promise<IPagedResponse<ITransaction> | undefined> {
    let searchWhereClause = sql`${transactionsTable.status} != ${"pending"}`;

    if (params.search) {
      const search = `%${params.search.toLowerCase()}%`;
      searchWhereClause = sql`${searchWhereClause} AND (LOWER(${transactionsTable.transactionId}::text) LIKE ${search} OR LOWER(${transactionsTable.status}::text) LIKE ${search})`;
    }

    const items: ITransaction[] = (await this.db
      .select()
      .from(transactionsTable)
      .where(searchWhereClause)
      .offset(params.offset)
      .limit(params.limit)
      .execute()) as ITransaction[];

    const [{ count: total }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(transactionsTable)
      .where(searchWhereClause)
      .execute();

    return {
      items,
      pagination: {
        offset: params.offset,
        limit: params.limit,
        total,
      },
    };
  }

  async listPendingRequest(
    params: IPageRequest
  ): Promise<IPagedResponse<ITransaction> | undefined> {
    let searchWhereClause = sql`${transactionsTable.status} = ${"pending"}`;

    if (params.search) {
      const search = `%${params.search.toLowerCase()}%`;
      searchWhereClause = sql`${searchWhereClause} AND (LOWER(${transactionsTable.transactionId}::text) LIKE ${search} OR LOWER(${transactionsTable.status}::text) LIKE ${search})`;
    }

    const items: ITransaction[] = (await this.db
      .select()
      .from(transactionsTable)
      .where(searchWhereClause)
      .offset(params.offset)
      .limit(params.limit)
      .execute()) as ITransaction[];

    const [{ count: total }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(transactionsTable)
      .where(searchWhereClause)
      .execute();

    return {
      items,
      pagination: {
        offset: params.offset,
        limit: params.limit,
        total,
      },
    };
  }

  async updateStatus(
    id: number,
    status: "approved" | "rejected" | "returned"
  ): Promise<ITransaction | null> {
    try {
      const result = await this.db
        .update(transactionsTable)
        .set({ status })
        .where(eq(transactionsTable.transactionId, id))
        .execute();

      if (result) {
        const [updatedTransaction] = await this.db
          .select()
          .from(transactionsTable)
          .where(eq(transactionsTable.transactionId, id))
          .execute();

        return updatedTransaction as ITransaction;
      } else {
        console.log("Unable to update the transaction status");
        return null;
      }
    } catch (err) {
      console.error("Error updating transaction status:", err);
      throw err;
    }
  }

  /**
   * Retrieves all transactions for a specific user ID.
   * @param {number} userId - The ID of the user for which to retrieve transactions.
   * @returns {Promise<ITransaction[]>} The list of transactions for the specified user ID.
   */
  async getTransactionsByUserId(userId: number): Promise<ITransaction[]> {
    try {
      const results = await this.db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.userId, userId))
        .execute();

      return results as ITransaction[];
    } catch (err) {
      console.error("Error retrieving transactions by user ID:", err);
      throw err;
    }
  }
}
