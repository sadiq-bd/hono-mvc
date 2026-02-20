import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import Apps from "./Apps";

export default sqliteTable("auth_tokens", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  app_id: integer().notNull().references(() => Apps.id),
  token: text().notNull().unique(),
  refresh_token: text().notNull(),
  ip_address: text().notNull(),
  user_agent: text().notNull(),
  expiration: text().notNull(),
  created_at: text().default(sql`CURRENT_TIMESTAMP`)
    .$defaultFn(() => new Date().toISOString()),
});

