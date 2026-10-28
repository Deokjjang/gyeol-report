import { seoulWallClockMs, sunLongitudeInstant } from "./oracle";

// Seeded solar-calendar birth times, 1930-2025. Composition (3,000):
//   2,000 uniform · 400 in UTC+8:30 (1954-03-21~1961-08-09) · 300 in summer time (Jun 1~Sep 7 of 1948-51,
//   1955-60, 1987-88) · 200 within ±15 min of a 節 · 100 at 22:30~01:29.
// The windows only steer sampling; offsets are always taken from tzdata.
export type RandomCase = { id: string; group: string; date: string; time: string };

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAY = 86_400_000;
const pad = (value: number) => String(value).padStart(2, "0");
const toCase = (id: string, group: string, wallMs: number): RandomCase => {
  const iso = new Date(wallMs).toISOString();
  return { id, group, date: iso.slice(0, 10), time: iso.slice(11, 16) };
};

export function randomCases(seed = 20261028): RandomCase[] {
  const random = mulberry32(seed);
  const int = (min: number, max: number) => min + Math.floor(random() * (max - min + 1));
  const dayIn = (from: string, to: string) => Date.parse(from) + int(0, Math.round((Date.parse(to) - Date.parse(from)) / DAY)) * DAY;
  const minute = () => int(0, 1439) * 60_000;
  const cases: RandomCase[] = [];
  const push = (group: string, wallMs: number) => cases.push(toCase(`R${pad(Math.floor(cases.length / 100))}${pad(cases.length % 100)}`, group, wallMs));
  for (let i = 0; i < 2000; i++) push("uniform", dayIn("1930-01-01", "2025-12-31") + minute());
  for (let i = 0; i < 400; i++) push("utc+8:30", dayIn("1954-03-21", "1961-08-09") + minute());
  const summerYears = [1948, 1949, 1950, 1951, 1955, 1956, 1957, 1958, 1959, 1960, 1987, 1988];
  for (let i = 0; i < 300; i++) {
    const year = summerYears[int(0, summerYears.length - 1)];
    push("summer-time", dayIn(`${year}-06-01`, `${year}-09-07`) + minute());
  }
  for (let i = 0; i < 200; i++) {
    const year = int(1930, 2025);
    const jie = sunLongitudeInstant(285 + 30 * int(0, 11), Date.UTC(year, 0, 1), 370);
    const instant = jie + int(-15, 15) * 60_000 + int(0, 59) * 1000;
    push("near-jie", Math.floor(seoulWallClockMs(instant) / 60_000) * 60_000);
  }
  for (let i = 0; i < 100; i++) push("near-midnight", dayIn("1930-01-01", "2025-12-30") + (22 * 60 + 30 + int(0, 179)) * 60_000);
  return cases;
}
