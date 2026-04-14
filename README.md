# fnstrsim

[![npm version](https://img.shields.io/npm/v/fnstrsim)](https://www.npmjs.com/package/fnstrsim)
[![bundle size](https://img.shields.io/bundlephobia/minzip/fnstrsim)](https://bundlephobia.com/package/fnstrsim)
[![license](https://img.shields.io/npm/l/fnstrsim)](./LICENSE)

Multi-algorithm string similarity for TypeScript. Drop-in replacement for [`string-similarity`](https://www.npmjs.com/package/string-similarity) with Dice, Jaro-Winkler, Levenshtein, and cosine similarity.

## Why?

`string-similarity` has 2.1M weekly downloads but is abandoned (last publish 2018), has no TypeScript types, no ESM support, and only implements one algorithm. This package provides:

- **TypeScript-first** with full type definitions
- **ESM + CJS** dual publish
- **Four algorithms** (Dice, Jaro-Winkler, Levenshtein, Cosine) -- pick the best one for your use case
- **Zero dependencies**, <2KB minified+gzipped
- **Tree-shakeable** -- import only the algorithms you need
- **Drop-in compatible** API with `string-similarity`

## Install

```bash
npm install fnstrsim
# or
pnpm add fnstrsim
```

## Migration from `string-similarity`

The default API is compatible -- just change the import:

```diff
- const stringSimilarity = require('string-similarity');
+ import { compareTwoStrings, findBestMatch } from 'fnstrsim';

// These work exactly the same way:
compareTwoStrings('healed', 'sealed');        // 0.8
findBestMatch('healed', ['edward', 'sealed']); // { bestMatch: { target: 'sealed', ... }, ... }
```

The default algorithm is Dice's Coefficient, same as `string-similarity`.

## Quick Start

```typescript
import { compareTwoStrings, findBestMatch } from 'fnstrsim';

// Default comparison (Dice's Coefficient)
compareTwoStrings('healed', 'sealed'); // 0.8

// Use a different algorithm
compareTwoStrings('martha', 'marhta', { algorithm: 'jaro-winkler' }); // ~0.96

// Find best match in an array
const result = findBestMatch('healed', ['edward', 'sealed', 'theatre']);
// result.bestMatch = { target: 'sealed', rating: 0.8 }
// result.bestMatchIndex = 1
// result.ratings = [{ target: 'edward', rating: 0.2 }, ...]
```

## Individual Algorithms

Each algorithm is a named export for tree-shaking:

```typescript
import { dice, jaroWinkler, levenshtein, cosine } from 'fnstrsim';

dice('healed', 'sealed');           // 0.8
jaroWinkler('martha', 'marhta');    // ~0.96
levenshtein('kitten', 'sitting');   // ~0.57
cosine('hello world', 'world hello'); // high similarity
```

Or access them via the `algorithms` object:

```typescript
import { algorithms } from 'fnstrsim';

algorithms.dice('healed', 'sealed');
algorithms.jaroWinkler('martha', 'marhta');
```

## When to Use Which Algorithm

| Algorithm | Best For | Speed | Notes |
|-----------|----------|-------|-------|
| **Dice** (default) | General purpose | Fast | Good balance of speed and accuracy. Best for medium-length strings. |
| **Jaro-Winkler** | Short strings, names, typos | Fast | Boosts score for common prefixes. Ideal for person names, product codes. |
| **Levenshtein** | Edit distance, spell checking | Medium | Counts exact number of edits needed. Good when you care about character-level changes. |
| **Cosine** | Longer text, order-insensitive | Fast | Based on bigram frequency vectors. Good when word/character order matters less. |

## API Reference

### `compareTwoStrings(a, b, options?)`

Returns a number between 0 and 1, where 1 means identical.

```typescript
compareTwoStrings(a: string, b: string, options?: { algorithm?: AlgorithmName }): number
```

- `a`, `b` -- strings to compare
- `options.algorithm` -- one of `'dice'`, `'jaro-winkler'`, `'levenshtein'`, `'cosine'` (default: `'dice'`)

### `findBestMatch(query, targets, options?)`

Finds the best match for `query` among an array of `targets`.

```typescript
findBestMatch(query: string, targets: string[], options?: { algorithm?: AlgorithmName }): {
  bestMatch: { target: string; rating: number };
  bestMatchIndex: number;
  ratings: Array<{ target: string; rating: number }>;
}
```

- `query` -- the string to match against
- `targets` -- non-empty array of candidate strings
- `options.algorithm` -- same as `compareTwoStrings`

Throws if `targets` is empty.

### `dice(a, b)`

Sorensen-Dice coefficient using character bigrams. `(2 * common bigrams) / (total bigrams)`.

### `jaroWinkler(a, b)`

Jaro-Winkler similarity. Jaro similarity with a prefix bonus (up to 4 characters, scaling factor 0.1).

### `levenshtein(a, b)`

Normalized Levenshtein distance. `1 - (editDistance / max(len(a), len(b)))`.

### `cosine(a, b)`

Cosine similarity of character bigram frequency vectors.

### `AlgorithmName`

```typescript
type AlgorithmName = 'dice' | 'jaro-winkler' | 'levenshtein' | 'cosine';
```

## Comparison with Alternatives

| Feature | fnstrsim | string-similarity | string-similarity-js | cmpstr |
|---------|----------|-------------------|---------------------|--------|
| TypeScript | Native | No | No | Yes |
| ESM | Yes | No | No | Yes |
| Algorithms | 4 | 1 (Dice) | 1 (Dice) | 3 |
| Tree-shakeable | Yes | No | No | No |
| Zero deps | Yes | Yes | Yes | No |
| Bundle size | <2KB | 2.1KB | 1.5KB | 8KB+ |
| Maintained | Yes | Abandoned (2018) | Abandoned (2020) | Yes |
| Drop-in compatible | Yes | -- | Partial | No |

## License

[MIT](./LICENSE)
