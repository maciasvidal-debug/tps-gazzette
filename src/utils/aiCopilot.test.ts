import { expect, test, describe } from "bun:test";
import { improveTone } from "./aiCopilot";

describe("improveTone", () => {
  test("should return empty string if input is empty", async () => {
    expect(await improveTone("", "professional")).toBe("");
    expect(await improveTone("", "casual")).toBe("");
  });

  describe("professional tone", () => {
    test("should add 'Furthermore, ' prefix and replace words", async () => {
      const input = "This is really good.";
      const result = await improveTone(input, "professional");
      expect(result).toBe("Furthermore, This is significantly optimal.");
    });

    test("should replace all occurrences of 'really' and 'good'", async () => {
      const input = "It is really really good and really good.";
      const result = await improveTone(input, "professional");
      expect(result).toBe("Furthermore, It is significantly significantly optimal and significantly optimal.");
    });

    test("should only add prefix if target words are not present", async () => {
      const input = "The project is on track.";
      const result = await improveTone(input, "professional");
      expect(result).toBe("Furthermore, The project is on track.");
    });

    test("should be case sensitive for replacements", async () => {
      const input = "REALLY GOOD";
      const result = await improveTone(input, "professional");
      expect(result).toBe("Furthermore, REALLY GOOD");
    });
  });

  describe("casual tone", () => {
    test("should add 'Hey team, ' prefix and replace words", async () => {
      const input = "Furthermore, the results are optimal.";
      const result = await improveTone(input, "casual");
      expect(result).toBe("Hey team, Also, the results are great.");
    });

    test("should replace all occurrences of 'Furthermore' and 'optimal'", async () => {
      const input = "Furthermore, it is optimal. Furthermore, optimal.";
      const result = await improveTone(input, "casual");
      expect(result).toBe("Hey team, Also, it is great. Also, great.");
    });

    test("should only add prefix if target words are not present", async () => {
      const input = "Let's grab a coffee.";
      const result = await improveTone(input, "casual");
      expect(result).toBe("Hey team, Let's grab a coffee.");
    });

    test("should be case sensitive for replacements", async () => {
      const input = "FURTHERMORE OPTIMAL";
      const result = await improveTone(input, "casual");
      expect(result).toBe("Hey team, FURTHERMORE OPTIMAL");
    });
  });
});
