import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";

const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);
export const upload = multer({
  storage: multer.diskStorage({
    destination: path.resolve("uploads"),
    filename: (_request, file, callback) => callback(null, `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => callback(null, allowed.has(file.mimetype)),
});
