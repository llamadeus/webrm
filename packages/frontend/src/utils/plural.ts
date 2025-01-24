const PLURALS = {
  "category": "categories",
  "second": "seconds",
  "minute": "minutes",
  "item": "items",
} as const;

type Mode = "word" | "with-count";

export function pluralize(word: keyof typeof PLURALS, count: number, mode: Mode = "with-count"): string {
  const pluralized = count === 1 ? word : PLURALS[word];

  if (mode === "word") {
    return pluralized;
  }

  return `${count} ${pluralized}`;
}
