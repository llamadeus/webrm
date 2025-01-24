export interface FuzzyOptions {
  pre?: string;
  post?: string;
  extract?: (arg: any) => string;
  caseSensitive?: boolean;
}

export interface FuzzyMatchResult {
  rendered: string;
  score: number;
}

export interface FilterResult<T> {
  string: string;   // rendered string highlighting matches
  score: number;    // cumulative score of the fuzzy match
  index: number;    // original index in the array
  original: T;      // the original element from the array
}

export const fuzzy = {
  /**
   * Return all elements of `items` that have a fuzzy match against `pattern`.
   */
  simpleFilter(items: string[], pattern: string): string[] {
    return items.filter(value => fuzzy.test(value, pattern));
  },

  /**
   * Check if `pattern` fuzzy-matches `value`.
   */
  test(value: string, pattern: string): boolean {
    return fuzzy.match(value, pattern) !== null;
  },

  /**
   * If `pattern` matches `value`, wrap each matching character with
   * `opts.pre` and `opts.post`. If no match, return null.
   */
  match(
    value: string,
    pattern: string,
    opts: FuzzyOptions = {},
  ): FuzzyMatchResult | null {
    const { pre = "", post = "", caseSensitive = false } = opts;

    const result: string[] = [];
    let patternIdx = 0;
    let totalScore = 0;
    let currScore = 0;

    // Compare string can be lowercased if case-insensitive matching is desired.
    const compareString = caseSensitive ? value : value.toLowerCase();
    const normalizedPattern = caseSensitive ? pattern : pattern.toLowerCase();

    for (let idx = 0; idx < value.length; idx++) {
      const ch = value[idx];

      if (compareString[idx] === normalizedPattern[patternIdx]) {
        // character matches the next character in the pattern
        result.push(pre + ch + post);
        patternIdx += 1;

        // consecutive matches should increment score more than linearly
        currScore += 1 + currScore;
      }
      else {
        // reset consecutive match bonus
        result.push(ch);
        currScore = 0;
      }

      totalScore += currScore;
    }

    // return match data if we matched the entire pattern
    if (patternIdx === normalizedPattern.length) {
      // If the string is exactly the same as the pattern, maximize its score
      totalScore = compareString === normalizedPattern ? Infinity : totalScore;

      return {
        rendered: result.join(""),
        score: totalScore,
      };
    }

    return null;
  },

  /**
   * The main entry point. Filters `arr` for matches against `pattern`.
   *
   * Returns an array of objects of the form:
   * [
   *   {
   *     string:   '<b>fuz</b>zy',  // The rendered string
   *     score:    23,             // The fuzzy-match score
   *     index:    0,              // Original index in `arr`
   *     original: 'fuzzy'         // The original item in `arr`
   *   }
   * ]
   */
  filter<T>(items: T[], pattern: string, opts: FuzzyOptions = {}): FilterResult<T>[] {
    // Edge case
    if (items.length == 0) {
      return [];
    }

    // Reduce the array to all matched results
    const matchedResults: FilterResult<T>[] = items.reduce((acc, element, idx) => {
      // If `opts.extract` is provided, extract the string to compare.
      const value = opts.extract ? opts.extract(element) : (element as unknown as string);
      const matchResult = fuzzy.match(value, pattern, opts);

      if (matchResult) {
        acc.push({
          string: matchResult.rendered,
          score: matchResult.score,
          index: idx,
          original: element,
        });
      }

      return acc;
    }, [] as FilterResult<T>[]);

    // Sort by score (descending). Break ties by index (ascending).
    return matchedResults.toSorted((a, b) => {
      const compare = b.score - a.score;

      return compare !== 0 ? compare : a.index - b.index;
    });
  },
};
