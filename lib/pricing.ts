// Yearly price per unit, applied like tax brackets (docs/BRIEF.md, docs/BUILD_PLAN.md step 4):
// 50 SAR each for units 1–100, 40 for 101–300, 30 above 300. 150 units = 5,000 + 2,000 = 7,000 SAR.
// The homepage calculator (app/_home/home-script.js) uses the same brackets.
export const BRACKETS = [
  { upTo: 100, rate: 50 },
  { upTo: 300, rate: 40 },
  { upTo: Infinity, rate: 30 },
] as const;

// How many units fall in each bracket, and what they cost.
export function priceBreakdown(units: number) {
  let from = 0;
  return BRACKETS.map((b) => {
    const count = Math.max(0, Math.min(units, b.upTo) - from);
    from = b.upTo;
    return { rate: b.rate, units: count, total: count * b.rate };
  }).filter((row) => row.units > 0);
}

export function yearlyTotal(units: number) {
  return priceBreakdown(units).reduce((sum, row) => sum + row.total, 0);
}

export const MAX_UNITS = 100_000;
