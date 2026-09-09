import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env.production" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.DIRECT_URL ||
      process.env.DATABASE_URL,
  },
});
