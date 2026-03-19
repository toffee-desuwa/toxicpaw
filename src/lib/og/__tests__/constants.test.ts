import { GRADE_HEX, OG_WIDTH, OG_HEIGHT } from "../constants";

describe("OG Constants", () => {
  describe("GRADE_HEX", () => {
    it("has hex colors for all grades", () => {
      expect(GRADE_HEX.A).toBe("#10b981");
      expect(GRADE_HEX.B).toBe("#84cc16");
      expect(GRADE_HEX.C).toBe("#f59e0b");
      expect(GRADE_HEX.D).toBe("#f97316");
      expect(GRADE_HEX.F).toBe("#dc2626");
    });

    it("all values are valid hex colors", () => {
      const hexPattern = /^#[0-9a-f]{6}$/;
      for (const color of Object.values(GRADE_HEX)) {
        expect(color).toMatch(hexPattern);
      }
    });

    it("covers exactly 5 grades", () => {
      expect(Object.keys(GRADE_HEX)).toHaveLength(5);
      expect(Object.keys(GRADE_HEX).sort()).toEqual(["A", "B", "C", "D", "F"]);
    });
  });

  describe("OG dimensions", () => {
    it("uses standard OG image dimensions", () => {
      expect(OG_WIDTH).toBe(1200);
      expect(OG_HEIGHT).toBe(630);
    });
  });
});
