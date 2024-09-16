"use server";
import { DrizzleManager } from "@/db/drizzleDbConnection";
import { BookRepository } from "@/repository/books.repository";
import { TransactionRepository } from "@/repository/transaction.repository";

const drizzleManager = new DrizzleManager();
const db = drizzleManager.getPoolDrizzle();
const bookRepository = new BookRepository(db);
const transactionRepository = new TransactionRepository(db);

export async function deleteTransaction(transactionId: number) {
  try {
    await transactionRepository.delete(transactionId);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete transaction", error);
    return { success: false, error: error.message };
  }
}
