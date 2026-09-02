import fs from "node:fs";
import path from "node:path";
import { env } from "./env.js";

export const uploadDirectory = path.resolve(env.UPLOAD_DIR);
fs.mkdirSync(uploadDirectory, { recursive: true });
