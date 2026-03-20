/* eslint-disable react/display-name */
import { render, screen } from "@testing-library/react";
import { FadeIn } from "../FadeIn";

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
            variants,
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
              "data-initial": JSON.stringify(initial),
              "data-animate": JSON.stringify(animate),
              ...rest,
            },
            children
          )
      ),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe("FadeIn", () => {
  it("renders children", () => {
    render(<FadeIn>Hello World</FadeIn>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("wraps children in a motion.div", () => {
    render(<FadeIn>Content</FadeIn>);
    expect(screen.getByTestId("motion-div")).toBeInTheDocument();
  });

  it("applies className when provided", () => {
    render(<FadeIn className="custom-class">Content</FadeIn>);
    expect(screen.getByTestId("motion-div")).toHaveClass("custom-class");
  });

  it("uses hidden initial state and visible animate state", () => {
    render(<FadeIn>Content</FadeIn>);
    const div = screen.getByTestId("motion-div");
    expect(div.getAttribute("data-initial")).toBe('"hidden"');
    expect(div.getAttribute("data-animate")).toBe('"visible"');
  });

  it("renders multiple children", () => {
    render(
      <FadeIn>
        <span>First</span>
        <span>Second</span>
      </FadeIn>
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});
