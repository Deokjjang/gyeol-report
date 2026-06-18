import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { AnnualFortuneEvidencePacket } from "../report-knowledge/annualFortuneEvidence";
import {
  getAnnualMonthlyBasisDisplayLabel,
  sanitizeAnnualFortuneKoreanCopy,
} from "./annualFortuneReportDraftValidator";
import type { AnnualFortuneReportDraft } from "./annualFortuneReportDraftTypes";

export type AnnualFortunePreviewSnapshot = {
  readonly fixtureId: string;
  readonly generatedAt: string;
  readonly evidencePacket: AnnualFortuneEvidencePacket;
  readonly draft: AnnualFortuneReportDraft;
};

const annualFortunePreviewSnapshotRoot = ".tmp/annual-fortune-preview";

function assertSafeFixtureId(fixtureId: string): void {
  if (!/^[a-z0-9-]+$/u.test(fixtureId)) {
    throw new Error(`Invalid annual fortune preview fixture id: ${fixtureId}`);
  }
}

function sanitizeSnapshotTextValue(value: unknown, key?: string): unknown {
  if (typeof value === "string") {
    if (key === "monthlyBasis") {
      return getAnnualMonthlyBasisDisplayLabel(value);
    }

    return sanitizeAnnualFortuneKoreanCopy(value);
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

export function sanitizeAnnualFortunePreviewSnapshotPayload(input: {
  readonly evidencePacket: AnnualFortuneEvidencePacket;
  readonly draft: AnnualFortuneReportDraft;
}): {
  readonly evidencePacket: AnnualFortuneEvidencePacket;
  readonly draft: AnnualFortuneReportDraft;
} {
  return {
    evidencePacket: sanitizeSnapshotTextValue(
      input.evidencePacket,
    ) as AnnualFortuneEvidencePacket,
    draft: sanitizeSnapshotTextValue(input.draft) as AnnualFortuneReportDraft,
  };
}

export function getAnnualFortunePreviewSnapshotPath(fixtureId: string): string {
  assertSafeFixtureId(fixtureId);

  return join(
    process.cwd(),
    annualFortunePreviewSnapshotRoot,
    `${fixtureId}-latest.json`,
  );
}

export function getAnnualFortunePreviewSnapshotRelativePath(
  fixtureId: string,
): string {
  assertSafeFixtureId(fixtureId);

  return `${annualFortunePreviewSnapshotRoot}/${fixtureId}-latest.json`;
}

export function getAnnualFortunePreviewUrl(fixtureId: string): string {
  assertSafeFixtureId(fixtureId);

  return `http://localhost:3000/dev/annual-fortune-preview?fixture=${fixtureId}&snapshot=latest`;
}

export async function writeAnnualFortunePreviewSnapshot(input: {
  readonly fixtureId: string;
  readonly evidencePacket: AnnualFortuneEvidencePacket;
  readonly draft: AnnualFortuneReportDraft;
  readonly generatedAt?: string;
}): Promise<string> {
  const filePath = getAnnualFortunePreviewSnapshotPath(input.fixtureId);
  const sanitizedPayload = sanitizeAnnualFortunePreviewSnapshotPayload({
    evidencePacket: input.evidencePacket,
    draft: input.draft,
  });
  const snapshot: AnnualFortunePreviewSnapshot = {
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
    throw new Error("Annual fortune preview snapshot contains blocked secret markers.");
  }

  await mkdir(join(process.cwd(), annualFortunePreviewSnapshotRoot), {
    recursive: true,
  });
  await writeFile(filePath, `${serialized}\n`, "utf8");

  return filePath;
}

export async function readAnnualFortunePreviewSnapshot(
  fixtureId: string,
): Promise<AnnualFortunePreviewSnapshot | null> {
  const filePath = getAnnualFortunePreviewSnapshotPath(fixtureId);

  try {
    return JSON.parse(await readFile(filePath, "utf8")) as AnnualFortunePreviewSnapshot;
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
