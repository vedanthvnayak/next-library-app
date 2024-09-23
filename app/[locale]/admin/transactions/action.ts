"use server";
import { DrizzleManager } from "@/db/drizzleDbConnection";
import { BookRepository } from "@/repository/books.repository";
import { TransactionRepository } from "@/repository/transaction.repository";

const bookRepository = new BookRepository();
const transactionRepository = new TransactionRepository();

export async function deleteTransaction(transactionId: number) {
  try {
    await transactionRepository.delete(transactionId);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete transaction", error);
    return { success: false, error: error.message };
  }
}
