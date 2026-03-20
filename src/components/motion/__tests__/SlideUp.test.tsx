/* eslint-disable react/display-name */
import { render, screen } from "@testing-library/react";
import { SlideUp } from "../SlideUp";

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
              "data-initial": JSON.stringify(initial),
              "data-animate": JSON.stringify(animate),
              "data-custom": JSON.stringify(custom),
              ...rest,
            },
            children
          )
      ),
    },
  };
});

describe("SlideUp", () => {
  it("renders children", () => {
    render(<SlideUp>Slide content</SlideUp>);
    expect(screen.getByText("Slide content")).toBeInTheDocument();
  });

  it("wraps children in a motion.div", () => {
    render(<SlideUp>Content</SlideUp>);
    expect(screen.getByTestId("motion-div")).toBeInTheDocument();
  });

  it("applies className when provided", () => {
    render(<SlideUp className="slide-class">Content</SlideUp>);
    expect(screen.getByTestId("motion-div")).toHaveClass("slide-class");
  });

  it("passes default offset of 24", () => {
    render(<SlideUp>Content</SlideUp>);
    const custom = JSON.parse(
      screen.getByTestId("motion-div").getAttribute("data-custom") ?? "{}"
    );
    expect(custom.offset).toBe(24);
  });

  it("accepts custom offset", () => {
    render(<SlideUp offset={48}>Content</SlideUp>);
    const custom = JSON.parse(
      screen.getByTestId("motion-div").getAttribute("data-custom") ?? "{}"
    );
    expect(custom.offset).toBe(48);
  });

  it("accepts custom duration and delay", () => {
    render(
      <SlideUp duration={1} delay={0.5}>
        Content
      </SlideUp>
    );
    const custom = JSON.parse(
      screen.getByTestId("motion-div").getAttribute("data-custom") ?? "{}"
    );
    expect(custom.duration).toBe(1);
    expect(custom.delay).toBe(0.5);
  });
});
