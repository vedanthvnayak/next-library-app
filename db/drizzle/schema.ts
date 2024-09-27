import {
  pgTable,
  foreignKey,
  bigserial,
  integer,
  text,
  timestamp,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const refreshTokens = pgTable("refresh_tokens", {
  id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
  userid: integer("userid")
    .notNull()
    .references(() => users.userid),
  token: text("token").notNull(),
  issuedat: timestamp("issuedat", { mode: "string" }).defaultNow().notNull(),
  expiresat: timestamp("expiresat", { mode: "string" }).notNull(),
  ip: text("ip"),
});

export const users = pgTable("users", {
  userid: serial("userid").primaryKey().notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  profileimage: varchar("profileimage", { length: 2048 }).notNull(),
});

export const transactions = pgTable("transactions", {
  transactionid: serial("transactionid").primaryKey().notNull(),
  userid: integer("userid")
    .notNull()
    .references(() => users.userid),
  bookid: integer("bookid")
    .notNull()
    .references(() => books.id),
  issueddate: timestamp("issueddate", { mode: "string" })
    .defaultNow()
    .notNull(),
  status: varchar("status", { length: 100 }).notNull(),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  publisher: varchar("publisher", { length: 255 }),
  genre: varchar("genre", { length: 100 }),
  isbnNo: varchar("isbnNo", { length: 20 }),
  numofPages: integer("numofPages").notNull(),
  totalNumberOfCopies: integer("totalNumberOfCopies").notNull(),
  availableNumberOfCopies: integer("availableNumberOfCopies").notNull(),
  coverimagelink: varchar("coverimagelink", { length: 255 }),
});
export const professors = pgTable("professors", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  department: varchar("department", { length: 255 }).notNull(),
  shortBio: text("short_bio"),
  calendlyEventLink: varchar("calendly_event_link", { length: 255 }),
  email: varchar("email", { length: 255 }),
});
