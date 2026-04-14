const bigrams = (s: string): Map<string, number> => {
  const map = new Map<string, number>();
  for (let i = 0; i < s.length - 1; i++) {
    const pair = s.substring(i, i + 2);
    map.set(pair, (map.get(pair) ?? 0) + 1);
  }
  return map;
};

export const dice = (a: string, b: string): number => {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;

  const bigramsA = bigrams(a);
  const bigramsB = bigrams(b);

  let intersection = 0;
  for (const [pair, countA] of bigramsA) {
    const countB = bigramsB.get(pair);
    if (countB !== undefined) {
      intersection += Math.min(countA, countB);
    }
  }

  return (2 * intersection) / (a.length - 1 + b.length - 1);
};

export const jaroWinkler = (a: string, b: string): number => {
  if (a === b) return 1;
  if (a.length === 0 || b.length === 0) return 0;

  const matchWindow = Math.max(Math.floor(Math.max(a.length, b.length) / 2) - 1, 0);
  const matchesA = new Array<boolean>(a.length).fill(false);
  const matchesB = new Array<boolean>(b.length).fill(false);

  let matches = 0;
  for (let i = 0; i < a.length; i++) {
    const lo = Math.max(0, i - matchWindow);
    const hi = Math.min(b.length - 1, i + matchWindow);
    for (let j = lo; j <= hi; j++) {
      if (!matchesB[j] && a[i] === b[j]) {
        matchesA[i] = true;
        matchesB[j] = true;
        matches++;
        break;
      }
    }
  }

  if (matches === 0) return 0;

  let transpositions = 0;
  let k = 0;
  for (let i = 0; i < a.length; i++) {
    if (!matchesA[i]) continue;
    while (!matchesB[k]) k++;
    if (a[i] !== b[k]) transpositions++;
    k++;
  }

  const jaro =
    (matches / a.length + matches / b.length + (matches - transpositions / 2) / matches) / 3;

  let prefixLen = 0;
  const maxPrefix = Math.min(4, Math.min(a.length, b.length));
  while (prefixLen < maxPrefix && a[prefixLen] === b[prefixLen]) {
    prefixLen++;
  }

  return jaro + prefixLen * 0.1 * (1 - jaro);
};

export const levenshtein = (a: string, b: string): number => {
  if (a === b) return 1;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      curr[j] =
        a[i - 1] === b[j - 1]
          ? prev[j - 1]
          : 1 + Math.min(prev[j - 1], prev[j], curr[j - 1]);
    }
    [prev, curr] = [curr, prev];
  }

  return 1 - prev[b.length] / maxLen;
};

export const cosine = (a: string, b: string): number => {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;

  const vecA = bigrams(a);
  const vecB = bigrams(b);

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (const [pair, count] of vecA) {
    magA += count * count;
    const countB = vecB.get(pair);
    if (countB !== undefined) {
      dot += count * countB;
    }
  }

  for (const count of vecB.values()) {
    magB += count * count;
  }

  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
};
