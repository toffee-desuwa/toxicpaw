/**
 * Tests for pet profile localStorage persistence (F008)
 */

import type { PetProfile } from "../types";
import { saveProfile, loadProfile, clearProfile, STORAGE_KEY } from "../storage";

/** Helper to create a test profile */
function makeProfile(overrides: Partial<PetProfile> = {}): PetProfile {
  return {
    petType: "dog",
    breed: "Labrador Retriever",
    ageRange: "adult",
    weightKg: 25,
    healthConditions: [],
    ...overrides,
  };
}

describe("profile storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("saveProfile stores profile in localStorage", () => {
    const profile = makeProfile();
    saveProfile(profile);

    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!)).toEqual(profile);
  });

  test("loadProfile returns saved profile", () => {
    const profile = makeProfile({ healthConditions: ["grain_sensitivity"] });
    saveProfile(profile);

    const loaded = loadProfile();
    expect(loaded).toEqual(profile);
  });

  test("loadProfile returns null when nothing saved", () => {
    const loaded = loadProfile();
    expect(loaded).toBeNull();
  });

  test("loadProfile returns null for corrupted data", () => {
    localStorage.setItem(STORAGE_KEY, "not-json");
    const loaded = loadProfile();
    expect(loaded).toBeNull();
  });

  test("clearProfile removes stored profile", () => {
    saveProfile(makeProfile());
    clearProfile();

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(loadProfile()).toBeNull();
  });

  test("saveProfile overwrites previous profile", () => {
    saveProfile(makeProfile({ breed: "Pug" }));
    saveProfile(makeProfile({ breed: "Boxer" }));

    const loaded = loadProfile();
    expect(loaded?.breed).toBe("Boxer");
  });
});
