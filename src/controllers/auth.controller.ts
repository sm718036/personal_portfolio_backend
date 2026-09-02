import type { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";

export const login: RequestHandler = async (request, response, next) => {
  try {
    const input = z.object({ email: z.string().email(), password: z.string().min(8) }).parse(request.body);
    const admin = await prisma.admin.findUnique({ where: { email: input.email.toLowerCase() } });
    if (!admin || !(await bcrypt.compare(input.password, admin.passwordHash))) throw new HttpError(401, "Invalid email or password");
    const token = jwt.sign({}, env.JWT_SECRET, { subject: admin.id, expiresIn: "8h" });
    response.cookie("portfolio_token", token, { httpOnly: true, sameSite: "lax", secure: env.NODE_ENV === "production", maxAge: 8 * 60 * 60 * 1000 });
    response.json({ admin: { id: admin.id, email: admin.email } });
  } catch (error) { next(error); }
};

export const logout: RequestHandler = (_request, response) => { response.clearCookie("portfolio_token"); response.status(204).end(); };
export const me: RequestHandler = async (request, response) => {
  const admin = await prisma.admin.findUnique({ where: { id: request.adminId! }, select: { id: true, email: true } });
  response.json({ admin });
};
