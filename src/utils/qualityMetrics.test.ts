import { expect, test, describe } from "bun:test";
import {
  getWordCount,
  getReadingTime,
  getFleschKincaidScore,
  getContrastRatio,
  passesWCAGAA,
} from "./qualityMetrics";

describe("qualityMetrics", () => {
  describe("getWordCount", () => {
    test("counts words correctly", () => {
      expect(getWordCount("Hello world")).toBe(2);
      expect(getWordCount("   Hello   world   ")).toBe(2);
      expect(getWordCount("")).toBe(0);
    });
  });

  describe("getReadingTime", () => {
    test("calculates reading time correctly", () => {
      // 225 words should be 1 minute
      const text225 = new Array(225).fill("word").join(" ");
      expect(getReadingTime(text225)).toBe(1);

      // 450 words should be 2 minutes
      const text450 = new Array(450).fill("word").join(" ");
      expect(getReadingTime(text450)).toBe(2);

      // 1 word should still be 1 minute (rounded up)
      expect(getReadingTime("word")).toBe(1);
    });
  });

  describe("getContrastRatio", () => {
    test("calculates contrast ratio correctly", () => {
      // Black and white should be 21
      expect(getContrastRatio("#000000", "#FFFFFF")).toBe(21);
      expect(getContrastRatio("#FFFFFF", "#000000")).toBe(21);

      // Same colors should be 1
      expect(getContrastRatio("#123456", "#123456")).toBe(1);
    });
  });

  describe("passesWCAGAA", () => {
    test("evaluates WCAG AA passing correctly", () => {
      expect(passesWCAGAA(4.5, false)).toBe(true);
      expect(passesWCAGAA(4.4, false)).toBe(false);
      expect(passesWCAGAA(3.0, true)).toBe(true);
      expect(passesWCAGAA(2.9, true)).toBe(false);
    });
  });
});
