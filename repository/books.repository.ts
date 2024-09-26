import { IPageRequest, IPagedResponse } from "./models/pagination.model";
import { IRepository } from "./models/repository";
import { IBookBase, IBook } from "./models/books.model";
import { books as booksTable } from "../db/drizzle/schema";
import { and, eq, ilike, like, sql } from "drizzle-orm";
import { MySql2Database } from "drizzle-orm/mysql2";
import { db } from "@/db/db";

export class BookRepository implements IRepository<IBookBase, IBook> {
  constructor() {}

  private async fetchBookById(id: number): Promise<IBook | null> {
    const [book] = await db
      .select()
      .from(booksTable)
      .where(eq(booksTable.id, BigInt(id)));

    return book ? ({ ...book, id: Number(book.id) } as IBook) : null;
  }

  async create(data: IBookBase): Promise<IBook> {
    const book = {
      ...data,
      availableNumberOfCopies: data.totalNumberOfCopies,
    };

    try {
      const [result] = await db
        .insert(booksTable)
        .values(book)
        .returning({ id: booksTable.id });

      const insertedBookId = result.id;
      if (insertedBookId) {
        return (await this.fetchBookById(Number(insertedBookId))) as IBook;
      } else {
        console.error("Inserted but ID not matching");
        return { ...book, id: 0 } as IBook;
      }
    } catch (err) {
      console.error("Error creating book:", err);
      throw err;
    }
  }

  async update(id: number, data: IBook): Promise<IBook | null> {
    try {
      const result = await db
        .update(booksTable)
        .set(data)
        .where(eq(booksTable.id, BigInt(id)))
        .returning();

      if (result) {
        return await this.fetchBookById(id);
      } else {
        console.log("Unable to update the book");
        return null;
      }
    } catch (err) {
      console.error("Error updating book:", err);
      return null;
    }
  }

  async delete(id: number): Promise<IBook | null> {
    try {
      const deletingBook = await this.fetchBookById(id);

      if (deletingBook) {
        const result = await db
          .delete(booksTable)
          .where(eq(booksTable.id, BigInt(id)));

        if (result) {
          return deletingBook;
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

  async getById(id: number): Promise<IBook | null> {
    try {
      return await this.fetchBookById(id);
    } catch (err) {
      console.error("Error fetching book by ID", err);
      return null;
    }
  }

  async list(params: IPageRequest): Promise<IPagedResponse<IBook> | undefined> {
    let searchWhereClause;
    let orderByClause;

    if (params.search) {
      const search = `%${params.search.toLowerCase()}%`;
      searchWhereClause = sql`${booksTable.title} LIKE ${search} OR ${booksTable.isbnNo} LIKE ${search} OR ${booksTable.author} LIKE ${search} OR ${booksTable.genre} LIKE ${search}`;
    }

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
        orderByClause = sql`${booksTable.title} ASC`;
    }

    try {
      const items = await db
        .select()
        .from(booksTable)
        .where(searchWhereClause)
        .orderBy(orderByClause)
        .offset(params.offset)
        .limit(params.limit);

      const convertedItems = items.map((item) => ({
        ...item,
        id: Number(item.id),
      })) as IBook[];

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
    } catch (err) {
      console.error("Error listing books:", err);
      throw err;
    }
  }

  async searchByKeyword(keyword: string): Promise<IBook[]> {
    try {
      const results = await db
        .select()
        .from(booksTable)
        .where(like(booksTable.title, `%${keyword}%`))
        .limit(100)
        .execute();

      return results.map((item) => ({
        ...item,
        id: Number(item.id),
      })) as IBook[];
    } catch (err) {
      console.error("Error searching books:", err);
      throw err;
    }
  }

  async getTopFiveBook(): Promise<IBook[]> {
    try {
      const results = await db.select().from(booksTable).limit(5).execute();

      return results.map((item) => ({
        ...item,
        id: Number(item.id),
      })) as IBook[];
    } catch (err) {
      console.error("Error fetching top five books:", err);
      throw err;
    }
  }

  async getTotalBookCount(): Promise<number> {
    try {
      const result = await db.select({ count: sql`COUNT(*)` }).from(booksTable);
      return result[0].count as number;
    } catch (err) {
      console.error("Error fetching total book count:", err);
      throw err;
    }
  }

  async updateAvailableNumberOfCopies(id: number, difference: number) {
    try {
      const bigintId = BigInt(id);

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
