import type { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";
import {
  SESSION_COOKIE,
  SESSION_DURATION_MS,
  TOKEN_AUDIENCE,
  TOKEN_ISSUER,
} from "../constants/auth.js";

const credentialsSchema = z
  .object({
    email: z.string().trim().email().max(254),
    password: z.string().min(8).max(128),
  })
  .strict();

const cookieSecurityOptions = {
  httpOnly: true,
  sameSite: env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
  secure: env.NODE_ENV === "production",
  path: "/",
};

export const login: RequestHandler = async (request, response, next) => {
  try {
    const input = credentialsSchema.parse(request.body);
    const admin = await prisma.admin.findUnique({ where: { email: input.email.toLowerCase() } });
    if (!admin || !(await bcrypt.compare(input.password, admin.passwordHash)))
      throw new HttpError(401, "Invalid email or password");
    const token = jwt.sign({}, env.JWT_SECRET, {
      subject: admin.id,
      expiresIn: "8h",
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
      algorithm: "HS256",
    });
    response.cookie(SESSION_COOKIE, token, {
      ...cookieSecurityOptions,
      maxAge: SESSION_DURATION_MS,
    });
    response.setHeader("Cache-Control", "no-store");
    response.json({ admin: { id: admin.id, email: admin.email } });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (_request, response) => {
  response.clearCookie(SESSION_COOKIE, cookieSecurityOptions);
  response.status(204).end();
};

export const me: RequestHandler = async (request, response, next) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: request.adminId! },
      select: { id: true, email: true },
    });
    if (!admin) throw new HttpError(401, "Session is no longer valid");
    response.setHeader("Cache-Control", "no-store");
    response.json({ admin });
  } catch (error) {
    next(error);
  }
};
