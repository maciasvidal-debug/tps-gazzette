import { mock, test, expect } from "bun:test";

mock.module("react", () => {
  return {
    default: {
      createElement: (type: unknown, props: unknown, ...children: unknown[]) => ({ type, props, children }),
    },
  };
});

mock.module("react/jsx-dev-runtime", () => {
  return {
    jsxDEV: (type: unknown, props: unknown, ...children: unknown[]) => ({ type, props, children }),
  };
});

import React from "react";

test("mock module works", () => {
  // @ts-expect-error - mock types don't exactly match React types
  const el = React.createElement("div", { className: "foo" });
  expect(el.type).toBe("div");
  expect(el.props.className).toBe("foo");
});
