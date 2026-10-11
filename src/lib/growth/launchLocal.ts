import "server-only";
import { readFile } from "node:fs/promises";
import type { PGlite } from "@electric-sql/pglite";
import { localMeasurementDatabase } from "../analytics/localReview";
export const LAUNCH_MIGRATION = "supabase/migrations/20261010132645_v4_launch_event.sql";
export const LAUNCH_SCHEDULE_MIGRATION = "supabase/migrations/20261010135755_v4_launch_event_schedule_fix.sql";
export const LAUNCH_UNLIMITED_MIGRATION = "supabase/migrations/20261011114539_v4_launch_event_unlimited.sql";
const root = globalThis as typeof globalThis & { __launchEventDb?: Promise<PGlite | null>; __launchScheduleDb?: Promise<PGlite | null>; __launchUnlimitedDb?: Promise<PGlite | null> };
export async function localLaunchEventDatabase() {
  if (process.env.NODE_ENV !== "development") return null;
  return root.__launchUnlimitedDb ??= (async () => {
    const scheduled = await (root.__launchScheduleDb ??= (async () => {
      const db = await (root.__launchEventDb ??= (async () => {
        const original = await localMeasurementDatabase();
        if (original) await original.exec(await readFile(LAUNCH_MIGRATION, "utf8"));
        return original;
      })());
      if (db) await db.exec(await readFile(LAUNCH_SCHEDULE_MIGRATION, "utf8"));
      return db;
    })());
    if (scheduled) await scheduled.exec(await readFile(LAUNCH_UNLIMITED_MIGRATION, "utf8"));
    return scheduled;
  })();
}
