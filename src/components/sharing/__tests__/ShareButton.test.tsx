import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { ShareButton } from "../ShareButton";
import html2canvas from "html2canvas";
import type { AnalysisResult, AnalyzedIngredient, AnalysisSummary, Grade } from "@/lib/analyzer/types";

// Mock html2canvas
jest.mock("html2canvas", () => {
  return jest.fn().mockResolvedValue({
    toBlob: (cb: (blob: Blob | null) => void) => {
      cb(new Blob(["fake-image-data"], { type: "image/png" }));
    },
  });
});

function makeIngredient(overrides: Partial<AnalyzedIngredient> = {}): AnalyzedIngredient {
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
    score: 78,
    ingredients: [makeIngredient()],
    summary: makeSummary(),
    verdict: "Good quality food.",
    ...overrides,
  };
}

describe("ShareButton", () => {
  let mockCreateObjectURL: jest.Mock;
  let mockRevokeObjectURL: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    Object.defineProperty(navigator, "share", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, "canShare", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    mockCreateObjectURL = jest.fn().mockReturnValue("blob:mock-url");
    mockRevokeObjectURL = jest.fn();
    URL.createObjectURL = mockCreateObjectURL;
    URL.revokeObjectURL = mockRevokeObjectURL;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders share button", () => {
    render(<ShareButton result={makeResult()} />);
    expect(screen.getByTestId("share-button")).toBeInTheDocument();
    expect(screen.getByTestId("share-button")).toHaveTextContent("Share Result");
  });

  it("renders the hidden share card for capture", () => {
    render(<ShareButton result={makeResult()} />);
    expect(screen.getByTestId("share-card")).toBeInTheDocument();
  });

  it("shows generating text while sharing", () => {
    render(<ShareButton result={makeResult()} />);
    const button = screen.getByTestId("share-button");
    fireEvent.click(button);
    expect(button).toHaveTextContent("Generating...");
  });

  it("calls html2canvas when share is clicked", async () => {
    render(<ShareButton result={makeResult()} />);

    await act(async () => {
      fireEvent.click(screen.getByTestId("share-button"));
    });

    expect(html2canvas).toHaveBeenCalled();
  });

  it("falls back to download when Web Share API is unavailable", async () => {
    render(<ShareButton result={makeResult()} />);

    await act(async () => {
      fireEvent.click(screen.getByTestId("share-button"));
    });

    // Should create a blob URL for download
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  it("uses Web Share API when available", async () => {
    const mockShare = jest.fn().mockResolvedValue(undefined);
    const mockCanShare = jest.fn().mockReturnValue(true);
    Object.defineProperty(navigator, "share", {
      value: mockShare,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, "canShare", {
      value: mockCanShare,
      writable: true,
      configurable: true,
    });

    render(<ShareButton result={makeResult()} foodName="Royal Canin" />);

    await act(async () => {
      fireEvent.click(screen.getByTestId("share-button"));
    });

    expect(mockShare).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "ToxicPaw Pet Food Score",
        text: expect.stringContaining("Royal Canin"),
        files: expect.any(Array),
      }),
    );
  });

  it("shows Shared! text after successful share", async () => {
    render(<ShareButton result={makeResult()} />);

    await act(async () => {
      fireEvent.click(screen.getByTestId("share-button"));
    });

    expect(screen.getByTestId("share-button")).toHaveTextContent("Shared!");
  });

  it("resets Shared! text after timeout", async () => {
    render(<ShareButton result={makeResult()} />);

    await act(async () => {
      fireEvent.click(screen.getByTestId("share-button"));
    });

    expect(screen.getByTestId("share-button")).toHaveTextContent("Shared!");

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getByTestId("share-button")).toHaveTextContent("Share Result");
  });

  it("passes food name to share card", () => {
    render(<ShareButton result={makeResult()} foodName="Test Food" />);
    expect(screen.getByTestId("share-food-name")).toHaveTextContent("Test Food");
  });

  it("disables button while sharing", () => {
    render(<ShareButton result={makeResult()} />);
    const button = screen.getByTestId("share-button");
    fireEvent.click(button);
    expect(button).toBeDisabled();
  });
});
