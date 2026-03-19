/**
 * Tests for PetProfileForm component (F008)
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PetProfileForm } from "../PetProfileForm";
import type { PetProfile } from "@/lib/profile/types";

describe("PetProfileForm", () => {
  const mockOnSave = jest.fn();
  const mockOnSkip = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders pet type selection", () => {
    render(<PetProfileForm onSave={mockOnSave} onSkip={mockOnSkip} />);

    expect(screen.getByText("Dog")).toBeInTheDocument();
    expect(screen.getByText("Cat")).toBeInTheDocument();
  });

  test("renders breed input", () => {
    render(<PetProfileForm onSave={mockOnSave} onSkip={mockOnSkip} />);

    expect(screen.getByLabelText(/breed/i)).toBeInTheDocument();
  });

  test("renders age range selection", () => {
    render(<PetProfileForm onSave={mockOnSave} onSkip={mockOnSkip} />);

    expect(screen.getByText(/puppy/i)).toBeInTheDocument();
    expect(screen.getByText(/adult/i)).toBeInTheDocument();
    expect(screen.getByText(/senior/i)).toBeInTheDocument();
  });

  test("renders weight input", () => {
    render(<PetProfileForm onSave={mockOnSave} onSkip={mockOnSkip} />);

    expect(screen.getByLabelText(/weight/i)).toBeInTheDocument();
  });

  test("renders health conditions checkboxes", () => {
    render(<PetProfileForm onSave={mockOnSave} onSkip={mockOnSkip} />);

    expect(screen.getByLabelText(/grain sensitivity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/chicken allergy/i)).toBeInTheDocument();
  });

  test("calls onSkip when skip button clicked", () => {
    render(<PetProfileForm onSave={mockOnSave} onSkip={mockOnSkip} />);

    fireEvent.click(screen.getByText(/skip/i));
    expect(mockOnSkip).toHaveBeenCalledTimes(1);
  });

  test("calls onSave with profile data when save button clicked", () => {
    render(<PetProfileForm onSave={mockOnSave} onSkip={mockOnSkip} />);

    // Select dog (default)
    fireEvent.click(screen.getByText("Dog"));

    // Enter breed
    fireEvent.change(screen.getByLabelText(/breed/i), {
      target: { value: "Labrador Retriever" },
    });

    // Select adult (default)
    fireEvent.click(screen.getByText(/adult/i));

    // Enter weight
    fireEvent.change(screen.getByLabelText(/weight/i), {
      target: { value: "25" },
    });

    // Click save
    fireEvent.click(screen.getByText(/save/i));

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    const savedProfile = mockOnSave.mock.calls[0][0] as PetProfile;
    expect(savedProfile.petType).toBe("dog");
    expect(savedProfile.breed).toBe("Labrador Retriever");
    expect(savedProfile.ageRange).toBe("adult");
    expect(savedProfile.weightKg).toBe(25);
  });

  test("toggles health conditions", () => {
    render(<PetProfileForm onSave={mockOnSave} onSkip={mockOnSkip} />);

    const grainCheckbox = screen.getByLabelText(/grain sensitivity/i);
    fireEvent.click(grainCheckbox);

    fireEvent.click(screen.getByText(/save/i));

    const savedProfile = mockOnSave.mock.calls[0][0] as PetProfile;
    expect(savedProfile.healthConditions).toContain("grain_sensitivity");
  });

  test("pre-fills form when initialProfile provided", () => {
    const initial: PetProfile = {
      petType: "cat",
      breed: "Persian",
      ageRange: "senior",
      weightKg: 5,
      healthConditions: ["kidney_disease"],
    };

    render(
      <PetProfileForm
        onSave={mockOnSave}
        onSkip={mockOnSkip}
        initialProfile={initial}
      />
    );

    expect(screen.getByLabelText(/breed/i)).toHaveValue("Persian");
    expect(screen.getByLabelText(/weight/i)).toHaveValue(5);
  });

  test("renders title text", () => {
    render(<PetProfileForm onSave={mockOnSave} onSkip={mockOnSkip} />);

    expect(screen.getByText(/pet profile/i)).toBeInTheDocument();
  });
});
