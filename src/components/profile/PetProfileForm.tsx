"use client";

import { useState } from "react";
import type {
  PetProfile,
  PetType,
  AgeRange,
  HealthCondition,
} from "@/lib/profile/types";
import { useTranslation } from "@/lib/i18n";

interface PetProfileFormProps {
  onSave: (profile: PetProfile) => void;
  onSkip: () => void;
  initialProfile?: PetProfile;
}

const HEALTH_CONDITION_VALUES: HealthCondition[] = [
  "grain_sensitivity",
  "chicken_allergy",
  "beef_allergy",
  "fish_allergy",
  "kidney_disease",
  "diabetes",
  "obesity",
  "digestive_issues",
];

const AGE_VALUES: AgeRange[] = ["puppy", "adult", "senior"];

export function PetProfileForm({ onSave, onSkip, initialProfile }: PetProfileFormProps) {
  const [petType, setPetType] = useState<PetType>(initialProfile?.petType ?? "dog");
  const [breed, setBreed] = useState(initialProfile?.breed ?? "");
  const [ageRange, setAgeRange] = useState<AgeRange>(initialProfile?.ageRange ?? "adult");
  const [weightKg, setWeightKg] = useState(initialProfile?.weightKg ?? 0);
  const [conditions, setConditions] = useState<HealthCondition[]>(
    initialProfile?.healthConditions ?? []
  );
  const { t } = useTranslation("profile");

  function handleToggleCondition(condition: HealthCondition) {
    setConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  }

  function handleSave() {
    onSave({
      petType,
      breed,
      ageRange,
      weightKg,
      healthConditions: conditions,
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      <h2 className="text-xl font-semibold text-neutral-200">{t("title")}</h2>
      <p className="text-sm text-neutral-400">
        {t("description")}
      </p>

      {/* Pet Type */}
      <div>
        <p className="mb-2 text-sm font-medium text-neutral-300">{t("petType")}</p>
        <div className="flex gap-3">
          {(["dog", "cat"] as PetType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setPetType(type)}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                petType === type
                  ? "bg-red-500 text-white"
                  : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
              }`}
            >
              {t(type)}
            </button>
          ))}
        </div>
      </div>

      {/* Breed */}
      <div>
        <label htmlFor="breed-input" className="mb-1 block text-sm font-medium text-neutral-300">
          {t("breed")}
        </label>
        <input
          id="breed-input"
          type="text"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          placeholder={petType === "dog" ? t("breedPlaceholderDog") : t("breedPlaceholderCat")}
          className="w-full rounded-lg bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Age Range */}
      <div>
        <p className="mb-2 text-sm font-medium text-neutral-300">{t("age")}</p>
        <div className="flex gap-2">
          {AGE_VALUES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setAgeRange(value)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                ageRange === value
                  ? "bg-red-500 text-white"
                  : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
              }`}
            >
              {t(value)}
            </button>
          ))}
        </div>
      </div>

      {/* Weight */}
      <div>
        <label htmlFor="weight-input" className="mb-1 block text-sm font-medium text-neutral-300">
          {t("weight")}
        </label>
        <input
          id="weight-input"
          type="number"
          value={weightKg || ""}
          onChange={(e) => setWeightKg(Number(e.target.value))}
          placeholder={t("weightPlaceholder")}
          min={0}
          max={200}
          className="w-full rounded-lg bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Health Conditions */}
      <div>
        <p className="mb-2 text-sm font-medium text-neutral-300">{t("healthConditions")}</p>
        <div className="flex flex-col gap-2">
          {HEALTH_CONDITION_VALUES.map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 text-sm text-neutral-300"
            >
              <input
                type="checkbox"
                checked={conditions.includes(value)}
                onChange={() => handleToggleCondition(value)}
                className="h-4 w-4 rounded border-neutral-600 bg-neutral-800 text-red-500 focus:ring-red-500"
              />
              {t(value)}
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onSkip}
          className="flex-1 rounded-full bg-neutral-700 px-6 py-3 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-600"
        >
          {t("skip")}
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-400 active:scale-95"
        >
          {t("saveProfile")}
        </button>
      </div>
    </div>
  );
}
