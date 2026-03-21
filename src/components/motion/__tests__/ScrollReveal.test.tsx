/* eslint-disable react/display-name */
import { render, screen } from "@testing-library/react";
import { ScrollReveal } from "../ScrollReveal";

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
            whileInView,
            viewport,
            transition,
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
              "data-while-in-view": JSON.stringify(whileInView),
              ...rest,
            },
            children
          )
      ),
    },
  };
});

describe("ScrollReveal", () => {
  it("renders children", () => {
    render(<ScrollReveal>Hello World</ScrollReveal>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("wraps children in a motion.div", () => {
    render(<ScrollReveal>Content</ScrollReveal>);
    expect(screen.getByTestId("motion-div")).toBeInTheDocument();
  });

  it("applies className when provided", () => {
    render(<ScrollReveal className="custom-class">Content</ScrollReveal>);
    expect(screen.getByTestId("motion-div")).toHaveClass("custom-class");
  });

  it("sets initial state with opacity 0 and y offset", () => {
    render(<ScrollReveal>Content</ScrollReveal>);
    const div = screen.getByTestId("motion-div");
    const initial = JSON.parse(div.getAttribute("data-initial") ?? "{}");
    expect(initial.opacity).toBe(0);
    expect(initial.y).toBe(20);
  });

  it("sets whileInView state with full opacity and y 0", () => {
    render(<ScrollReveal>Content</ScrollReveal>);
    const div = screen.getByTestId("motion-div");
    const whileInView = JSON.parse(div.getAttribute("data-while-in-view") ?? "{}");
    expect(whileInView.opacity).toBe(1);
    expect(whileInView.y).toBe(0);
  });

  it("renders multiple children", () => {
    render(
      <ScrollReveal>
        <span>First</span>
        <span>Second</span>
      </ScrollReveal>
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});
