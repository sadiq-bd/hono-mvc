import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export default sqliteTable("apps", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  name: text().notNull().unique(),
  key: text().notNull(),
  secret: text(),
  created_at: text().default(sql`CURRENT_TIMESTAMP`)
    .$defaultFn(() => new Date().toISOString()),
});
