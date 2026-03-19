"use client";

import { useState } from "react";
import type {
  PetProfile,
  PetType,
  AgeRange,
  HealthCondition,
} from "@/lib/profile/types";

interface PetProfileFormProps {
  onSave: (profile: PetProfile) => void;
  onSkip: () => void;
  initialProfile?: PetProfile;
}

const HEALTH_CONDITIONS: { value: HealthCondition; label: string }[] = [
  { value: "grain_sensitivity", label: "Grain Sensitivity" },
  { value: "chicken_allergy", label: "Chicken Allergy" },
  { value: "beef_allergy", label: "Beef Allergy" },
  { value: "fish_allergy", label: "Fish Allergy" },
  { value: "kidney_disease", label: "Kidney Disease" },
  { value: "diabetes", label: "Diabetes" },
  { value: "obesity", label: "Obesity" },
  { value: "digestive_issues", label: "Digestive Issues" },
];

const AGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: "puppy", label: "Puppy/Kitten" },
  { value: "adult", label: "Adult" },
  { value: "senior", label: "Senior" },
];

export function PetProfileForm({ onSave, onSkip, initialProfile }: PetProfileFormProps) {
  const [petType, setPetType] = useState<PetType>(initialProfile?.petType ?? "dog");
  const [breed, setBreed] = useState(initialProfile?.breed ?? "");
  const [ageRange, setAgeRange] = useState<AgeRange>(initialProfile?.ageRange ?? "adult");
  const [weightKg, setWeightKg] = useState(initialProfile?.weightKg ?? 0);
  const [conditions, setConditions] = useState<HealthCondition[]>(
    initialProfile?.healthConditions ?? []
  );

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
      <h2 className="text-xl font-semibold text-neutral-200">Pet Profile</h2>
      <p className="text-sm text-neutral-400">
        Personalize your analysis based on your pet&apos;s needs.
      </p>

      {/* Pet Type */}
      <div>
        <p className="mb-2 text-sm font-medium text-neutral-300">Pet Type</p>
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
              {type === "dog" ? "Dog" : "Cat"}
            </button>
          ))}
        </div>
      </div>

      {/* Breed */}
      <div>
        <label htmlFor="breed-input" className="mb-1 block text-sm font-medium text-neutral-300">
          Breed (optional)
        </label>
        <input
          id="breed-input"
          type="text"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          placeholder={petType === "dog" ? "e.g., Labrador Retriever" : "e.g., Persian"}
          className="w-full rounded-lg bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Age Range */}
      <div>
        <p className="mb-2 text-sm font-medium text-neutral-300">Age</p>
        <div className="flex gap-2">
          {AGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setAgeRange(opt.value)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                ageRange === opt.value
                  ? "bg-red-500 text-white"
                  : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Weight */}
      <div>
        <label htmlFor="weight-input" className="mb-1 block text-sm font-medium text-neutral-300">
          Weight (kg)
        </label>
        <input
          id="weight-input"
          type="number"
          value={weightKg || ""}
          onChange={(e) => setWeightKg(Number(e.target.value))}
          placeholder="e.g., 15"
          min={0}
          max={200}
          className="w-full rounded-lg bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Health Conditions */}
      <div>
        <p className="mb-2 text-sm font-medium text-neutral-300">Health Conditions</p>
        <div className="flex flex-col gap-2">
          {HEALTH_CONDITIONS.map((cond) => (
            <label
              key={cond.value}
              className="flex items-center gap-2 text-sm text-neutral-300"
            >
              <input
                type="checkbox"
                checked={conditions.includes(cond.value)}
                onChange={() => handleToggleCondition(cond.value)}
                className="h-4 w-4 rounded border-neutral-600 bg-neutral-800 text-red-500 focus:ring-red-500"
              />
              {cond.label}
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
          Skip
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-400 active:scale-95"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}
