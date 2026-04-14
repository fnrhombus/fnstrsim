import { describe, it, expect } from "vitest";
import {
  dice,
  jaroWinkler,
  levenshtein,
  cosine,
  algorithms,
  compareTwoStrings,
  findBestMatch,
} from "fnstrsim";
import type { AlgorithmName } from "fnstrsim";

const approx = (value: number, expected: number, tolerance = 0.02) =>
  expect(value).toBeCloseTo(expected, 1);

describe("dice", () => {
  it("returns ~0.8 for healed/sealed", () => {
    approx(dice("healed", "sealed"), 0.8);
  });

  it("returns 1.0 for identical strings", () => {
    expect(dice("hello", "hello")).toBe(1);
  });

  it("returns 0.0 for completely different strings", () => {
    expect(dice("ab", "yz")).toBe(0);
  });

  it("returns 0 for single character strings", () => {
    expect(dice("a", "b")).toBe(0);
  });

  it("returns 1 for identical single characters", () => {
    expect(dice("a", "a")).toBe(1);
  });

  it("returns 0 for empty strings vs non-empty", () => {
    expect(dice("", "abc")).toBe(0);
  });

  it("returns 1 for both empty strings", () => {
    expect(dice("", "")).toBe(1);
  });

  it("handles unicode characters", () => {
    expect(dice("cafe\u0301", "cafe\u0301")).toBe(1);
  });

  it("returns value between 0 and 1", () => {
    const result = dice("night", "nacht");
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
  });
});

describe("jaroWinkler", () => {
  it("returns ~0.96 for martha/marhta", () => {
    approx(jaroWinkler("martha", "marhta"), 0.96);
  });

  it("returns ~0.81 for dixon/dicksonx", () => {
    approx(jaroWinkler("dixon", "dicksonx"), 0.81);
  });

  it("returns 1.0 for identical strings", () => {
    expect(jaroWinkler("hello", "hello")).toBe(1);
  });

  it("returns 0.0 for completely different strings", () => {
    expect(jaroWinkler("abc", "xyz")).toBe(0);
  });

  it("returns 0 when one string is empty", () => {
    expect(jaroWinkler("", "abc")).toBe(0);
    expect(jaroWinkler("abc", "")).toBe(0);
  });

  it("returns 1 for both empty strings", () => {
    expect(jaroWinkler("", "")).toBe(1);
  });

  it("boosts score for common prefixes", () => {
    const withPrefix = jaroWinkler("prefix_abc", "prefix_xyz");
    const withoutPrefix = jaroWinkler("abc_prefix", "xyz_prefix");
    expect(withPrefix).toBeGreaterThan(withoutPrefix);
  });

  it("returns value between 0 and 1", () => {
    const result = jaroWinkler("night", "nacht");
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
  });
});

describe("levenshtein", () => {
  it("returns ~0.57 for kitten/sitting (3 edits out of 7)", () => {
    approx(levenshtein("kitten", "sitting"), 0.57);
  });

  it("returns 1.0 for identical strings", () => {
    expect(levenshtein("hello", "hello")).toBe(1);
  });

  it("returns 0.0 for completely different strings of same length", () => {
    expect(levenshtein("abc", "xyz")).toBeCloseTo(0, 1);
  });

  it("returns 1 for both empty strings", () => {
    expect(levenshtein("", "")).toBe(1);
  });

  it("handles one empty string", () => {
    expect(levenshtein("", "abc")).toBe(0);
    expect(levenshtein("abc", "")).toBe(0);
  });

  it("handles single character strings", () => {
    expect(levenshtein("a", "a")).toBe(1);
    expect(levenshtein("a", "b")).toBe(0);
  });

  it("returns value between 0 and 1", () => {
    const result = levenshtein("night", "nacht");
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
  });

  it("handles strings with special characters", () => {
    approx(levenshtein("hello!", "hello?"), 0.83);
  });
});

