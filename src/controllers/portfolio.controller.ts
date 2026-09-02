import type { RequestHandler } from "express";
import { getAdminPortfolio, getPublicPortfolio } from "../services/portfolio.service.js";

export const publicPortfolio: RequestHandler = async (_request, response, next) => {
  try {
    response.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    response.json(await getPublicPortfolio());
  } catch (error) {
    next(error);
  }
};

export const adminPortfolio: RequestHandler = async (_request, response, next) => {
  try {
    response.setHeader("Cache-Control", "no-store");
    response.json(await getAdminPortfolio());
  } catch (error) {
    next(error);
  }
};
