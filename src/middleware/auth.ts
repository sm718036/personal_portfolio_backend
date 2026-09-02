import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";
import { SESSION_COOKIE, TOKEN_AUDIENCE, TOKEN_ISSUER } from "../constants/auth.js";

export const requireAuth: RequestHandler = (request, _response, next) => {
  const token = request.cookies?.[SESSION_COOKIE];
  if (!token) return next(new HttpError(401, "Authentication required"));
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    });
    if (typeof payload === "string" || typeof payload.sub !== "string") {
      throw new Error("Invalid token payload");
    }
    request.adminId = payload.sub;
    next();
  } catch {
    next(new HttpError(401, "Session is invalid or expired"));
  }
};
