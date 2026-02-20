import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import { contextStorage } from "hono/context-storage";
// import tokenized from "./routes/tokenized";

const app = new Hono<{ Bindings: CloudflareBindings }>();
app.use(cors());
app.use(contextStorage());

// app.route('/token', tokenized);

app.notFound((c: Context) => c.json({ message: 'Not found' }, 404));
app.onError((err, c: Context) => {
  console.error(err);
  return c.json({ message: 'Internal server error' }, 500);
});

export default app;
