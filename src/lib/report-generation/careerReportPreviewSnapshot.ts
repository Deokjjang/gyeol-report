import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { CareerReportEvidencePacket } from "../report-knowledge/careerReportTypes";
import {
  sanitizeCareerReportVisibleText,
} from "./careerReportDraftValidator";
import type { CareerReportDraft } from "./careerReportDraftTypes";

export type CareerReportPreviewSnapshot = {
  readonly fixtureId: string;
  readonly generatedAt: string;
  readonly evidencePacket: CareerReportEvidencePacket;
  readonly draft: CareerReportDraft;
};

const careerReportPreviewSnapshotRoot = ".tmp/career-report-preview";

function assertSafeFixtureId(fixtureId: string): void {
  if (!/^[a-z0-9-]+$/u.test(fixtureId)) {
    throw new Error(`Invalid career report preview fixture id: ${fixtureId}`);
  }
}

function sanitizeSnapshotTextValue(value: unknown): unknown {
  if (typeof value === "string") {
    return sanitizeCareerReportVisibleText(value);
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
      sanitizeSnapshotTextValue(item),
    ]),
  );
}

export function sanitizeCareerReportPreviewSnapshotPayload(input: {
  readonly evidencePacket: CareerReportEvidencePacket;
  readonly draft: CareerReportDraft;
}): {
  readonly evidencePacket: CareerReportEvidencePacket;
  readonly draft: CareerReportDraft;
} {
  return {
    evidencePacket: sanitizeSnapshotTextValue(
      input.evidencePacket,
    ) as CareerReportEvidencePacket,
    draft: sanitizeSnapshotTextValue(input.draft) as CareerReportDraft,
  };
}

export function getCareerReportPreviewSnapshotPath(fixtureId: string): string {
  assertSafeFixtureId(fixtureId);

  return join(
    process.cwd(),
    careerReportPreviewSnapshotRoot,
    `${fixtureId}-latest.json`,
  );
}

export function getCareerReportPreviewSnapshotRelativePath(
  fixtureId: string,
): string {
  assertSafeFixtureId(fixtureId);

  return `${careerReportPreviewSnapshotRoot}/${fixtureId}-latest.json`;
}

export function getCareerReportPreviewUrl(fixtureId: string): string {
  assertSafeFixtureId(fixtureId);

  return `http://localhost:3000/dev/career-report-preview?fixture=${fixtureId}&snapshot=latest`;
}

export async function writeCareerReportPreviewSnapshot(input: {
  readonly fixtureId: string;
  readonly evidencePacket: CareerReportEvidencePacket;
  readonly draft: CareerReportDraft;
  readonly generatedAt?: string;
}): Promise<string> {
  const filePath = getCareerReportPreviewSnapshotPath(input.fixtureId);
  const sanitizedPayload = sanitizeCareerReportPreviewSnapshotPayload({
    evidencePacket: input.evidencePacket,
    draft: input.draft,
  });
  const snapshot: CareerReportPreviewSnapshot = {
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
    throw new Error("Career report preview snapshot contains blocked secret markers.");
  }

  await mkdir(join(process.cwd(), careerReportPreviewSnapshotRoot), {
    recursive: true,
  });
  await writeFile(filePath, `${serialized}\n`, "utf8");

  return filePath;
}

export async function readCareerReportPreviewSnapshot(
  fixtureId: string,
): Promise<CareerReportPreviewSnapshot | null> {
  const filePath = getCareerReportPreviewSnapshotPath(fixtureId);

  try {
    return JSON.parse(await readFile(filePath, "utf8")) as CareerReportPreviewSnapshot;
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
