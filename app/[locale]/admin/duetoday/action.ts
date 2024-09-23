"use server";
import { BookRepository } from "@/repository/books.repository";
import { TransactionRepository } from "@/repository/transaction.repository";
import { UserRepository } from "@/repository/user.repository";

const transactionRepository = new TransactionRepository();
const bookRepository = new BookRepository();
const userRepository = new UserRepository();

export async function getDueToday() {
  try {
    const dueTodayTransactions =
      await transactionRepository.getTransactionsDueToday();

    if (!dueTodayTransactions || dueTodayTransactions.length === 0) {
      return { success: true, data: [] };
    }

    // Map through each transaction and fetch additional details
    const detailedTransactions = await Promise.all(
      dueTodayTransactions.map(async (transaction) => {
        const book = await bookRepository.getById(transaction.bookId);
        const user = await userRepository.getById(transaction.userId);

        return {
          transactionId: `${transaction.transactionId.toString()}`,
          bookId: `${transaction.bookId.toString()}`,
          bookName: book?.title || "Unknown Title",
          userName: `${user?.username || "Unknown User"}`,
          userEmail: user?.email || "Unknown Email",
          issuedDate: transaction.issuedDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
        };
      })
    );

    return { success: true, data: detailedTransactions };
  } catch (error) {
    console.error("Failed to get due transactions", error);
    return { success: false, error: error.message };
  }
}
export async function returnBookByTransactionId(transactionId: number) {
  try {
    // Update the transaction status to 'returned'
    const result = await transactionRepository.updateStatus(
      transactionId,
      "returned"
    );

    if (!result) {
      throw new Error("Failed to update transaction status.");
    }

    // Optionally, you could fetch and return the updated transaction details
    const updatedTransaction = await transactionRepository.getById(
      transactionId
    );

    return {
      success: true,
      data: updatedTransaction,
    };
  } catch (error) {
    console.error("Failed to return book by transaction ID", error);
    return { success: false, error: error.message };
  }
}
export async function getOverDueToday() {
  try {
    const overDueTodayTransactions =
      await transactionRepository.getOverdueTransactions();

    if (!overDueTodayTransactions || overDueTodayTransactions.length === 0) {
      return { success: true, data: [] };
    }

    // Map through each transaction and fetch additional details
    const detailedTransactions = await Promise.all(
      overDueTodayTransactions.map(async (transaction) => {
        const book = await bookRepository.getById(transaction.bookId);
        const user = await userRepository.getById(transaction.userId);

        return {
          transactionId: `${transaction.transactionId.toString()}`,
          bookId: `${transaction.bookId.toString()}`,
          bookName: book?.title || "Unknown Title",
          userName: `${user?.username || "Unknown User"}`,
          userEmail: user?.email || "Unknown Email",
          issuedDate: transaction.issuedDate.toISOString().split("T")[0],
        };
      })
    );

    return { success: true, data: detailedTransactions };
  } catch (error) {
    console.error("Failed to get Over due transactions", error);
    return { success: false, error: error.message };
  }
}