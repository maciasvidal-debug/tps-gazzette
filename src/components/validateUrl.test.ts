import { expect, test, describe } from "bun:test";
import { validateUrl } from "../utils/url";

describe("validateUrl", () => {
  test("allows safe https links", () => {
    expect(validateUrl("https://example.com")).toBe("https://example.com");
  });

  test("allows safe http links", () => {
    expect(validateUrl("http://example.com")).toBe("http://example.com");
  });

  test("allows mailto links", () => {
    expect(validateUrl("mailto:test@example.com")).toBe("mailto:test@example.com");
  });

  test("allows tel links", () => {
    expect(validateUrl("tel:+1234567890")).toBe("tel:+1234567890");
  });

  test("allows absolute paths", () => {
    expect(validateUrl("/path/to/resource")).toBe("/path/to/resource");
  });

  test("allows relative paths", () => {
    expect(validateUrl("./path/to/resource")).toBe("./path/to/resource");
  });

  test("blocks javascript: protocol", () => {
    expect(validateUrl("javascript:alert(1)")).toBe("#");
  });

  test("blocks data: protocol", () => {
    expect(validateUrl("data:text/html,<script>alert(1)</script>")).toBe("#");
  });

  test("blocks vbscript: protocol", () => {
    expect(validateUrl("vbscript:msgbox('hello')")).toBe("#");
  });

  test("trims whitespace", () => {
    expect(validateUrl("  https://example.com  ")).toBe("https://example.com");
  });

  test("blocks malformed URLs with protocols", () => {
    expect(validateUrl("not-a-url:something")).toBe("#");
  });

  test("allows strings that don't look like protocols", () => {
    expect(validateUrl("just-some-text")).toBe("just-some-text");
  });
});

describe("validateUrl xss", () => {
  test("blocks javascript: protocol with control characters", () => {
    expect(validateUrl("\x01javascript:alert(1)")).toBe("#");
    expect(validateUrl("javascript\x01:alert(1)")).toBe("#");
    expect(validateUrl("java\nscript:alert(1)")).toBe("#");
  });
});
