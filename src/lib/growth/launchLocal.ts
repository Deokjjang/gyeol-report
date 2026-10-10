import "server-only";
import { readFile } from "node:fs/promises";
import type { PGlite } from "@electric-sql/pglite";
import { localMeasurementDatabase } from "../analytics/localReview";
export const LAUNCH_MIGRATION = "supabase/migrations/20261010132645_v4_launch_event.sql";
export const LAUNCH_SCHEDULE_MIGRATION = "supabase/migrations/20261010135755_v4_launch_event_schedule_fix.sql";
const root = globalThis as typeof globalThis & { __launchEventDb?: Promise<PGlite | null>; __launchScheduleDb?: Promise<PGlite | null> };
export async function localLaunchEventDatabase() {
  if (process.env.NODE_ENV !== "development") return null;
  return root.__launchScheduleDb ??= (async () => {
    const db = await (root.__launchEventDb ??= (async () => {
      const original = await localMeasurementDatabase();
      if (original) await original.exec(await readFile(LAUNCH_MIGRATION, "utf8"));
      return original;
    })());
    if (db) await db.exec(await readFile(LAUNCH_SCHEDULE_MIGRATION, "utf8"));
    return db;
  })();
}
