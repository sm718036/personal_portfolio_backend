import type { RequestHandler } from "express";
import { getAdminPortfolio, getPublicPortfolio } from "../services/portfolio.service.js";
export const publicPortfolio: RequestHandler = async (_req, res, next) => { try { res.json(await getPublicPortfolio()); } catch (e) { next(e); } };
export const adminPortfolio: RequestHandler = async (_req, res, next) => { try { res.json(await getAdminPortfolio()); } catch (e) { next(e); } };
