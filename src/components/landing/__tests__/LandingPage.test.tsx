/**
 * Tests for LandingPage component (F017 - Demo-first homepage redesign)
 *
 * Replaces the F011 marketing page with a demo-first homepage
 * that shows real brand data immediately — top 5 best/worst brands,
 * search bar, and scan CTA.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LandingPage } from "../LandingPage";

// Mock next/link
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe("LandingPage (F017 - Demo-first)", () => {
  const defaultProps = {
    onStartScan: jest.fn(),
    onViewHistory: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---- Hero / Branding ----
  it("renders the app name", () => {
    render(<LandingPage {...defaultProps} />);
    expect(screen.getByText("Paw")).toBeInTheDocument();
    expect(screen.getByText("Toxic")).toBeInTheDocument();
  });

  it("renders a concise tagline", () => {
    render(<LandingPage {...defaultProps} />);
    expect(
      screen.getByText(/search or scan to find out/i)
    ).toBeInTheDocument();
  });

  // ---- Search Bar ----
  it("renders a brand search input", () => {
    render(<LandingPage {...defaultProps} />);
    expect(screen.getByTestId("brand-search-input")).toBeInTheDocument();
  });

  it("search input has placeholder text", () => {
    render(<LandingPage {...defaultProps} />);
    const input = screen.getByTestId("brand-search-input");
    expect(input).toHaveAttribute("placeholder", expect.stringContaining("Search"));
  });

  it("shows search results when user types a query", () => {
    render(<LandingPage {...defaultProps} />);
    const input = screen.getByTestId("brand-search-input");
    fireEvent.change(input, { target: { value: "Orijen" } });
    expect(screen.getByTestId("brand-search-results")).toBeInTheDocument();
  });

  // ---- Top 5 Best Brands ----
  it("renders a top-rated brands section", () => {
    render(<LandingPage {...defaultProps} />);
    expect(screen.getByTestId("best-brands")).toBeInTheDocument();
  });

  it("shows exactly 5 best brands", () => {
    render(<LandingPage {...defaultProps} />);
    const section = screen.getByTestId("best-brands");
    const links = section.querySelectorAll("a[href^='/brand/']");
    expect(links.length).toBe(5);
  });

  it("best brands section has a heading", () => {
    render(<LandingPage {...defaultProps} />);
    expect(screen.getByText(/top rated/i)).toBeInTheDocument();
  });

  // ---- Top 5 Worst Brands ----
  it("renders a worst-rated brands section", () => {
    render(<LandingPage {...defaultProps} />);
    expect(screen.getByTestId("worst-brands")).toBeInTheDocument();
  });

  it("shows exactly 5 worst brands", () => {
    render(<LandingPage {...defaultProps} />);
    const section = screen.getByTestId("worst-brands");
    const links = section.querySelectorAll("a[href^='/brand/']");
    expect(links.length).toBe(5);
  });

  it("worst brands section has a heading", () => {
    render(<LandingPage {...defaultProps} />);
    expect(screen.getByText(/worst rated/i)).toBeInTheDocument();
  });

  // ---- Grade Badges in Brand Lists ----
  it("displays grade badges in brand lists", () => {
    render(<LandingPage {...defaultProps} />);
    const bestSection = screen.getByTestId("best-brands");
    const badges = bestSection.querySelectorAll("[data-testid='mini-grade-badge']");
    expect(badges.length).toBe(5);
  });

  // ---- Brand links point to /brand/[slug] ----
  it("brand links point to /brand/[slug] routes", () => {
    render(<LandingPage {...defaultProps} />);
    const bestSection = screen.getByTestId("best-brands");
    const links = bestSection.querySelectorAll("a[href^='/brand/']");
    links.forEach((link) => {
      expect(link.getAttribute("href")).toMatch(/^\/brand\/[\w-]+$/);
    });
  });

  // ---- Scan CTA ----
  it("renders primary scan CTA button", () => {
    render(<LandingPage {...defaultProps} />);
    const btn = screen.getByTestId("hero-scan-button");
    expect(btn).toBeInTheDocument();
  });

  it("fires onStartScan when scan button clicked", () => {
    render(<LandingPage {...defaultProps} />);
    fireEvent.click(screen.getByTestId("hero-scan-button"));
    expect(defaultProps.onStartScan).toHaveBeenCalledTimes(1);
  });

  // ---- View History ----
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

  // ---- Full Ranking Link ----
  it("renders a link to the full ranking page", () => {
    render(<LandingPage {...defaultProps} />);
    const link = screen.getByTestId("view-full-ranking");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/ranking");
  });

  // ---- Below-fold: Trust Signals ----
  it("renders trust signals section", () => {
    render(<LandingPage {...defaultProps} />);
    expect(screen.getByText("500+")).toBeInTheDocument();
    expect(screen.getByText("A-F")).toBeInTheDocument();
  });

  // ---- Footer ----
  it("renders footer with disclaimer", () => {
    render(<LandingPage {...defaultProps} />);
    expect(
      screen.getByText(/not a substitute for veterinary advice/i)
    ).toBeInTheDocument();
  });

  // ---- Accessibility ----
  it("has proper section headings", () => {
    render(<LandingPage {...defaultProps} />);
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThanOrEqual(3);
  });

  // ---- Bottom Scan CTA ----
  it("renders bottom scan CTA", () => {
    render(<LandingPage {...defaultProps} />);
    const btn = screen.getByTestId("bottom-scan-button");
    expect(btn).toBeInTheDocument();
  });

  it("fires onStartScan when bottom scan button clicked", () => {
    render(<LandingPage {...defaultProps} />);
    fireEvent.click(screen.getByTestId("bottom-scan-button"));
    expect(defaultProps.onStartScan).toHaveBeenCalledTimes(1);
  });
});
