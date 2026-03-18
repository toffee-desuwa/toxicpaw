import {
  lookupIngredient,
  lookupIngredients,
  searchIngredients,
  getIngredientsByCategory,
  getIngredientsByRating,
  getHarmfulIngredients,
  getIngredientCount,
  getCategories,
  getKnowledgeBaseInfo,
} from "../index";

describe("Ingredient Knowledge Base", () => {
  describe("getKnowledgeBaseInfo", () => {
    it("returns correct metadata", () => {
      const info = getKnowledgeBaseInfo();
      expect(info.version).toBe("1.0.0");
      expect(info.lastUpdated).toBe("2026-03-19");
      expect(info.totalIngredients).toBeGreaterThanOrEqual(500);
    });
  });

  describe("getIngredientCount", () => {
    it("returns 500+ ingredients", () => {
      expect(getIngredientCount()).toBeGreaterThanOrEqual(500);
    });
  });

  describe("getCategories", () => {
    it("includes all expected categories", () => {
      const categories = getCategories();
      expect(categories).toContain("protein");
      expect(categories).toContain("grain");
      expect(categories).toContain("vegetable");
      expect(categories).toContain("fruit");
      expect(categories).toContain("fat_oil");
      expect(categories).toContain("preservative");
      expect(categories).toContain("vitamin");
      expect(categories).toContain("mineral");
      expect(categories).toContain("coloring");
      expect(categories).toContain("sweetener");
      expect(categories).toContain("filler");
      expect(categories).toContain("byproduct");
      expect(categories).toContain("supplement");
      expect(categories).toContain("thickener");
      expect(categories).toContain("flavor");
      expect(categories).toContain("additive");
      expect(categories).toContain("fiber");
    });
  });

  describe("lookupIngredient", () => {
    it("finds ingredient by exact name", () => {
      const result = lookupIngredient("Chicken");
      expect(result).not.toBeNull();
      expect(result!.ingredient.name).toBe("Chicken");
      expect(result!.matched_by).toBe("exact");
      expect(result!.confidence).toBe(1.0);
    });

    it("is case-insensitive", () => {
      const result = lookupIngredient("chicken");
      expect(result).not.toBeNull();
      expect(result!.ingredient.name).toBe("Chicken");
    });

    it("finds ingredient by alias", () => {
      const result = lookupIngredient("Deboned Chicken");
      expect(result).not.toBeNull();
      expect(result!.ingredient.name).toBe("Chicken");
      expect(result!.matched_by).toBe("alias");
      expect(result!.confidence).toBe(0.95);
    });

    it("finds ingredient by Chinese alias", () => {
      const result = lookupIngredient("鸡肉");
      expect(result).not.toBeNull();
      expect(result!.ingredient.name).toBe("Chicken");
      expect(result!.matched_by).toBe("alias");
    });

    it("handles whitespace and punctuation", () => {
      const result = lookupIngredient("  Chicken  ");
      expect(result).not.toBeNull();
      expect(result!.ingredient.name).toBe("Chicken");
    });

    it("returns null for unknown ingredients", () => {
      const result = lookupIngredient("UnknownIngredientXYZ123");
      expect(result).toBeNull();
    });

    it("identifies harmful ingredients correctly", () => {
      const bha = lookupIngredient("BHA");
      expect(bha).not.toBeNull();
      expect(bha!.ingredient.safety_rating).toBe("harmful");

      const xylitol = lookupIngredient("Xylitol");
      expect(xylitol).not.toBeNull();
      expect(xylitol!.ingredient.safety_rating).toBe("harmful");
    });

    it("identifies safe ingredients correctly", () => {
      const salmon = lookupIngredient("Salmon");
      expect(salmon).not.toBeNull();
      expect(salmon!.ingredient.safety_rating).toBe("safe");
    });

    it("identifies caution ingredients correctly", () => {
      const corn = lookupIngredient("Corn");
      expect(corn).not.toBeNull();
      expect(corn!.ingredient.safety_rating).toBe("caution");
    });

    it("performs fuzzy matching for partial names", () => {
      const result = lookupIngredient("Fresh Chicken Liver");
      expect(result).not.toBeNull();
      expect(result!.ingredient.name).toBe("Chicken Liver");
    });
  });

  describe("lookupIngredients", () => {
    it("looks up multiple ingredients at once", () => {
      const results = lookupIngredients([
        "Chicken",
        "Brown Rice",
        "BHA",
        "UnknownXYZ",
      ]);
      expect(results).toHaveLength(4);
      expect(results[0]).not.toBeNull();
      expect(results[0]!.ingredient.name).toBe("Chicken");
      expect(results[1]).not.toBeNull();
      expect(results[1]!.ingredient.name).toBe("Brown Rice");
      expect(results[2]).not.toBeNull();
      expect(results[2]!.ingredient.safety_rating).toBe("harmful");
      expect(results[3]).toBeNull();
    });
  });

  describe("searchIngredients", () => {
    it("finds ingredients by partial name", () => {
      const results = searchIngredients("chicken");
      expect(results.length).toBeGreaterThan(3);
      expect(results.some((i) => i.name === "Chicken")).toBe(true);
      expect(results.some((i) => i.name === "Chicken Meal")).toBe(true);
      expect(results.some((i) => i.name === "Chicken Fat")).toBe(true);
    });

    it("finds ingredients by Chinese name", () => {
      const results = searchIngredients("鸡");
      expect(results.length).toBeGreaterThan(0);
    });

    it("returns empty for empty query", () => {
      expect(searchIngredients("")).toHaveLength(0);
      expect(searchIngredients("  ")).toHaveLength(0);
    });
  });

  describe("getIngredientsByCategory", () => {
    it("returns proteins", () => {
      const proteins = getIngredientsByCategory("protein");
      expect(proteins.length).toBeGreaterThan(20);
      expect(proteins.every((i) => i.category === "protein")).toBe(true);
    });

    it("returns preservatives", () => {
      const preservatives = getIngredientsByCategory("preservative");
      expect(preservatives.length).toBeGreaterThan(5);
      expect(preservatives.every((i) => i.category === "preservative")).toBe(true);
    });
  });

  describe("getIngredientsByRating", () => {
    it("returns harmful ingredients", () => {
      const harmful = getIngredientsByRating("harmful");
      expect(harmful.length).toBeGreaterThan(10);
      expect(harmful.every((i) => i.safety_rating === "harmful")).toBe(true);
    });

    it("returns safe ingredients", () => {
      const safe = getIngredientsByRating("safe");
      expect(safe.length).toBeGreaterThan(200);
      expect(safe.every((i) => i.safety_rating === "safe")).toBe(true);
    });
  });

  describe("getHarmfulIngredients", () => {
    it("returns known harmful ingredients", () => {
      const harmful = getHarmfulIngredients();
      const names = harmful.map((i) => i.name);
      expect(names).toContain("BHA");
      expect(names).toContain("BHT");
      expect(names).toContain("Ethoxyquin");
      expect(names).toContain("Xylitol");
      expect(names).toContain("Red 40");
      expect(names).toContain("Sugar");
      expect(names).toContain("Artificial Flavor");
      expect(names).toContain("Onion");
    });
  });

  describe("data integrity", () => {
    it("every ingredient has required fields", () => {
      const info = getKnowledgeBaseInfo();
      const allCategories = getCategories();

      for (const category of allCategories) {
        const ingredients = getIngredientsByCategory(category);
        for (const ingredient of ingredients) {
          expect(ingredient.name).toBeTruthy();
          expect(ingredient.category).toBeTruthy();
          expect(["safe", "caution", "harmful"]).toContain(
            ingredient.safety_rating
          );
          expect(ingredient.explanation).toBeTruthy();
          expect(Array.isArray(ingredient.common_aliases)).toBe(true);
        }
      }

      expect(info.totalIngredients).toBeGreaterThanOrEqual(500);
    });

    it("has no duplicate ingredient names", () => {
      const safe = getIngredientsByRating("safe");
      const caution = getIngredientsByRating("caution");
      const harmful = getIngredientsByRating("harmful");
      const all = [...safe, ...caution, ...harmful];
      const names = all.map((i) => i.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });
  });
});
