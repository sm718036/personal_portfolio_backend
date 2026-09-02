import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import { env } from "./env.js";
import { HttpError } from "../utils/http-error.js";

export const uploadDirectory = env.isVercel ? undefined : path.resolve(env.UPLOAD_DIR);

if (uploadDirectory) fs.mkdirSync(uploadDirectory, { recursive: true });

export async function storeUpload(file: Express.Multer.File) {
  if (!env.isVercel) {
    if (!file.filename) throw new HttpError(500, "Local upload was not written");
    return `${env.PUBLIC_API_URL}/uploads/${file.filename}`;
  }

  if (!env.BLOB_READ_WRITE_TOKEN) {
    throw new HttpError(503, "File storage is not configured");
  }

  const extension = path.extname(file.originalname).toLowerCase();
  const blob = await put(`portfolio/${crypto.randomUUID()}${extension}`, file.buffer, {
    access: "public",
    contentType: file.mimetype,
    addRandomSuffix: false,
    token: env.BLOB_READ_WRITE_TOKEN,
  });
  return blob.url;
}
