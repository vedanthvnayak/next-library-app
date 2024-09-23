"use server";
import { DrizzleManager } from "@/db/drizzleDbConnection";
import { BookRepository } from "@/repository/books.repository";
import { IBook } from "@/repository/models/books.model";

const bookRepository = new BookRepository();

export async function deleteBook(id: number) {
  try {
    await bookRepository.delete(id);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete book", error);
    return { success: false, error: error.message };
  }
}

export async function getBookInfo(id: number) {
  try {
    const book = await bookRepository.getById(id);
    return { bookData: book, success: true };
  } catch (error) {
    console.error("Failed to get book details", error);
    return { success: false, error: error.message };
  }
}
export async function updateBookInfo(bookData: IBook) {
  try {
    await bookRepository.update(bookData.id, bookData);
    return { success: true };
  } catch (error) {
    console.error("Failed to update book details", error);
    return { success: false, error: error.message };
  }
}

export async function addBook(bookData: IBook) {
  try {
    await bookRepository.create(bookData);
    return { success: true };
  } catch (error) {
    console.error("Failed to insert book details", error);
    return { success: false, error: error.message };
  }
}
