import type { RequestHandler } from "express";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";

const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);

export const requireAllowedOrigin: RequestHandler = (request, _response, next) => {
  if (safeMethods.has(request.method)) return next();

  const origin = request.get("origin");
  if (!origin || !env.allowedOrigins.includes(origin)) {
    return next(new HttpError(403, "Request origin is not allowed"));
  }

  next();
};
