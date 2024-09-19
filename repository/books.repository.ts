import { IPageRequest, IPagedResponse } from "./models/pagination.model";
import { IRepository } from "./models/repository";
import { IBookBase, IBook } from "./models/books.model";
import { books as booksTable } from "../db/drizzle/schema";
import { and, eq, ilike, like, sql } from "drizzle-orm";
import { MySql2Database } from "drizzle-orm/mysql2";
import { db } from "@/db/db";
export class BookRepository implements IRepository<IBookBase, IBook> {
  constructor(private readonly db: MySql2Database<Record<string, unknown>>) {}

  /**
   * Creates a new book and adds it to the repository.
   * @param {IBookBase} data - The base data for the book to be created.
   * @returns {Promise<IBook>} The created book with assigned ID and available number of copies.
   */
  async create(data: IBookBase): Promise<IBook> {
    const book = {
      title: data.title,
      author: data.author,
      numofPages: data.numofPages,
      publisher: data.publisher,
      genre: data.genre,
      isbnNo: data.isbnNo,
      totalNumberOfCopies: data.totalNumberOfCopies,
      availableNumberOfCopies: data.totalNumberOfCopies,
    };

    try {
      const [result] = await db
        .insert(booksTable)
        .values(book)
        .returning({ id: booksTable.id });

      const insertedBookId = result.id;
      if (insertedBookId) {
        const [insertedBook] = await db
          .select()
          .from(booksTable)
          .where(eq(booksTable.id, insertedBookId));

        return insertedBook as unknown as IBook;
      } else {
        console.error("Inserted but ID not matching");
        return { ...book, id: 0 } as IBook;
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Updates an existing book in the repository.
   * @param {number} id - The ID of the book to update.
   * @param {IBook} data - The new data for the book.
   * @returns {Promise<IBook | null>} The updated book or null if the book was not found.
   */
  async update(id: number, data: IBook): Promise<IBook | null> {
    try {
      // Perform the update operation
      const result = await db
        .update(booksTable)
        .set(data)
        .where(eq(booksTable.id, BigInt(id))) // Convert `id` to `BigInt`
        .returning(); // Optional: Add returning clause if needed

      if (result) {
        // Fetch the updated book after the update
        const [updatedBook] = await db
          .select()
          .from(booksTable)
          .where(eq(booksTable.id, BigInt(id))); // Convert `id` to `BigInt`

        if (updatedBook) {
          // Convert `bigint` id to number and return as IBook
          return {
            ...updatedBook,
            id: Number(updatedBook.id),
          } as IBook;
        } else {
          console.log("Book not found after update");
          return null;
        }
      } else {
        console.log("Unable to update the book");
        return null;
      }
    } catch (err) {
      console.error("Error updating book:", err);
      return null;
    }
  }

  /**
   * Deletes a book from the repository.
   * @param {number} id - The ID of the book to delete.
   * @returns {Promise<IBook | null>} The deleted book or null if the book was not found.
   */
  async delete(id: number): Promise<IBook | null> {
    try {
      // Fetch the book to be deleted
      const [deletingBook] = await db
        .select()
        .from(booksTable)
        .where(eq(booksTable.id, BigInt(id))); // Convert `id` to `BigInt`

      if (deletingBook) {
        // Delete the book
        const result = await db
          .delete(booksTable)
          .where(eq(booksTable.id, BigInt(id))); // Convert `id` to `BigInt`

        // Check if the deletion was successful
        if (result) {
          // Convert the `bigint` id to `number` when returning the book as IBook
          return {
            ...deletingBook,
            id: Number(deletingBook.id), // Convert id to number
          } as IBook;
        } else {
          console.error("Deleting unsuccessful");
          return null;
        }
      } else {
        console.error("Book does not exist");
        return null;
      }
    } catch (err) {
      console.error("Deletion failed", err);
      return null;
    }
  }

  /**
   * Retrieves a book by its ID.
   * @param {number} id - The ID of the book to retrieve.
   * @returns {IBook | null} The book with the specified ID or null if not found.
   */
  async getById(id: number): Promise<IBook | null> {
    try {
      // Fetch the book by id
      const [fetchedBook] = await db
        .select()
        .from(booksTable)
        .where(eq(booksTable.id, BigInt(id))); // Convert `id` to `BigInt`

      if (fetchedBook) {
        // Convert `bigint` id to `number` and return the book as IBook
        return {
          ...fetchedBook,
          id: Number(fetchedBook.id), // Convert id to number
        } as IBook;
      } else {
        return null; // Book not found
      }
    } catch (err) {
      console.error("Error fetching book by ID", err);
      return null;
    }
  }

  async list(params: IPageRequest): Promise<IPagedResponse<IBook> | undefined> {
    let searchWhereClause;
    let orderByClause;

    // Construct the search WHERE clause
    if (params.search) {
      const search = `%${params.search.toLowerCase()}%`;
      searchWhereClause = sql`${booksTable.title} LIKE ${search} OR ${booksTable.isbnNo} LIKE ${search} OR ${booksTable.author} LIKE ${search} OR ${booksTable.genre} LIKE ${search}`;
    }

    // Determine the ORDER BY clause based on the sort parameter
    switch (params.sort) {
      case "title-asc":
        orderByClause = sql`${booksTable.title} ASC`;
        break;
      case "title-desc":
        orderByClause = sql`${booksTable.title} DESC`;
        break;
      case "author-asc":
        orderByClause = sql`${booksTable.author} ASC`;
        break;
      case "author-desc":
        orderByClause = sql`${booksTable.author} DESC`;
        break;
      case "genre-asc":
        orderByClause = sql`${booksTable.genre} ASC`;
        break;
      case "genre-desc":
        orderByClause = sql`${booksTable.genre} DESC`;
        break;
      case "id-asc":
        orderByClause = sql`${booksTable.id} ASC`;
        break;
      case "id-desc":
        orderByClause = sql`${booksTable.id} DESC`;
        break;
      default:
        orderByClause = sql`${booksTable.title} ASC`; // Default sorting
    }

    // Fetch items with search and sorting
    const items = await db
      .select()
      .from(booksTable)
      .where(searchWhereClause)
      .orderBy(orderByClause)
      .offset(params.offset)
      .limit(params.limit);

    // Convert the items to IBook[] with id as number
    const convertedItems = items.map((item) => ({
      ...item,
      id: Number(item.id), // Convert bigint id to number
    })) as IBook[];

    // Count total items matching the search criteria
    const [{ count: total }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(booksTable)
      .where(searchWhereClause);

    return {
      items: convertedItems,
      pagination: {
        offset: params.offset,
        limit: params.limit,
        total,
      },
    };
  }

  async searchByKeyword(keyword: string): Promise<IBook[]> {
    try {
      const results = await db
        .select()
        .from(booksTable)
        .where(like(booksTable.title, `%${keyword}%`)) // Use 'like' for case-insensitive search
        .limit(100)
        .execute();

      // Convert the results to IBook[] with id as number
      const convertedResults = results.map((item) => ({
        ...item,
        id: Number(item.id), // Convert bigint id to number
      })) as IBook[];

      return convertedResults;
    } catch (err) {
      console.error("Error searching books:", err);
      throw err;
    }
  }

  async getTopFiveBook(): Promise<IBook[]> {
    try {
      // Fetch the top 4 books
      const results = await db.select().from(booksTable).limit(5).execute();

      // Convert the results to IBook[] with id as number
      const convertedResults: IBook[] = results.map((item) => ({
        ...item,
        id: Number(item.id), // Convert bigint id to number
      }));

      return convertedResults;
    } catch (err) {
      console.error("Error fetching top four books:", err);
      throw err;
    }
  }

  async getTotalBookCount(): Promise<number> {
    try {
      const result = await db.select({ count: sql`COUNT(*)` }).from(booksTable);
      return result[0].count as number;
    } catch (err) {
      throw err;
    }
  }
  async updateAvailableNumberOfCopies(id: number, difference: number) {
    try {
      // Convert id to bigint for the query
      const bigintId = BigInt(id);

      // Fetch the current value of availableNumberOfCopies
      const currentBook = await db
        .select({ availableNumberOfCopies: booksTable.availableNumberOfCopies })
        .from(booksTable)
        .where(eq(booksTable.id, bigintId))
        .execute();

      if (currentBook.length === 0) {
        throw new Error("Book not found");
      }

      const currentAvailableNumberOfCopies =
        currentBook[0].availableNumberOfCopies;

      // Update availableNumberOfCopies
      await db
        .update(booksTable)
        .set({
          availableNumberOfCopies: currentAvailableNumberOfCopies + difference,
        })
        .where(eq(booksTable.id, bigintId))
        .execute();
    } catch (err) {
      console.error("Error updating available number of copies:", err);
      throw err;
    }
  }
}
