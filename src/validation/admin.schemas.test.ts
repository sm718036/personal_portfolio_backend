import { describe, expect, it } from "vitest";
import { resourceSchemas, settingsSchema } from "./admin.schemas.js";

describe("admin validation", () => {
  it("normalizes category slugs", () => {
    const value = resourceSchemas.projectCategories.parse({
      name: "Client Projects",
      slug: "Client_projects",
      sortOrder: 0,
      isVisible: true,
    });
    expect(value.slug).toBe("client-projects");
  });

  it("rejects executable social-link protocols", () => {
    expect(() =>
      resourceSchemas.socialLinks.parse({
        label: "Unsafe",
        url: "javascript:alert(1)",
        icon: "link",
        sortOrder: 0,
        isVisible: true,
      }),
    ).toThrow();
  });

  it("rejects unknown settings fields", () => {
    expect(() => settingsSchema.parse({ unexpected: true })).toThrow();
  });
});
