import type { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";

const settingsSchema = z.object({
  logoText: z.string().min(1), greeting: z.string().min(1), name: z.string().min(1), headline: z.string().min(1),
  location: z.string(), heroDescription: z.string(), aboutTitle: z.string(), aboutParagraphs: z.array(z.string()),
  contactTitle: z.string(), contactText: z.string(), email: z.string().email(), phone: z.string(),
  profileImageUrl: z.string().nullable().optional(), resumeUrl: z.string().nullable().optional(), footerText: z.string(),
});

const schemas = {
  socialLinks: z.object({ label: z.string().min(1), url: z.string().min(1), icon: z.string(), sortOrder: z.number().int(), isVisible: z.boolean() }),
  skillCategories: z.object({ title: z.string().min(1), icon: z.string(), skills: z.array(z.string()), sortOrder: z.number().int(), isVisible: z.boolean() }),
  experiences: z.object({ company: z.string().min(1), title: z.string().min(1), period: z.string(), location: z.string(), points: z.array(z.string()), sortOrder: z.number().int(), isVisible: z.boolean() }),
  projectCategories: z.object({ name: z.string().min(1), slug: z.string().regex(/^[a-z0-9-]+$/), sortOrder: z.number().int(), isVisible: z.boolean() }),
  projects: z.object({ title: z.string().min(1), description: z.string(), imageUrl: z.string().nullable().optional(), technologies: z.array(z.string()), githubUrl: z.string().nullable().optional(), liveUrl: z.string().nullable().optional(), featured: z.boolean(), sortOrder: z.number().int(), isVisible: z.boolean(), categoryId: z.string().min(1) }),
  certifications: z.object({ title: z.string().min(1), issuer: z.string(), period: z.string(), description: z.string(), sortOrder: z.number().int(), isVisible: z.boolean() }),
  education: z.object({ degree: z.string().min(1), institution: z.string(), period: z.string(), highlight: z.string().nullable().optional(), sortOrder: z.number().int(), isVisible: z.boolean() }),
} as const;
type Resource = keyof typeof schemas;
const delegates: Record<Resource, any> = { socialLinks: prisma.socialLink, skillCategories: prisma.skillCategory, experiences: prisma.experience, projectCategories: prisma.projectCategory, projects: prisma.project, certifications: prisma.certification, education: prisma.education };
const resource = (value: string): Resource => { if (!(value in schemas)) throw new HttpError(404, "Unknown resource"); return value as Resource; };

export const updateSettings: RequestHandler = async (req, res, next) => { try { const data = settingsSchema.parse(req.body); res.json(await prisma.siteSettings.upsert({ where: { id: "main" }, create: { id: "main", ...data }, update: data })); } catch (e) { next(e); } };
export const createItem: RequestHandler = async (req, res, next) => { try { const key = resource(String(req.params.resource)); const data = schemas[key].parse(req.body); res.status(201).json(await delegates[key].create({ data })); } catch (e) { next(e); } };
export const updateItem: RequestHandler = async (req, res, next) => { try { const key = resource(String(req.params.resource)); const data = schemas[key].partial().parse(req.body); res.json(await delegates[key].update({ where: { id: String(req.params.id) }, data })); } catch (e) { next(e); } };
export const deleteItem: RequestHandler = async (req, res, next) => { try { const key = resource(String(req.params.resource)); await delegates[key].delete({ where: { id: String(req.params.id) } }); res.status(204).end(); } catch (e) { next(e); } };
export const uploadFile: RequestHandler = (req, res, next) => { if (!req.file) return next(new HttpError(400, "Select a supported image or PDF")); res.status(201).json({ url: `${env.PUBLIC_API_URL}/uploads/${req.file.filename}` }); };