describe("cosine", () => {
  it("returns 1.0 for identical strings", () => {
    expect(cosine("hello", "hello")).toBe(1);
  });

  it("returns 0.0 for completely different bigrams", () => {
    expect(cosine("ab", "cd")).toBe(0);
  });

  it("returns 0 for single character strings", () => {
    expect(cosine("a", "b")).toBe(0);
  });

  it("returns 1 for both empty strings", () => {
    expect(cosine("", "")).toBe(1);
  });

  it("returns value between 0 and 1", () => {
    const result = cosine("night", "nacht");
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
  });

  it("handles repeated bigrams", () => {
    const result = cosine("aaaa", "aabb");
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(1);
  });
});

describe("algorithms object", () => {
  it("exposes all four algorithms", () => {
    expect(typeof algorithms.dice).toBe("function");
    expect(typeof algorithms.jaroWinkler).toBe("function");
    expect(typeof algorithms.levenshtein).toBe("function");
    expect(typeof algorithms.cosine).toBe("function");
  });
});

describe("compareTwoStrings", () => {
  it("defaults to dice algorithm", () => {
    const result = compareTwoStrings("healed", "sealed");
    const diceResult = dice("healed", "sealed");
    expect(result).toBe(diceResult);
  });

  it("switches algorithm via options", () => {
    const names: AlgorithmName[] = ["dice", "jaro-winkler", "levenshtein", "cosine"];
    for (const name of names) {
      const result = compareTwoStrings("hello", "hallo", { algorithm: name });
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    }
  });

  it("jaro-winkler option uses jaroWinkler", () => {
    const result = compareTwoStrings("martha", "marhta", { algorithm: "jaro-winkler" });
    expect(result).toBe(jaroWinkler("martha", "marhta"));
  });
});

describe("findBestMatch", () => {
  it("finds the best match from targets", () => {
    const result = findBestMatch("healed", ["edward", "sealed", "theatre"]);
    expect(result.bestMatch.target).toBe("sealed");
    expect(result.bestMatchIndex).toBe(1);
  });

  it("returns all ratings", () => {
    const targets = ["a", "b", "c"];
    const result = findBestMatch("a", targets);
    expect(result.ratings).toHaveLength(3);
    expect(result.ratings.map((r) => r.target)).toEqual(targets);
  });

  it("throws on empty targets array", () => {
    expect(() => findBestMatch("query", [])).toThrow("targets must be a non-empty array");
  });

  it("works with algorithm option", () => {
    const result = findBestMatch("martha", ["marhta", "xyz"], {
      algorithm: "jaro-winkler",
    });
    expect(result.bestMatch.target).toBe("marhta");
    expect(result.bestMatchIndex).toBe(0);
  });

  it("bestMatchIndex is correct when best is not first", () => {
    const result = findBestMatch("hello", ["xyz", "abc", "hello"]);
    expect(result.bestMatchIndex).toBe(2);
    expect(result.bestMatch.rating).toBe(1);
  });
});

describe("edge cases across all algorithms", () => {
  const allAlgs = [dice, jaroWinkler, levenshtein, cosine] as const;

  it("all return 1 for identical non-trivial strings", () => {
    for (const alg of allAlgs) {
      expect(alg("testing", "testing")).toBe(1);
    }
  });

  it("all return values in [0, 1]", () => {
    const pairs: [string, string][] = [
      ["", ""],
      ["a", ""],
      ["", "a"],
      ["abc", "xyz"],
      ["hello world", "world hello"],
    ];
    for (const alg of allAlgs) {
      for (const [a, b] of pairs) {
        const r = alg(a, b);
        expect(r).toBeGreaterThanOrEqual(0);
        expect(r).toBeLessThanOrEqual(1);
      }
    }
  });

  it("handles strings with spaces and punctuation", () => {
    for (const alg of allAlgs) {
      const r = alg("hello, world!", "hello world");
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(1);
    }
  });
});

describe("tree-shaking", () => {
  it("each algorithm is independently importable", () => {
    expect(typeof dice).toBe("function");
    expect(typeof jaroWinkler).toBe("function");
    expect(typeof levenshtein).toBe("function");
    expect(typeof cosine).toBe("function");
  });
});
