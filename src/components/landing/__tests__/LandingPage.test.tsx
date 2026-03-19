/**
 * Tests for LandingPage component (F011)
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LandingPage } from "../LandingPage";

describe("LandingPage", () => {
  const defaultProps = {
    onStartScan: jest.fn(),
    onViewHistory: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Hero section
  it("renders the app name", () => {
    render(<LandingPage {...defaultProps} />);
    expect(screen.getByText("Paw")).toBeInTheDocument();
    expect(screen.getByText("Toxic")).toBeInTheDocument();
  });

  it("renders the hero tagline", () => {
    render(<LandingPage {...defaultProps} />);
    expect(
      screen.getByText(/scan the ingredient label/i)
    ).toBeInTheDocument();
  });

  it("renders hero scan button", () => {
    render(<LandingPage {...defaultProps} />);
    const btn = screen.getByTestId("hero-scan-button");
    expect(btn).toHaveTextContent("Scan Label Now");
  });

  it("fires onStartScan when hero scan button clicked", () => {
    render(<LandingPage {...defaultProps} />);
    fireEvent.click(screen.getByTestId("hero-scan-button"));
    expect(defaultProps.onStartScan).toHaveBeenCalledTimes(1);
  });

  it("renders history button", () => {
    render(<LandingPage {...defaultProps} />);
    const btn = screen.getByTestId("history-button");
    expect(btn).toHaveTextContent("View Scan History");
  });

  it("fires onViewHistory when history button clicked", () => {
    render(<LandingPage {...defaultProps} />);
    fireEvent.click(screen.getByTestId("history-button"));
    expect(defaultProps.onViewHistory).toHaveBeenCalledTimes(1);
  });

  // How It Works section
  it("renders How It Works section", () => {
    render(<LandingPage {...defaultProps} />);
    expect(screen.getByText("How It Works")).toBeInTheDocument();
  });

  it("renders all three steps", () => {
    render(<LandingPage {...defaultProps} />);
    expect(screen.getByText("Scan")).toBeInTheDocument();
    expect(screen.getByText("Analyze")).toBeInTheDocument();
    expect(screen.getByText("Know")).toBeInTheDocument();
  });

  // Features section
  it("renders Why ToxicPaw section", () => {
    render(<LandingPage {...defaultProps} />);
    expect(screen.getByText("Why ToxicPaw?")).toBeInTheDocument();
  });

  it("renders all four feature cards", () => {
    render(<LandingPage {...defaultProps} />);
    expect(screen.getByText("Snap a Photo")).toBeInTheDocument();
    expect(screen.getByText("AI Analysis")).toBeInTheDocument();
    expect(screen.getByText("Safety Grade")).toBeInTheDocument();
    expect(screen.getByText("Personalized")).toBeInTheDocument();
  });

  it("renders feature descriptions", () => {
    render(<LandingPage {...defaultProps} />);
    expect(screen.getByText(/500\+ ingredients rated/i)).toBeInTheDocument();
    expect(screen.getByText(/clear A-F grade/i)).toBeInTheDocument();
  });

  // Trust Signals section
  it("renders trust signals section", () => {
    render(<LandingPage {...defaultProps} />);
    expect(screen.getByText("Built for Pet Parents")).toBeInTheDocument();
  });

  it("renders all trust signal stats", () => {
    render(<LandingPage {...defaultProps} />);
    expect(screen.getByText("500+")).toBeInTheDocument();
    expect(screen.getByText("A-F")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  // Bottom CTA
  it("renders bottom CTA section", () => {
    render(<LandingPage {...defaultProps} />);
    expect(screen.getByText("Ready to Scan?")).toBeInTheDocument();
  });

  it("fires onStartScan when bottom scan button clicked", () => {
    render(<LandingPage {...defaultProps} />);
    fireEvent.click(screen.getByTestId("bottom-scan-button"));
    expect(defaultProps.onStartScan).toHaveBeenCalledTimes(1);
  });

  // Footer
  it("renders footer with disclaimer", () => {
    render(<LandingPage {...defaultProps} />);
    expect(
      screen.getByText(/not a substitute for veterinary advice/i)
    ).toBeInTheDocument();
  });

  // Accessibility
  it("has proper section headings", () => {
    render(<LandingPage {...defaultProps} />);
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThanOrEqual(4);
  });

  it("has accessible landmark labels", () => {
    render(<LandingPage {...defaultProps} />);
    expect(
      screen.getByLabelText("How It Works")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Why ToxicPaw?")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Built for Pet Parents")
    ).toBeInTheDocument();
  });
});
