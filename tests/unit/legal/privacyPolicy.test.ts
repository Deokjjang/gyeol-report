import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { INTERIM_TARGET } from "../../../src/lib/ops/generation/policy";

import {
  policyText,
  prePaymentPrivacyNoticeKo,
  privacyPolicyCollectionItems,
  privacyPolicyCollectionRows,
  privacyPolicyCookieRows,
  privacyPolicyDestructionItems,
  privacyPolicyMinorNoticeKo,
  privacyPolicyNoResidentRegistrationNumberKo,
  privacyPolicyOverseasHead,
  privacyPolicyOverseasRows,
  privacyPolicyPaymentNoticeKo,
  privacyPolicyProcessorRows,
  privacyPolicyPurposeItems,
  privacyPolicyRetentionRows,
  privacyPolicySections,
  privacyPolicySensitiveInfoLimitKo,
  privacyPolicyUnder14Ko,
} from "../../../src/lib/legal/privacyPolicy";
import { META_DEFAULT_FROM, metaChangeRows, metaOptInNotice, metaOptInTransferNotice, metaTrackingNotice, metaTransferNotice } from "../../../src/lib/analytics/metaConsent";

const copy = policyText(privacyPolicySections).join("\n");

describe("privacy policy (v5 최종3)", () => {
  it("법정 필수 항목을 모두 갖춘다", () => {
    expect(privacyPolicySections.map(s => s.titleKo.replace(/^\d+\. /, ""))).toEqual([
      "개인정보의 처리 목적", "처리하는 개인정보 항목", "개인정보의 보유 기간", "개인정보의 파기 절차와 방법", "개인정보의 제3자 제공",
      "개인정보 처리 위탁", "개인정보의 국외 이전", "정보주체의 권리와 행사 방법", "만 14세 미만 아동과 미성년자",
      "자동 수집 장치(쿠키 등)의 설치·운영과 거부", "개인정보의 안전성 확보 조치", "개인정보 보호책임자", "행태정보와 광고 성과 측정(Meta)",
      "권익침해 구제 방법", "자동화된 결정", "방침의 변경과 시행일",
    ]);
    expect(copy).toContain("개인정보 보호책임자: 장덕민(대표) · 이메일 support@gyeolreport.com · 전화 050-6664-8562");
    expect(copy).toContain("10일 안에 처리");
    for (const body of ["1833-6972", "118", "182"]) expect(copy).toContain(body);
    expect(copy).toMatch(/이 방침은 .+부터 시행합니다/);
  });

  it("수집 항목·목적: 이메일·로그인 식별자·현재 하는 일·연애 상태·궁합·선물·이용권·혜택 알림", () => {
    const items = privacyPolicyCollectionItems.join("\n");
    for (const item of ["이메일(필수 동의)", "로그인 식별자", "현재 하는 일", "연애 상태", "상대방의 이름", "선물을 보낸·받은 계정", "이용권 증정·사용·만료 기록", "혜택 알림 동의 여부"]) expect(items).toContain(item);
    expect(privacyPolicyCollectionRows.map(([source]) => source)).toContain("궁합 리포트 입력");
    for (const purpose of ["이용권 관리", "서비스 공지와 긴급 안내", "같은 사람의 이전 리포트 참조", "혜택 알림 보내기(새 책·이벤트·할인 소식, 따로 동의한 회원만)"]) expect(privacyPolicyPurposeItems.join("\n")).toContain(purpose);
  });

  it("보유 기간: 법정 기간과 리포트 버전별 열람", () => {
    const rows = Object.fromEntries(privacyPolicyRetentionRows.map(([k, v]) => [k, v]));
    expect(rows["계약 또는 청약철회 등에 관한 기록"]).toMatch(/^5년/);
    expect(rows["대금 결제 및 재화 등의 공급에 관한 기록"]).toMatch(/^5년/);
    expect(rows["소비자의 불만 또는 분쟁 처리에 관한 기록(문의·환불·재생성 요청)"]).toMatch(/^3년/);
    expect(rows["로그인 기록"]).toBe("3개월(통신비밀보호법)");
    expect(rows["리포트와 리포트 입력정보 — v5부터 발행한 리포트"]).toBe("회원 탈퇴, 삭제 요청, 서비스 종료 시까지");
    expect(rows["리포트와 리포트 입력정보 — v5 이전에 발행한 리포트"]).toBe("처음 발행일로부터 90일");
    expect(rows["회원 정보(로그인 식별자, 이름, 이메일, 휴대폰 번호, 카카오톡 채널 추가 상태, 혜택 알림 동의 여부)"]).toMatch(/^회원 탈퇴 시까지/);
  });

  it("P 추가(2026-11-06): 비회원 결제 항목·구매 연결 쿠키 없음, v5 이전 리포트 만료 뒤 법정 최소 기록 5년, 결제수단 토스페이·카카오페이", () => {
    expect(copy).not.toContain("비회원");
    expect(privacyPolicyCollectionRows.map(([source]) => source)).toContain("결제");
    expect(privacyPolicyCookieRows.map(([kind]) => kind)).not.toContain("비회원 구매 연결");
    const destruction = privacyPolicyDestructionItems.join("\n");
    expect(destruction).toContain("v5 이전 리포트는 열람 기간(90일)이 끝나면 원고와 입력정보(주문할 때 적은 이름 또는 닉네임, 생년월일, 출생시간 등)를 자동으로 지웁니다.");
    expect(destruction).toContain("주문번호·상품·결제 금액·결제 일시·처리 상태만 남겨 5년 동안 따로 보관하며, 이 기록은 서비스 화면에 보이지 않습니다.");
    expect(privacyPolicyPaymentNoticeKo).toContain("토스페이먼츠의 결제창에서 토스페이(주식회사 비바리퍼블리카) 또는 카카오페이(주식회사 카카오페이)로 합니다.");
    expect(privacyPolicyPaymentNoticeKo).toContain("회사는 결제수단 상세 정보를 저장하지 않습니다.");
    expect(privacyPolicyPaymentNoticeKo).not.toContain("카드번호");
    expect(copy).toContain("로그인하지 않고 예전에 산 리포트 포함");
  });

  it("외부 서비스는 실제 쓰는 것만(OpenAI는 임시본 레인 — 배포 명령 0-1), 국외 이전은 업체별 6칸", () => {
    // 운영 Q(2026-11-07 개정): 운영자 주문 알림 봇 Telegram이 위탁·국외 이전 끝에 한 줄씩.
    expect(privacyPolicyProcessorRows.map(([name]) => name)).toEqual(["토스페이먼츠(주)", "Supabase", "Anthropic", "OpenAI", "Vercel Inc.", "Telegram Messenger Inc."]);
    expect(privacyPolicyOverseasHead).toEqual(["이전받는 자 · 국가 · 연락처", "이전 항목", "이전 시기와 방법", "이용 목적", "보유·이용 기간", "거부 방법과 효과"]);
    expect(privacyPolicyOverseasRows.map(r => r[0].split(" · ")[0])).toEqual(["Anthropic, PBC", "OpenAI, LLC", "Supabase Pte. Ltd.", "Vercel Inc.", "Telegram Messenger Inc."]);
    for (const row of privacyPolicyOverseasRows) { expect(row).toHaveLength(6); for (const cell of row) expect(cell.length).toBeGreaterThan(5); }
    expect(privacyPolicyOverseasRows[2][0]).toContain("대한민국 서울");
    // OpenAI 행: 임시본 레인(코드가 실제로 OpenAI를 부르는 유일한 경로)·미국·입력 정보와 해석 근거·30일(남용 감시 기록, store: false).
    const openai = privacyPolicyOverseasRows[1];
    expect(INTERIM_TARGET.provider).toBe("openai");
    expect(readFileSync("src/lib/llm/providers.ts", "utf8")).toMatch(/endpoint: "https:\/\/api\.openai\.com\/v1\/responses"[\s\S]{0,400}store: false/);
    expect(openai[0]).toContain("미국"); expect(openai[1]).toContain("리포트 입력정보"); expect(openai[1]).toContain("계산된 명리 해석 근거");
    expect(openai[2]).toContain("Anthropic 장애"); expect(openai[4]).toContain("최대 30일");
    // Meta 문구·버전은 승인 항목이라 그대로 싣는다.
    expect(copy).toContain(metaTrackingNotice);
    expect(copy).toContain(metaTransferNotice);
  });

  it("시행일(덕짱님 결정 2026-11-09): 13번은 「12월 9일까지(지금 문구 그대로)」와 「12월 10일부터」 두 판 + 변경 안내 표(시행일·바뀌는 점·보내는 항목·목적·받는 자·거부 방법), 그리는 시각과 무관", () => {
    expect(META_DEFAULT_FROM).toBe("2026-12-10T00:00:00+09:00");
    const s13 = privacyPolicySections.find(s => s.titleKo.startsWith("13. "))!;
    const texts = s13.blocks.map(b => b.kind === "p" ? b.text : b.kind === "table" ? b.table.captionKo : "");
    expect(texts[0]).toMatch(/^광고 성과 측정 방식이 2026년 12월 10일 0시\(한국 시간\)부터 바뀝니다\. 2026년 12월 9일까지는 아래 「2026년 12월 9일까지」대로 동의한 경우에만 보내고, 2026년 12월 10일부터는 「2026년 12월 10일부터」대로 거부하지 않으면 기본으로 보냅니다\. 2026년 11월 9일부터 서비스 화면/);
    expect(texts.slice(1)).toEqual(["광고 성과 측정 변경 안내(2026년 12월 10일 시행)", `[2026년 12월 9일까지] ${metaOptInNotice}`, `[2026년 12월 9일까지 · Meta 제공·국외 이전] ${metaOptInTransferNotice}`,
      `[2026년 12월 10일부터] ${metaTrackingNotice}`, "2026년 12월 10일부터 광고 성과 측정으로 보내는 행태정보", `[2026년 12월 10일부터 · Meta 제공·국외 이전] ${metaTransferNotice}`]);
    expect(metaChangeRows.map(([k]) => k)).toEqual(["시행일", "바뀌는 점", "보내는 항목", "목적", "받는 자", "거부 방법"]);
    expect(metaChangeRows[0][1]).toBe("2026년 12월 10일(목) 0시(한국 시간)부터. 2026년 11월 9일부터 미리 알립니다.");
    expect(metaChangeRows[5][1]).toContain("지금 거부해 두면 12월 10일(목) 뒤에도 보내지 않습니다.");
    // 「12월 9일까지」 문구는 지금 운영 문구 그대로(v5/main dc5dc158) — 동의한 경우에만.
    expect(metaOptInNotice.startsWith("광고 성과 측정은 선택 사항입니다. 허용하면 ")).toBe(true);
    expect(metaOptInTransferNotice).toContain("위 측정 항목은 동의 후 이벤트 발생 시");
    // 정적으로 만든 화면이 시행일 앞뒤에 틀리지 않게: 「(현재」「예정」「지금은」처럼 시각에 따라 틀려지는 말을 13·16번에 쓰지 않는다(「현재 하는 일」 같은 항목 이름은 괜찮음).
    const s16 = privacyPolicySections.find(s => s.titleKo.startsWith("16. "))!;
    for (const block of [...s13.blocks, ...s16.blocks]) expect(JSON.stringify(block)).not.toMatch(/\(현재|확정 전|시행 예정|변경 예정|지금은/);
  });

  it("운영 Q(2026-11-07 개정): Telegram 행 — 목적·항목·보유·이전받는 자·국가·이전 방법(공식 문서 telegram.org/privacy·faq만)", () => {
    expect(privacyPolicyProcessorRows.at(-1)).toEqual(["Telegram Messenger Inc.", "운영자 주문 알림·문의 처리", "국외(아래 7번)"]);
    const [who, items, how, purpose, keep] = privacyPolicyOverseasRows.at(-1)!;
    expect(who).toMatch(/^Telegram Messenger Inc\. · 아랍에미리트\(두바이, 개발팀 소재\) 및 여러 나라의 데이터센터 · /);
    expect(items).toBe("주문코드, 상품, 금액, 결제 시각, 결제수단, 기기 정보");
    expect(how).toBe("알림이 생길 때 텔레그램 봇 API(HTTPS)로 전송");
    expect(purpose).toBe("운영자 주문 알림·문의 처리");
    expect(keep).toBe("처리 후 메시지 정리");
    // 리포트 입력정보(생년월일 등)·이름·연락처는 보내지 않는다(항목에 없음).
    for (const absent of ["생년월일", "이름", "이메일", "휴대폰"]) expect(items).not.toContain(absent);
  });

  it("「현재 버전에서」 같은 임시 문구가 없고, 나이·민감정보 안내는 그대로", () => {
    expect(copy).not.toContain("현재 버전에서");
    expect(privacyPolicyUnder14Ko).toBe("만 14세 미만은 서비스를 이용할 수 없습니다.");
    expect(privacyPolicyMinorNoticeKo).toContain("만 19세 미만 미성년자는 결제 시 법정대리인 동의가 필요하며");
    expect(privacyPolicySensitiveInfoLimitKo).toContain("건강정보, 질병정보, 정신질환 정보");
    expect(privacyPolicyNoResidentRegistrationNumberKo).toBe("회사는 주민등록번호를 수집하지 않습니다.");
    expect(prePaymentPrivacyNoticeKo).toBe("리포트 생성을 위해 이름 또는 닉네임, 생년월일, 출생시간, 성별, MBTI가 처리됩니다.");
  });

  it("does not use unsafe product claim wording", () => {
    for (const marker of ["적중률", "100% 맞춤", "보장", "반드시 성공", "운명 확정", "정신질환 분석", "우울증 분석", "불안장애 분석", "투자 추천"]) expect(copy).not.toContain(marker);
  });
});
