import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export default sqliteTable("basic_auth_credentials", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  user: text().notNull().unique(),
  password: text().notNull(),
});

