/**
 * F008 - Pet Profile Module
 */

export { saveProfile, loadProfile, clearProfile } from "./storage";
export { calculateProfileAdjustments } from "./sensitivities";
export type {
  PetProfile,
  PetType,
  AgeRange,
  HealthCondition,
  ScoreAdjustment,
  ProfileAdjustmentResult,
} from "./types";
