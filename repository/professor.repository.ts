import { IPageRequest, IPagedResponse } from "./models/pagination.model";
import { IRepository } from "./models/repository";
import { IProfessor, IProfessorBase } from "./models/professor.model";
import { professors as professorsTable } from "../db/drizzle/schema";
import { eq, SQL, sql } from "drizzle-orm";
import { db } from "@/db/db";

export class ProfessorRepository
  implements IRepository<IProfessorBase, IProfessor>
{
  constructor() {}

  private async fetchProfessorById(id: number): Promise<IProfessor | null> {
    const [professor] = await db
      .select()
      .from(professorsTable)
      .where(eq(professorsTable.id, id));

    return professor
      ? ({ ...professor, id: Number(professor.id) } as IProfessor)
      : null;
  }

  async create(data: IProfessorBase): Promise<IProfessor> {
    const professor = { ...data };

    try {
      const [result] = await db
        .insert(professorsTable)
        .values(professor)
        .returning({ id: professorsTable.id });

      const insertedProfessorId = result.id;
      if (insertedProfessorId) {
        return (await this.fetchProfessorById(
          Number(insertedProfessorId)
        )) as IProfessor;
      } else {
        console.error("Inserted but ID not matching");
        throw new Error("Insertion successful, but ID not returned.");
      }
    } catch (err) {
      // Handle specific error messages
      if (err.response) {
        // Assuming your database library gives a response object
        if (err.response.status === 400) {
          const errorMessage = err.response.data.message;
          if (errorMessage.includes("Already Invited")) {
            throw new Error("Professor has already been invited.");
          }
        }
      }

      // Log and rethrow general errors
      console.error("Error creating professor:", err);
      throw new Error("Failed to create professor. Please try again.");
    }
  }

  async update(id: number, data: IProfessorBase): Promise<IProfessor | null> {
    try {
      const result = await db
        .update(professorsTable)
        .set(data)
        .where(eq(professorsTable.id, id))
        .returning();
      console.log(result);
      if (result.length > 0) {
        return await this.fetchProfessorById(id);
      } else {
        console.log("Unable to update the professor");
        return null;
      }
    } catch (err) {
      console.error("Error updating professor:", err);
      return null;
    }
  }

  async delete(id: number): Promise<IProfessor | null> {
    try {
      const deletingProfessor = await this.fetchProfessorById(id);

      if (deletingProfessor) {
        const result = await db
          .delete(professorsTable)
          .where(eq(professorsTable.id, id))
          .returning();

        if (result.length > 0) {
          return deletingProfessor;
        } else {
          console.error("Deleting unsuccessful");
          return null;
        }
      } else {
        console.error("Professor does not exist");
        return null;
      }
    } catch (err) {
      console.error("Deletion failed", err);
      return null;
    }
  }

  async getById(id: number): Promise<IProfessor | null> {
    try {
      return await this.fetchProfessorById(id);
    } catch (err) {
      console.error("Error fetching professor by ID", err);
      return null;
    }
  }

  async list(
    params: IPageRequest
  ): Promise<IPagedResponse<IProfessor> | undefined> {
    let searchWhereClause: SQL;
    let orderByClause: SQL;

    if (params.search) {
      const search = `%${params.search.toLowerCase()}%`;
      searchWhereClause = sql`${professorsTable.name} ILIKE ${search} OR ${professorsTable.department} ILIKE ${search}`;
    }

    switch (params.sort) {
      case "name-asc":
        orderByClause = sql`${professorsTable.name} ASC`;
        break;
      case "name-desc":
        orderByClause = sql`${professorsTable.name} DESC`;
        break;
      case "department-asc":
        orderByClause = sql`${professorsTable.department} ASC`;
        break;
      case "department-desc":
        orderByClause = sql`${professorsTable.department} DESC`;
        break;
      case "id-asc":
        orderByClause = sql`${professorsTable.id} ASC`;
        break;
      case "id-desc":
        orderByClause = sql`${professorsTable.id} DESC`;
        break;
      default:
        orderByClause = sql`${professorsTable.name} ASC`;
    }

    try {
      const items = await db
        .select()
        .from(professorsTable)
        .where(searchWhereClause)
        .orderBy(orderByClause)
        .offset(params.offset)
        .limit(params.limit);

      const convertedItems = items.map((item) => ({
        ...item,
        id: Number(item.id),
      })) as IProfessor[];

      const [{ count: total }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(professorsTable)
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
      console.error("Error listing professors:", err);
      throw err;
    }
  }
  async getByEmail(email: string): Promise<IProfessor | null> {
    const [professor] = await db
      .select()
      .from(professorsTable)
      .where(eq(professorsTable.email, email));

    return professor
      ? ({ ...professor, id: Number(professor.id) } as IProfessor)
      : null;
  }
}

export const professorRepository = new ProfessorRepository();
