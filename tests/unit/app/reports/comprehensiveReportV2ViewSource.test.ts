import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const viewSource = readFileSync(
  join(process.cwd(), "src/app/reports/[reportId]/ComprehensiveReportV2View.tsx"),
  "utf8",
);

describe("comprehensive report v2 view source", () => {
  it("renders common ManseRyeok and MBTI table slots", () => {
    expect(viewSource).toContain("ManseRyeokCommonTable");
    expect(viewSource).toContain("MbtiCommonProfileTable");
    expect(viewSource).toContain("buildManseRyeokCommonTableData");
    expect(viewSource).toContain("buildMbtiCommonProfileTableData");
    expect(viewSource).toContain('variant="compact"');
    expect(viewSource).toContain("defaultOpen={false}");
    expect(viewSource).toContain("기초 정보");
    expect(viewSource).toContain("만세력표와 MBTI 성향표는 해석의 근거입니다");
    expect(viewSource).not.toContain('eyebrow="공통 정보"');
    expect(viewSource).toContain("나의 만세력");
    expect(viewSource).toContain("시주·일주·월주·연주가 모두 연결된 결과");
    expect(viewSource).toContain("hasCompletePillarGrid");
    expect(viewSource).not.toContain("lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]");
  });

  it("renders sajuFeatureChapter as a separate prose chapter", () => {
    expect(viewSource).toContain("sajuFeatureChapter");
    expect(viewSource).toContain("내 사주의 주요 표식 해석");
    expect(viewSource).toContain("쉬운 뜻");
    expect(viewSource).toContain("나에게 드러나는 방식");
    expect(viewSource).toContain("잘 쓰면 강점");
    expect(viewSource).toContain("과하면 피로");
    expect(viewSource).toContain("실제로 쓰는 법");
    expect(viewSource).toContain("buildFeatureClosingLine");
    expect(viewSource).toContain("buildQuickFeatureLine");
    expect(viewSource).toContain("buildFeatureCategoryLabel");
    expect(viewSource).toContain("groupQuickFeatureItems");
    expect(viewSource).toContain("화개·화개살");
    expect(viewSource).toContain("화개와 화개살은 혼자 깊게 정리할 때");
    expect(viewSource).toContain("{item.rawLabel}");
    expect(viewSource).not.toContain("{buildFeatureCategoryLabel(item.rawLabel)} · {item.rawLabel}");
    expect(viewSource).toContain("돈이 저절로 쌓인다는 뜻이 아니라");
    expect(viewSource).toContain("말의 순서를 바꾸라는 뜻");
    expect(viewSource).toContain("숨은 역할과 회복 포인트");
    expect(viewSource).toContain("아래 표식은 사건 예언이 아니라");
    expect(viewSource).toContain("급한 상황에서는 빨리 움직이지만");
    expect(viewSource).toContain("표현의 선을 더 신경");
  });

  it("renders a five-element energy interpretation section", () => {
    expect(viewSource).toContain("오행 분포로 보는 에너지 구조");
    expect(viewSource).toContain("buildFiveElementEnergyItems");
    expect(viewSource).toContain("목은 방향성과 성장");
    expect(viewSource).toContain("화는 말의 온도");
    expect(viewSource).toContain("토는 현실을 붙잡고");
    expect(viewSource).toContain("금은 기준, 판단");
    expect(viewSource).toContain("수는 생각을 식히고");
  });

  it("renders longform readings and bridge-friendly prose sections", () => {
    expect(viewSource).toContain("longformReadings");
    expect(viewSource).toContain("전체 성향 핵심부터 읽기");
    expect(viewSource).toContain("명리 구조와 MBTI 행동 발현");
    expect(viewSource).toContain("LongformBody");
    expect(viewSource).toContain("오늘부터 바꿀 기준");
    expect(viewSource).toContain(".slice(0, 6)");
    expect(viewSource).toContain("공부와 일 루틴");
    expect(viewSource).toContain("돈은 공격 계획과 방어 계획");
    expect(viewSource).not.toContain("흐름별 핵심 장면");
    expect(viewSource).not.toContain("장문형 V2");
    expect(viewSource).not.toContain("Preview ID");
  });

  it("uses ivory, wine, and gold premium tone markers", () => {
    expect(viewSource).toContain("bg-[#fffdf8]");
    expect(viewSource).toContain("bg-[#fffaf1]");
    expect(viewSource).toContain("text-[#6f1d35]");
    expect(viewSource).toContain("text-[#8b6d2d]");
    expect(viewSource).toContain("border-[#d7b56d]");
    expect(viewSource).not.toContain("bg-neutral-950");
    expect(viewSource).not.toContain("bg-neutral-900");
  });

  it("keeps mobile overflow and blocked copy defenses visible in source", () => {
    expect(viewSource).toContain("min-w-0 overflow-hidden");
    expect(viewSource).toContain("break-words");
    expect(viewSource).not.toContain("source registry");
    expect(viewSource).not.toContain("placeholder");
    expect(viewSource).not.toContain("fallback");
    expect(viewSource).not.toContain("투자 수익 보장");
    expect(viewSource).not.toContain("합격 확정");
    expect(viewSource).not.toContain("승진 확정");
    expect(viewSource).not.toContain("이직 확정");
    expect(viewSource).not.toContain("결혼 확정");
    expect(viewSource).not.toContain("이혼 확정");
    expect(viewSource).not.toContain("임신/출산 확정");
    expect(viewSource).not.toContain("질병/사고/사망 예언");
  });
});
