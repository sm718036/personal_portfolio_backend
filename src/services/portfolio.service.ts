import { prisma } from "../config/database.js";
import { HttpError } from "../utils/http-error.js";

const byOrder = { sortOrder: "asc" as const };

export async function getPortfolio(includeHidden = false) {
  const visibility = includeHidden ? undefined : { isVisible: true };
  const [
    settings,
    socialLinks,
    skillCategories,
    experiences,
    projectCategories,
    projects,
    certifications,
    education,
  ] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "main" } }),
    prisma.socialLink.findMany({ where: visibility, orderBy: byOrder }),
    prisma.skillCategory.findMany({ where: visibility, orderBy: byOrder }),
    prisma.experience.findMany({ where: visibility, orderBy: byOrder }),
    prisma.projectCategory.findMany({ where: visibility, orderBy: byOrder }),
    prisma.project.findMany({
      where: includeHidden ? undefined : { isVisible: true, category: { isVisible: true } },
      orderBy: byOrder,
    }),
    prisma.certification.findMany({ where: visibility, orderBy: byOrder }),
    prisma.education.findMany({ where: visibility, orderBy: byOrder }),
  ]);

  if (!settings) throw new HttpError(503, "Portfolio content has not been initialized");
  return {
    settings,
    socialLinks,
    skillCategories,
    experiences,
    projectCategories,
    projects,
    certifications,
    education,
  };
}

export const getPublicPortfolio = () => getPortfolio(false);
export const getAdminPortfolio = () => getPortfolio(true);
