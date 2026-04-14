# fnstrsim

**Four string similarity algorithms. One import. Two kilobytes.**

[![npm version](https://img.shields.io/npm/v/fnstrsim)](https://www.npmjs.com/package/fnstrsim)
[![bundle size](https://img.shields.io/bundlephobia/minzip/fnstrsim)](https://bundlephobia.com/package/fnstrsim)
[![license](https://img.shields.io/npm/l/fnstrsim)](./LICENSE)

```ts
import { compareTwoStrings, findBestMatch } from "fnstrsim";

compareTwoStrings("healed", "sealed");  // 0.8
findBestMatch("healed", ["edward", "sealed", "theatre"]);
// => { bestMatch: { target: "sealed", rating: 0.8 }, ... }
```

Drop-in replacement for [`string-similarity`](https://www.npmjs.com/package/string-similarity) — same API, but with TypeScript, ESM, and three more algorithms.

---

## The problem

`string-similarity` has 2.1M weekly downloads, hasn't been touched since 2018, ships no types, no ESM, and only implements one algorithm (Dice). You can't even pick the right tool for the job because there's only one tool.

**fnstrsim** gives you four — and lets your bundler tree-shake the ones you don't use.

## Migrating from `string-similarity`

Change the import. That's it.

```diff
- const stringSimilarity = require('string-similarity');
+ import { compareTwoStrings, findBestMatch } from 'fnstrsim';
```

The default algorithm is Dice's Coefficient, same as the original.

## Pick your algorithm

```ts
import { dice, jaroWinkler, levenshtein, cosine } from "fnstrsim";

dice("healed", "sealed");          // 0.8  — general purpose
jaroWinkler("martha", "marhta");   // 0.96 — names and typos
levenshtein("kitten", "sitting");  // 0.57 — edit distance
cosine("hello world", "world hello"); // order-insensitive
```

Or pass it as an option:

```ts
compareTwoStrings("martha", "marhta", { algorithm: "jaro-winkler" });
```

### When to use which

| Algorithm | Best for | Notes |
|-----------|----------|-------|
| **Dice** (default) | General purpose | Bigram overlap. Good balance for medium strings. |
| **Jaro-Winkler** | Short strings, names | Prefix bonus. Ideal for person names, product codes. |
| **Levenshtein** | Spell checking | Normalized edit distance. Character-level precision. |
| **Cosine** | Longer text | Bigram frequency vectors. Order doesn't matter much. |

Full API docs are on the [wiki](https://github.com/fnrhombus/fnstrsim/wiki).

## Comparison

| | fnstrsim | string-similarity | string-similarity-js | cmpstr |
|---|---|---|---|---|
| **Size** (min+gz) | **<2KB** | 2.1KB | 1.5KB | 8KB+ |
| Algorithms | 4 | 1 | 1 | 3 |
| TypeScript | native | no | no | yes |
| ESM + CJS | yes | no | no | yes |
| Tree-shakeable | yes | no | no | no |
| Drop-in compatible | yes | — | partial | no |
| Maintained | yes | abandoned | abandoned | yes |

## Install

```bash
npm install fnstrsim
pnpm add fnstrsim
```

Requires Node 20+. Works in all modern browsers.

## Support

- **[GitHub Sponsors](https://github.com/sponsors/fnrhombus)**
- **[Buy Me a Coffee](https://buymeacoffee.com/fnrhombus)**

## License

MIT © [fnrhombus](https://github.com/fnrhombus)
