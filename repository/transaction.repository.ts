import {
  IPageRequest,
  IPagedResponse,
} from "@/repository/models/pagination.model";
import { IRepository } from "./models/repository";
import { ITransaction } from "@/repository/models/transactions.model";
import { transactions as transactionsTable } from "@/db/drizzle/schema";
import { and, eq, like, sql, desc } from "drizzle-orm";
import { MySql2Database } from "drizzle-orm/mysql2";
import { db } from "@/db/db";
export class TransactionRepository
  implements IRepository<ITransaction, ITransaction>
{
  constructor(private readonly db: MySql2Database<Record<string, unknown>>) {}

  async create(data: ITransaction): Promise<ITransaction> {
    try {
      // Ensure that the data object matches the expected structure
      const values = {
        userid: data.userId,
        bookid: data.bookId,
        status: data.status,
        // Add other properties if required
      };

      const [result] = await db
        .insert(transactionsTable)
        .values(values)
        .returning({ transactionid: transactionsTable.transactionid }) // Use 'returning' instead of '$returningId'
        .execute();

      if (result) {
        // Return the inserted data with the generated ID
        return { ...data, transactionId: result.transactionid };
      }

      throw new Error("Failed to create transaction");
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
      const result = await db
        .update(transactionsTable)
        .set(data)
        .where(eq(transactionsTable.transactionid, id))
        .returning()
        .execute();

      if (result.length > 0) {
        const updatedTransaction = result[0];
        // Map the result to match ITransaction
        return {
          transactionId: updatedTransaction.transactionid,
          userId: updatedTransaction.userid,
          bookId: updatedTransaction.bookid,
          issuedDate: new Date(updatedTransaction.issueddate), // Convert string to Date
          status: updatedTransaction.status,
        } as ITransaction;
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
      // Fetch the transaction to be deleted
      const [deletingTransaction] = await db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.transactionid, id))
        .execute();

      if (deletingTransaction) {
        // Ensure that the transaction data is in the expected format
        const transactionToReturn: ITransaction = {
          transactionId: deletingTransaction.transactionid,
          userId: deletingTransaction.userid,
          bookId: deletingTransaction.bookid,
          issuedDate: new Date(deletingTransaction.issueddate), // Convert string to Date
          status: deletingTransaction.status,
        };

        // Perform the deletion
        const result = await db
          .delete(transactionsTable)
          .where(eq(transactionsTable.transactionid, id))
          .execute();

        if (result) {
          return transactionToReturn; // Return the correctly formatted transaction
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
      const [transaction] = await db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.transactionid, id))
        .execute();

      if (transaction) {
        // Map database fields to ITransaction
        const transactionToReturn: ITransaction = {
          transactionId: transaction.transactionid,
          userId: transaction.userid,
          bookId: transaction.bookid,
          issuedDate: new Date(transaction.issueddate), // Convert string to Date
          status: transaction.status,
        };

        return transactionToReturn;
      } else {
        console.error("Transaction not found");
        return null;
      }
    } catch (err) {
      console.error("Error retrieving transaction:", err);
      throw err;
    }
  }

  async list(
    params: IPageRequest
  ): Promise<IPagedResponse<ITransaction> | undefined> {
    try {
      let searchWhereClause;

      if (params.search) {
        const search = `%${params.search.toLowerCase()}%`;
        searchWhereClause = sql`${transactionsTable.transactionid}::text LIKE ${search} OR ${transactionsTable.status} LIKE ${search}`;
      } else {
        searchWhereClause = sql`true`; // If no search parameter, ensure query returns results
      }

      // Fetch items with proper mapping
      const rawItems = await db
        .select()
        .from(transactionsTable)
        .where(searchWhereClause)
        .offset(params.offset)
        .limit(params.limit)
        .orderBy(desc(transactionsTable.transactionid))
        .execute();

      // Map database fields to ITransaction
      const items: ITransaction[] = rawItems.map((item) => ({
        transactionId: item.transactionid,
        userId: item.userid,
        bookId: item.bookid,
        issuedDate: new Date(item.issueddate), // Convert string to Date
        status: item.status,
      }));

      // Count total items with proper mapping
      const [{ count: total }] = await db
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
    } catch (err) {
      console.error("Error retrieving transactions:", err);
      throw err;
    }
  }

  async searchByKeyword(keyword: string): Promise<ITransaction[]> {
    try {
      const rawResults = await db
        .select()
        .from(transactionsTable)
        .where(like(transactionsTable.status, `%${keyword}%`))
        .limit(100)
        .execute();

      // Map raw results to ITransaction
      const results: ITransaction[] = rawResults.map((result) => ({
        transactionId: result.transactionid,
        userId: result.userid,
        bookId: result.bookid,
        issuedDate: new Date(result.issueddate), // Convert string to Date
        status: result.status,
      }));

      return results;
    } catch (err) {
      console.error("Error searching transactions:", err);
      throw err;
    }
  }

  async getTopFourTransaction(): Promise<ITransaction[]> {
    try {
      const rawResults = await db
        .select()
        .from(transactionsTable)
        .limit(4)
        .execute();

      // Map raw results to ITransaction
      const results: ITransaction[] = rawResults.map((result) => ({
        transactionId: result.transactionid,
        userId: result.userid,
        bookId: result.bookid,
        issuedDate: new Date(result.issueddate), // Convert string to Date
        status: result.status,
      }));

      return results;
    } catch (err) {
      console.error("Error retrieving top four transactions:", err);
      throw err;
    }
  }

  async getPendingTransactions(): Promise<ITransaction[]> {
    try {
      const rawResults = await db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.status, "pending"))
        .execute();

      // Map raw results to ITransaction
      const transactions: ITransaction[] = rawResults.map((result) => ({
        transactionId: result.transactionid,
        userId: result.userid,
        bookId: result.bookid,
        issuedDate: new Date(result.issueddate), // Convert string to Date
        status: result.status,
      }));

      return transactions;
    } catch (err) {
      console.error("Error retrieving pending transactions:", err);
      throw err;
    }
  }

  async getTotalTransactionCount(): Promise<number> {
    try {
      // Ensure transactionsTable is defined correctly and compatible with your query methods
      const result = await db
        .select({ count: sql`COUNT(*)` })
        .from(transactionsTable as any) // Type assertion if necessary
        .execute();

      // Assuming result[0].count is a bigint, you need to convert it to number
      return Number(result[0].count);
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
      searchWhereClause = sql`${searchWhereClause} AND (LOWER(${transactionsTable.transactionid}::text) LIKE ${search} OR LOWER(${transactionsTable.status}::text) LIKE ${search})`;
    }

    try {
      const rawItems = await db
        .select()
        .from(transactionsTable)
        .where(searchWhereClause)
        .offset(params.offset)
        .limit(params.limit)
        .execute();

      // Map raw results to ITransaction
      const items: ITransaction[] = rawItems.map((result) => ({
        transactionId: result.transactionid,
        userId: result.userid,
        bookId: result.bookid,
        issuedDate: new Date(result.issueddate), // Convert string to Date
        status: result.status,
      }));

      const [{ count: total }] = await db
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
    } catch (err) {
      console.error("Error listing non-pending transactions:", err);
      throw err;
    }
  }

  async listPendingRequest(
    params: IPageRequest
  ): Promise<IPagedResponse<ITransaction> | undefined> {
    // Initialize the where clause
    let searchWhereClause = sql`${
      transactionsTable.status
    } = ${sql`'pending'`}`;

    // Modify the where clause if a search term is provided
    if (params.search) {
      const search = `%${params.search.toLowerCase()}%`;
      searchWhereClause = sql`${searchWhereClause} AND (LOWER(${transactionsTable.transactionid}::text) LIKE ${search} OR LOWER(${transactionsTable.status}::text) LIKE ${search})`;
    }

    try {
      // Fetch items from the database
      const rawItems = await db
        .select()
        .from(transactionsTable)
        .where(searchWhereClause)
        .offset(params.offset)
        .limit(params.limit)
        .execute();

      // Map the database result to ITransaction[]
      const mappedItems: ITransaction[] = rawItems.map((item) => ({
        transactionId: Number(item.transactionid), // Convert bigint to number
        userId: item.userid,
        bookId: item.bookid,
        issuedDate: new Date(item.issueddate), // Convert string to Date
        status: item.status,
      }));

      // Fetch total count
      const [{ count }] = await db
        .select({ count: sql`COUNT(*)` })
        .from(transactionsTable)
        .where(searchWhereClause)
        .execute();

      return {
        items: mappedItems, // Return the mapped items
        pagination: {
          offset: params.offset,
          limit: params.limit,
          total: Number(count), // Ensure count is converted to a number
        },
      };
    } catch (err) {
      console.error("Error listing pending requests:", err);
      throw err;
    }
  }

  async updateStatus(
    id: number,
    status: "approved" | "rejected" | "returned"
  ): Promise<ITransaction | null> {
    try {
      // Perform the update operation
      const result = await db
        .update(transactionsTable)
        .set({ status })
        .where(eq(transactionsTable.transactionid, id))
        .execute();

      // Check if the update was successful
      if (result) {
        // Fetch the updated transaction
        const [rawUpdatedTransaction] = await db
          .select()
          .from(transactionsTable)
          .where(eq(transactionsTable.transactionid, id))
          .execute();

        // Map the database result to ITransaction[]
        const updatedTransaction: ITransaction = {
          transactionId: Number(rawUpdatedTransaction.transactionid), // Convert bigint to number
          userId: rawUpdatedTransaction.userid,
          bookId: rawUpdatedTransaction.bookid,
          issuedDate: new Date(rawUpdatedTransaction.issueddate), // Convert string to Date
          status: rawUpdatedTransaction.status,
        };

        return updatedTransaction;
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
      // Fetch transactions by user ID
      const rawResults = await db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.userid, userId))
        .execute();

      // Map the database result to ITransaction[]
      const transactions: ITransaction[] = rawResults.map((item) => ({
        transactionId: Number(item.transactionid), // Convert bigint to number
        userId: item.userid,
        bookId: item.bookid,
        issuedDate: new Date(item.issueddate), // Convert string to Date
        status: item.status,
      }));

      return transactions;
    } catch (err) {
      console.error("Error retrieving transactions by user ID:", err);
      throw err;
    }
  }

  async getPendingRequestCount(): Promise<number> {
    try {
      // Query to count pending transactions
      const [{ count }] = await db
        .select({ count: sql`COUNT(*)` })
        .from(transactionsTable)
        .where(eq(transactionsTable.status, "pending")) // Ensure status is 'pending'
        .execute();

      // Return the count as a number
      return Number(count);
    } catch (err) {
      console.error("Error getting pending request count:", err);
      return 0; // Return 0 in case of an error
    }
  }
}
