import type {
  CompatibilityRelationshipType,
  JobStatus,
  RelationshipStatus,
  ReportGender,
  ReportInputPayload,
  ReportPersonInputPayload,
  SinglePersonReportInputPayload,
} from "../src/lib/report-generation/reportInputTypes";

type ProductType =
  | "saju_mbti_full"
  | "career_money_study"
  | "love_marriage_child"
  | "saju_mbti_compatibility"
  | "major_fortune"
  | "annual_fortune";

type SingleProductType = Exclude<ProductType, "saju_mbti_compatibility">;

type SingleProductSlug =
  | "saju-mbti-full"
  | "career-money-study"
  | "love-marriage-child"
  | "major-fortune"
  | "annual-fortune";

type LaunchQaFixture = {
  readonly id: string;
  readonly person: ReportPersonInputPayload;
  readonly relationshipStatus: RelationshipStatus;
  readonly jobStatus: JobStatus;
  readonly detailJob: string;
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

type LaunchQaCase = {
  readonly label: string;
  readonly productType: ProductType;
  readonly productSlug: string;
  readonly fixtureId: string;
  readonly payload: ReportInputPayload;
  readonly htmlMarkers: readonly string[];
  readonly assertExtra?: (body: ProductPreviewSuccessBody) => void;
};

const launchQaBaseUrl =
  process.env.LAUNCH_QA_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

const compatibilityRelationshipTypes = [
  "love",
  "marriage",
  "parentChild",
  "coworker",
  "managerReport",
  "businessPartner",
  "friendship",
] as const satisfies readonly CompatibilityRelationshipType[];

const annualSelectedYears = ["2026", "2025"] as const;

const launchQaFixtures = [
  {
    id: "student-birth-time-unknown-infp",
    person: createPerson({
      name: "민아",
      birthDate: "2002-03-15",
      birthTime: "",
      birthTimeUnknown: true,
      gender: "FEMALE",
      mbtiType: "INFP",
    }),
    relationshipStatus: "",
    jobStatus: "student",
    detailJob: "대학생",
  },
  {
    id: "employee-exact-time-estj",
    person: createPerson({
      name: "준호",
      birthDate: "1994-09-22",
      birthTime: "14:20",
      birthTimeUnknown: false,
      gender: "MALE",
      mbtiType: "ESTJ",
    }),
    relationshipStatus: "dating",
    jobStatus: "employee",
    detailJob: "개발자",
  },
  {
    id: "freelancer-no-gender-isfp",
    person: createPerson({
      name: "서윤",
      birthDate: "1988-01-08",
      birthTime: "05:40",
      birthTimeUnknown: false,
      gender: "",
      mbtiType: "ISFP",
    }),
    relationshipStatus: "single",
    jobStatus: "freelancer",
    detailJob: "디자이너",
  },
  {
    id: "unemployed-no-mbti",
    person: createPerson({
      name: "하은",
      birthDate: "1998-11-30",
      birthTime: "",
      birthTimeUnknown: true,
      gender: "FEMALE",
      mbtiType: "",
    }),
    relationshipStatus: "",
    jobStatus: "unemployed",
    detailJob: "",
  },
  {
    id: "other-job-exact-time-entj",
    person: createPerson({
      name: "도윤",
      birthDate: "1996-12-06",
      birthTime: "09:30",
      birthTimeUnknown: false,
      gender: "MALE",
      mbtiType: "ENTJ",
    }),
    relationshipStatus: "married",
    jobStatus: "other",
    detailJob: "서비스 기획자",
  },
  {
    id: "homemaker-birth-time-unknown-entj",
    person: createPerson({
      name: "지안",
      birthDate: "1991-04-17",
      birthTime: "",
      birthTimeUnknown: true,
      gender: "FEMALE",
      mbtiType: "ENTJ",
    }),
    relationshipStatus: "married",
    jobStatus: "homemaker",
    detailJob: "",
  },
  {
    id: "business-owner-exact-time-entj",
    person: createPerson({
      name: "태오",
      birthDate: "1985-06-21",
      birthTime: "22:10",
      birthTimeUnknown: false,
      gender: "MALE",
      mbtiType: "ENTJ",
    }),
    relationshipStatus: "some",
    jobStatus: "business_owner",
    detailJob: "자영업자",
  },
] as const satisfies readonly LaunchQaFixture[];

const defaultSingleFixtureIds = launchQaFixtures.map((fixture) => fixture.id);
const comprehensiveV2FixtureIds = [
  "unemployed-no-mbti",
  "other-job-exact-time-entj",
  "homemaker-birth-time-unknown-entj",
  "business-owner-exact-time-entj",
] as const;
const majorFortuneFixtureIds = launchQaFixtures
  .filter((fixture) => fixture.id !== "unemployed-no-mbti")
  .map((fixture) => fixture.id);

const singleProductMatrix = [
  {
    productType: "saju_mbti_full",
    productSlug: "saju-mbti-full",
    fixtureIds: comprehensiveV2FixtureIds,
    htmlMarkers: [
      "종합 리포트",
      "오행 분포",
      "내 사주의 주요 표식 해석",
      "명리×MBTI",
    ],
  },
  {
    productType: "career_money_study",
    productSlug: "career-money-study",
    fixtureIds: defaultSingleFixtureIds,
    htmlMarkers: ["직업·커리어·돈·학업 리포트", "만세력", "오행 분포"],
  },
  {
    productType: "love_marriage_child",
    productSlug: "love-marriage-child",
    fixtureIds: defaultSingleFixtureIds,
    htmlMarkers: ["연애·결혼·자녀 리포트", "만세력", "오행 분포"],
  },
  {
    productType: "major_fortune",
    productSlug: "major-fortune",
    fixtureIds: majorFortuneFixtureIds,
    htmlMarkers: ["대운 리포트", "만세력", "오행 분포", "대운"],
  },
  {
    productType: "annual_fortune",
    productSlug: "annual-fortune",
    fixtureIds: defaultSingleFixtureIds,
    htmlMarkers: ["세운 리포트", "만세력", "오행 분포", "세운", "월운"],
  },
] as const satisfies readonly {
  readonly productType: SingleProductType;
  readonly productSlug: SingleProductSlug;
  readonly fixtureIds: readonly string[];
  readonly htmlMarkers: readonly string[];
}[];

const forbiddenDraftMarkers = [
  "placeholder",
  "fallback",
  "source registry",
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

const forbiddenVisibleMarkers = [
  "리포트를 찾을 수 없습니다",
  "상품 미리보기 준비 중입니다",
  "placeholder",
  "fallback",
  "source registry",
  "Preview ID",
  "productKey",
  "productSlug",
] as const;

const expectedSingleCaseCount = singleProductMatrix.reduce(
  (total, product) => total + product.fixtureIds.length,
  0,
);
const expectedCompatibilityCaseCount = compatibilityRelationshipTypes.length;
const expectedLaunchQaCaseCount =
  expectedSingleCaseCount + expectedCompatibilityCaseCount;

function createPerson(input: {
  readonly name: string;
  readonly birthDate: string;
  readonly birthTime: string;
  readonly birthTimeUnknown: boolean;
  readonly gender: ReportGender;
  readonly mbtiType: ReportPersonInputPayload["mbtiType"];
}): ReportPersonInputPayload {
  return {
    name: input.name,
    birthDate: input.birthDate,
    birthTime: input.birthTimeUnknown ? "" : input.birthTime,
    birthTimeUnknown: input.birthTimeUnknown,
    approximateBirthTimeSlot: "",
    gender: input.gender,
    mbtiType: input.mbtiType,
  };
}

function createSingleProductPayload(input: {
  readonly productType: SingleProductType;
  readonly productSlug: SingleProductSlug;
  readonly fixture: LaunchQaFixture;
  readonly selectedYear?: string;
}): SinglePersonReportInputPayload {
  return {
    productKey: input.productType,
    productSlug: input.productSlug,
    person: input.fixture.person,
    userContext: {
      relationshipStatus: input.fixture.relationshipStatus,
      jobStatus: input.fixture.jobStatus,
      detailJob: input.fixture.detailJob,
      focusAreas: [],
    },
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
  fixtureA: LaunchQaFixture,
  fixtureB: LaunchQaFixture,
): ReportInputPayload {
  return {
    productKey: "saju_mbti_compatibility",
    productSlug: "compatibility",
    relationshipType,
    personA: fixtureA.person,
    personB: fixtureB.person,
  };
}

function createLaunchQaCases(): readonly LaunchQaCase[] {
  const singleCases = singleProductMatrix.flatMap((product) =>
    product.fixtureIds.map((fixtureId, fixtureIndex): LaunchQaCase => {
      const fixture = getLaunchQaFixture(fixtureId);
      const selectedYear =
        product.productType === "annual_fortune"
          ? annualSelectedYears[fixtureIndex % annualSelectedYears.length]
          : undefined;
      const label =
        selectedYear === undefined
          ? `${product.productSlug}:${fixture.id}`
          : `${product.productSlug}:${fixture.id}:selectedYear=${selectedYear}`;

      return {
        label,
        productType: product.productType,
        productSlug: product.productSlug,
        fixtureId: fixture.id,
        htmlMarkers: product.htmlMarkers,
        payload: createSingleProductPayload({
          productType: product.productType,
          productSlug: product.productSlug,
          fixture,
          selectedYear,
        }),
        assertExtra: (body) => {
          if (product.productType === "annual_fortune") {
            assertEqual(
              String(body.productPreview.draft.targetYear),
              selectedYear,
              "annual draft selectedYear",
            );
            assertEqual(
              String(body.productPreview.evidencePacket?.selectedYear),
              selectedYear,
              "annual evidence selectedYear",
            );
          }

          if (product.productType === "saju_mbti_full") {
            assertEqual(
              body.productPreview.draft.version,
              "comprehensive_v2_draft",
              "comprehensive V2 draft version",
            );
            assertHasKey(
              body.productPreview.draft,
              "sajuFeatureChapter",
              "comprehensive sajuFeatureChapter marker",
            );
          }
        },
      };
    }),
  );

  const compatibilityCases = compatibilityRelationshipTypes.map(
    (relationshipType, relationshipIndex): LaunchQaCase => {
      const fixtureA = launchQaFixtures[relationshipIndex % launchQaFixtures.length];
      const fixtureB =
        launchQaFixtures[(relationshipIndex + 1) % launchQaFixtures.length];

      return {
        label: `compatibility:${relationshipType}:${fixtureA.id}+${fixtureB.id}`,
        productType: "saju_mbti_compatibility",
        productSlug: "compatibility",
        fixtureId: `${fixtureA.id}+${fixtureB.id}`,
        htmlMarkers: ["궁합 리포트", "두 사람 기초표", "관계 카테고리"],
        payload: createCompatibilityPayload(relationshipType, fixtureA, fixtureB),
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
      };
    },
  );

  return [...singleCases, ...compatibilityCases];
}

function getLaunchQaFixture(fixtureId: string): LaunchQaFixture {
  const fixture = launchQaFixtures.find((candidate) => candidate.id === fixtureId);
  if (fixture === undefined) {
    throw new Error(`launch QA fixture is missing: ${fixtureId}`);
  }

  return fixture;
}

async function postCreateReport(
  payload: ReportInputPayload,
): Promise<ProductPreviewSuccessBody> {
  const response = await fetch(`${launchQaBaseUrl}/api/reports/create`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body: unknown = await response.json();

  if (response.status !== 200) {
    throw new Error(`create status ${response.status}: ${JSON.stringify(body)}`);
  }

  assertProductPreviewBody(body);
  return body;
}

async function getReportHtml(reportId: string): Promise<string> {
  const response = await fetch(`${launchQaBaseUrl}/reports/${reportId}`);
  const html = await response.text();

  if (response.status !== 200) {
    throw new Error(`result page status ${response.status}`);
  }

  return html;
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
  qaCase: LaunchQaCase,
): void {
  assertEqual(body.productPreview.productType, qaCase.productType, "productType");
  assertEqual(body.productPreview.productKey, qaCase.productType, "productKey");
  assertEqual(body.productPreview.productSlug, qaCase.productSlug, "productSlug");
  assertEqual(
    body.productPreview.draft.productType,
    qaCase.productType,
    "draft productType",
  );

  const draftVersion =
    body.productPreview.draft.productVersion ?? body.productPreview.draft.version;
  if (typeof draftVersion !== "string" || draftVersion.length === 0) {
    throw new Error("draft version/productVersion is missing");
  }

  assertNoForbiddenText(
    JSON.stringify(body.productPreview.draft),
    forbiddenDraftMarkers,
    "draft",
  );

  qaCase.assertExtra?.(body);
}

function assertResultHtml(html: string, qaCase: LaunchQaCase): void {
  const visibleText = normalizeVisibleText(html);

  for (const marker of qaCase.htmlMarkers) {
    if (!visibleText.includes(marker)) {
      throw new Error(`result HTML missing marker: ${marker}`);
    }
  }

  assertNoForbiddenText(visibleText, forbiddenVisibleMarkers, "result HTML");
}

function normalizeVisibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function assertNoForbiddenText(
  text: string,
  markers: readonly string[],
  label: string,
): void {
  for (const marker of markers) {
    if (text.includes(marker)) {
      throw new Error(`${label} contains forbidden marker: ${marker}`);
    }
  }
}

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${String(expected)}, received ${String(actual)}`);
  }
}

function assertHasKey(
  value: Record<string, unknown>,
  key: string,
  label: string,
): void {
  if (!(key in value)) {
    throw new Error(`${label} is missing`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function runLaunchQaCase(qaCase: LaunchQaCase): Promise<void> {
  const body = await postCreateReport(qaCase.payload);
  assertCaseBody(body, qaCase);

  const html = await getReportHtml(body.reportId);
  assertResultHtml(html, qaCase);

  process.stdout.write(
    `PASS product=${qaCase.productSlug} fixture=${qaCase.fixtureId} reportId=${body.reportId}\n`,
  );
}

async function main(): Promise<void> {
  const cases = createLaunchQaCases();
  if (cases.length !== expectedLaunchQaCaseCount) {
    process.exitCode = 1;
    process.stderr.write(
      `FAIL expected ${expectedLaunchQaCaseCount} launch QA cases, received ${cases.length}\n`,
    );
    return;
  }

  let passed = 0;
  let failed = 0;

  for (const qaCase of cases) {
    try {
      await runLaunchQaCase(qaCase);
      passed += 1;
    } catch (error) {
      failed += 1;
      process.stderr.write(
        `FAIL product=${qaCase.productSlug} fixture=${qaCase.fixtureId} reason=${
          error instanceof Error ? error.message : String(error)
        }\n`,
      );
    }
  }

  if (failed > 0) {
    process.exitCode = 1;
  }

  process.stdout.write(
    `launch QA matrix complete: passed=${passed} failed=${failed} total=${cases.length}\n`,
  );
}

main().catch((error: unknown) => {
  process.exitCode = 1;
  process.stderr.write(
    `FAIL launch QA matrix ${error instanceof Error ? error.message : String(error)}\n`,
  );
});
