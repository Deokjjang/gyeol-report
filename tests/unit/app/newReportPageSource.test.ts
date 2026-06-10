import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pagePath = join(process.cwd(), "src/app/report/new/page.tsx");
const pageSource = readFileSync(pagePath, "utf8");
const pageSourceWithoutDevTossLauncher = pageSource
  .replace(
    /import DevTossCheckoutLauncher from "\.\.\/\.\.\/\.\.\/components\/payment\/DevTossCheckoutLauncher";\r?\n\r?\n/,
    "",
  )
  .replace("{currentStep === 3 ? <DevTossCheckoutLauncher /> : null}", "");

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
    ];

    for (const fieldName of fieldNames) {
      expect(pageSource).toContain(fieldName);
    }
  });

  it("has required fixed values", () => {
    expect(pageSource).toContain('"SOLAR"');
    expect(pageSource).toContain('value="Asia/Seoul"');
  });

  it("calls create report API", () => {
    expect(pageSource).toContain('fetch("/api/reports/create"');
  });

  it("keeps create report API request flow", () => {
    expect(pageSource).toContain('fetch("/api/reports/create"');
    expect(pageSource).toContain("const json = (await response.json())");
    expect(pageSource).toContain("setReport(json.report)");
    expect(pageSource).toContain("shouldScrollToResultRef.current = true");
  });

  it("renders env-gated mock one-report payment choices", () => {
    const mockPaymentMarkers = [
      "NEXT_PUBLIC_MOCK_PAID_REPORT_UI_ENABLED",
      "/api/reports/mock-paid-complete",
      "mockPaymentMethod",
      "toss",
      "kakao_pay",
      "Toss로 결제 테스트",
      "KakaoPay로 결제 테스트",
      "리포트 1개당 1회 결제",
      "정식 결제 전 테스트용 결제 흐름입니다",
      "sharePath",
      "window.location.assign(json.sharePath)",
      "결제 테스트를 완료하지 못했습니다",
    ];

    for (const marker of mockPaymentMarkers) {
      expect(pageSource).toContain(marker);
    }
  });

  it("renders error and preview text", () => {
    expect(pageSource).toContain("리포트 생성에 실패했습니다.");
    expect(pageSource).toContain("무료 미리보기 생성");
    expect(pageSource).toContain("생성 중...");
    expect(pageSource).toContain("report.titleKo");
    expect(pageSource).toContain("report.subtitleKo");
    expect(pageSource).toContain("report.notices");
  });

  it("renders product preview header copy", () => {
    expect(pageSource).toContain("결리포트 미리보기");
    expect(pageSource).toContain("샘플 리포트를 생성합니다");
    expect(pageSource).toContain(
      "무료 미리보기에서는 핵심 구조 일부를 먼저 확인할 수 있습니다.",
    );
    expect(pageSource).toContain(
      "전체 리포트는 정식 결제 연동 이후 제공됩니다.",
    );
    expect(pageSource).toContain(
      "결제 후 전체 리포트를 받아보는 구조로 준비 중입니다.",
    );
    expect(pageSource).toContain(
      "현재는 결제 전 테스트용 무료 미리보기만 확인할 수 있습니다.",
    );
    expect(pageSource).not.toContain(
      "전체 리포트 영역은 " + "정식 결제 연동 이후 제공됩니다.",
    );
    expect(pageSource).toContain("자기이해용 참고자료");
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
      "확인 후 생성",
      "다음",
      "이전",
    ];

    for (const marker of stepMarkers) {
      expect(pageSource).toContain(marker);
    }

    expect(pageSource).toContain(
      "모바일에서 한 단계씩 입력한 뒤 무료 미리보기를 생성합니다.",
    );
    expect(pageSource).toContain(
      "현재 테스트 버전에서는 무료 미리보기를 생성합니다.",
    );
    expect(pageSource).toContain(
      "정식 버전에서는 결제 후 전체 리포트가 생성됩니다.",
    );
    expect(pageSource).toContain("이름");
    expect(pageSource).toContain(
      "리포트에서 불러드릴 이름입니다. 사주 계산에는 사용하지 않습니다.",
    );
    expect(pageSource).toContain("예: 덕짱");
    expect(pageSource).toContain("미입력");
    expect(pageSource).toContain("displayName");
    expect(pageSource).not.toContain("이름 또는 " + "닉네임");
    expect(pageSource).not.toContain("이름/" + "닉네임");
    expect(pageSource).toContain("양력 기준 생년월일");
    expect(pageSource).toContain(
      "현재 V1은 양력 기준 생년월일만 지원합니다.",
    );
    expect(pageSource).toContain("음력 생일 입력은 추후 지원 예정입니다.");
    expect(pageSource).toContain(
      "예: 1996-12-06 형식으로 입력해 주세요.",
    );
    expect(pageSource).toContain("날짜 선택");
    expect(pageSource).toContain("colorScheme");
    expect(pageSource).toContain("dark");
    expect(pageSource).toContain("정확한 시간");
    expect(pageSource).toContain("대략적인 시간대");
    expect(pageSource).toContain("출생시간 모름");
    expect(pageSource).toContain("시간 선택");
    expect(pageSource).toContain("시간대를 선택해 주세요");
    expect(pageSource).toContain(
      "출생시간을 입력하거나, 대략적인 시간대 또는 모름을 선택해 주세요.",
    );
    expect(pageSource).toContain(
      "예: 오후 3시 12분이면 15:12로 입력해 주세요.",
    );
    expect(pageSource).toContain(
      "출생시간을 모르면 시주 없이 일부 해석이 제한될 수 있습니다.",
    );
    expect(pageSource).toContain(
      "MBTI는 내가 생각하는 나의 모습이 반영될 수 있습니다.",
    );
    expect(pageSource).toContain(
      "가능하면 여러 번의 검사 결과나 가까운 사람의 피드백도 함께 참고해 주세요.",
    );
  });

  it("renders traditional time branch and midnight warning copy", () => {
    const branchMarkers = [
      "자시 23:00~00:59",
      "진시 07:00~08:59",
      "유시 17:00~18:59",
      "해시 21:00~22:59",
    ];

    for (const marker of branchMarkers) {
      expect(pageSource).toContain(marker);
    }

    expect(pageSource).toContain(
      "자정 전후 출생은 날짜 기준에 따라 일주·시주 해석이 달라질 수 있습니다.",
    );
    expect(pageSource).toContain(
      "가능하면 가족에게 실제 출생일과 시간을 다시 확인해 주세요.",
    );
    expect(pageSource).toContain("입력 정보 확인");
    expect(pageSource).toContain("달력 기준");
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

  it("keeps calendar payload solar-only without active lunar selector", () => {
    expect(pageSource).toContain("calendarType");
    expect(pageSource).toContain("SOLAR");
    expect(pageSource).toContain('name="calendarType"');
    expect(pageSource).toContain('value="SOLAR"');
    expect(pageSource).not.toContain('value="' + "LUNAR" + '"');
    expect(pageSource).not.toContain("value='" + "LUNAR" + "'");
    expect(pageSource).not.toContain('calendarType: "' + "LUNAR" + '"');
    expect(pageSource).not.toContain("calendarType: '" + "LUNAR" + "'");
  });

  it("renders loading state copy and disables submit", () => {
    expect(pageSource).toContain("isSubmitting");
    expect(pageSource).toContain("disabled={isSubmitting || isMockPaymentSubmitting}");
    expect(pageSource).toContain("리포트 생성 중...");
    expect(pageSource).toContain(
      "사주 구조와 MBTI 입력값을 함께 정리하고 있습니다.",
    );
  });

  it("renders calm creation error copy", () => {
    expect(pageSource).toContain("function getReportCreationErrorMessage");
    expect(pageSource).toContain("리포트 생성에 실패했습니다.");
    expect(pageSource).toContain(
      "입력한 생년월일, 출생시간, MBTI를 다시 확인해 주세요.",
    );
    expect(pageSource).toContain("잠시 후 다시 시도해 주세요.");
    expect(pageSource).toContain(
      "현재 입력값은 자동 계산 범위에서 처리하지 못했습니다.",
    );
    expect(pageSource).toContain(
      "일시적인 연결 문제로 리포트를 만들지 못했습니다.",
    );
    expect(pageSource).toContain(
      "입력 정보를 고친 뒤 무료 미리보기를 다시 생성해 주세요.",
    );
    expect(pageSource).not.toContain(".stack");
    expect(pageSource).not.toContain("JSON.stringify(error)");
  });

  it("renders report creation success note", () => {
    expect(pageSource).toContain("생성된 미리보기");
    expect(pageSource).toContain(
      "아래에서 무료 미리보기 결과를 확인할 수 있습니다.",
    );
    expect(pageSource).toContain("샘플 리포트가 생성되었습니다.");
    expect(pageSource).toContain("아래 내용은 자기이해용 참고자료입니다.");
  });

  it("renders four pillars manse card source", () => {
    const manseCardMarkers = [
      "function getPillarCardItems",
      "function renderPillarManseCard",
      "만세력 카드",
      "사주 네 기둥",
      "생년월일시를 바탕으로 계산된 네 기둥입니다.",
      "일주는 리포트에서 나를 보는 기준점으로 사용합니다.",
      "일주는 나를 보는 기준점입니다.",
      "년주",
      "월주",
      "일주",
      "시주",
      "천간",
      "지지",
      "출생시간 모름",
    ];

    for (const marker of manseCardMarkers) {
      expect(pageSource).toContain(marker);
    }

    expect(pageSource).toContain('section.id === "SAJU_CORE"');
    expect(pageSource).toContain('block.kind === "KEY_VALUE"');
    expect(pageSource).toContain("renderPillarManseCard(report)");
  });

  it("supports mobile result scroll and quick navigation", () => {
    const resultNavigationMarkers = [
      "useRef",
      "scrollIntoView",
      "resultRef",
      "shouldScrollToResultRef",
      "결과 빠른 이동",
      "무료 미리보기",
      "전체 리포트 잠금",
      "리포트 개요",
      "한눈에 보는 나의 결",
      "report-section-INTRO",
      "report-section-QUICK_SUMMARY",
    ];

    for (const marker of resultNavigationMarkers) {
      expect(pageSource).toContain(marker);
    }
  });

  it("supports report block source types", () => {
    expect(pageSource).toContain("type ReportBlock");
    expect(pageSource).toContain("keyValues");
    expect(pageSource).toContain("itemsKo");
    expect(pageSource).toContain("bodyKo");
  });

  it("has a report block render helper", () => {
    expect(pageSource).toContain("function renderReportBlock");
    expect(pageSource).toContain('block.kind === "KEY_VALUE"');
    expect(pageSource).toContain('block.kind === "BULLET_LIST"');
    expect(pageSource).toContain('block.kind === "WARNING"');
    expect(pageSource).toContain('block.kind === "HIGHLIGHT"');
  });

  it("supports rich report block kinds", () => {
    expect(pageSource).toContain('block.kind === "KEY_VALUE"');
    expect(pageSource).toContain('block.kind === "BULLET_LIST"');
    expect(pageSource).toContain('block.kind === "WARNING"');
    expect(pageSource).toContain('block.kind === "HIGHLIGHT"');
    expect(pageSource).toContain("block.bodyKo");
    expect(pageSource).toContain('className="text-sm leading-6 text-neutral-300"');
  });

  it("keeps rich report block field rendering", () => {
    expect(pageSource).toContain("block.titleKo");
    expect(pageSource).toContain("block.bodyKo");
    expect(pageSource).toContain("block.itemsKo");
    expect(pageSource).toContain("item.keyKo");
    expect(pageSource).toContain("item.valueKo");
  });

  it("renders block-level titles", () => {
    expect(pageSource).toContain("const title = block.titleKo");
    expect(pageSource).toContain("{block.titleKo}");
    expect(pageSource).toContain("{title}");
  });

  it("renders key value object fields", () => {
    expect(pageSource).toContain("item.keyKo");
    expect(pageSource).toContain("item.valueKo");
    expect(pageSource).not.toContain("keyValues.map(([");
  });

  it("renders list items", () => {
    expect(pageSource).toContain("block.itemsKo");
    expect(pageSource).toContain("block.itemsKo.map");
    expect(pageSource).toContain("{item}");
  });

  it("renders all report sections", () => {
    expect(pageSource).toContain("report.sections.map");
    expect(pageSource).toContain("renderReportBlock");
    expect(pageSource).not.toContain("slice(0, 5)");
  });

  it("defines report preview gating modes", () => {
    expect(pageSource).toContain("REPORT_PREVIEW_MODE");
    expect(pageSource).toContain('"dev_full"');
    expect(pageSource).toContain('"gated_preview"');
    expect(pageSource).toContain(
      'const REPORT_PREVIEW_MODE = "gated_preview" as const',
    );
    expect(pageSource).not.toContain(
      'const REPORT_PREVIEW_MODE = "dev_full" as const',
    );
  });

  it("defines section body access helper", () => {
    expect(pageSource).toContain("function canShowSectionBody");
    expect(pageSource).toContain('mode === "dev_full"');
    expect(pageSource).toContain('level === "FREE_PREVIEW"');
  });

  it("keeps locked paid section copy and CTA available", () => {
    const activePurchaseMarkers = [
      "결제" + "하기",
      "구매" + "하기",
      "지금 " + "구매",
      "바로 " + "결제",
      "유료 " + "결제 시작",
    ];

    for (const marker of activePurchaseMarkers) {
      expect(pageSource).not.toContain(marker);
    }

    expect(pageSource).toContain("function getLockedSectionTeaser");
    expect(pageSource).toContain("function renderLockedSectionBody");
    expect(pageSource).toContain("renderLockedSectionBody(section)");
    expect(pageSource).toContain("section.titleKo");
    expect(pageSource).toContain("전체 리포트 잠금");
    expect(pageSource).toContain("정식 결제 연동 후 제공 예정");
    expect(pageSource).toContain("오행 밸런스, 보완 루틴, 추천 색상·공간");
    expect(pageSource).toContain("일의 방식, 자원 관리, 관계·연애 패턴");
    expect(pageSource).toContain("입력 MBTI와 사주 구조의 공통점과 차이");
    expect(pageSource).not.toContain("전체 리포트 확인하기");
  });

  it("renders global paid teaser once outside compact locked cards", () => {
    const globalTeaserMarkers = [
      "전체 리포트에서는 무료 미리보기에서 보인 핵심 구조를 바탕으로",
      "정식 버전에서는 결제 후 전체 리포트가 생성되고, 공유 링크로 같은 리포트를 다시 열 수 있습니다.",
      "공유 링크로 가족, 연인, 친구에게 같은 결과를 보여줄 수 있습니다.",
      "오행, 십성, 신살·귀인, 일·돈·관계 활용",
      "전체 리포트에서 이어지는 내용",
      "오행 보완 루틴",
      "십성 기반 일·돈·관계 해석",
      "신살·귀인 반복 신호 해석",
      "사주×MBTI 차이와 조절 포인트",
      "결제 기능은 아직 준비 중입니다. 현재는 무료 미리보기만 확인할 수 있습니다.",
    ];

    for (const marker of globalTeaserMarkers) {
      expect(pageSource).toContain(marker);
    }

    const resultNavigationIndex = pageSource.indexOf(
      'aria-label="결과 빠른 이동"',
    );
    const globalTeaserIndex = pageSource.indexOf(
      "전체 리포트에서 이어지는 내용",
    );
    const inactiveNoticeIndex = pageSource.indexOf("결제 비활성 안내");
    const lockedCardSource = pageSource.slice(
      pageSource.indexOf("function renderLockedSectionBody"),
      pageSource.indexOf("function renderReportBlock"),
    );

    expect(resultNavigationIndex).toBeGreaterThanOrEqual(0);
    expect(globalTeaserIndex).toBeGreaterThan(resultNavigationIndex);
    expect(globalTeaserIndex).toBeLessThan(inactiveNoticeIndex);
    expect(lockedCardSource).toContain("전체 리포트 잠금");
    expect(lockedCardSource).toContain("정식 결제 연동 후 제공 예정");
    expect(lockedCardSource).not.toContain("전체 리포트에서 이어지는 내용");
    expect(lockedCardSource).not.toContain("lockedValuePoints.map");
    expect(pageSource.match(/전체 리포트에서 이어지는 내용/g)).toHaveLength(1);
    expect(pageSource).toContain(
      "결제 기능은 아직 준비 중입니다. 현재는 무료 미리보기만 확인할 수 있습니다.",
    );
  });

  it("uses gated preview as the public default", () => {
    expect(pageSource).toContain('"gated_preview"');
    expect(pageSource).toContain('level === "FREE_PREVIEW"');
    expect(pageSource).not.toContain(
      'const REPORT_PREVIEW_MODE = "dev_full" as const',
    );
  });

  it("renders payment inactive guard copy", () => {
    const guardMarkers = [
      "결제 비활성 안내",
      "현재 실제 결제는 아직 활성화되어 있지 않습니다.",
      "무료 미리보기에서는 핵심 구조 일부를 먼저 확인할 수 있습니다.",
      "전체 리포트는 정식 결제 연동 이후 제공됩니다.",
      "정식 결제 연동 후 제공 예정",
    ];

    for (const marker of guardMarkers) {
      expect(pageSource).toContain(marker);
    }
  });

  it("keeps section heading outside gated body rendering", () => {
    expect(pageSource).toContain("section.titleKo");
    expect(pageSource).toContain("section.summaryKo");
    expect(pageSource).toContain("canShowSectionBody(");
    expect(pageSource).toContain("shouldShowSectionBody");
    expect(pageSource).toContain("renderLockedSectionBody(section)");
  });

  it("uses product-style section card structure", () => {
    expect(pageSource).toContain("report.sections.map");
    expect(pageSource).toContain("rounded-lg");
    expect(pageSource).toContain("border border-neutral-800");
    expect(pageSource).toContain("section.titleKo");
    expect(pageSource).toContain("section.summaryKo");
    expect(pageSource).toContain("space-y-5");
  });

  it("does not render raw section id as visible label", () => {
    expect(pageSource).toContain("key={section.id}");
    expect(pageSource).not.toContain("{section.id}</");
  });

  it("renders section level pills", () => {
    expect(pageSource).toContain("FREE_PREVIEW");
    expect(pageSource).toContain("무료 미리보기");
    expect(pageSource).toContain("전체 리포트");
    expect(pageSource).not.toContain("{section.level}</");
    expect(pageSource).not.toContain('>"PAID_FULL"<');
  });

  it("renders public gated preview notice", () => {
    const normalizedSource = pageSource.replace(/\s+/g, " ");

    expect(normalizedSource).toContain(
      "무료 미리보기에서는 핵심 구조 일부를 먼저 확인할 수 있습니다. 전체 리포트는 정식 결제 연동 이후 제공됩니다.",
    );
    expect(pageSource).not.toContain(
      "전체 리포트 영역은 " + "정식 결제 연동 이후 제공됩니다.",
    );
    expect(pageSource).not.toContain("개발용 오류");
    expect(pageSource).not.toContain("미리보기 오류");
  });

  it("does not intentionally truncate long report content", () => {
    expect(pageSource).not.toContain("line-clamp");
    expect(pageSource).not.toContain("truncate");
  });

  it("does not include persistence auth payment or LLM markers", () => {
    const markers = [
      "supabase",
      "paymentIntent",
      "paddle",
      "check" + "out",
      "providerPayment",
      "login",
      "auth",
      "openai",
      "llm",
      "localStorage",
      "sessionStorage",
      "router.push",
    ];
    const lowerSource = pageSourceWithoutDevTossLauncher.toLowerCase();

    for (const marker of markers) {
      expect(lowerSource).not.toContain(marker.toLowerCase());
    }
  });

  it("does not include payment implementation markers", () => {
    const markers = [
      "create" + "Payment",
      "confirm" + "Payment",
      "To" + "ss" + "Payments",
      "Pad" + "dle",
      "KakaoPay API",
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
    ];

    for (const marker of markers) {
      expect(pageSource).not.toContain(marker);
    }
  });

  it("does not include wallet recharge point balance or unsafe payment markers", () => {
    const blockedSourceMarkers = [
      "wallet",
      "recharge",
      "point balance",
      "credit balance",
      "충전",
      "잔액",
      "/api/payments",
      "/api/reports/unlock",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "access" + "TokenHash",
      "access" + "_token" + "_hash",
      "payment" + "Provider" + "Payment" + "Id",
      "payment" + "_provider" + "_payment" + "_id",
      "console" + ".log",
    ];

    for (const marker of blockedSourceMarkers) {
      expect(pageSource).not.toContain(marker);
    }

    const mockPaymentUiStart = pageSource.indexOf(
      "currentStep === 3 && MOCK_PAID_REPORT_UI_ENABLED",
    );
    const mockPaymentUiEnd = pageSource.indexOf(
      '<div className="grid gap-3 sm:grid-cols-2">',
      mockPaymentUiStart + 1,
    );

    expect(mockPaymentUiStart).toBeGreaterThanOrEqual(0);
    expect(mockPaymentUiEnd).toBeGreaterThan(mockPaymentUiStart);
    expect(pageSource.slice(mockPaymentUiStart, mockPaymentUiEnd)).not.toContain(
      "포인트",
    );
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
