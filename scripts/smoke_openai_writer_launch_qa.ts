import { loadLocalEnv } from "./lib/loadLocalEnv";
import type {
  CompatibilityRelationshipType,
  ReportInputPayload,
  ReportPersonInputPayload,
} from "../src/lib/report-generation/reportInputTypes";

type ProductType =
  | "saju_mbti_full"
  | "career_money_study"
  | "love_marriage_child"
  | "saju_mbti_compatibility"
  | "major_fortune"
  | "annual_fortune";

type SingleProductType = Exclude<ProductType, "saju_mbti_compatibility">;

type WriterLaunchQaCase = {
  readonly label: string;
  readonly productType: ProductType;
  readonly productSlug: string;
  readonly payload: ReportInputPayload;
  readonly assertExtra?: (body: ProductPreviewSuccessBody) => void;
};

type ProductPreviewSuccessBody = {
  readonly ok: true;
  readonly reportId: string;
  readonly snapshotKind: "product_preview";
  readonly productPreview: {
    readonly productType: ProductType;
    readonly productKey: ProductType;
    readonly productSlug: string;
    readonly draft: Record<string, unknown>;
    readonly evidencePacket?: Record<string, unknown>;
  };
};

type RequiredWriterEnvName =
  | "OPENAI_REPORT_WRITER_ENABLED"
  | "OPENAI_API_KEY"
  | "OPENAI_REPORT_MODEL";

const compatibilityRelationshipTypes = [
  "love",
  "marriage",
  "parentChild",
  "coworker",
  "managerReport",
  "businessPartner",
  "friendship",
] as const satisfies readonly CompatibilityRelationshipType[];

const basePerson: ReportPersonInputPayload = {
  name: "도윤",
  birthDate: "1996-12-06",
  birthTime: "09:30",
  birthTimeUnknown: false,
  approximateBirthTimeSlot: "",
  gender: "MALE",
  mbtiType: "ENTJ",
};

const partnerPerson: ReportPersonInputPayload = {
  name: "서윤",
  birthDate: "1998-11-30",
  birthTime: "",
  birthTimeUnknown: true,
  approximateBirthTimeSlot: "",
  gender: "FEMALE",
  mbtiType: "INFP",
};

const userContext = {
  relationshipStatus: "single",
  jobStatus: "employee",
  detailJob: "서비스 기획자",
  focusAreas: [],
} as const;

const forbiddenVisibleMarkers = [
  "placeholder",
  "fallback",
  "source registry",
  "Preview ID",
  "productKey",
  "productSlug",
  "raw output",
  "internal",
  "calendar_month_approximation",
  "투자 수익 보장",
  "합격 확정",
  "승진 확정",
  "이직 확정",
  "결혼 확정",
  "이혼 확정",
  "임신 확정",
  "출산 확정",
  "질병/사고/사망 예언",
] as const;

const expectedWriterLaunchQaCaseCount = 12;

function createSingleProductPayload(input: {
  readonly productType: SingleProductType;
  readonly productSlug:
    | "saju-mbti-full"
    | "career-money-study"
    | "love-marriage-child"
    | "major-fortune"
    | "annual-fortune";
  readonly selectedYear?: string;
}): ReportInputPayload {
  return {
    productKey: input.productType,
    productSlug: input.productSlug,
    person: basePerson,
    userContext,
    productOptions:
      input.selectedYear === undefined
        ? {}
        : {
            selectedYear: input.selectedYear,
          },
  };
}

function createCompatibilityPayload(
  relationshipType: CompatibilityRelationshipType,
): ReportInputPayload {
  return {
    productKey: "saju_mbti_compatibility",
    productSlug: "compatibility",
    relationshipType,
    personA: basePerson,
    personB: partnerPerson,
  };
}

