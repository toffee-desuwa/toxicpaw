/**
 * F032 - AnimatedGradeBadge tests
 *
 * Tests the animated grade badge: 3D flip reveal, scale bounce,
 * CountUp score, faded label, and glow pulse.
 */

import { render, screen, act } from "@testing-library/react";
import { AnimatedGradeBadge } from "../AnimatedGradeBadge";
import type { Grade } from "@/lib/analyzer/types";

// Mock framer-motion: motion.div renders as plain div with animation data attributes
jest.mock("framer-motion", () => {
  const R = require("react");
  return {
    motion: {
      div: R.forwardRef(
        (
          {
            children,
            initial,
            animate: animateProp,
            transition,
            className,
            style,
            ...rest
          }: Record<string, unknown>,
          ref: unknown
        ) =>
          R.createElement(
            "div",
            {
              ref,
              className,
              style,
              "data-testid": rest["data-testid"] || "motion-div",
              "data-initial": JSON.stringify(initial),
              "data-animate": JSON.stringify(animateProp),
              "data-transition": JSON.stringify(transition),
              role: rest.role,
              "aria-label": rest["aria-label"],
            },
            children
          )
      ),
    },
    animate: (...args: unknown[]) => {
      // Simulate CountUp animation completing immediately
      const onUpdate = (args[2] as Record<string, unknown>)?.onUpdate as
        | ((v: number) => void)
        | undefined;
      if (onUpdate) {
        onUpdate(args[1] as number);
      }
      return { stop: jest.fn() };
    },
  };
});

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("AnimatedGradeBadge", () => {
  it("renders the grade letter", () => {
    render(<AnimatedGradeBadge grade="A" score={95} />);
    act(() => { jest.runAllTimers(); });
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders the animated score via CountUp", () => {
    render(<AnimatedGradeBadge grade="B" score={82} />);
    act(() => { jest.runAllTimers(); });
    expect(screen.getByText("82")).toBeInTheDocument();
    expect(screen.getByText("/ 100")).toBeInTheDocument();
  });

  it("renders the grade label", () => {
    render(<AnimatedGradeBadge grade="A" score={95} />);
    act(() => { jest.runAllTimers(); });
    expect(screen.getByText("Excellent")).toBeInTheDocument();
  });

  it("has accessible grade label on badge", () => {
    render(<AnimatedGradeBadge grade="B" score={82} />);
    act(() => { jest.runAllTimers(); });
    expect(
      screen.getByRole("img", { name: /Grade B/i })
    ).toBeInTheDocument();
  });

  it("renders the animated badge container", () => {
    render(<AnimatedGradeBadge grade="C" score={65} />);
    act(() => { jest.runAllTimers(); });
    expect(screen.getByTestId("animated-grade-badge")).toBeInTheDocument();
  });

  it("renders the animated label container", () => {
    render(<AnimatedGradeBadge grade="D" score={45} />);
    act(() => { jest.runAllTimers(); });
    expect(screen.getByTestId("animated-grade-label")).toBeInTheDocument();
  });

  it("applies 3D flip initial state (rotateY 180, scale 0.5, opacity 0)", () => {
    render(<AnimatedGradeBadge grade="A" score={95} />);
    act(() => { jest.runAllTimers(); });
    const badge = screen.getByTestId("animated-grade-badge");
    const initial = JSON.parse(badge.getAttribute("data-initial") ?? "{}");
    expect(initial.rotateY).toBe(180);
    expect(initial.scale).toBe(0.5);
    expect(initial.opacity).toBe(0);
  });

  it("animates to final state (rotateY 0, scale 1, opacity 1)", () => {
    render(<AnimatedGradeBadge grade="A" score={95} />);
    act(() => { jest.runAllTimers(); });
    const badge = screen.getByTestId("animated-grade-badge");
    const animateState = JSON.parse(badge.getAttribute("data-animate") ?? "{}");
    expect(animateState.rotateY).toBe(0);
    expect(animateState.scale).toBe(1);
    expect(animateState.opacity).toBe(1);
  });

  it("uses bounce easing for the badge transition", () => {
    render(<AnimatedGradeBadge grade="A" score={95} />);
    act(() => { jest.runAllTimers(); });
    const badge = screen.getByTestId("animated-grade-badge");
    const transition = JSON.parse(badge.getAttribute("data-transition") ?? "{}");
    expect(transition.duration).toBe(0.7);
    expect(transition.ease).toEqual([0.34, 1.56, 0.64, 1]);
  });

  it("label fades in with delay after badge reveal", () => {
    render(<AnimatedGradeBadge grade="B" score={82} />);
    act(() => { jest.runAllTimers(); });
    const label = screen.getByTestId("animated-grade-label");
    const initial = JSON.parse(label.getAttribute("data-initial") ?? "{}");
    const transition = JSON.parse(label.getAttribute("data-transition") ?? "{}");
    expect(initial.opacity).toBe(0);
    expect(transition.delay).toBe(0.5);
  });

  it("applies glow-pulse animation via inline style", () => {
    render(<AnimatedGradeBadge grade="A" score={95} />);
    act(() => { jest.runAllTimers(); });
    const badge = screen.getByTestId("animated-grade-badge");
    const style = badge.getAttribute("style");
    expect(style).toContain("glow-pulse");
  });

  it("sets glow color CSS variable per grade", () => {
    render(<AnimatedGradeBadge grade="F" score={20} />);
    act(() => { jest.runAllTimers(); });
    const badge = screen.getByTestId("animated-grade-badge");
    const style = badge.getAttribute("style");
    // F grade uses red glow
    expect(style).toContain("220, 38, 38");
  });

  it("renders all grades correctly", () => {
    const grades: Grade[] = ["A", "B", "C", "D", "F"];
    for (const grade of grades) {
      const { unmount } = render(<AnimatedGradeBadge grade={grade} score={50} />);
      act(() => { jest.runAllTimers(); });
      expect(screen.getByText(grade)).toBeInTheDocument();
      unmount();
    }
  });

  it("renders with correct grade colors in className", () => {
    render(<AnimatedGradeBadge grade="A" score={95} />);
    act(() => { jest.runAllTimers(); });
    const badge = screen.getByTestId("animated-grade-badge");
    expect(badge.className).toContain("bg-emerald-500");
    expect(badge.className).toContain("ring-emerald-400/30");
  });
});
