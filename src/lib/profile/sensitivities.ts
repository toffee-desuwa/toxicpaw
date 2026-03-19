/**
 * F008 - Breed Sensitivity Data and Score Adjustment Logic
 *
 * Maps breed names to known ingredient sensitivities, and health conditions
 * to ingredient category penalties. Calculates personalized score adjustments
 * based on a pet's profile and the analyzed ingredients.
 */

import type { IngredientCategory } from "../knowledge/types";
import type { AnalyzedIngredient } from "../analyzer/types";
import type {
  PetProfile,
  ProfileAdjustmentResult,
  ScoreAdjustment,
  HealthCondition,
} from "./types";

/** Breed sensitivity definition */
interface BreedSensitivity {
  sensitiveCategories: IngredientCategory[];
  sensitiveIngredients?: string[];
}

/** Per-breed sensitivity data (lowercase breed name → sensitivity) */
export const BREED_SENSITIVITIES: Record<string, BreedSensitivity> = {
  // Dogs with grain sensitivities
  "irish setter": { sensitiveCategories: ["grain"] },
  "german shepherd": { sensitiveCategories: ["grain"] },
  "labrador retriever": { sensitiveCategories: ["grain"] },
  "golden retriever": { sensitiveCategories: ["grain"] },
  "cocker spaniel": { sensitiveCategories: ["grain"] },
  "boxer": { sensitiveCategories: ["grain", "filler"] },
  "bulldog": { sensitiveCategories: ["grain", "filler"] },
  "french bulldog": { sensitiveCategories: ["grain", "filler", "coloring"] },
  "pug": { sensitiveCategories: ["grain", "filler"] },
  "shih tzu": { sensitiveCategories: ["grain", "additive"] },
  "dachshund": { sensitiveCategories: ["grain"] },
  // Cats
  "siamese": { sensitiveCategories: ["grain", "additive"] },
  "persian": { sensitiveCategories: ["grain", "coloring"] },
  "bengal": { sensitiveCategories: ["grain", "filler"] },
  "sphynx": { sensitiveCategories: ["grain", "additive", "coloring"] },
};

/** Condition → ingredient category penalty */
interface ConditionPenalty {
  category: IngredientCategory;
  points: number;
  reason: string;
}

/** Per-condition ingredient penalties */
export const CONDITION_INGREDIENT_PENALTIES: Record<string, ConditionPenalty[]> = {
  grain_sensitivity: [
    { category: "grain", points: -8, reason: "Grain ingredient may trigger sensitivity" },
  ],
  chicken_allergy: [
    { category: "protein", points: -10, reason: "May contain chicken protein allergen" },
  ],
  beef_allergy: [
    { category: "protein", points: -10, reason: "May contain beef protein allergen" },
  ],
  fish_allergy: [
    { category: "protein", points: -10, reason: "May contain fish protein allergen" },
  ],
  kidney_disease: [
    { category: "protein", points: -5, reason: "High protein may stress kidneys" },
    { category: "mineral", points: -3, reason: "Excess minerals may stress kidneys" },
  ],
  diabetes: [
    { category: "grain", points: -5, reason: "Grains can spike blood sugar" },
    { category: "sweetener", points: -10, reason: "Sweeteners dangerous for diabetic pets" },
  ],
  obesity: [
    { category: "fat_oil", points: -8, reason: "High fat content contributes to weight gain" },
    { category: "sweetener", points: -5, reason: "Added sweeteners contribute to weight gain" },
  ],
  digestive_issues: [
    { category: "filler", points: -5, reason: "Fillers may worsen digestive issues" },
    { category: "byproduct", points: -5, reason: "Byproducts may be hard to digest" },
    { category: "additive", points: -3, reason: "Additives may irritate sensitive digestion" },
  ],
};

/** Allergy condition → ingredient name keywords to match */
const ALLERGY_KEYWORDS: Record<string, string[]> = {
  chicken_allergy: ["chicken", "poultry"],
  beef_allergy: ["beef", "cattle", "bovine"],
  fish_allergy: ["fish", "salmon", "tuna", "cod", "anchovy", "sardine", "herring"],
};

/** Base penalty per sensitive ingredient */
const BASE_SENSITIVITY_PENALTY = -5;
/** Extra penalty if ingredient is in top 5 positions */
const TOP_POSITION_EXTRA = -3;

/**
 * Calculate personalized score adjustments based on pet profile and ingredients.
 */
