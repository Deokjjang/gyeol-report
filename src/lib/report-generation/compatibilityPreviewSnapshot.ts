import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { CompatibilityEvidencePacket } from "../report-knowledge/compatibilityEvidenceBuilder";
import type { CompatibilityRelationshipType } from "../report-knowledge/compatibilityTypes";
import { sanitizeCompatibilityVisibleText } from "./compatibilityReportDraftValidator";
import type { CompatibilityReportDraft } from "./compatibilityReportDraftTypes";

export type CompatibilityPreviewSnapshot = {
  readonly fixtureId: string;
  readonly generatedAt: string;
  readonly evidencePacket: CompatibilityEvidencePacket;
  readonly draft: CompatibilityReportDraft;
  readonly qualityWarnings: readonly string[];
};

const compatibilityPreviewSnapshotRoot = ".tmp/compatibility-preview";

function sanitizeSnapshotTextValue(
  value: unknown,
  relationshipType: CompatibilityRelationshipType,
): unknown {
  if (typeof value === "string") {
    return sanitizeCompatibilityVisibleText(value, relationshipType);
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeSnapshotTextValue(item, relationshipType));
  }
  if (typeof value !== "object" || value === null) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      sanitizeSnapshotTextValue(item, relationshipType),
    ]),
  );
}

export function sanitizeCompatibilityPreviewSnapshotPayload(input: {
  readonly evidencePacket: CompatibilityEvidencePacket;
  readonly draft: CompatibilityReportDraft;
}): {
  readonly evidencePacket: CompatibilityEvidencePacket;
  readonly draft: CompatibilityReportDraft;
} {
  const relationshipType =
    input.draft.relationshipType ?? input.evidencePacket.input.relationshipType;

  return {
    evidencePacket: sanitizeSnapshotTextValue(
      input.evidencePacket,
      relationshipType,
    ) as CompatibilityEvidencePacket,
    draft: sanitizeSnapshotTextValue(
      input.draft,
      relationshipType,
    ) as CompatibilityReportDraft,
  };
}

function assertSafeFixtureId(fixtureId: string): void {
  if (!/^[a-z0-9-]+$/u.test(fixtureId)) {
    throw new Error(`Invalid compatibility preview fixture id: ${fixtureId}`);
  }
}

export function getCompatibilityPreviewSnapshotPath(fixtureId: string): string {
  assertSafeFixtureId(fixtureId);

  return join(
    process.cwd(),
    compatibilityPreviewSnapshotRoot,
    `${fixtureId}-latest.json`,
  );
}

export function getCompatibilityPreviewSnapshotRelativePath(
  fixtureId: string,
): string {
  assertSafeFixtureId(fixtureId);

  return `${compatibilityPreviewSnapshotRoot}/${fixtureId}-latest.json`;
}

export function getCompatibilityPreviewUrl(fixtureId: string): string {
  assertSafeFixtureId(fixtureId);

  return `http://localhost:3000/dev/compatibility-preview?fixture=${fixtureId}&snapshot=latest`;
}

export async function writeCompatibilityPreviewSnapshot(input: {
  readonly fixtureId: string;
  readonly evidencePacket: CompatibilityEvidencePacket;
  readonly draft: CompatibilityReportDraft;
  readonly qualityWarnings: readonly string[];
  readonly generatedAt?: string;
}): Promise<string> {
  const filePath = getCompatibilityPreviewSnapshotPath(input.fixtureId);
  const sanitizedPayload = sanitizeCompatibilityPreviewSnapshotPayload({
    evidencePacket: input.evidencePacket,
    draft: input.draft,
  });
  const snapshot: CompatibilityPreviewSnapshot = {
    fixtureId: input.fixtureId,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    evidencePacket: sanitizedPayload.evidencePacket,
    draft: sanitizedPayload.draft,
    qualityWarnings: input.qualityWarnings,
  };
  const serialized = JSON.stringify(snapshot, null, 2);

  if (
    serialized.includes("OPENAI_API_KEY") ||
    serialized.includes("Authorization")
  ) {
    throw new Error("Compatibility preview snapshot contains blocked secret markers.");
  }

  await mkdir(join(process.cwd(), compatibilityPreviewSnapshotRoot), {
    recursive: true,
  });
  await writeFile(filePath, `${serialized}\n`, "utf8");

  return filePath;
}

export async function readCompatibilityPreviewSnapshot(
  fixtureId: string,
): Promise<CompatibilityPreviewSnapshot | null> {
  const filePath = getCompatibilityPreviewSnapshotPath(fixtureId);

  try {
    return JSON.parse(await readFile(filePath, "utf8")) as CompatibilityPreviewSnapshot;
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return null;
    }

    throw error;
  }
}
