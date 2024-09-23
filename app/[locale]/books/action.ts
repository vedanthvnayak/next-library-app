"use server";
import { DrizzleManager } from "@/db/drizzleDbConnection";
import { BookRepository } from "@/repository/books.repository";
import { IBook } from "@/repository/models/books.model";
import { TransactionRepository } from "@/repository/transaction.repository";

const drizzleManager = new DrizzleManager();
const db = drizzleManager.getPoolDrizzle();
const bookRepository = new BookRepository(db);
const transactionRepository = new TransactionRepository(db);

export async function requestBook(userId: number, bookId: number) {
  const currentDate = new Date();
  try {
    await transactionRepository.create({
      userId,
      bookId,
      transactionId: 0,
      issuedDate: currentDate,
      status: "pending",
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to create transaction", error);
    return { success: false, error: error.message };
  }
}

export async function getTransactions(userId: number) {
  try {
    // Get the transactions for the user
    const userTransactions =
      await transactionRepository.getTransactionsByUserId(userId);

    // Fetch the book details for each transaction
    const transactionsWithBooks = await Promise.all(
      userTransactions.map(async (transaction) => {
        const book = await bookRepository.getById(transaction.bookId);
        return {
          ...transaction,
          bookName: book ? book.title : "Unknown Book",
        };
      })
    );

    return { data: transactionsWithBooks, success: true };
  } catch (error) {
    console.error("Failed to fetch transactions", error);
    return { success: false, error: error.message };
  }
}
