import type { RequestHandler } from "express";
import { prisma } from "../config/database.js";
import { storeUpload } from "../config/storage.js";
import { createResource, deleteResource, updateResource } from "../services/admin.service.js";
import { HttpError } from "../utils/http-error.js";
import { parseResourceName, settingsSchema } from "../validation/admin.schemas.js";

function getResource(value: string) {
  const resource = parseResourceName(value);
  if (!resource) throw new HttpError(404, "Unknown resource");
  return resource;
}

export const updateSettings: RequestHandler = async (request, response, next) => {
  try {
    const data = settingsSchema.parse(request.body);
    const settings = await prisma.siteSettings.upsert({
      where: { id: "main" },
      create: { id: "main", ...data },
      update: data,
    });
    response.json(settings);
  } catch (error) {
    next(error);
  }
};

export const createItem: RequestHandler = async (request, response, next) => {
  try {
    const item = await createResource(getResource(String(request.params.resource)), request.body);
    response.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const updateItem: RequestHandler = async (request, response, next) => {
  try {
    const item = await updateResource(
      getResource(String(request.params.resource)),
      String(request.params.id),
      request.body,
    );
    response.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteItem: RequestHandler = async (request, response, next) => {
  try {
    await deleteResource(getResource(String(request.params.resource)), String(request.params.id));
    response.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const uploadFile: RequestHandler = async (request, response, next) => {
  try {
    if (!request.file) throw new HttpError(400, "Select a supported image or PDF");
    response.status(201).json({ url: await storeUpload(request.file) });
  } catch (error) {
    next(error);
  }
};
