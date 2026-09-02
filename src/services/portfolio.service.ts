import { prisma } from "../config/database.js";

const visibleOrder = { where: { isVisible: true }, orderBy: { sortOrder: "asc" as const } };

export async function getPublicPortfolio() {
  const [settings, socialLinks, skillCategories, experiences, projectCategories, projects, certifications, education] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "main" } }),
    prisma.socialLink.findMany(visibleOrder),
    prisma.skillCategory.findMany(visibleOrder),
    prisma.experience.findMany(visibleOrder),
    prisma.projectCategory.findMany(visibleOrder),
    prisma.project.findMany({ ...visibleOrder, include: { category: true } }),
    prisma.certification.findMany(visibleOrder),
    prisma.education.findMany(visibleOrder),
  ]);
  return { settings, socialLinks, skillCategories, experiences, projectCategories, projects, certifications, education };
}

export async function getAdminPortfolio() {
  const data = await getPublicPortfolio();
  const [socialLinks, skillCategories, experiences, projectCategories, projects, certifications, education] = await Promise.all([
    prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.skillCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.experience.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.projectCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.project.findMany({ orderBy: { sortOrder: "asc" }, include: { category: true } }),
    prisma.certification.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.education.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return { ...data, socialLinks, skillCategories, experiences, projectCategories, projects, certifications, education };
}
