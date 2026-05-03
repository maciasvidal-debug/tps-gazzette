import { mock, test, expect } from "bun:test";

mock.module("react", () => {
  return {
    default: {
      createElement: (type, props, ...children) => ({ type, props, children }),
    },
  };
});

import React from "react";

test("mock module works", () => {
  // @ts-ignore
  const el = React.createElement("div", { className: "foo" });
  expect(el.type).toBe("div");
  expect(el.props.className).toBe("foo");
});
