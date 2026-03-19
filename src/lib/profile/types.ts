/**
 * F008 - Pet Profile and Personalization Types
 *
 * Pre-implementation thinking:
 * 1. What does this feature do? Allow users to input pet details (type, breed, age, weight,
 *    health conditions) and adjust ingredient scoring based on breed-specific sensitivities.
 * 2. Key design decisions:
 *    - Pet type limited to cat/dog (covers 95%+ of users)
 *    - Health conditions are predefined set (not free text) for reliable matching
 *    - Score adjustments are additive modifiers applied after base scoring
 *    - Profile stored in localStorage for persistence across sessions
 * 3. What could go wrong? Invalid breed names, empty profiles, stale localStorage data
 * 4. Simplest approach: predefined sensitivity map per breed/condition, additive score modifiers
 * 5. Acceptance criteria: profile form works, score adjusts for known sensitivities, persists
 */

/** Supported pet types */
export type PetType = "dog" | "cat";

/** Age range categories */
export type AgeRange = "puppy" | "adult" | "senior";

/** Common health conditions that affect food scoring */
export type HealthCondition =
  | "grain_sensitivity"
  | "chicken_allergy"
  | "beef_allergy"
  | "fish_allergy"
  | "kidney_disease"
  | "diabetes"
  | "obesity"
  | "digestive_issues";

/** A user's pet profile */
export interface PetProfile {
  /** Pet type - dog or cat */
  petType: PetType;
  /** Breed name (free text, optional) */
  breed: string;
  /** Age range */
  ageRange: AgeRange;
  /** Weight in kg */
  weightKg: number;
  /** Active health conditions */
  healthConditions: HealthCondition[];
}

/** A scoring adjustment based on pet profile */
export interface ScoreAdjustment {
  /** Points to add (negative = penalty) */
  points: number;
  /** Reason for this adjustment */
  reason: string;
  /** Which ingredient triggered it (if any) */
  ingredientName?: string;
}

/** Result of applying pet profile to analysis */
export interface ProfileAdjustmentResult {
  /** All adjustments applied */
  adjustments: ScoreAdjustment[];
  /** Total points change */
  totalAdjustment: number;
  /** Personalized warnings */
  warnings: string[];
}
