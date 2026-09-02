import type { ErrorRequestHandler } from "express";
import { MulterError } from "multer";
import { ZodError } from "zod";
import { HttpError } from "../utils/http-error.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) return response.status(400).json({ message: "Invalid request", issues: error.issues });
  if (error instanceof MulterError) return response.status(400).json({ message: error.message });
  if (error instanceof HttpError) return response.status(error.status).json({ message: error.message });
  console.error(error);
  return response.status(500).json({ message: "Internal server error" });
};
