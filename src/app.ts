import express from "express";
import cors from "cors";
import * as helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/error-handler.js";
import { HttpError } from "./utils/http-error.js";
import { uploadDirectory } from "./config/storage.js";

export const app = express();
app.disable("x-powered-by");
app.set("trust proxy", env.TRUST_PROXY ? 1 : false);
app.use(helmet.default({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.allowedOrigins.includes(origin)) return callback(null, true);
      callback(new HttpError(403, "Origin is not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(
  "/uploads",
  express.static(uploadDirectory, {
    dotfiles: "deny",
    fallthrough: false,
    immutable: true,
    maxAge: "1y",
    setHeaders: (response) => response.setHeader("X-Content-Type-Options", "nosniff"),
  }),
);
app.use("/api", apiRouter);
app.use((_request, response) => response.status(404).json({ message: "Route not found" }));
app.use(errorHandler);
