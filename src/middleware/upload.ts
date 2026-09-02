import multer from "multer";
import crypto from "node:crypto";
import { HttpError } from "../utils/http-error.js";
import { uploadDirectory } from "../config/storage.js";

const extensionsByMimeType = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["application/pdf", ".pdf"],
]);

const storage = uploadDirectory
  ? multer.diskStorage({
      destination: uploadDirectory,
      filename: (_request, file, callback) => {
        const extension = extensionsByMimeType.get(file.mimetype);
        if (!extension) return callback(new HttpError(400, "Unsupported file type"), "");
        callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
      },
    })
  : multer.memoryStorage();

export const upload = multer({
  storage,
  // Vercel Functions reject request bodies above 4.5 MB, including multipart overhead.
  limits: { fileSize: uploadDirectory ? 8 * 1024 * 1024 : 4 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    if (!extensionsByMimeType.has(file.mimetype))
      return callback(new HttpError(400, "Unsupported file type"));
    callback(null, true);
  },
});
