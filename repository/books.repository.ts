import { IPageRequest, IPagedResponse } from "./models/pagination.model";
import { IRepository } from "./models/repository";
import { IBookBase, IBook } from "./models/books.model";
import { booksTable } from "../db/drizzle/schema";
import { and, eq, ilike, like, sql } from "drizzle-orm";
import { MySql2Database } from "drizzle-orm/mysql2";

export class BookRepository implements IRepository<IBookBase, IBook> {
  constructor(private readonly db: MySql2Database<Record<string, unknown>>) {}

  /**
   * Creates a new book and adds it to the repository.
   * @param {IBookBase} data - The base data for the book to be created.
   * @returns {Promise<IBook>} The created book with assigned ID and available number of copies.
   */
  async create(data: IBookBase): Promise<IBook> {
    const book = {
      // TODO: Implement validation
      ...data,
      id: 0,
      availableNumberOfCopies: data.totalNumberOfCopies,
    };
    try {
      const [result] = await this.db
        .insert(booksTable)
        .values(book)
        .$returningId();
      // const insertedBookId = result.insertId;

      const insertedBookId = result.id;
      if (insertedBookId) {
        const [insertedBook] = await this.db
          .select()
          .from(booksTable)
          .where(eq(booksTable.id, insertedBookId));
        return insertedBook as IBook;
      } else {
        console.error("Inserted But ID not matching");
        return book;
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
      const result = await (
        await this.db
      )
        .update(booksTable)
        .set(data)
        .where(sql`${booksTable.id} = ${id}`)
        .execute();

      if (result) {
        const [updatedBook] = await (
          await this.db
        )
          .select()
          .from(booksTable)
          .where(sql`${booksTable.id} = ${id}`)
          .execute();

        return updatedBook as IBook;
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
      const [deletingBook] = await (await this.db)
        .select()
        .from(booksTable)
        .where(eq(booksTable.id, id));
      if (deletingBook) {
        const [result] = await (await this.db)
          .delete(booksTable)
          .where(eq(booksTable.id, id));
        if (result) {
          return deletingBook as IBook;
        } else {
          console.error("deleting unsuccessful");
          return null;
        }
      } else {
        console.error("book does not exist");
        return null;
      }
    } catch (err) {
      throw new Error("deletion failed");
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
      const [insertedBook] = await (await this.db)
        .select()
        .from(booksTable)
        .where(eq(booksTable.id, id));
      return insertedBook as IBook;
    } catch (err) {
      throw err;
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

      default:
        orderByClause = sql`${booksTable.title} ASC`; // Default sorting
    }

    // Fetch items with search and sorting
    const items: IBook[] = (await this.db
      .select()
      .from(booksTable)
      .where(searchWhereClause)
      .orderBy(orderByClause)
      .offset(params.offset)
      .limit(params.limit)) as IBook[];

    // Count total items matching the search criteria
    const [{ count: total }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(booksTable)
      .where(searchWhereClause);

    return {
      items,
      pagination: {
        offset: params.offset,
        limit: params.limit,
        total,
      },
    };
  }

  async searchByKeyword(keyword: string): Promise<IBook[]> {
    try {
      const results = await (
        await this.db
      )
        .select()
        .from(booksTable)
        .where(like(booksTable.title, `%${keyword}%`)) // Use 'like' for case-insensitive search
        .limit(100)
        .execute();

      return results as IBook[];
    } catch (err) {
      console.error("Error searching books:", err);
      throw err;
    }
  }

  async getTopFourBook(): Promise<IBook[]> {
    try {
      const results = await this.db.select().from(booksTable).limit(4);

      return results as IBook[];
    } catch (err) {
      console.error("Error searching books:", err);
      throw err;
    }
  }
  async getTotalBookCount(): Promise<number> {
    try {
      const result = await this.db
        .select({ count: sql`COUNT(*)` })
        .from(booksTable);
      return result[0].count as number;
    } catch (err) {
      throw err;
    }
  }
  async updateAvailableNumberOfCopies(id: number, difference: number) {
    try {
      // Fetch the current value of availableNumberOfCopies
      const currentBook = await this.db
        .select({ availableNumberOfCopies: booksTable.availableNumberOfCopies })
        .from(booksTable)
        .where(eq(booksTable.id, id))
        .execute();

      if (currentBook.length === 0) {
        throw new Error("Book not found");
      }

      const currentAvailableCopies = currentBook[0].availableNumberOfCopies;

      // Update the availableNumberOfCopies with the given difference
      const newAvailableCopies = currentAvailableCopies + difference;

      await this.db
        .update(booksTable)
        .set({ availableNumberOfCopies: newAvailableCopies })
        .where(eq(booksTable.id, id))
        .execute();

      return {
        success: true,
        message: "Available number of copies updated successfully.",
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to update available number of copies: ${error.message}`,
      };
    }
  }
}
