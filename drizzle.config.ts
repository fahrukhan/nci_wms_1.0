import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/drizzle/migrations",
  dialect: "postgresql" || "",

  dbCredentials: {
    host: process.env.DB_HOST ?? "",
    user: process.env.DB_USER ?? "",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "",
  },
  schema:
    [
      "./src/drizzle/schema/MasterData/masterData.schema.ts",
      "./src/drizzle/schema/Transaction/transaction.schema.ts",
      "./src/drizzle/schema/UserManagement/userManagement.schema.ts",
    ] || [],
});
