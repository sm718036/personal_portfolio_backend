import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "node:path";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api", apiRouter);
app.use(errorHandler);
