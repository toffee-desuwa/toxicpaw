/**
 * F025 - Share Image API Route Tests
 *
 * Tests the share image generation logic. Since NextRequest requires the
 * Request global (unavailable in jsdom), we test the underlying modules
 * (share-image builder, constants, brand data) directly.
 * The actual API route is tested via build (static generation).
 */

import { buildShareImage } from "@/lib/og/share-image";
import type { ShareImageData } from "@/lib/og/share-image";
import { GRADE_HEX, OG_WIDTH, OG_HEIGHT, SQUARE_WIDTH, SQUARE_HEIGHT } from "@/lib/og/constants";
import { getAnalyzedBrandBySlug, getAllBrandSlugs } from "@/lib/brands";
import type { AnalysisSummary, Grade } from "@/lib/analyzer/types";

function makeSummary(overrides: Partial<AnalysisSummary> = {}): AnalysisSummary {
  return {
    totalIngredients: 10,
    harmfulCount: 1,
    cautionCount: 2,
    safeCount: 6,
    unknownCount: 1,
    topIngredientIsProtein: true,
    concernPercentage: 10,
    ...overrides,
  };
}

describe("Share Image API — integration", () => {
  describe("brand share image generation", () => {
    it("generates OG share data for a valid brand", () => {
      const brand = getAnalyzedBrandBySlug("orijen-original-dog");
      expect(brand).toBeDefined();
      if (!brand) return;

      const data: ShareImageData = {
        grade: brand.analysis.grade,
        score: brand.analysis.score,
        summary: brand.analysis.summary,
        verdict: brand.analysis.verdict,
        foodName: `${brand.brand} ${brand.product}`,
        foodNameCn: `${brand.brandCn} ${brand.productCn}`,
        petType: brand.petType,
        harmfulNames: brand.analysis.ingredients
          .filter((i) => i.flag === "red")
          .slice(0, 5)
          .map((i) => i.original),
      };

      const ogImage = buildShareImage(data, "og");
      expect(ogImage).toBeDefined();
      expect(ogImage.props).toBeDefined();
    });

    it("generates square share data for a valid brand", () => {
      const brand = getAnalyzedBrandBySlug("orijen-original-dog");
      expect(brand).toBeDefined();
      if (!brand) return;

      const data: ShareImageData = {
        grade: brand.analysis.grade,
        score: brand.analysis.score,
        summary: brand.analysis.summary,
        verdict: brand.analysis.verdict,
        foodName: `${brand.brand} ${brand.product}`,
        petType: brand.petType,
      };

      const sqImage = buildShareImage(data, "square");
      expect(sqImage).toBeDefined();
    });

    it("generates share images for all brands without errors", () => {
      const slugs = getAllBrandSlugs();
      expect(slugs.length).toBeGreaterThan(0);

      for (const slug of slugs) {
        const brand = getAnalyzedBrandBySlug(slug);
        expect(brand).toBeDefined();
        if (!brand) continue;

        const data: ShareImageData = {
          grade: brand.analysis.grade,
          score: brand.analysis.score,
          summary: brand.analysis.summary,
          verdict: brand.analysis.verdict,
          foodName: `${brand.brand} ${brand.product}`,
          foodNameCn: `${brand.brandCn} ${brand.productCn}`,
          petType: brand.petType,
        };

        // Both formats
        expect(buildShareImage(data, "og")).toBeDefined();
        expect(buildShareImage(data, "square")).toBeDefined();
      }
    });
  });

  describe("scan result share image generation", () => {
    it("generates share image for scan result data", () => {
      const data: ShareImageData = {
        grade: "B" as Grade,
        score: 78,
        summary: makeSummary(),
        verdict: "Good quality food.",
        foodName: "My Pet Food",
        harmfulNames: ["BHA", "BHT"],
        safeNames: ["Chicken", "Rice"],
      };

      expect(buildShareImage(data, "og")).toBeDefined();
      expect(buildShareImage(data, "square")).toBeDefined();
    });

    it("handles empty food name", () => {
      const data: ShareImageData = {
        grade: "A" as Grade,
        score: 95,
        summary: makeSummary({ harmfulCount: 0 }),
        verdict: "Excellent food.",
      };

      expect(buildShareImage(data, "og")).toBeDefined();
      expect(buildShareImage(data, "square")).toBeDefined();
    });

    it("handles all grade values", () => {
      const grades: Grade[] = ["A", "B", "C", "D", "F"];
      for (const grade of grades) {
        const data: ShareImageData = {
          grade,
          score: 50,
          summary: makeSummary(),
          verdict: "Test verdict",
        };
        expect(buildShareImage(data, "og")).toBeDefined();
        expect(buildShareImage(data, "square")).toBeDefined();
      }
    });
  });

  describe("format dimensions", () => {
    it("OG format uses 1200x630", () => {
      expect(OG_WIDTH).toBe(1200);
      expect(OG_HEIGHT).toBe(630);
    });

    it("square format uses 1080x1080", () => {
      expect(SQUARE_WIDTH).toBe(1080);
      expect(SQUARE_HEIGHT).toBe(1080);
    });
  });

  describe("grade colors", () => {
    it("all grades have hex colors for share images", () => {
      const grades: Grade[] = ["A", "B", "C", "D", "F"];
      for (const grade of grades) {
        expect(GRADE_HEX[grade]).toMatch(/^#[0-9a-f]{6}$/);
      }
    });
  });
});
