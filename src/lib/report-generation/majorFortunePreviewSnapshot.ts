import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { MajorFortuneEvidencePacket } from "../report-knowledge/majorFortuneTypes";
import {
  getMajorFortuneBasisDisplayLabel,
  sanitizeMajorFortuneVisibleText,
} from "./majorFortuneReportDraftValidator";
import type { MajorFortuneReportDraft } from "./majorFortuneReportDraftTypes";

export type MajorFortunePreviewSnapshot = {
  readonly fixtureId: string;
  readonly generatedAt: string;
  readonly evidencePacket: MajorFortuneEvidencePacket;
  readonly draft: MajorFortuneReportDraft;
};

const majorFortunePreviewSnapshotRoot = ".tmp/major-fortune-preview";

function assertSafeFixtureId(fixtureId: string): void {
  if (!/^[a-z0-9-]+$/u.test(fixtureId)) {
    throw new Error(`Invalid major fortune preview fixture id: ${fixtureId}`);
  }
}

function sanitizeSnapshotTextValue(value: unknown, key?: string): unknown {
  if (typeof value === "string") {
    if (key === "basisType") {
      return value;
    }
    if (key === "basisLabel" || key === "displayLabel") {
      return getMajorFortuneBasisDisplayLabel(value);
    }

    return sanitizeMajorFortuneVisibleText(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeSnapshotTextValue(item));
  }
  if (typeof value !== "object" || value === null) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      sanitizeSnapshotTextValue(item, key),
    ]),
  );
}

export function sanitizeMajorFortunePreviewSnapshotPayload(input: {
  readonly evidencePacket: MajorFortuneEvidencePacket;
  readonly draft: MajorFortuneReportDraft;
}): {
  readonly evidencePacket: MajorFortuneEvidencePacket;
  readonly draft: MajorFortuneReportDraft;
} {
  return {
    evidencePacket: sanitizeSnapshotTextValue(
      input.evidencePacket,
    ) as MajorFortuneEvidencePacket,
    draft: sanitizeSnapshotTextValue(input.draft) as MajorFortuneReportDraft,
  };
}

export function getMajorFortunePreviewSnapshotPath(fixtureId: string): string {
  assertSafeFixtureId(fixtureId);

  return join(
    process.cwd(),
    majorFortunePreviewSnapshotRoot,
    `${fixtureId}-latest.json`,
  );
}

export function getMajorFortunePreviewSnapshotRelativePath(
  fixtureId: string,
): string {
  assertSafeFixtureId(fixtureId);

  return `${majorFortunePreviewSnapshotRoot}/${fixtureId}-latest.json`;
}

export function getMajorFortunePreviewUrl(fixtureId: string): string {
  assertSafeFixtureId(fixtureId);

  return `http://localhost:3000/dev/major-fortune-preview?fixture=${fixtureId}&snapshot=latest`;
}

export async function writeMajorFortunePreviewSnapshot(input: {
  readonly fixtureId: string;
  readonly evidencePacket: MajorFortuneEvidencePacket;
  readonly draft: MajorFortuneReportDraft;
  readonly generatedAt?: string;
}): Promise<string> {
  const filePath = getMajorFortunePreviewSnapshotPath(input.fixtureId);
  const sanitizedPayload = sanitizeMajorFortunePreviewSnapshotPayload({
    evidencePacket: input.evidencePacket,
    draft: input.draft,
  });
  const snapshot: MajorFortunePreviewSnapshot = {
    fixtureId: input.fixtureId,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    evidencePacket: sanitizedPayload.evidencePacket,
    draft: sanitizedPayload.draft,
  };
  const serialized = JSON.stringify(snapshot, null, 2);

  if (
    serialized.includes("OPENAI_API_KEY") ||
    serialized.includes("Authorization")
  ) {
    throw new Error("Major fortune preview snapshot contains blocked secret markers.");
  }

  await mkdir(join(process.cwd(), majorFortunePreviewSnapshotRoot), {
    recursive: true,
  });
  await writeFile(filePath, `${serialized}\n`, "utf8");

  return filePath;
}

export async function readMajorFortunePreviewSnapshot(
  fixtureId: string,
): Promise<MajorFortunePreviewSnapshot | null> {
  const filePath = getMajorFortunePreviewSnapshotPath(fixtureId);

  try {
    return JSON.parse(await readFile(filePath, "utf8")) as MajorFortunePreviewSnapshot;
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
