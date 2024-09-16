import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { AppEnvs } from "./read-env";

const databaseUrl = process.env.DB_URL;

export interface IDrizzleAdapter {
  getPoolDrizzle: () => MySql2Database;
  getConnectionDrizzle: () => Promise<MySql2Database<Record<string, unknown>>>;
  migrate(): Promise<MySql2Database>;
}

export class DrizzleManager implements IDrizzleAdapter {
  private pool: mysql.Pool | undefined;
  private db: MySql2Database | undefined;

  getPoolDrizzle(): MySql2Database {
    if (!this.pool) {
      this.pool = mysql.createPool({
        uri: databaseUrl,
      });
    }
    return drizzle(this.pool);
  }

  async getConnectionDrizzle(): Promise<MySql2Database> {
    const connection = await mysql.createConnection({
      uri: databaseUrl,
    });
    return drizzle(connection);
  }

  async runMigrations(): Promise<void> {
    try {
      await migrate(this.db!, {
        migrationsFolder:
          "/home/vedanth/library-mgmt/Library-Management/src/drizzle/migration/",
      });
      console.log("Migrations completed successfully.");
    } catch (error) {
      console.error("Error running migrations:", error);
      throw error;
    }
  }

  async migrate(): Promise<MySql2Database> {
    if (!this.db && this.pool) {
      this.db = drizzle(this.pool);
      await this.runMigrations();
    }
    if (!this.db) {
      throw new Error("Failed to initialize drizzle database.");
    }
    return this.db;
  }
}

export const drizzleAdapter = new DrizzleManager();
