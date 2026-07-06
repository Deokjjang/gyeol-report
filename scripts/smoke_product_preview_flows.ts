import { POST } from "../src/app/api/reports/create/route";
import type {
  CompatibilityRelationshipType,
  ReportInputPayload,
  ReportPersonInputPayload,
} from "../src/lib/report-generation/reportInputTypes";

type SmokeCase = {
  readonly label: string;
  readonly expectedProductType:
    | "career_money_study"
    | "love_marriage_child"
    | "saju_mbti_compatibility"
    | "major_fortune"
    | "annual_fortune";
  readonly payload: ReportInputPayload;
  readonly assertExtra?: (body: ProductPreviewSuccessBody) => void;
};

type SingleProductType = Exclude<
  SmokeCase["expectedProductType"],
  "saju_mbti_compatibility"
>;

type ProductPreviewSuccessBody = {
  readonly ok: true;
  readonly reportId: string;
  readonly snapshotKind: "product_preview";
  readonly productPreview: {
    readonly productType: string;
    readonly productKey: string;
    readonly productSlug: string;
    readonly draft: Record<string, unknown>;
    readonly evidencePacket?: Record<string, unknown>;
  };
};

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
  name: "덕민",
  birthDate: "1999-07-31",
  birthTime: "07:30",
  birthTimeUnknown: false,
  approximateBirthTimeSlot: "",
  gender: "MALE",
  mbtiType: "ENTJ",
};

const partnerPerson: ReportPersonInputPayload = {
  name: "소담",
  birthDate: "2000-02-14",
  birthTime: "",
  birthTimeUnknown: true,
  approximateBirthTimeSlot: "",
  gender: "FEMALE",
  mbtiType: "INTP",
};

const singlePersonUserContext = {
  relationshipStatus: "single",
  jobStatus: "employee",
  detailJob: "서비스 기획자",
  focusAreas: ["직업", "돈", "관계", "공부"],
} as const;

function createSingleProductPayload(
  input: {
    readonly expectedProductType: SingleProductType;
    readonly productSlug:
      | "career-money-study"
      | "love-marriage-child"
      | "major-fortune"
      | "annual-fortune";
    readonly selectedYear?: string;
  },
): ReportInputPayload {
  return {
    productKey: input.expectedProductType,
    productSlug: input.productSlug,
    person: basePerson,
    userContext: singlePersonUserContext,
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

const smokeCases: readonly SmokeCase[] = [
  {
    label: "career-money-study",
    expectedProductType: "career_money_study",
    payload: createSingleProductPayload({
      expectedProductType: "career_money_study",
      productSlug: "career-money-study",
    }),
  },
  {
    label: "love-marriage-child",
    expectedProductType: "love_marriage_child",
    payload: createSingleProductPayload({
      expectedProductType: "love_marriage_child",
      productSlug: "love-marriage-child",
    }),
  },
  {
    label: "major-fortune",
    expectedProductType: "major_fortune",
    payload: createSingleProductPayload({
      expectedProductType: "major_fortune",
      productSlug: "major-fortune",
    }),
  },
  {
    label: "annual-fortune",
    expectedProductType: "annual_fortune",
    payload: createSingleProductPayload({
      expectedProductType: "annual_fortune",
      productSlug: "annual-fortune",
      selectedYear: "2026",
    }),
    assertExtra: (body) => {
      assertEqual(body.productPreview.draft.targetYear, 2026, "draft targetYear");
      assertEqual(
        body.productPreview.evidencePacket?.selectedYear,
        2026,
        "evidence selectedYear",
      );
    },
  },
  ...compatibilityRelationshipTypes.map((relationshipType): SmokeCase => ({
    label: `compatibility:${relationshipType}`,
    expectedProductType: "saju_mbti_compatibility",
    payload: createCompatibilityPayload(relationshipType),
    assertExtra: (body) => {
      assertEqual(
        body.productPreview.draft.relationshipType,
        relationshipType,
        "draft relationshipType",
      );
      assertEqual(
        body.productPreview.evidencePacket?.relationshipType,
        relationshipType,
        "evidence relationshipType",
      );
    },
  })),
];

function createJsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/reports/create", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${String(expected)}, received ${String(actual)}`);
  }
}

function assertProductPreviewBody(
  body: unknown,
  expectedProductType: SmokeCase["expectedProductType"],
): asserts body is ProductPreviewSuccessBody {
  if (typeof body !== "object" || body === null) {
    throw new Error("response body is not an object");
  }

  const value = body as Partial<ProductPreviewSuccessBody>;

  assertEqual(value.ok, true, "ok");
  assertEqual(value.snapshotKind, "product_preview", "snapshotKind");

  if (typeof value.reportId !== "string" || value.reportId.length === 0) {
    throw new Error("reportId is missing");
  }

  const productPreview = value.productPreview;
  if (typeof productPreview !== "object" || productPreview === null) {
    throw new Error("productPreview is missing");
  }

  assertEqual(productPreview.productType, expectedProductType, "productType");
  assertEqual(productPreview.productKey, expectedProductType, "productKey");

  if (
    typeof productPreview.draft !== "object" ||
    productPreview.draft === null
  ) {
    throw new Error("draft is missing");
  }

  assertEqual(
    productPreview.draft.productType,
    expectedProductType,
    "draft productType",
  );
}

async function runSmokeCase(smokeCase: SmokeCase): Promise<void> {
  const response = await POST(createJsonRequest(smokeCase.payload));
  const body = await response.json();

  if (response.status !== 200) {
    throw new Error(`status ${response.status}: ${JSON.stringify(body)}`);
  }

  assertProductPreviewBody(body, smokeCase.expectedProductType);
  smokeCase.assertExtra?.(body);

  process.stdout.write(
    `PASS ${smokeCase.label} ${body.reportId} ${body.productPreview.productType}\n`,
  );
}

async function main(): Promise<void> {
  let failures = 0;

  for (const smokeCase of smokeCases) {
    try {
      await runSmokeCase(smokeCase);
    } catch (error) {
      failures += 1;
      process.stderr.write(
        `FAIL ${smokeCase.label} ${
          error instanceof Error ? error.message : String(error)
        }\n`,
      );
    }
  }

  if (failures > 0) {
    process.exitCode = 1;
    process.stderr.write(`product preview flow smoke failed: ${failures}\n`);
    return;
  }

  process.stdout.write(`product preview flow smoke passed: ${smokeCases.length}\n`);
}

main().catch((error: unknown) => {
  process.exitCode = 1;
  process.stderr.write(
    `FAIL product preview flow smoke ${
      error instanceof Error ? error.message : String(error)
    }\n`,
  );
});
