import { getContext } from "hono/context-storage";
import type { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";

// Factory function
export default function database() {
  return drizzle((getContext().env as { DB: D1Database }).DB);
}

