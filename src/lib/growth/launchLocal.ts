import "server-only";
import { readFile } from "node:fs/promises";
import type { PGlite } from "@electric-sql/pglite";
import { localMeasurementDatabase } from "../analytics/localReview";
export const LAUNCH_MIGRATION = "supabase/migrations/20261010132645_v4_launch_event.sql";
const root = globalThis as typeof globalThis & { __launchEventDb?: Promise<PGlite | null> };
export async function localLaunchEventDatabase() {
  if (process.env.NODE_ENV !== "development") return null;
  return root.__launchEventDb ??= (async () => {
    const db = await localMeasurementDatabase();
    if (db) await db.exec(await readFile(LAUNCH_MIGRATION, "utf8"));
    return db;
  })();
}
