/**
 * F005 - Ingredient Analysis Engine Tests
 */

import { analyzeIngredients, scoreToGrade } from "../index";
import type { ParsedIngredient } from "../../ocr/types";

/** Helper to create a ParsedIngredient */
function makeIngredient(name: string, position: number): ParsedIngredient {
  return {
    original: name,
    normalized: name.toLowerCase(),
    position,
  };
}

describe("scoreToGrade", () => {
  it("maps 90-100 to A", () => {
    expect(scoreToGrade(100)).toBe("A");
    expect(scoreToGrade(95)).toBe("A");
    expect(scoreToGrade(90)).toBe("A");
  });

  it("maps 75-89 to B", () => {
    expect(scoreToGrade(89)).toBe("B");
    expect(scoreToGrade(75)).toBe("B");
  });

  it("maps 60-74 to C", () => {
    expect(scoreToGrade(74)).toBe("C");
    expect(scoreToGrade(60)).toBe("C");
  });

  it("maps 40-59 to D", () => {
    expect(scoreToGrade(59)).toBe("D");
    expect(scoreToGrade(40)).toBe("D");
  });

  it("maps 0-39 to F", () => {
    expect(scoreToGrade(39)).toBe("F");
    expect(scoreToGrade(0)).toBe("F");
  });
});

describe("analyzeIngredients", () => {
  it("returns empty analysis for no ingredients", () => {
    const result = analyzeIngredients([]);
    expect(result.grade).toBe("F");
    expect(result.score).toBe(0);
    expect(result.ingredients).toHaveLength(0);
    expect(result.summary.totalIngredients).toBe(0);
    expect(result.verdict).toContain("No ingredients found");
  });

  it("grades a high-quality food with safe ingredients highly", () => {
    const ingredients = [
      makeIngredient("chicken", 0),
      makeIngredient("brown rice", 1),
      makeIngredient("chicken fat", 2),
      makeIngredient("sweet potato", 3),
      makeIngredient("peas", 4),
    ];

    const result = analyzeIngredients(ingredients);
    // Protein first, all safe ingredients = should be A or B
    expect(["A", "B"]).toContain(result.grade);
    expect(result.score).toBeGreaterThanOrEqual(75);
    expect(result.summary.topIngredientIsProtein).toBe(true);
    expect(result.summary.harmfulCount).toBe(0);
  });

  it("penalizes harmful ingredients heavily", () => {
    const ingredients = [
      makeIngredient("chicken", 0),
      makeIngredient("BHA", 1), // harmful preservative
      makeIngredient("BHT", 2), // harmful preservative
      makeIngredient("ethoxyquin", 3), // harmful preservative
      makeIngredient("propylene glycol", 4), // harmful
    ];

    const result = analyzeIngredients(ingredients);
    // Multiple harmful ingredients = should be low grade
    expect(result.summary.harmfulCount).toBeGreaterThanOrEqual(2);
    expect(result.score).toBeLessThan(60);
  });

  it("flags unknown ingredients correctly", () => {
    const ingredients = [
      makeIngredient("chicken", 0),
      makeIngredient("xyzzyflurb", 1), // not in database
    ];

    const result = analyzeIngredients(ingredients);
    const unknown = result.ingredients.find(
      (i) => i.normalized === "xyzzyflurb"
    );
    expect(unknown).toBeDefined();
    expect(unknown!.flag).toBe("unknown");
    expect(unknown!.knownIngredient).toBeNull();
    expect(result.summary.unknownCount).toBe(1);
  });

  it("flags safe, caution, and harmful ingredients with correct colors", () => {
    const ingredients = [
      makeIngredient("chicken", 0), // safe protein
      makeIngredient("corn syrup", 1), // harmful sweetener
    ];

    const result = analyzeIngredients(ingredients);
    const chicken = result.ingredients.find(
      (i) => i.normalized === "chicken"
    );
    const cornSyrup = result.ingredients.find(
      (i) => i.normalized === "corn syrup"
    );

    expect(chicken).toBeDefined();
    expect(chicken!.flag).toBe("green");

    expect(cornSyrup).toBeDefined();
    expect(cornSyrup!.flag).toBe("red");
  });

  it("penalizes foods without protein in top 3", () => {
    const ingredients = [
      makeIngredient("corn", 0), // grain, not protein
      makeIngredient("wheat", 1),
      makeIngredient("soybean meal", 2),
      makeIngredient("chicken", 3), // protein but not in top 3
      makeIngredient("rice", 4),
    ];

    const result = analyzeIngredients(ingredients);
    expect(result.summary.topIngredientIsProtein).toBe(false);
    // Should be penalized vs similar food with protein first
    const withProteinFirst = analyzeIngredients([
      makeIngredient("chicken", 0),
      makeIngredient("corn", 1),
      makeIngredient("wheat", 2),
      makeIngredient("soybean meal", 3),
      makeIngredient("rice", 4),
    ]);
    expect(result.score).toBeLessThan(withProteinFirst.score);
  });

  it("builds correct summary statistics", () => {
    const ingredients = [
      makeIngredient("chicken", 0),
      makeIngredient("brown rice", 1),
      makeIngredient("BHA", 2),
      makeIngredient("xyzunknown", 3),
    ];

    const result = analyzeIngredients(ingredients);
    expect(result.summary.totalIngredients).toBe(4);
    expect(result.summary.safeCount).toBeGreaterThanOrEqual(1);
    expect(result.summary.unknownCount).toBe(1);
  });

  it("generates a verdict string", () => {
    const ingredients = [
      makeIngredient("chicken", 0),
      makeIngredient("brown rice", 1),
    ];

    const result = analyzeIngredients(ingredients);
    expect(result.verdict).toBeTruthy();
    expect(typeof result.verdict).toBe("string");
    expect(result.verdict.length).toBeGreaterThan(10);
  });

  it("handles concern categories in summary percentage", () => {
    const ingredients = [
      makeIngredient("chicken", 0),
      makeIngredient("corn gluten meal", 1), // filler
      makeIngredient("BHA", 2), // harmful
    ];

    const result = analyzeIngredients(ingredients);
    expect(result.summary.concernPercentage).toBeGreaterThan(0);
  });

  it("includes match info for known ingredients", () => {
    const ingredients = [makeIngredient("chicken", 0)];

    const result = analyzeIngredients(ingredients);
    const chicken = result.ingredients[0];
    expect(chicken.matchInfo).not.toBeNull();
    expect(chicken.knownIngredient).not.toBeNull();
    expect(chicken.explanation).toBeTruthy();
    expect(chicken.explanation).not.toBe(
      "Not found in our ingredient database"
    );
  });

  it("clamps score between 0 and 100", () => {
    // Many harmful ingredients should not go below 0
    const manyHarmful = Array.from({ length: 15 }, (_, i) =>
      makeIngredient("BHA", i)
    );
    const result = analyzeIngredients(manyHarmful);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});
