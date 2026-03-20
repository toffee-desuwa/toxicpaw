/* eslint-disable react/display-name */
import { render, screen } from "@testing-library/react";
import { PageTransition } from "../PageTransition";

jest.mock("framer-motion", () => {
  const React = require("react");
  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", { "data-testid": "animate-presence" }, children),
    motion: {
      div: React.forwardRef(
        (
          {
            children,
            initial,
            animate,
            exit,
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
              "data-testid": "page-transition",
              "data-initial": JSON.stringify(initial),
              "data-animate": JSON.stringify(animate),
              "data-exit": JSON.stringify(exit),
              ...rest,
            },
            children
          )
      ),
    },
  };
});

describe("PageTransition", () => {
  it("renders children", () => {
    render(
      <PageTransition transitionKey="page-1">
        <p>Page content</p>
      </PageTransition>
    );
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("wraps content in AnimatePresence", () => {
    render(
      <PageTransition transitionKey="page-1">
        Content
      </PageTransition>
    );
    expect(screen.getByTestId("animate-presence")).toBeInTheDocument();
  });

  it("wraps content in a motion.div", () => {
    render(
      <PageTransition transitionKey="page-1">
        Content
      </PageTransition>
    );
    expect(screen.getByTestId("page-transition")).toBeInTheDocument();
  });

  it("applies className when provided", () => {
    render(
      <PageTransition transitionKey="page-1" className="page-class">
        Content
      </PageTransition>
    );
    expect(screen.getByTestId("page-transition")).toHaveClass("page-class");
  });

  it("sets initial, animate, and exit states", () => {
    render(
      <PageTransition transitionKey="page-1">
        Content
      </PageTransition>
    );
    const div = screen.getByTestId("page-transition");
    const initial = JSON.parse(div.getAttribute("data-initial") ?? "{}");
    const animate = JSON.parse(div.getAttribute("data-animate") ?? "{}");
    const exit = JSON.parse(div.getAttribute("data-exit") ?? "{}");

    expect(initial).toEqual({ opacity: 0, y: 8 });
    expect(animate).toEqual({ opacity: 1, y: 0 });
    expect(exit).toEqual({ opacity: 0, y: -8 });
  });

  it("renders different content when key changes", () => {
    const { rerender } = render(
      <PageTransition transitionKey="page-1">
        <span>Page 1</span>
      </PageTransition>
    );
    expect(screen.getByText("Page 1")).toBeInTheDocument();

    rerender(
      <PageTransition transitionKey="page-2">
        <span>Page 2</span>
      </PageTransition>
    );
    expect(screen.getByText("Page 2")).toBeInTheDocument();
  });
});
