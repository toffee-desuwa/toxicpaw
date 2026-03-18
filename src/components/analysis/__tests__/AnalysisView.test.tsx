import { render, screen, fireEvent } from "@testing-library/react";
import { AnalysisView } from "../AnalysisView";
import { IngredientList } from "../IngredientList";
import { SummaryBar } from "../SummaryBar";
import type { AnalysisResult, AnalyzedIngredient, AnalysisSummary, Grade } from "@/lib/analyzer/types";

function makeIngredient(
  overrides: Partial<AnalyzedIngredient> = {}
): AnalyzedIngredient {
  return {
    original: "Chicken",
    normalized: "chicken",
    position: 0,
    flag: "green",
    knownIngredient: null,
    matchInfo: null,
    explanation: "Quality protein source",
    ...overrides,
  };
}

function makeSummary(overrides: Partial<AnalysisSummary> = {}): AnalysisSummary {
  return {
    totalIngredients: 5,
    harmfulCount: 0,
    cautionCount: 1,
    safeCount: 3,
    unknownCount: 1,
    topIngredientIsProtein: true,
    concernPercentage: 0,
    ...overrides,
  };
}

function makeResult(overrides: Partial<AnalysisResult> = {}): AnalysisResult {
  return {
    grade: "B" as Grade,
    score: 82,
    ingredients: [
      makeIngredient({ original: "Chicken", flag: "green", position: 0 }),
      makeIngredient({ original: "Brown Rice", normalized: "brown rice", flag: "green", position: 1 }),
      makeIngredient({ original: "BHA", normalized: "bha", flag: "red", position: 2, explanation: "Potentially harmful preservative" }),
    ],
    summary: makeSummary({ safeCount: 2, harmfulCount: 1 }),
    verdict: "Good quality food with mostly safe ingredients.",
    ...overrides,
  };
}

describe("GradeBadge (via AnalysisView)", () => {
  it("renders the grade letter", () => {
    render(<AnalysisView result={makeResult({ grade: "A", score: 95 })} onScanAnother={jest.fn()} />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders the score", () => {
    render(<AnalysisView result={makeResult({ score: 82 })} onScanAnother={jest.fn()} />);
    expect(screen.getByText("Score: 82/100")).toBeInTheDocument();
  });

  it("has accessible grade label", () => {
    render(<AnalysisView result={makeResult({ grade: "B" })} onScanAnother={jest.fn()} />);
    expect(screen.getByRole("img", { name: /Grade B/i })).toBeInTheDocument();
  });
});

describe("SummaryBar", () => {
  it("renders all four stat counts", () => {
    render(<SummaryBar summary={makeSummary({ safeCount: 5, cautionCount: 2, harmfulCount: 1, unknownCount: 3 })} />);
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders labels", () => {
    render(<SummaryBar summary={makeSummary()} />);
    expect(screen.getByText("Safe")).toBeInTheDocument();
    expect(screen.getByText("Caution")).toBeInTheDocument();
    expect(screen.getByText("Harmful")).toBeInTheDocument();
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });
});

describe("IngredientList", () => {
  it("renders all ingredients", () => {
    const ingredients = [
      makeIngredient({ original: "Chicken", position: 0 }),
      makeIngredient({ original: "Rice", normalized: "rice", position: 1 }),
    ];
    render(<IngredientList ingredients={ingredients} />);
    expect(screen.getByText("Chicken")).toBeInTheDocument();
    expect(screen.getByText("Rice")).toBeInTheDocument();
  });

  it("shows position numbers", () => {
    render(<IngredientList ingredients={[makeIngredient({ position: 0 })]} />);
    expect(screen.getByText("#1")).toBeInTheDocument();
  });

  it("shows explanations", () => {
    render(
      <IngredientList
        ingredients={[makeIngredient({ explanation: "Quality protein source" })]}
      />
    );
    expect(screen.getByText("Quality protein source")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<IngredientList ingredients={[]} />);
    expect(screen.getByTestId("empty-list")).toBeInTheDocument();
  });

  it("shows ingredient count in header", () => {
    const ingredients = [
      makeIngredient({ original: "A", position: 0 }),
      makeIngredient({ original: "B", normalized: "b", position: 1 }),
      makeIngredient({ original: "C", normalized: "c", position: 2 }),
    ];
    render(<IngredientList ingredients={ingredients} />);
    expect(screen.getByText("Ingredients (3)")).toBeInTheDocument();
  });
});

describe("AnalysisView", () => {
  it("renders the verdict text", () => {
    render(<AnalysisView result={makeResult()} onScanAnother={jest.fn()} />);
    expect(screen.getByTestId("verdict")).toHaveTextContent(
      "Good quality food with mostly safe ingredients."
    );
  });

  it("renders Scan Another button", () => {
    render(<AnalysisView result={makeResult()} onScanAnother={jest.fn()} />);
    expect(screen.getByRole("button", { name: /scan another/i })).toBeInTheDocument();
  });

  it("calls onScanAnother when button is clicked", () => {
    const onScanAnother = jest.fn();
    render(<AnalysisView result={makeResult()} onScanAnother={onScanAnother} />);
    fireEvent.click(screen.getByRole("button", { name: /scan another/i }));
    expect(onScanAnother).toHaveBeenCalledTimes(1);
  });

  it("renders all ingredients with correct flags", () => {
    const result = makeResult();
    render(<AnalysisView result={result} onScanAnother={jest.fn()} />);
    expect(screen.getByText("Chicken")).toBeInTheDocument();
    expect(screen.getByText("Brown Rice")).toBeInTheDocument();
    expect(screen.getByText("BHA")).toBeInTheDocument();
  });

  it("renders different grades correctly", () => {
    const grades: Grade[] = ["A", "B", "C", "D", "F"];
    for (const grade of grades) {
      const { unmount } = render(
        <AnalysisView result={makeResult({ grade })} onScanAnother={jest.fn()} />
      );
      expect(screen.getByText(grade)).toBeInTheDocument();
      unmount();
    }
  });
});
