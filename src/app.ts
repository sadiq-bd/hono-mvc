import { Hono } from "hono";
import { cors } from "hono/cors";
import { contextStorage } from "hono/context-storage";
import { globalErrorHandler, notFoundHandler } from "./core/errors";
import authRoutes from "./features/auth/routes";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Global Middlewares
app.use(cors());
app.use(contextStorage());

// Feature Routes
app.route('/token', authRoutes);

// Error Handlers
app.notFound(notFoundHandler);
app.onError(globalErrorHandler);

export default app;
