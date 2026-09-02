import type { RequestHandler } from "express";
import { prisma } from "../config/database.js";

export const liveness: RequestHandler = (_request, response) => {
  response.json({ status: "ok" });
};

export const readiness: RequestHandler = async (_request, response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    response.json({ status: "ready" });
  } catch {
    response.status(503).json({ status: "unavailable" });
  }
};