export function calculateProfileAdjustments(
  profile: PetProfile,
  ingredients: AnalyzedIngredient[]
): ProfileAdjustmentResult {
  if (ingredients.length === 0) {
    return { adjustments: [], totalAdjustment: 0, warnings: [] };
  }

  const adjustments: ScoreAdjustment[] = [];
  const warnings: string[] = [];
  // Track which categories have already been penalized to avoid double-counting
  const penalizedCategories = new Set<string>();

  // 1. Breed-specific sensitivities
  const breedKey = profile.breed.toLowerCase().trim();
  const breedSensitivity = BREED_SENSITIVITIES[breedKey];

  if (breedSensitivity) {
    for (const ingredient of ingredients) {
      if (!ingredient.knownIngredient) continue;
      const cat = ingredient.knownIngredient.category;
      if (breedSensitivity.sensitiveCategories.includes(cat)) {
        const inTop = ingredient.position < 5;
        const points = BASE_SENSITIVITY_PENALTY + (inTop ? TOP_POSITION_EXTRA : 0);
        adjustments.push({
          points,
          reason: `${profile.breed} breed may be sensitive to ${cat} ingredients`,
          ingredientName: ingredient.original,
        });
        penalizedCategories.add(`${cat}:${ingredient.normalized}`);
      }
    }
    if (adjustments.length > 0) {
      warnings.push(
        `${profile.breed} dogs/cats can be sensitive to certain ingredients in this food.`
      );
    }
  }

  // 2. Health condition penalties
  for (const condition of profile.healthConditions) {
    const penalties = CONDITION_INGREDIENT_PENALTIES[condition];
    if (!penalties) continue;

    const allergyKeywords = ALLERGY_KEYWORDS[condition];

    for (const ingredient of ingredients) {
      if (!ingredient.knownIngredient) continue;
      const cat = ingredient.knownIngredient.category;
      const key = `${cat}:${ingredient.normalized}`;

      for (const penalty of penalties) {
        if (penalty.category !== cat) continue;

        // For allergy conditions, only penalize if ingredient name matches
        if (allergyKeywords) {
          const nameLC = ingredient.normalized;
          if (!allergyKeywords.some((kw) => nameLC.includes(kw))) continue;
        }

        // Avoid double-counting same category+ingredient from breed sensitivity
        if (penalizedCategories.has(key)) {
          // Still add a smaller adjustment for the condition on top
          adjustments.push({
            points: Math.round(penalty.points / 2),
            reason: penalty.reason,
            ingredientName: ingredient.original,
          });
        } else {
          const inTop = ingredient.position < 5;
          const positionExtra = inTop ? -2 : 0;
          adjustments.push({
            points: penalty.points + positionExtra,
            reason: penalty.reason,
            ingredientName: ingredient.original,
          });
          penalizedCategories.add(key);
        }
      }
    }

    // Generate condition-specific warnings
    const conditionWarning = generateConditionWarning(condition, ingredients);
    if (conditionWarning) {
      warnings.push(conditionWarning);
    }
  }

  // 3. Age-based adjustments
  const ageAdjustments = calculateAgeAdjustments(profile, ingredients);
  adjustments.push(...ageAdjustments.adjustments);
  warnings.push(...ageAdjustments.warnings);

  const totalAdjustment = adjustments.reduce((sum, a) => sum + a.points, 0);

  return { adjustments, totalAdjustment, warnings };
}

/** Generate a warning string for a health condition */
function generateConditionWarning(
  condition: HealthCondition,
  ingredients: AnalyzedIngredient[]
): string | null {
  const allergyKeywords = ALLERGY_KEYWORDS[condition];
  if (allergyKeywords) {
    const matches = ingredients.filter((i) =>
      allergyKeywords.some((kw) => i.normalized.includes(kw))
    );
    if (matches.length > 0) {
      const names = matches.map((m) => m.original).join(", ");
      return `Warning: Contains ${names} which may trigger ${condition.replace(/_/g, " ")}.`;
    }
  }
  return null;
}

/** Calculate age-specific scoring adjustments */
function calculateAgeAdjustments(
  profile: PetProfile,
  ingredients: AnalyzedIngredient[]
): { adjustments: ScoreAdjustment[]; warnings: string[] } {
  const adjustments: ScoreAdjustment[] = [];
  const warnings: string[] = [];

  const proteinCount = ingredients.filter(
    (i) => i.knownIngredient?.category === "protein"
  ).length;
  const totalCount = ingredients.length;
  const proteinRatio = totalCount > 0 ? proteinCount / totalCount : 0;

  if (profile.ageRange === "senior" && proteinRatio > 0.3) {
    adjustments.push({
      points: -3,
      reason: "High protein ratio may not be ideal for senior pets",
    });
    warnings.push(
      "This food has high protein content. Senior pets may benefit from moderate protein levels — consult your vet."
    );
  }

  if (profile.ageRange === "puppy" && proteinRatio < 0.1 && totalCount >= 3) {
    adjustments.push({
      points: -5,
      reason: "Low protein content not ideal for growing puppies",
    });
    warnings.push(
      "This food appears low in protein. Growing puppies need protein-rich diets for proper development."
    );
  }

  return { adjustments, warnings };
}
