import {
  buildCacheKey,
  buildPrompt,
  generateExplanation,
  clearCache,
  getCacheSize,
} from "../index";
import type { ExplainRequest, ExplainIngredient } from "../types";

// Mock the Anthropic SDK
jest.mock("@anthropic-ai/sdk", () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [
          {
            type: "text",
            text: "This food contains BHA, a potentially harmful preservative. However, chicken as the first ingredient is a positive sign of quality protein content.",
          },
        ],
      }),
    },
  }));
});

function makeIngredients(): ExplainIngredient[] {
  return [
    { name: "Chicken", flag: "green", explanation: "Quality protein source" },
    { name: "Brown Rice", flag: "green", explanation: "Whole grain" },
    { name: "BHA", flag: "red", explanation: "Potentially harmful preservative" },
  ];
}

function makeRequest(overrides: Partial<ExplainRequest> = {}): ExplainRequest {
  return {
    grade: "B",
    score: 82,
    ingredients: makeIngredients(),
    summary: {
      harmfulCount: 1,
      cautionCount: 0,
      safeCount: 2,
      unknownCount: 0,
      topIngredientIsProtein: true,
    },
    ...overrides,
  };
}

describe("buildCacheKey", () => {
  it("creates a deterministic key from ingredients", () => {
    const ingredients = makeIngredients();
    const key1 = buildCacheKey(ingredients);
    const key2 = buildCacheKey(ingredients);
    expect(key1).toBe(key2);
  });

  it("sorts ingredients so order does not matter", () => {
    const ingredients = makeIngredients();
    const reversed = [...ingredients].reverse();
    expect(buildCacheKey(ingredients)).toBe(buildCacheKey(reversed));
  });

  it("produces different keys for different ingredients", () => {
    const a = [{ name: "Chicken", flag: "green" as const, explanation: "" }];
    const b = [{ name: "Beef", flag: "green" as const, explanation: "" }];
    expect(buildCacheKey(a)).not.toBe(buildCacheKey(b));
  });

  it("includes flag in the key", () => {
    const safe = [{ name: "BHA", flag: "green" as const, explanation: "" }];
    const harmful = [{ name: "BHA", flag: "red" as const, explanation: "" }];
    expect(buildCacheKey(safe)).not.toBe(buildCacheKey(harmful));
  });
});

describe("buildPrompt", () => {
  it("includes the grade and score", () => {
    const prompt = buildPrompt(makeRequest());
    expect(prompt).toContain("grade of B");
    expect(prompt).toContain("82/100");
  });

  it("lists harmful ingredients", () => {
    const prompt = buildPrompt(makeRequest());
    expect(prompt).toContain("BHA");
    expect(prompt).toContain("Flagged ingredients");
  });

  it("lists safe ingredients", () => {
    const prompt = buildPrompt(makeRequest());
    expect(prompt).toContain("Chicken");
    expect(prompt).toContain("Brown Rice");
  });

  it("mentions protein status", () => {
    const prompt = buildPrompt(makeRequest({ summary: { ...makeRequest().summary, topIngredientIsProtein: false } }));
    expect(prompt).toContain("quality protein: no");
  });

  it("requests 2-3 sentences", () => {
    const prompt = buildPrompt(makeRequest());
    expect(prompt).toContain("2-3 sentences");
  });
});

describe("generateExplanation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    clearCache();
    process.env = { ...originalEnv, ANTHROPIC_API_KEY: "test-key-123" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns an explanation from the API", async () => {
    const result = await generateExplanation(makeRequest());
    expect(result.explanation).toContain("BHA");
    expect(result.cached).toBe(false);
  });

  it("caches the result for subsequent calls", async () => {
    const first = await generateExplanation(makeRequest());
    expect(first.cached).toBe(false);
    expect(getCacheSize()).toBe(1);

    const second = await generateExplanation(makeRequest());
    expect(second.cached).toBe(true);
    expect(second.explanation).toBe(first.explanation);
  });

  it("throws when ANTHROPIC_API_KEY is not set", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    await expect(generateExplanation(makeRequest())).rejects.toThrow(
      "ANTHROPIC_API_KEY"
    );
  });
});

describe("cache management", () => {
  beforeEach(() => {
    clearCache();
  });

  it("clearCache resets the cache", () => {
    // Directly test cache size after clear
    expect(getCacheSize()).toBe(0);
  });

  it("getCacheSize returns correct count", async () => {
    expect(getCacheSize()).toBe(0);
  });
});
