import { expect, test, describe } from "bun:test";
import { Vignette } from "./Vignette";

// A minimal representation of what React.FC returns when called as a function
interface MockElement {
  type: string;
  props: {
    className?: string;
    viewBox?: string;
    [key: string]: unknown;
  };
}

describe("Vignette Component", () => {
  test("renders classic style by default", () => {
    // We call the component as a function to test its logic.
    // In a real React environment, this would return a React Element.
    // Given the environment constraints, we use this to verify the returned structure.
    const result = Vignette({}) as unknown as MockElement;

    expect(result.type).toBe("svg");
    expect(result.props.viewBox).toBe("0 0 100 20");
    expect(result.props.className).toContain("w-24 h-6 text-tps-primary");
  });

  test("renders science style", () => {
    const result = Vignette({ style: 'science' }) as unknown as MockElement;
    expect(result.type).toBe("svg");
    expect(result.props.viewBox).toBe("0 0 100 40");
  });

  test("renders writing style", () => {
    const result = Vignette({ style: 'writing' }) as unknown as MockElement;
    expect(result.type).toBe("svg");
    expect(result.props.viewBox).toBe("0 0 100 40");
  });

  test("renders medical style", () => {
    const result = Vignette({ style: 'medical' }) as unknown as MockElement;
    expect(result.type).toBe("svg");
    expect(result.props.viewBox).toBe("0 0 100 40");
  });

  test("applies custom className", () => {
    const customClass = "custom-vignette-class";
    const result = Vignette({ className: customClass }) as unknown as MockElement;
    expect(result.props.className).toBe(customClass);
  });
});
