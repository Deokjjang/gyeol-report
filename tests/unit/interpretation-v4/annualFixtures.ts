import { MAJOR_NARRATIVE_FIXTURES } from "./majorFixtures";
export const ANNUAL_CLOCK = { currentDate: "2026-10-01T12:00:00+09:00" };
const years = [2026, 2026, 2028, 2027, 2025, 2026];
export const ANNUAL_NARRATIVE_FIXTURES = MAJOR_NARRATIVE_FIXTURES.map((f, i) => ({ id: f.id,
  clock: { ...ANNUAL_CLOCK, ...(years[i] > 2026 ? { policyDate: `${years[i]}-10-01T12:00:00+09:00` } : {}) },
  payload: { ...f.payload, productKey: "annual_fortune", productSlug: "annual-fortune", productOptions: { contentVersion: "v3", selectedYear: String(years[i]) } },
}));
