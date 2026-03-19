import robots from "../robots";
import sitemap from "../sitemap";
import { getAllBrandSlugs } from "@/lib/brands";

describe("robots.txt", () => {
  it("allows all user agents to crawl everything", () => {
    const config = robots();
    expect(config.rules).toEqual({
      userAgent: "*",
      allow: "/",
    });
  });

  it("includes sitemap URL", () => {
    const config = robots();
    expect(config.sitemap).toContain("/sitemap.xml");
  });
});

describe("sitemap.xml", () => {
  it("includes homepage and ranking page", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.endsWith("/ranking"))).toBe(true);
    // Homepage is the base URL (no trailing path)
    expect(urls.some((u) => !u.includes("/brand/") && !u.includes("/ranking"))).toBe(true);
  });

  it("includes all brand pages", () => {
    const entries = sitemap();
    const brandSlugs = getAllBrandSlugs();
    const brandUrls = entries.filter((e) => e.url.includes("/brand/"));
    expect(brandUrls.length).toBe(brandSlugs.length);
  });

  it("sets correct priorities", () => {
    const entries = sitemap();
    const homepage = entries.find((e) => e.priority === 1);
    const ranking = entries.find((e) => e.url.includes("/ranking"));
    const brand = entries.find((e) => e.url.includes("/brand/"));
    expect(homepage).toBeDefined();
    expect(ranking?.priority).toBe(0.9);
    expect(brand?.priority).toBe(0.7);
  });

  it("has lastModified dates on all entries", () => {
    const entries = sitemap();
    entries.forEach((entry) => {
      expect(entry.lastModified).toBeInstanceOf(Date);
    });
  });
});
