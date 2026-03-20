/* eslint-disable react/display-name */
import { render, screen } from "@testing-library/react";
import { StaggerChildren, staggerItemVariants } from "../StaggerChildren";

jest.mock("framer-motion", () => {
  const React = require("react");
  return {
    motion: {
      div: React.forwardRef(
        (
          {
            children,
            initial,
            animate,
            custom,
            className,
            ...rest
          }: Record<string, unknown>,
          ref: React.Ref<HTMLDivElement>
        ) =>
          React.createElement(
            "div",
            {
              ref,
              className,
              "data-testid": "motion-div",
              "data-custom": JSON.stringify(custom),
              ...rest,
            },
            children
          )
      ),
    },
  };
});

describe("StaggerChildren", () => {
  it("renders children", () => {
    render(
      <StaggerChildren>
        <div>Item 1</div>
        <div>Item 2</div>
      </StaggerChildren>
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("wraps children in a motion.div container", () => {
    render(
      <StaggerChildren>
        <div>Item</div>
      </StaggerChildren>
    );
    expect(screen.getByTestId("motion-div")).toBeInTheDocument();
  });

  it("applies className when provided", () => {
    render(
      <StaggerChildren className="stagger-class">
        <div>Item</div>
      </StaggerChildren>
    );
    expect(screen.getByTestId("motion-div")).toHaveClass("stagger-class");
  });

  it("passes default staggerDelay of 0.1", () => {
    render(
      <StaggerChildren>
        <div>Item</div>
      </StaggerChildren>
    );
    const custom = JSON.parse(
      screen.getByTestId("motion-div").getAttribute("data-custom") ?? "{}"
    );
    expect(custom.staggerDelay).toBe(0.1);
  });

  it("accepts custom staggerDelay", () => {
    render(
      <StaggerChildren staggerDelay={0.2}>
        <div>Item</div>
      </StaggerChildren>
    );
    const custom = JSON.parse(
      screen.getByTestId("motion-div").getAttribute("data-custom") ?? "{}"
    );
    expect(custom.staggerDelay).toBe(0.2);
  });

  it("exports staggerItemVariants with hidden and visible states", () => {
    expect(staggerItemVariants).toBeDefined();
    expect(staggerItemVariants.hidden).toEqual({ opacity: 0, y: 16 });
    expect(staggerItemVariants.visible).toBeDefined();
  });
});
