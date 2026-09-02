import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";

export const requireAuth: RequestHandler = (request, _response, next) => {
  const bearer = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  const token = request.cookies?.portfolio_token ?? bearer;
  if (!token) return next(new HttpError(401, "Authentication required"));
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };
    request.adminId = payload.sub;
    next();
  } catch { next(new HttpError(401, "Session is invalid or expired")); }
};
