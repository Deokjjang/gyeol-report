import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { MbtiCommonProfileSourceInput } from "./mbtiProfileTableData";

export const MBTI_SOURCE_TYPES = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const;

export type MbtiSourceType = (typeof MBTI_SOURCE_TYPES)[number];

export type MbtiSourceRegistryEntry = MbtiCommonProfileSourceInput & {
  readonly reportUseCases?: unknown;
};

const mbtiSourceFileNames = {
  INTJ: "INTJ.json",
  INTP: "INTP.json",
  ENTJ: "ENTJ.json",
  ENTP: "ENTP.json",
  INFJ: "INFJ.json",
  INFP: "INFP.json",
  ENFJ: "ENFJ.json",
  ENFP: "ENFP.json",
  ISTJ: "ISTJ.json",
  ISFJ: "ISFJ.json",
  ESTJ: "ESTJ.json",
  ESFJ: "ESFJ.json",
  ISTP: "ISTP.json",
  ISFP: "ISFP.json",
  ESTP: "ESTP.json",
  ESFP: "ESFP.json",
} as const satisfies Record<MbtiSourceType, string>;

const sourceCache: Partial<Record<MbtiSourceType, MbtiSourceRegistryEntry>> = {};

export function getMbtiSourceByType(
  type: string | null | undefined,
): MbtiSourceRegistryEntry | null {
  const normalizedType = normalizeMbtiSourceType(type);

  if (normalizedType === null) {
    return null;
  }

  return sourceCache[normalizedType] ?? readMbtiSource(normalizedType);
}

export function hasMbtiSourceType(type: string | null | undefined): boolean {
  return normalizeMbtiSourceType(type) !== null;
}

function normalizeMbtiSourceType(
  type: string | null | undefined,
): MbtiSourceType | null {
  if (type === null || type === undefined) {
    return null;
  }

  const normalized = type.trim().toUpperCase();

  return (MBTI_SOURCE_TYPES as readonly string[]).includes(normalized)
    ? (normalized as MbtiSourceType)
    : null;
}

function readMbtiSource(type: MbtiSourceType): MbtiSourceRegistryEntry {
  const source = parseMbtiSourceFile(type);

  sourceCache[type] = source;

  return source;
}

function parseMbtiSourceFile(type: MbtiSourceType): MbtiSourceRegistryEntry {
  const sourcePath = join(
    process.cwd(),
    "docs/product/mbti/source",
    mbtiSourceFileNames[type],
  );
  const rawText = stripUtf8Bom(readFileSync(sourcePath, "utf8"));
  const parsed = JSON.parse(rawText) as unknown;

  if (!isObjectRecord(parsed) || parsed.type !== type) {
    throw new Error(`Invalid MBTI source file for type: ${type}`);
  }

  return parsed as MbtiSourceRegistryEntry;
}

function stripUtf8Bom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
