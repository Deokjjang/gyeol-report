import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pagePath = join(process.cwd(), "src/app/report/new/page.tsx");
const pageSource = readFileSync(pagePath, "utf8");

describe("new report page source", () => {
  it("is a client component", () => {
    expect(pageSource).toContain('"use client";');
  });

  it("has required form field names", () => {
    const fieldNames = [
      'name="birthDate"',
      'name="birthTimeUnknown"',
      'name="birthTime"',
      'name="gender"',
      'name="mbtiType"',
      'name="calendarType"',
      'name="timezone"',
      'name="displayName"',
      'name="productKey"',
      'name="productSlug"',
      'name="productName"',
    ];

    for (const fieldName of fieldNames) {
      expect(pageSource).toContain(fieldName);
    }
  });

  it("keeps supported fixed values", () => {
    expect(pageSource).toContain('"SOLAR"');
    expect(pageSource).toContain('value="Asia/Seoul"');
  });

  it("renders paid-first input confirmation and product summary", () => {
    const requiredMarkers = [
      "종합 리포트 입력",
      "상담이 아닌 참고용 리포트",
      "입력값 최종 확인",
      "입력한 정보로 전체 리포트를 생성합니다.",
      "결제 승인 후 리포트가 생성되며, 결과는 온라인 열람 페이지로 제공됩니다.",
      "전체 리포트",
      "종합 리포트",
      "정가 1,290원",
      "런칭가 990원",
      "결제금액 990원",
      "자동 생성 디지털 리포트",
      "정식 결제 연결 준비 중입니다.",
      "리포트 생성을 위해 필요한 정보를 먼저 입력해 주세요.",
      "onEditInput",
    ];

    for (const marker of requiredMarkers) {
      expect(pageSource).toContain(marker);
    }
  });

  it("keeps career money study product selection as a non-payment input branch", () => {
    const requiredMarkers = [
      "CAREER_MONEY_STUDY_PRODUCT_KEY",
      "career_money_study",
      "CAREER_MONEY_STUDY_PRODUCT_SLUG",
      "career-money-study",
      "resolveSelectedReportProduct",
      "DEFAULT_SELECTED_REPORT_PRODUCT",
      "CAREER_MONEY_STUDY_SELECTED_REPORT_PRODUCT",
      "직업·커리어·돈·학업 리포트 입력",
      "직업, 커리어, 돈, 학업 흐름을 한 사람 기준으로 보는 리포트입니다.",
      "현재 연애 상태, 직업 상태, 세부 직업, 관심 영역은 계산 원인이 아니라 해석을 현실 장면으로 바꾸는 참고 정보입니다.",
      "/dev/career-report-preview?fixture=deokmin-career",
      "준비 중 · 미리보기 가능",
      "isSinglePersonPreviewProduct",
      "getSingleProductLeadText",
      "getSingleProductDevPreviewHref",
      "isSelectedProductPurchasable",
    ];

    for (const marker of requiredMarkers) {
      expect(pageSource).toContain(marker);
    }
  });

  it("keeps love marriage child product selection as a non-payment input branch", () => {
    const requiredMarkers = [
      "LOVE_MARRIAGE_CHILD_PRODUCT_KEY",
      "love_marriage_child",
      "LOVE_MARRIAGE_CHILD_PRODUCT_SLUG",
      "love-marriage-child",
      "LOVE_MARRIAGE_CHILD_SELECTED_REPORT_PRODUCT",
      "연애·결혼·자녀 리포트 입력",
      "나의 연애, 결혼, 부모 역할 성향을 한 사람 기준으로 보는 리포트입니다.",
      "현재 연애 상태, 직업 상태, 세부 직업, 관심 영역은 계산 원인이 아니라 해석을 현실 장면으로 바꾸는 참고 정보입니다.",
      "/dev/love-marriage-child-report-preview?fixture=deokmin-love",
      "미리보기 입력 흐름",
      "준비 중 · 미리보기 가능",
      "productSlug === LOVE_MARRIAGE_CHILD_PRODUCT_SLUG",
      "return LOVE_MARRIAGE_CHILD_SELECTED_REPORT_PRODUCT",
      "return DEFAULT_SELECTED_REPORT_PRODUCT",
    ];

    for (const marker of requiredMarkers) {
      expect(pageSource).toContain(marker);
    }
  });

  it("renders the shared solo-person input branch for preview single products", () => {
    const requiredMarkers = [
      "isSinglePersonPreviewProduct(selectedProduct.productKey)",
      "singleProductInput",
      "setSingleProductInput",
      "isSingleProductInputReady",
      "singleProductCtaLabel",
      "renderSingleProductCommonInputSection",
      "현재 연애 상태, 직업 상태, 세부 직업, 관심 영역은 계산 원인이 아니라 해석을 현실 장면으로 바꾸는 참고 정보입니다.",
      "공통 입력값",
      "모든 단독 인물 리포트가 공유하는 기본 정보입니다.",
      'name="name"',
      'name="birthDate"',
      'name="birthTime"',
      'name="timeBranch"',
      'name="birthTimeUnknown"',
      'name="gender"',
      'name="mbtiType"',
      'name="relationshipStatus"',
      'name="jobStatus"',
      'name="detailedJob"',
      'name="focusAreas"',
      "현재 연애 상태",
      "직업 상태",
      "세부 직업",
      "관심 영역",
      "입력 확인 요약",
      "기본 정보",
      "현재 맥락",
      "상품 정보",
      "productKey:",
      "productSlug:",
      "미리보기 준비됨",
      "필수 정보를 입력해 주세요",
      "현재 입력값으로 실제 리포트를 생성하지 않습니다.",
      "실제 생성, 결제, 저장은 이후 단계에서 연결합니다.",
      "event.preventDefault()",
    ];

    for (const marker of requiredMarkers) {
      expect(pageSource).toContain(marker);
    }

    expect(
      pageSource.indexOf("isSinglePersonPreviewProduct(selectedProduct.productKey)"),
    ).toBeLessThan(pageSource.indexOf("<DevTossCheckoutLauncher"));
  });

  it("keeps compatibility product selection as a non-payment skeleton", () => {
    const requiredMarkers = [
      "COMPATIBILITY_PRODUCT_KEY",
      "saju_mbti_compatibility",
      "COMPATIBILITY_PRODUCT_SLUG",
      "compatibility",
      "COMPATIBILITY_SELECTED_REPORT_PRODUCT",
      "selectedProduct.productKey === COMPATIBILITY_PRODUCT_KEY",
      "궁합 리포트 입력",
      "두 사람의 생년월일, 출생시간, MBTI, 관계 카테고리",
      "바탕으로 궁합 리포트를 구성합니다.",
      "상담이나 예언이 아닌 관계 분석용 디지털 리포트입니다.",
      "전용 흐름으로 연결될 예정입니다.",
      "productSlug === COMPATIBILITY_PRODUCT_SLUG",
      "return COMPATIBILITY_SELECTED_REPORT_PRODUCT",
      "return DEFAULT_SELECTED_REPORT_PRODUCT",
      "isSelectedProductPurchasable",
      "isPurchasable: false",
      "궁합 리포트 미리보기 준비됨",
      "필수 정보를 입력해 주세요",
    ];

    for (const marker of requiredMarkers) {
      expect(pageSource).toContain(marker);
    }
  });

  it("keeps major fortune product selection as a non-payment input branch", () => {
    const requiredMarkers = [
      "MAJOR_FORTUNE_PRODUCT_KEY",
      "major_fortune",
      "MAJOR_FORTUNE_PRODUCT_SLUG",
      "major-fortune",
      "MAJOR_FORTUNE_SELECTED_REPORT_PRODUCT",
      "대운 리포트 입력",
      "대운은 입력된 생년월일과 출생시간 기반의 10년 흐름을 보는 리포트입니다.",
      "현재 연애 상태, 직업 상태, 세부 직업, 관심 영역은 계산 원인이 아니라 해석을 현실 장면으로 바꾸는 참고 정보입니다.",
      "실제 생성/결제 연결은",
      "준비 중입니다.",
      "/dev/major-fortune-preview?fixture=deokmin-current-major-fortune",
      "미리보기 입력 흐름",
      "준비 중 · 미리보기 가능",
      "productSlug === MAJOR_FORTUNE_PRODUCT_SLUG",
      "return MAJOR_FORTUNE_SELECTED_REPORT_PRODUCT",
      "return DEFAULT_SELECTED_REPORT_PRODUCT",
      "isSelectedProductPurchasable",
      "isPurchasable: false",
      "selectedProduct.productKey === MAJOR_FORTUNE_PRODUCT_KEY",
      "대운 리포트 미리보기 준비됨",
      "필수 정보를 입력해 주세요",
    ];

    for (const marker of requiredMarkers) {
      expect(pageSource).toContain(marker);
    }
  });

  it("renders major fortune input branch with common solo-person fields and summary", () => {
    const requiredMarkers = [
      "MajorFortuneInputState",
      "majorFortuneInput",
      "setMajorFortuneInput",
      "createMajorFortuneInputState",
      "isMajorFortuneRequiredInputComplete",
      "formatAnnualBirthTimeSummary",
      "formatAnnualRelationshipStatus",
      "formatAnnualJobStatus",
      "toggleAnnualFocusArea",
      "annualRelationshipStatusOptions",
      "annualJobStatusOptions",
      "annualDetailedJobOptions",
      "annualFocusAreaOptions",
      "공통 입력값",
      "모든 단독 인물 리포트가 공유하는 기본 정보입니다.",
      'name="name"',
      'name="birthDate"',
      'name="birthTime"',
      'name="timeBranch"',
      'name="birthTimeUnknown"',
      'name="gender"',
      'name="mbtiType"',
      'name="relationshipStatus"',
      'name="jobStatus"',
      'name="detailedJob"',
      'name="focusAreas"',
      "현재 연애 상태",
      "직업 상태",
      "세부 직업",
      "관심 영역",
      "대운 리포트 기준",
      "별도 추가 질문 없이 공통 입력값을 기준으로 10년 흐름",
      "입력 확인 요약",
      "기본 정보",
      "현재 맥락",
      "상품 정보",
      "productKey:",
      "productSlug:",
      "대운 리포트 미리보기 준비됨",
      "필수 정보를 입력해 주세요",
      "현재 입력값으로 실제 리포트를 생성하지 않습니다.",
      "실제 생성, 결제, 저장은 이후 단계에서 연결합니다.",
      "/dev/major-fortune-preview?fixture=deokmin-current-major-fortune",
      "event.preventDefault()",
    ];

    for (const marker of requiredMarkers) {
      expect(pageSource).toContain(marker);
    }

    expect(
      pageSource.indexOf("selectedProduct.productKey === MAJOR_FORTUNE_PRODUCT_KEY"),
    ).toBeLessThan(pageSource.indexOf("<DevTossCheckoutLauncher"));
  });

  it("keeps annual fortune product selection as a non-payment input branch", () => {
    const requiredMarkers = [
      "ANNUAL_FORTUNE_PRODUCT_KEY",
      "annual_fortune",
      "ANNUAL_FORTUNE_PRODUCT_SLUG",
      "annual-fortune",
      "ANNUAL_FORTUNE_SELECTED_REPORT_PRODUCT",
      "세운 리포트 입력",
      "세운은 선택한 한 해의 흐름을 보는 리포트입니다.",
      "현재 연애 상태, 직업 상태, 세부 직업, 관심 영역은 계산 원인이 아니라 해석을 현실 장면으로 바꾸는 참고 정보입니다.",
      "실제 생성/결제 연결은",
      "준비 중입니다.",
      "/dev/annual-fortune-preview?fixture=deokmin-2026-current",
      "미리보기 입력 흐름",
      "준비 중 · 미리보기 가능",
      "productSlug === ANNUAL_FORTUNE_PRODUCT_SLUG",
      "return ANNUAL_FORTUNE_SELECTED_REPORT_PRODUCT",
      "return DEFAULT_SELECTED_REPORT_PRODUCT",
      "isSelectedProductPurchasable",
      "isPurchasable: false",
      "selectedProduct.productKey === ANNUAL_FORTUNE_PRODUCT_KEY",
      "세운 리포트 미리보기 준비됨",
      "필수 정보를 입력해 주세요",
    ];

    for (const marker of requiredMarkers) {
      expect(pageSource).toContain(marker);
    }
  });

  it("renders annual fortune input branch fields, selected year, and handoff summary", () => {
    const requiredMarkers = [
      "AnnualFortuneInputState",
      "annualFortuneInput",
      "setAnnualFortuneInput",
      "createAnnualFortuneInputState",
      "isAnnualFortuneRequiredInputComplete",
      "formatAnnualBirthTimeSummary",
      "formatAnnualRelationshipStatus",
      "formatAnnualJobStatus",
      "toggleAnnualFocusArea",
      "annualRelationshipStatusOptions",
      "annualJobStatusOptions",
      "annualDetailedJobOptions",
      "annualFocusAreaOptions",
      "공통 입력값",
      "모든 단독 인물 리포트가 공유하는 기본 정보입니다.",
      'name="name"',
      'name="birthDate"',
      'name="birthTime"',
      'name="timeBranch"',
      'name="birthTimeUnknown"',
      'name="gender"',
      'name="mbtiType"',
      'name="relationshipStatus"',
      'name="jobStatus"',
      'name="detailedJob"',
      'name="focusAreas"',
      'name="selectedYear"',
      "현재 연애 상태",
      "직업 상태",
      "세부 직업",
      "관심 영역",
      "선택 입력입니다. 직업, 돈, 연애, 관계, 건강관리, 공부,",
      "세운 전용 조회 연도",
      "기본값은 현재 연도입니다.",
      "과거 5년과 올해",
      "12월 1일 이후에는 다음 해 신년사주 preview",
      "2년 이상 미래 조회는 아직 준비 중",
      "과거 10년 조회는",
      "입력 확인 요약",
      "현실 맥락",
      "조회 연도",
      "productKey:",
      "productSlug:",
      "세운 리포트 미리보기 준비됨",
      "필수 정보를 입력해 주세요",
      "현재 입력값으로 실제 리포트를 생성하지 않습니다.",
      "실제 생성, 결제, 저장은 이후 단계에서 연결합니다.",
      "/dev/annual-fortune-preview?fixture=deokmin-2026-current",
      "event.preventDefault()",
    ];

    for (const marker of requiredMarkers) {
      expect(pageSource).toContain(marker);
    }

    const removedMarkers = [
      "currentConcern",
      'name="currentConcern"',
      "현재 고민",
      "관심 분야 또는 현재 고민",
      "currentJob",
      'name="currentJob"',
      "현재 직업/상태",
      "자녀 계획",
      "자녀 유무",
      "결혼 상태",
    ];

    for (const marker of removedMarkers) {
      expect(pageSource).not.toContain(marker);
    }

    expect(
      pageSource.indexOf("selectedProduct.productKey === ANNUAL_FORTUNE_PRODUCT_KEY"),
    ).toBeLessThan(pageSource.indexOf("<DevTossCheckoutLauncher"));
  });

  it("renders compatibility A/B input branch fields and relationship categories", () => {
    const requiredMarkers = [
      "renderCompatibilityPersonInputSection",
      "CompatibilityPersonInputState",
      "compatibilityPersonA",
      "compatibilityPersonB",
      "compatibilityRelationshipType",
      "isCompatibilityPersonRequiredInputComplete",
      "A 사람 입력",
      "B 사람 입력",
      "첫 번째 사람의 기본 정보를 입력합니다.",
      "두 번째 사람의 기본 정보를 입력합니다.",
      "이름",
      "생년월일",
      "출생시간",
      "대략적인 시간대",
      "출생시간 모름",
      "성별",
      "MBTI",
      'name="relationshipType"',
      'value: "love"',
      'labelKo: "연애"',
      'value: "marriage"',
      'labelKo: "결혼"',
      'value: "parentChild"',
      'labelKo: "부모·자식"',
      'value: "coworker"',
      'labelKo: "직장 동료"',
      'value: "managerReport"',
      'labelKo: "상사·부하"',
      'value: "businessPartner"',
      'labelKo: "사업·협업"',
      'value: "friendship"',
      'labelKo: "친구·인간관계"',
      "/dev/compatibility-preview?fixture=deokmin-sodam-love",
    ];

    for (const marker of requiredMarkers) {
      expect(pageSource).toContain(marker);
    }

    expect(
      pageSource.indexOf("selectedProduct.productKey === COMPATIBILITY_PRODUCT_KEY"),
    ).toBeLessThan(pageSource.indexOf("<DevTossCheckoutLauncher"));
  });

  it("renders compatibility preview handoff summary without API or payment calls", () => {
    const requiredMarkers = [
      "입력 확인 요약",
      "실제 생성 전 단계",
      "현재 입력값이 어떤 궁합 context로",
      "A 사람",
      "B 사람",
      "관계 카테고리",
      "상품 context",
      "productKey:",
      "productSlug:",
      "formatCompatibilityBirthTimeSummary",
      "formatCompatibilityRelationshipLabel",
      "isCompatibilityInputReady",
      "compatibilityCtaLabel",
      "궁합 리포트 미리보기 준비됨",
      "필수 정보를 입력해 주세요",
      "현재 입력값으로 실제 리포트를 생성하지 않습니다.",
      "추후 입력값 기반 preview generation 예정",
      "fixture preview",
      "event.preventDefault()",
    ];

    for (const marker of requiredMarkers) {
      expect(pageSource).toContain(marker);
    }
  });

  it("passes actual form state into the Toss checkout launcher", () => {
    const requiredMarkers = [
      "createCheckoutInputSnapshot",
      "DevTossCheckoutInputSnapshot",
      "checkoutInputSnapshot",
      "isDevTossCheckoutInputComplete(checkoutInputSnapshot)",
      "mbti: input.mbtiType",
      "gender: input.gender",
      'timezone: "Asia/Seoul"',
      "birthDate: input.birthDate",
      "birthTime: input.birthTime ??",
      'calendarType: "SOLAR"',
      "birthTimeUnknown: input.birthTimeUnknown",
      "displayName: trimmedDisplayName",
      "inputSnapshot={checkoutInputSnapshot}",
    ];

    for (const marker of requiredMarkers) {
      expect(pageSource).toContain(marker);
    }
  });

  it("renders creation form helper copy", () => {
    const stepMarkers = [
      "1단계",
      "2단계",
      "3단계",
      "4단계",
      "생년월일",
      "출생시간",
      "성별·MBTI",
      "확인 후 결제",
      "다음",
      "이전",
      "이름",
      "리포트에서 불러드릴 이름입니다. 사주 계산에는 사용하지 않습니다.",
      "예: 덕짱",
      "미입력",
      "양력 기준 생년월일",
      "현재 V1은 양력 기준 생년월일만 지원합니다.",
      "음력 생일 입력은 추후 지원 예정입니다.",
      "예: 1996-12-06 형식으로 입력해 주세요.",
      "날짜 선택",
      "colorScheme",
      "dark",
      "정확한 시간",
      "대략적인 시간대",
      "출생시간 모름",
      "시간 선택",
      "시간대를 선택해 주세요",
      "출생시간을 입력하거나, 대략적인 시간대 또는 모름을 선택해 주세요.",
      "예: 오후 3시 12분이면 15:12로 입력해 주세요.",
      "출생시간을 모르면 시주 없이 일부 해석이 제한될 수 있습니다.",
      "MBTI는 내가 생각하는 나의 모습이 반영될 수 있습니다.",
    ];

    for (const marker of stepMarkers) {
      expect(pageSource).toContain(marker);
    }
  });

  it("renders traditional time branch and midnight warning copy", () => {
    const branchMarkers = [
      "자시 23:00~00:59",
      "진시 07:00~08:59",
      "유시 17:00~18:59",
      "해시 21:00~22:59",
      "자정 전후 출생은 날짜 기준에 따라 일주·시주 해석이 달라질 수 있습니다.",
      "가능하면 가족에게 실제 출생일과 시간을 다시 확인해 주세요.",
      "달력",
    ];

    for (const marker of branchMarkers) {
      expect(pageSource).toContain(marker);
    }
  });

  it("renders user-facing confirmation summary helpers", () => {
    const summaryMarkers = [
      "function formatGenderLabel",
      "function formatCalendarTypeLabel",
      "function formatBirthTimeSummary",
      "남성",
      "여성",
      "양력",
      "선택 안 함",
      "정확한 시간 ·",
      "대략적인 시간대 ·",
      "출생시간 모름",
      "기준",
    ];

    for (const marker of summaryMarkers) {
      expect(pageSource).toContain(marker);
    }
  });

  it("guards checkout until required input is present", () => {
    const requiredMarkers = [
      "isBirthTimeStepValid",
      "이름과 생년월일을 입력해 주세요.",
      "성별과 MBTI를 선택해 주세요.",
      "isCheckoutInputComplete",
      "REQUIRED_CHECKOUT_INPUT_MESSAGE_KO",
    ];

    for (const marker of requiredMarkers) {
      expect(pageSource).toContain(marker);
    }
  });

  it("does not keep preview or report generation as the primary flow", () => {
    const blockedMarkers = [
      "무료 미리보기 생성",
      "결제 " + "비활성 안내",
      'fetch("/api/reports/create"',
      "/api/reports/mock-paid-complete",
      "window.location.assign",
      "sharePath",
      "setReport(",
      "생성된 미리보기",
      "아래에서 무료 미리보기 결과를 확인할 수 있습니다.",
    ];

    for (const marker of blockedMarkers) {
      expect(pageSource).not.toContain(marker);
    }
  });

  it("does not include unsafe payment or paid-report implementation markers", () => {
    const blockedSourceMarkers = [
      "/v1/" + "payments/confirm",
      "payment" + "Key",
      "provider" + "Payment" + "Id",
      "provider" + "_payment" + "_id",
      "checkout" + "Url",
      "TOSS" + "_SECRET" + "_KEY",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "access" + "TokenHash",
      "share" + "Token",
      "report" + "_snapshot",
      "mark" + "Paid",
      "wallet",
      "recharge",
      "point balance",
      "credit balance",
      "충전",
      "포인트",
      "잔액",
      "console" + ".log",
    ];

    for (const marker of blockedSourceMarkers) {
      expect(pageSource).not.toContain(marker);
    }
  });

  it("does not include unsafe exact wording", () => {
    const forbiddenWords = [
      "무" + "조건",
      "반" + "드시",
      "운" + "명",
      "죽" + "음",
      "사고가 " + "난다",
      "병에 " + "걸린다",
      "건강에 " + "위험하다",
      "바람기가 " + "있다",
      "돈복이 " + "있다",
      "결혼" + "한다",
      "망" + "한다",
      "절" + "대",
      "항" + "상",
      "틀" + "렸다",
    ];

    for (const word of forbiddenWords) {
      expect(pageSource).not.toContain(word);
    }
  });

  it("is deterministic when read repeatedly", () => {
    const again = readFileSync(pagePath, "utf8");

    expect(again).toBe(pageSource);
  });
});
