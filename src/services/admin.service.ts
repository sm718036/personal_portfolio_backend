import { prisma } from "../config/database.js";
import { HttpError } from "../utils/http-error.js";
import { resourceSchemas, type ResourceName } from "../validation/admin.schemas.js";

export async function createResource(resource: ResourceName, input: unknown) {
  switch (resource) {
    case "socialLinks":
      return prisma.socialLink.create({ data: resourceSchemas.socialLinks.parse(input) });
    case "skillCategories":
      return prisma.skillCategory.create({ data: resourceSchemas.skillCategories.parse(input) });
    case "experiences":
      return prisma.experience.create({ data: resourceSchemas.experiences.parse(input) });
    case "projectCategories":
      return prisma.projectCategory.create({
        data: resourceSchemas.projectCategories.parse(input),
      });
    case "projects":
      return prisma.project.create({ data: resourceSchemas.projects.parse(input) });
    case "certifications":
      return prisma.certification.create({ data: resourceSchemas.certifications.parse(input) });
    case "education":
      return prisma.education.create({ data: resourceSchemas.education.parse(input) });
  }
}

export async function updateResource(resource: ResourceName, id: string, input: unknown) {
  switch (resource) {
    case "socialLinks":
      return prisma.socialLink.update({
        where: { id },
        data: resourceSchemas.socialLinks.partial().parse(input),
      });
    case "skillCategories":
      return prisma.skillCategory.update({
        where: { id },
        data: resourceSchemas.skillCategories.partial().parse(input),
      });
    case "experiences":
      return prisma.experience.update({
        where: { id },
        data: resourceSchemas.experiences.partial().parse(input),
      });
    case "projectCategories":
      return prisma.projectCategory.update({
        where: { id },
        data: resourceSchemas.projectCategories.partial().parse(input),
      });
    case "projects":
      return prisma.project.update({
        where: { id },
        data: resourceSchemas.projects.partial().parse(input),
      });
    case "certifications":
      return prisma.certification.update({
        where: { id },
        data: resourceSchemas.certifications.partial().parse(input),
      });
    case "education":
      return prisma.education.update({
        where: { id },
        data: resourceSchemas.education.partial().parse(input),
      });
  }
}

export async function deleteResource(resource: ResourceName, id: string) {
  if (resource === "projectCategories") {
    const projectCount = await prisma.project.count({ where: { categoryId: id } });
    if (projectCount > 0)
      throw new HttpError(409, "Move or delete projects in this category first");
  }

  switch (resource) {
    case "socialLinks":
      return prisma.socialLink.delete({ where: { id } });
    case "skillCategories":
      return prisma.skillCategory.delete({ where: { id } });
    case "experiences":
      return prisma.experience.delete({ where: { id } });
    case "projectCategories":
      return prisma.projectCategory.delete({ where: { id } });
    case "projects":
      return prisma.project.delete({ where: { id } });
    case "certifications":
      return prisma.certification.delete({ where: { id } });
    case "education":
      return prisma.education.delete({ where: { id } });
  }
}
