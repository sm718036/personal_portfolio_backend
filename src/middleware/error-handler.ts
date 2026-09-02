import type { ErrorRequestHandler } from "express";
import { MulterError } from "multer";
import { ZodError } from "zod";
import { HttpError } from "../utils/http-error.js";
import { Prisma } from "@prisma/client";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError)
    return response.status(400).json({ message: "Invalid request", issues: error.issues });
  if (error instanceof MulterError) return response.status(400).json({ message: error.message });
  if (error instanceof HttpError)
    return response.status(error.status).json({ message: error.message });
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002")
      return response.status(409).json({ message: "A record with this value already exists" });
    if (error.code === "P2025") return response.status(404).json({ message: "Record not found" });
    if (error.code === "P2003")
      return response.status(409).json({ message: "This record is still in use" });
  }
  if (typeof error === "object" && error && "status" in error && error.status === 404) {
    return response.status(404).json({ message: "File not found" });
  }
  console.error(error);
  return response.status(500).json({ message: "Internal server error" });
};