const writerLaunchQaCases: readonly WriterLaunchQaCase[] = [
  {
    label: "saju-mbti-full",
    productType: "saju_mbti_full",
    productSlug: "saju-mbti-full",
    payload: createSingleProductPayload({
      productType: "saju_mbti_full",
      productSlug: "saju-mbti-full",
    }),
    assertExtra: (body) => {
      assertEqual(
        body.productPreview.draft.version,
        "comprehensive_v2_draft",
        "comprehensive draft version",
      );
      assertLongformSections(body.productPreview.draft);
    },
  },
  {
    label: "career-money-study",
    productType: "career_money_study",
    productSlug: "career-money-study",
    payload: createSingleProductPayload({
      productType: "career_money_study",
      productSlug: "career-money-study",
    }),
  },
  {
    label: "love-marriage-child",
    productType: "love_marriage_child",
    productSlug: "love-marriage-child",
    payload: createSingleProductPayload({
      productType: "love_marriage_child",
      productSlug: "love-marriage-child",
    }),
  },
  {
    label: "major-fortune",
    productType: "major_fortune",
    productSlug: "major-fortune",
    payload: createSingleProductPayload({
      productType: "major_fortune",
      productSlug: "major-fortune",
    }),
  },
  {
    label: "annual-fortune",
    productType: "annual_fortune",
    productSlug: "annual-fortune",
    payload: createSingleProductPayload({
      productType: "annual_fortune",
      productSlug: "annual-fortune",
      selectedYear: "2026",
    }),
    assertExtra: (body) => {
      assertEqual(body.productPreview.draft.targetYear, 2026, "annual targetYear");
      assertEqual(
        body.productPreview.evidencePacket?.selectedYear,
        2026,
        "annual evidence selectedYear",
      );
    },
  },
  ...compatibilityRelationshipTypes.map(
    (relationshipType): WriterLaunchQaCase => ({
      label: `compatibility:${relationshipType}`,
      productType: "saju_mbti_compatibility",
      productSlug: "compatibility",
      payload: createCompatibilityPayload(relationshipType),
      assertExtra: (body) => {
        assertEqual(
          body.productPreview.draft.relationshipType,
          relationshipType,
          "compatibility draft relationshipType",
        );
        assertEqual(
          body.productPreview.evidencePacket?.relationshipType,
          relationshipType,
          "compatibility evidence relationshipType",
        );
      },
    }),
  ),
];

function getRequiredWriterEnv(): {
  readonly ok: true;
  readonly model: string;
} | {
  readonly ok: false;
  readonly missing: readonly string[];
} {
  const missing: string[] = [];
  const enabled = getEnvValue("OPENAI_REPORT_WRITER_ENABLED");
  const apiKey = getEnvValue("OPENAI_API_KEY");
  const model = getEnvValue("OPENAI_REPORT_MODEL");

  if (enabled !== "1") {
    missing.push("OPENAI_REPORT_WRITER_ENABLED=1");
  }
  if (apiKey === undefined) {
    missing.push("OPENAI_API_KEY");
  }
  if (model === undefined) {
    missing.push("OPENAI_REPORT_MODEL");
  }

  if (missing.length > 0 || model === undefined) {
    return { ok: false, missing };
  }

  return { ok: true, model };
}

function getEnvValue(name: RequiredWriterEnvName): string | undefined {
  const value = process.env[name];
  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  return value.trim();
}

function writeWriterEnvStatus(model: string): void {
  process.stdout.write("OPENAI_REPORT_WRITER_ENABLED=1\n");
  process.stdout.write("OPENAI_API_KEY=set\n");
  process.stdout.write(`OPENAI_REPORT_MODEL=${model}\n`);
}

function createJsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/reports/create", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

async function postCreateReport(
  payload: ReportInputPayload,
): Promise<ProductPreviewSuccessBody> {
  const { POST } = await import("../src/app/api/reports/create/route");
  const response = await POST(createJsonRequest(payload));
  const body: unknown = await response.json();

  if (response.status !== 200) {
    throw new Error(`status ${response.status}: ${JSON.stringify(body)}`);
  }

  assertProductPreviewBody(body);
  return body;
}

function assertProductPreviewBody(
  body: unknown,
): asserts body is ProductPreviewSuccessBody {
  if (!isRecord(body)) {
    throw new Error("response body is not an object");
  }

  assertEqual(body.ok, true, "ok");
  assertEqual(body.snapshotKind, "product_preview", "snapshotKind");

  if (typeof body.reportId !== "string" || body.reportId.length === 0) {
    throw new Error("reportId is missing");
  }

  if (!isRecord(body.productPreview)) {
    throw new Error("productPreview is missing");
  }

  if (!isRecord(body.productPreview.draft)) {
    throw new Error("draft is missing");
  }
}

function assertCaseBody(
  body: ProductPreviewSuccessBody,
  qaCase: WriterLaunchQaCase,
): void {
  assertEqual(body.productPreview.productType, qaCase.productType, "productType");
  assertEqual(body.productPreview.productKey, qaCase.productType, "productKey");
  assertEqual(body.productPreview.productSlug, qaCase.productSlug, "productSlug");
  assertEqual(
    body.productPreview.draft.productType,
    qaCase.productType,
    "draft productType",
  );

  const visibleText = normalizeVisibleText(body.productPreview.draft);
  assertNoForbiddenText(visibleText, forbiddenVisibleMarkers, "draft visible text");
  assertMinimumTextLength(visibleText, qaCase);
  assertNoExcessiveSentenceRepetition(visibleText);

  qaCase.assertExtra?.(body);
}

