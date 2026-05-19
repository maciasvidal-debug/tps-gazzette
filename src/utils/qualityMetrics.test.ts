import { expect, test, describe } from "bun:test";
import {
  getWordCount,
  getReadingTime,
  getContrastRatio,
  passesWCAGAA,
  getFleschKincaidScore,
  validateGazzette,
} from "./qualityMetrics";

import type { GazzetteState } from '../types/gazzette';

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

  describe("getFleschKincaidScore", () => {
    test("handles empty or whitespace input", () => {
      expect(getFleschKincaidScore("")).toBe(0);
      expect(getFleschKincaidScore("   ")).toBe(0);
    });

    test("calculates score for simple text (high score)", () => {
      // "The cat sat on the mat." is very easy
      expect(getFleschKincaidScore("The cat sat on the mat.")).toBe(100);
    });

    test("calculates score for complex text (low score)", () => {
      // Very complex words and long sentence should yield low score
      const complexText = "The comprehensive investigation revealed significant architectural vulnerabilities.";
      expect(getFleschKincaidScore(complexText)).toBe(0);
    });

    test("calculates intermediate scores correctly", () => {
      expect(getFleschKincaidScore("This is a sentence. This is another sentence.")).toBe(54.7);
      expect(getFleschKincaidScore("The quick brown fox jumps over the lazy dog.")).toBe(94.3);
    });

    test("clamps the score between 0 and 100", () => {
      // Extremely simple (should be > 100 if not clamped)
      expect(getFleschKincaidScore("The cat.")).toBe(100);

      // Extremely complex (should be < 0 if not clamped)
      const veryComplex = "Phenomenological epistemologies notwithstanding, institutionalized compartmentalization remains problematic.";
      expect(getFleschKincaidScore(veryComplex)).toBe(0);
    });
  });

  describe("validateGazzette", () => {
    test("advertorial validation impacts tone metrics", () => {
      const baseState: GazzetteState = {
        masthead: { title: "Simple Title", date: "", volume: "", tags: [] },
        featureStory: { kicker: "", headline: "Headline", author: "", paragraphs: ["Neutral text here."], pullQuote: "", pullQuotePosition: 0 },
        spotlight: { imageUrl: "", caption: "", grayscale: false },
        quote: { text: "", author: "" },
        staffBox: { editorInChief: "", contributors: [], artDirection: "", copyright: "" },
        secondaryArticle1: { kicker: "", headline: "", content: "" },
        secondaryArticle2: { kicker: "", headline: "", content: "" },
      };

      // Ensure no tone warnings on the base state
      const baseIssues = validateGazzette(baseState);
      const baseToneIssues = baseIssues.filter(i => i.field === 'tone');
      expect(baseToneIssues.length).toBe(0);

      // Add advertorial with very subjective words
      const stateWithAdvertorial: GazzetteState = {
        ...baseState,
        advertorial: {
          company: "Acme Corp",
          headline: "The absolute best unbelievable product! It is extremely amazing, wonderful, fantastic, and naturally the greatest!",
          content: "We clearly, undoubtedly, literally, absolutely have the most terrible, horrible, awful competitor! Luckily, surprisingly, fortunately, our clearly best unbelievable product is extremely amazing, wonderful, fantastic, and naturally the greatest!"
        }
      };

      const advIssues = validateGazzette(stateWithAdvertorial);
      const advToneIssues = advIssues.filter(i => i.field === 'tone');
      expect(advToneIssues.length).toBeGreaterThan(0);
      expect(advToneIssues[0].message).toContain('Objectivity score is low');
    });
  });
});
