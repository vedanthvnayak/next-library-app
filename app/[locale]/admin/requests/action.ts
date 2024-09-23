"use server";
import { DrizzleManager } from "@/db/drizzleDbConnection";
import { BookRepository } from "@/repository/books.repository";
import { TransactionRepository } from "@/repository/transaction.repository";

const transactionRepository = new TransactionRepository();
const bookRepository = new BookRepository();

export async function updateStatus(
  id: number,
  status: "approved" | "rejected" | "returned"
) {
  try {
    await transactionRepository.updateStatus(id, status);
    if (status == "approved") {
      const transaction = await transactionRepository.getById(id);
      await bookRepository.updateAvailableNumberOfCopies(
        transaction.bookId,
        -1
      );
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to delete book", error);
    return { success: false, error: error.message };
  }
}
