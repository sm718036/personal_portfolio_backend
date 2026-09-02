import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  FRONTEND_URL: z.string().url().default("http://localhost:8080"),
  JWT_SECRET: z.string().min(32),
  PUBLIC_API_URL: z.string().url().default("http://localhost:4000"),
});

export const env = schema.parse(process.env);
