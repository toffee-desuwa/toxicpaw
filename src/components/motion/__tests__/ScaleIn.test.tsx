/* eslint-disable react/display-name */
import { render, screen } from "@testing-library/react";
import { ScaleIn } from "../ScaleIn";

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

describe("ScaleIn", () => {
  it("renders children", () => {
    render(<ScaleIn>Scale content</ScaleIn>);
    expect(screen.getByText("Scale content")).toBeInTheDocument();
  });

  it("wraps children in a motion.div", () => {
    render(<ScaleIn>Content</ScaleIn>);
    expect(screen.getByTestId("motion-div")).toBeInTheDocument();
  });

  it("applies className when provided", () => {
    render(<ScaleIn className="scale-class">Content</ScaleIn>);
    expect(screen.getByTestId("motion-div")).toHaveClass("scale-class");
  });

  it("uses default initialScale of 0.8", () => {
    render(<ScaleIn>Content</ScaleIn>);
    const custom = JSON.parse(
      screen.getByTestId("motion-div").getAttribute("data-custom") ?? "{}"
    );
    expect(custom.initialScale).toBe(0.8);
  });

  it("accepts custom initialScale", () => {
    render(<ScaleIn initialScale={0.5}>Content</ScaleIn>);
    const custom = JSON.parse(
      screen.getByTestId("motion-div").getAttribute("data-custom") ?? "{}"
    );
    expect(custom.initialScale).toBe(0.5);
  });

  it("accepts custom duration and delay", () => {
    render(
      <ScaleIn duration={0.8} delay={0.2}>
        Content
      </ScaleIn>
    );
    const custom = JSON.parse(
      screen.getByTestId("motion-div").getAttribute("data-custom") ?? "{}"
    );
    expect(custom.duration).toBe(0.8);
    expect(custom.delay).toBe(0.2);
  });
});
