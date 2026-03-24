<p align="left"> <img src="https://api.sadiq.workers.dev/app/github/repo/hono-starter/views?nocache=true" alt="" /> </p>

<div align="center">
  <h1>🚀 Hono Backend Starter</h1>
  <p>A modern, feature-based TypeScript backend template powered by Hono, Bun, Drizzle ORM, and Cloudflare Workers.</p>
</div>

---

## ✨ Features

- ⚡️ **Edge-Ready**: Built on [Hono](https://hono.dev/), optimized for Cloudflare Workers.
- 📦 **Blazing Fast Toolkit**: Uses [Bun](https://bun.sh/) natively for installing dependencies, running the dev server, and executing tests.
- 🏗️ **Feature-Based Architecture**: Avoids the bloated MVC approach in favor of Modular/Domain-Driven Design. Everything related to a feature lives in its own folder!
- 🛡️ **Type-Safe ORM**: Fully integrated with [Drizzle ORM](https://orm.drizzle.team/) for migrations and zero-compromise type safety.
- 🚦 **First-class Validation**: Uses `Zod` and `@hono/zod-validator` for strict body and query validation out-of-the-box.
- 🚨 **Global Error Handling**: Integrated `AppError` and automatic catching of exceptions so you never leak stack traces.
- ✅ **Built-in Testing**: Leverage `bun:test` for Jest-like assertions without any complex config files.

---

## 📂 Architecture Overview

This template organizes logic **by feature (domain)** rather than by type (e.g. controllers, routes).

```text
src/
├── app.ts                  # Main entry point & global middlewares setup
├── core/                   # Cross-domain capabilities
│   ├── config.ts           # Typesafe environment variable loader
│   ├── errors.ts           # Global error handler (.onError) and AppError
│   └── utils.ts            # Common helpers (e.g. JSON HTTP responses)
├── database/               # Database concerns
│   ├── factory.ts          # Database connection builder (D1/SQLite)
│   └── schema.ts           # Unified Drizzle tables/schemas
└── features/               # 📦 Feature Modules
    └── auth/               # Example domain
        ├── routes.ts       # Route endpoints & Zod validators
        ├── schemas.ts      # Validations for requests and responses
        └── service.ts      # Pure business logic
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **[Bun](https://bun.sh/)** installed on your machine (`curl -fsSL https://bun.sh/install | bash`).

### 2. Installation
Clone the repository and install the dependencies in a flash:
```bash
bun install
```

### 3. Database Setup (Drizzle ORM)
Generate your SQL migrations based on `src/database/schema.ts` and apply them locally:
```bash
bun run db:generate
bun run db:migrate
```

### 4. Development Server
Start the local Wrangler development server:
```bash
bun run dev
```
Navigate to `http://localhost:8787` to see your API alive!

---

## 🧪 Testing

Testing is a breeze thanks to Bun's built-in test runner.
```bash
bun test
```
*Tip: Place your tests either in the `tests/` directory or alongside your feature files (e.g. `src/features/auth/service.test.ts`).*

---

## 🛠️ How to Add a New Feature

1. **Create a Folder:** `src/features/users/`
2. **Define Schemas:** Add your request body Zod schemas in `schemas.ts`.
3. **Write Logic:** Add your business operations in `service.ts` so they can be tested independently.
4. **Bind Routes:** Wire `@hono/zod-validator` to your service inside `routes.ts`.
5. **Register:** Plug the new feature into `src/app.ts`:
   ```ts
   import userRoutes from "./features/users/routes";
   app.route('/users', userRoutes);
   ```

---

## ☁️ Deployment

Deploy directly to Cloudflare Workers edge network:
```bash
bun run deploy
```

Whenever you update your environment variables in `wrangler.jsonc`, run:
```bash
bun run cf-typegen
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
