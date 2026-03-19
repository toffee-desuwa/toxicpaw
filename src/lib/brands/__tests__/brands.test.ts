import {
  getAllBrands,
  getAllAnalyzedBrands,
  analyzeBrand,
  getBrandBySlug,
  getAnalyzedBrandBySlug,
  getAllBrandSlugs,
  getBrandsByPetType,
  getAnalyzedBrandsByPetType,
  searchBrands,
  getBrandDatabaseInfo,
} from "../index";
import type { BrandEntry, AnalyzedBrand } from "../types";

describe("Brand Database", () => {
  describe("getAllBrands", () => {
    it("returns all brand entries", () => {
      const brands = getAllBrands();
      expect(brands.length).toBeGreaterThanOrEqual(50);
    });

    it("each brand has required fields", () => {
      const brands = getAllBrands();
      for (const brand of brands) {
        expect(brand.slug).toBeTruthy();
        expect(brand.brand).toBeTruthy();
        expect(brand.brandCn).toBeTruthy();
        expect(brand.product).toBeTruthy();
        expect(brand.productCn).toBeTruthy();
        expect(["cat", "dog"]).toContain(brand.petType);
        expect(brand.ingredients.length).toBeGreaterThan(0);
        expect(brand.source).toBeTruthy();
      }
    });

    it("all slugs are unique", () => {
      const brands = getAllBrands();
      const slugs = brands.map((b) => b.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it("has a mix of cat and dog brands", () => {
      const brands = getAllBrands();
      const cats = brands.filter((b) => b.petType === "cat").length;
      const dogs = brands.filter((b) => b.petType === "dog").length;
      expect(cats).toBeGreaterThanOrEqual(20);
      expect(dogs).toBeGreaterThanOrEqual(20);
    });
  });

  describe("analyzeBrand", () => {
    it("computes analysis for a brand", () => {
      const brand = getBrandBySlug("orijen-original-dog");
      expect(brand).not.toBeNull();
      const analyzed = analyzeBrand(brand!);
      expect(analyzed.analysis).toBeDefined();
      expect(analyzed.analysis.grade).toBeTruthy();
      expect(analyzed.analysis.score).toBeGreaterThanOrEqual(0);
      expect(analyzed.analysis.score).toBeLessThanOrEqual(100);
      expect(analyzed.analysis.ingredients.length).toBe(brand!.ingredients.length);
    });

    it("premium brands score higher than budget brands", () => {
      const orijen = getAnalyzedBrandBySlug("orijen-original-dog");
      const pedigree = getAnalyzedBrandBySlug("pedigree-adult-dog");
      expect(orijen).not.toBeNull();
      expect(pedigree).not.toBeNull();
      expect(orijen!.analysis.score).toBeGreaterThan(pedigree!.analysis.score);
    });

    it("high-quality brands get A or B grade", () => {
      const ziwi = getAnalyzedBrandBySlug("ziwi-peak-venison-dog");
      expect(ziwi).not.toBeNull();
      expect(["A", "B"]).toContain(ziwi!.analysis.grade);
    });

    it("budget brands with fillers get lower grades", () => {
      const meowMix = getAnalyzedBrandBySlug("meow-mix-original-cat");
      expect(meowMix).not.toBeNull();
      expect(["D", "F"]).toContain(meowMix!.analysis.grade);
    });
  });

  describe("getAllAnalyzedBrands", () => {
    it("returns all brands with analysis results", () => {
      const analyzed = getAllAnalyzedBrands();
      expect(analyzed.length).toBeGreaterThanOrEqual(50);
      for (const brand of analyzed) {
        expect(brand.analysis).toBeDefined();
        expect(brand.analysis.grade).toBeTruthy();
        expect(brand.analysis.verdict).toBeTruthy();
      }
    });

    it("has brands across all grade levels", () => {
      const analyzed = getAllAnalyzedBrands();
      const grades = new Set(analyzed.map((b) => b.analysis.grade));
      expect(grades.size).toBeGreaterThanOrEqual(3);
    });
  });

  describe("getBrandBySlug", () => {
    it("returns brand for valid slug", () => {
      const brand = getBrandBySlug("royal-canin-indoor-cat");
      expect(brand).not.toBeNull();
      expect(brand!.brand).toBe("Royal Canin");
      expect(brand!.petType).toBe("cat");
    });

    it("returns null for invalid slug", () => {
      const brand = getBrandBySlug("nonexistent-brand");
      expect(brand).toBeNull();
    });
  });

  describe("getAnalyzedBrandBySlug", () => {
    it("returns analyzed brand for valid slug", () => {
      const brand = getAnalyzedBrandBySlug("orijen-cat-kitten");
      expect(brand).not.toBeNull();
      expect(brand!.analysis).toBeDefined();
      expect(brand!.brand).toBe("Orijen");
    });

    it("returns null for invalid slug", () => {
      const brand = getAnalyzedBrandBySlug("nonexistent");
      expect(brand).toBeNull();
    });
  });

  describe("getAllBrandSlugs", () => {
    it("returns all slugs", () => {
      const slugs = getAllBrandSlugs();
      expect(slugs.length).toBe(getAllBrands().length);
      expect(slugs).toContain("orijen-original-dog");
      expect(slugs).toContain("royal-canin-indoor-cat");
    });
  });

  describe("getBrandsByPetType", () => {
    it("filters cat brands", () => {
      const cats = getBrandsByPetType("cat");
      expect(cats.length).toBeGreaterThan(0);
      expect(cats.every((b) => b.petType === "cat")).toBe(true);
    });

    it("filters dog brands", () => {
      const dogs = getBrandsByPetType("dog");
      expect(dogs.length).toBeGreaterThan(0);
      expect(dogs.every((b) => b.petType === "dog")).toBe(true);
    });
  });

  describe("getAnalyzedBrandsByPetType", () => {
    it("returns analyzed brands filtered by pet type", () => {
      const cats = getAnalyzedBrandsByPetType("cat");
      expect(cats.length).toBeGreaterThan(0);
      for (const cat of cats) {
        expect(cat.petType).toBe("cat");
        expect(cat.analysis).toBeDefined();
      }
    });
  });

  describe("searchBrands", () => {
    it("finds brands by English name", () => {
      const results = searchBrands("Orijen");
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((b) => b.brand === "Orijen")).toBe(true);
    });

    it("finds brands by Chinese name", () => {
      const results = searchBrands("皇家");
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((b) => b.brandCn === "皇家")).toBe(true);
    });

    it("finds brands by product name", () => {
      const results = searchBrands("Indoor");
      expect(results.length).toBeGreaterThan(0);
    });

    it("search is case-insensitive", () => {
      const results = searchBrands("orijen");
      expect(results.length).toBeGreaterThan(0);
    });

    it("returns empty for no match", () => {
      const results = searchBrands("zzzznonexistent");
      expect(results).toEqual([]);
    });

    it("returns empty for empty query", () => {
      const results = searchBrands("");
      expect(results).toEqual([]);
    });
  });

  describe("getBrandDatabaseInfo", () => {
    it("returns database metadata", () => {
      const info = getBrandDatabaseInfo();
      expect(info.version).toBeTruthy();
      expect(info.lastUpdated).toBeTruthy();
      expect(info.totalBrands).toBeGreaterThanOrEqual(50);
    });
  });

  describe("data integrity", () => {
    it("all slugs are URL-safe", () => {
      const brands = getAllBrands();
      const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      for (const brand of brands) {
        expect(brand.slug).toMatch(slugPattern);
      }
    });

    it("all ingredient lists are non-empty arrays of strings", () => {
      const brands = getAllBrands();
      for (const brand of brands) {
        expect(Array.isArray(brand.ingredients)).toBe(true);
        expect(brand.ingredients.length).toBeGreaterThan(0);
        for (const ingredient of brand.ingredients) {
          expect(typeof ingredient).toBe("string");
          expect(ingredient.trim().length).toBeGreaterThan(0);
        }
      }
    });

    it("most ingredients match the knowledge base", () => {
      const analyzed = getAllAnalyzedBrands();
      let totalIngredients = 0;
      let unknownIngredients = 0;
      for (const brand of analyzed) {
        for (const ing of brand.analysis.ingredients) {
          totalIngredients++;
          if (ing.flag === "unknown") unknownIngredients++;
        }
      }
      const matchRate = 1 - unknownIngredients / totalIngredients;
      expect(matchRate).toBeGreaterThan(0.7);
    });
  });
});
