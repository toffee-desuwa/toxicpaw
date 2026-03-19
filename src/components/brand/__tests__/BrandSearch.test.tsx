/**
 * Tests for BrandSearch component (F015)
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrandSearch } from "../BrandSearch";

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

describe("BrandSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the search input", () => {
    render(<BrandSearch />);
    expect(screen.getByTestId("brand-search-input")).toBeInTheDocument();
  });

  it("renders placeholder text with bilingual hint", () => {
    render(<BrandSearch />);
    const input = screen.getByTestId("brand-search-input");
    expect(input).toHaveAttribute(
      "placeholder",
      expect.stringContaining("Search a brand")
    );
    expect(input).toHaveAttribute(
      "placeholder",
      expect.stringContaining("搜索品牌")
    );
  });

  it("shows brand count when no query", () => {
    render(<BrandSearch />);
    expect(screen.getByText(/brands in database/)).toBeInTheDocument();
  });

  it("does not show results when query is empty", () => {
    render(<BrandSearch />);
    expect(screen.queryByTestId("brand-search-results")).not.toBeInTheDocument();
  });

  it("shows results when user types a query", () => {
    render(<BrandSearch />);
    const input = screen.getByTestId("brand-search-input");
    fireEvent.change(input, { target: { value: "Orijen" } });
    expect(screen.getByTestId("brand-search-results")).toBeInTheDocument();
  });

  it("displays matching brands with grade badges", () => {
    render(<BrandSearch />);
    const input = screen.getByTestId("brand-search-input");
    fireEvent.change(input, { target: { value: "Orijen" } });
    // Orijen brands should appear with links
    const results = screen.getByTestId("brand-search-results");
    const links = results.querySelectorAll("a");
    expect(links.length).toBeGreaterThan(0);
    // Each link should point to a brand page
    links.forEach((link) => {
      expect(link.getAttribute("href")).toMatch(/^\/brand\//);
    });
  });

  it("searches by Chinese brand name", () => {
    render(<BrandSearch />);
    const input = screen.getByTestId("brand-search-input");
    fireEvent.change(input, { target: { value: "渴望" } });
    const results = screen.getByTestId("brand-search-results");
    const links = results.querySelectorAll("a");
    expect(links.length).toBeGreaterThan(0);
  });

  it("shows no results message for unmatched query", () => {
    render(<BrandSearch />);
    const input = screen.getByTestId("brand-search-input");
    fireEvent.change(input, { target: { value: "xyznonexistent999" } });
    expect(screen.getByText(/No brands found/)).toBeInTheDocument();
  });

  it("displays brand name and product in results", () => {
    render(<BrandSearch />);
    const input = screen.getByTestId("brand-search-input");
    fireEvent.change(input, { target: { value: "Royal Canin" } });
    const results = screen.getByTestId("brand-search-results");
    expect(results.textContent).toContain("Royal Canin");
  });

  it("shows pet type emoji in results", () => {
    render(<BrandSearch />);
    const input = screen.getByTestId("brand-search-input");
    fireEvent.change(input, { target: { value: "Orijen" } });
    const results = screen.getByTestId("brand-search-results");
    // Should show cat or dog emoji
    expect(results.textContent).toMatch(/🐱|🐶/);
  });

  it("renders scan own label link when no onScanOwn prop", () => {
    render(<BrandSearch />);
    const link = screen.getByText("or scan your own label");
    expect(link.tagName.toLowerCase()).toBe("a");
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders scan own label button when onScanOwn prop provided", () => {
    const onScanOwn = jest.fn();
    render(<BrandSearch onScanOwn={onScanOwn} />);
    const button = screen.getByText("or scan your own label");
    expect(button.tagName.toLowerCase()).toBe("button");
    fireEvent.click(button);
    expect(onScanOwn).toHaveBeenCalledTimes(1);
  });

  it("clears results when input is emptied", () => {
    render(<BrandSearch />);
    const input = screen.getByTestId("brand-search-input");
    fireEvent.change(input, { target: { value: "Orijen" } });
    expect(screen.getByTestId("brand-search-results")).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "" } });
    expect(screen.queryByTestId("brand-search-results")).not.toBeInTheDocument();
  });
});
