import { render, screen, act } from "@testing-library/react";
import { CountUp } from "../CountUp";

const mockAnimate = jest.fn();

jest.mock("framer-motion", () => ({
  animate: (...args: unknown[]) => {
    mockAnimate(...args);
    // Simulate animation completing immediately
    const onUpdate = (args[2] as Record<string, unknown>)?.onUpdate as
      | ((v: number) => void)
      | undefined;
    if (onUpdate) {
      onUpdate(args[1] as number);
    }
    return { stop: jest.fn() };
  },
}));

beforeEach(() => {
  jest.useFakeTimers();
  mockAnimate.mockClear();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("CountUp", () => {
  it("renders initial value", () => {
    render(<CountUp to={100} />);
    // After immediate animation, should show target
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("renders as a span element", () => {
    const { container } = render(<CountUp to={50} />);
    act(() => {
      jest.runAllTimers();
    });
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("applies className when provided", () => {
    const { container } = render(
      <CountUp to={100} className="count-class" />
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(container.querySelector("span")).toHaveClass("count-class");
  });

  it("calls animate with from, to, and duration", () => {
    render(<CountUp from={0} to={100} duration={2} />);
    act(() => {
      jest.runAllTimers();
    });
    expect(mockAnimate).toHaveBeenCalledWith(
      0,
      100,
      expect.objectContaining({ duration: 2, ease: "easeOut" })
    );
  });

  it("uses custom formatter", () => {
    render(
      <CountUp
        to={100}
        formatter={(v) => `${v}%`}
      />
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("defaults from to 0", () => {
    render(<CountUp to={50} />);
    act(() => {
      jest.runAllTimers();
    });
    expect(mockAnimate).toHaveBeenCalledWith(0, 50, expect.any(Object));
  });

  it("respects delay before starting animation", () => {
    render(<CountUp to={100} delay={1} />);
    // Before delay
    expect(mockAnimate).not.toHaveBeenCalled();
    // After delay
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(mockAnimate).toHaveBeenCalled();
  });
});
