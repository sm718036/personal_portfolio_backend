import { z } from "zod";

const shortText = z.string().trim().min(1).max(200);
const longText = z.string().trim().max(10_000);
const order = z.number().int().min(0).max(100_000);
const stringList = z.array(z.string().trim().min(1).max(200)).max(100);

const optionalUrl = z
  .union([
    z.literal(""),
    z
      .string()
      .trim()
      .url()
      .max(2_048)
      .refine(
        (value) => ["http:", "https:"].includes(new URL(value).protocol),
        "Use an HTTP(S) URL",
      ),
  ])
  .transform((value) => value || null)
  .nullable()
  .optional();

const publicAssetUrl = z
  .union([
    z
      .string()
      .trim()
      .max(2_048)
      .regex(/^\/(?!\/)[^\s]*$/, "Use a root-relative path"),
    z
      .string()
      .trim()
      .url()
      .max(2_048)
      .refine(
        (value) => ["http:", "https:"].includes(new URL(value).protocol),
        "Use an HTTP(S) URL",
      ),
  ])
  .nullable()
  .optional();

const externalUrl = z
  .string()
  .trim()
  .max(2_048)
  .refine((value) => {
    try {
      return ["http:", "https:", "mailto:", "tel:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "Use an HTTP(S), mailto, or tel URL");

const publishFields = {
  sortOrder: order,
  isVisible: z.boolean(),
};

export const settingsSchema = z
  .object({
    logoText: shortText.max(12),
    greeting: shortText,
    name: shortText,
    headline: shortText,
    location: z.string().trim().max(200),
    heroDescription: longText,
    aboutTitle: shortText,
    aboutParagraphs: z.array(z.string().trim().min(1).max(5_000)).max(20),
    contactTitle: shortText,
    contactText: longText,
    email: z.string().trim().email().max(254),
    phone: z.string().trim().max(50),
    profileImageUrl: publicAssetUrl,
    resumeUrl: publicAssetUrl,
    footerText: z.string().trim().max(200),
  })
  .strict();

export const resourceSchemas = {
  socialLinks: z
    .object({ label: shortText, url: externalUrl, icon: shortText.max(50), ...publishFields })
    .strict(),
  skillCategories: z
    .object({ title: shortText, icon: shortText.max(50), skills: stringList, ...publishFields })
    .strict(),
  experiences: z
    .object({
      company: shortText,
      title: shortText,
      period: z.string().trim().max(100),
      location: z.string().trim().max(200),
      points: stringList,
      ...publishFields,
    })
    .strict(),
  projectCategories: z
    .object({
      name: shortText,
      slug: z
        .string()
        .trim()
        .min(1)
        .max(100)
        .transform((value) =>
          value
            .toLowerCase()
            .replace(/[_\s]+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, ""),
        )
        .pipe(z.string().min(1)),
      ...publishFields,
    })
    .strict(),
  projects: z
    .object({
      title: shortText,
      description: longText,
      imageUrl: publicAssetUrl,
      technologies: stringList,
      githubUrl: optionalUrl,
      liveUrl: optionalUrl,
      featured: z.boolean(),
      categoryId: z.string().cuid(),
      ...publishFields,
    })
    .strict(),
  certifications: z
    .object({
      title: shortText,
      issuer: z.string().trim().max(200),
      period: z.string().trim().max(100),
      description: longText,
      ...publishFields,
    })
    .strict(),
  education: z
    .object({
      degree: shortText,
      institution: z.string().trim().max(200),
      period: z.string().trim().max(100),
      highlight: z.string().trim().max(2_000).nullable().optional(),
      ...publishFields,
    })
    .strict(),
} as const;

export type ResourceName = keyof typeof resourceSchemas;

export function parseResourceName(value: string): ResourceName | null {
  return Object.hasOwn(resourceSchemas, value) ? (value as ResourceName) : null;
}
