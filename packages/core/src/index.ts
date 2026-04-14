import { dice, jaroWinkler, levenshtein, cosine } from "./algorithms.js";

export type AlgorithmName = "dice" | "jaro-winkler" | "levenshtein" | "cosine";

export const algorithms = { dice, jaroWinkler, levenshtein, cosine } as const;

const resolveAlgorithm = (name: AlgorithmName = "dice"): ((a: string, b: string) => number) => {
  switch (name) {
    case "dice":
      return dice;
    case "jaro-winkler":
      return jaroWinkler;
    case "levenshtein":
      return levenshtein;
    case "cosine":
      return cosine;
  }
};

export const compareTwoStrings = (
  a: string,
  b: string,
  options?: { algorithm?: AlgorithmName },
): number => resolveAlgorithm(options?.algorithm)(a, b);

export const findBestMatch = (
  query: string,
  targets: string[],
  options?: { algorithm?: AlgorithmName },
): {
  bestMatch: { target: string; rating: number };
  bestMatchIndex: number;
  ratings: Array<{ target: string; rating: number }>;
} => {
  if (targets.length === 0) {
    throw new Error("targets must be a non-empty array");
  }

  const fn = resolveAlgorithm(options?.algorithm);
  const ratings = targets.map((target) => ({ target, rating: fn(query, target) }));

  let bestMatchIndex = 0;
  for (let i = 1; i < ratings.length; i++) {
    if (ratings[i].rating > ratings[bestMatchIndex].rating) {
      bestMatchIndex = i;
    }
  }

  return {
    bestMatch: ratings[bestMatchIndex],
    bestMatchIndex,
    ratings,
  };
};

export { dice, jaroWinkler, levenshtein, cosine };