function assertLongformSections(draft: Record<string, unknown>): void {
  const readings = draft.longformReadings;
  if (!Array.isArray(readings)) {
    throw new Error("comprehensive longformReadings is missing");
  }

  for (const reading of readings) {
    if (!isRecord(reading)) {
      throw new Error("comprehensive longform reading is invalid");
    }

    const body = typeof reading.body === "string" ? reading.body.trim() : "";
    if (body.length < 220) {
      throw new Error("comprehensive longform section is too short");
    }
  }
}

function assertMinimumTextLength(
  visibleText: string,
  qaCase: WriterLaunchQaCase,
): void {
  const minimumLength =
    qaCase.productType === "saju_mbti_full"
      ? 4000
      : qaCase.productType === "saju_mbti_compatibility"
        ? 1800
        : 1400;

  if (visibleText.length < minimumLength) {
    throw new Error(
      `draft visible text is too short: ${visibleText.length}/${minimumLength}`,
    );
  }
}

function assertNoForbiddenText(
  text: string,
  markers: readonly string[],
  label: string,
): void {
  const lowerText = text.toLowerCase();

  for (const marker of markers) {
    if (lowerText.includes(marker.toLowerCase())) {
      throw new Error(`${label} contains forbidden marker: ${marker}`);
    }
  }
}

function assertNoExcessiveSentenceRepetition(text: string): void {
  const counts = new Map<string, number>();
  const sentences = text
    .split(/[.!?\n]|다\.|요\./)
    .map((sentence) => sentence.replace(/\s+/g, " ").trim())
    .filter((sentence) => sentence.length >= 24);

  for (const sentence of sentences) {
    const count = (counts.get(sentence) ?? 0) + 1;
    if (count >= 4) {
      throw new Error(`sentence repeated too often: ${sentence}`);
    }
    counts.set(sentence, count);
  }
}

function normalizeVisibleText(value: unknown): string {
  const chunks: string[] = [];
  collectStrings(value, chunks);

  return chunks.join(" ").replace(/\s+/g, " ").trim();
}

function collectStrings(value: unknown, chunks: string[]): void {
  if (typeof value === "string") {
    chunks.push(value);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectStrings(item, chunks);
    }
    return;
  }

  if (!isRecord(value)) {
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    if (key === "productKey" || key === "productSlug") {
      continue;
    }
    collectStrings(child, chunks);
  }
}

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${String(expected)}, received ${String(actual)}`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function runWriterLaunchQaCase(
  qaCase: WriterLaunchQaCase,
): Promise<void> {
  const body = await postCreateReport(qaCase.payload);
  assertCaseBody(body, qaCase);

  process.stdout.write(
    `PASS product=${qaCase.productSlug} reportId=${body.reportId} productType=${body.productPreview.productType}\n`,
  );
}

async function main(): Promise<void> {
  loadLocalEnv();

  const env = getRequiredWriterEnv();
  if (!env.ok) {
    process.exitCode = 1;
    process.stderr.write(`missing env: ${env.missing.join(", ")}\n`);
    return;
  }

  writeWriterEnvStatus(env.model);

  if (writerLaunchQaCases.length !== expectedWriterLaunchQaCaseCount) {
    process.exitCode = 1;
    process.stderr.write(
      `FAIL expected ${expectedWriterLaunchQaCaseCount} writer QA cases, received ${writerLaunchQaCases.length}\n`,
    );
    return;
  }

  let passed = 0;
  let failed = 0;

  for (const qaCase of writerLaunchQaCases) {
    try {
      await runWriterLaunchQaCase(qaCase);
      passed += 1;
    } catch (error) {
      failed += 1;
      process.stderr.write(
        `FAIL product=${qaCase.productSlug} label=${qaCase.label} reason=${
          error instanceof Error ? error.message : String(error)
        }\n`,
      );
    }
  }

  if (failed > 0) {
    process.exitCode = 1;
  }

  process.stdout.write(
    `OpenAI writer launch QA complete: passed=${passed} failed=${failed} total=${writerLaunchQaCases.length}\n`,
  );
}

main().catch((error: unknown) => {
  process.exitCode = 1;
  process.stderr.write(
    `FAIL OpenAI writer launch QA ${
      error instanceof Error ? error.message : String(error)
    }\n`,
  );
});
