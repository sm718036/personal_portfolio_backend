import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  FRONTEND_URL: z.string().url().default("http://localhost:8080"),
  ALLOWED_ORIGINS: z.string().optional(),
  JWT_SECRET: z.string().min(32),
  PUBLIC_API_URL: z.string().url().default("http://localhost:4000"),
  TRUST_PROXY: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  UPLOAD_DIR: z.string().min(1).default("uploads"),
  BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),
});

const parsed = schema.parse(process.env);

export const env = {
  ...parsed,
  isVercel: process.env.VERCEL === "1",
  allowedOrigins: [
    ...new Set([
      parsed.FRONTEND_URL,
      ...(parsed.ALLOWED_ORIGINS?.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean) ?? []),
    ]),
  ],
};
