import React from "react";
import { notFound } from "next/navigation";
import { DrizzleManager } from "@/db/drizzleDbConnection";
import { BookRepository } from "@/repository/books.repository";
import { IBook } from "@/repository/models/books.model";
import BookInfoClient from "@/components/ui/HandelBookInfo";

const drizzleManager = new DrizzleManager();
const db = drizzleManager.getPoolDrizzle();
const bookRepository = new BookRepository(db);

const getBookInfo = async (id: number): Promise<IBook | null> => {
  try {
    return await bookRepository.getById(id);
  } catch (error) {
    console.error("Failed to fetch book info:", error);
    return null;
  }
};

const BookInfoPage: React.FC<{ searchParams: { id: string } }> = async ({
  searchParams,
}) => {
  const id = parseInt(searchParams.id, 10);

  if (isNaN(id)) {
    notFound();
  }

  const book = await getBookInfo(id);

  if (!book) {
    notFound();
  }

  return <BookInfoClient book={book} />;
};

export default BookInfoPage;
