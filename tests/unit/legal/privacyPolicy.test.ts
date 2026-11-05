import { describe, expect, it } from "vitest";

import {
  policyText,
  prePaymentPrivacyNoticeKo,
  privacyPolicyCollectionItems,
  privacyPolicyCollectionRows,
  privacyPolicyMinorNoticeKo,
  privacyPolicyNoResidentRegistrationNumberKo,
  privacyPolicyOverseasHead,
  privacyPolicyOverseasRows,
  privacyPolicyProcessorRows,
  privacyPolicyPurposeItems,
  privacyPolicyRetentionRows,
  privacyPolicySections,
  privacyPolicySensitiveInfoLimitKo,
  privacyPolicyUnder14Ko,
} from "../../../src/lib/legal/privacyPolicy";
import { metaTrackingNotice, metaTransferNotice } from "../../../src/lib/analytics/metaConsent";

const copy = policyText(privacyPolicySections).join("\n");

describe("privacy policy (v5 최종3)", () => {
  it("법정 필수 항목을 모두 갖춘다", () => {
    expect(privacyPolicySections.map(s => s.titleKo.replace(/^\d+\. /, ""))).toEqual([
      "개인정보의 처리 목적", "처리하는 개인정보 항목", "개인정보의 보유 기간", "개인정보의 파기 절차와 방법", "개인정보의 제3자 제공",
      "개인정보 처리 위탁", "개인정보의 국외 이전", "정보주체의 권리와 행사 방법", "만 14세 미만 아동과 미성년자",
      "자동 수집 장치(쿠키 등)의 설치·운영과 거부", "개인정보의 안전성 확보 조치", "개인정보 보호책임자", "광고 성과 측정 (선택)",
      "권익침해 구제 방법", "자동화된 결정", "방침의 변경과 시행일",
    ]);
    expect(copy).toContain("개인정보 보호책임자: 장덕민(대표) · 이메일 support@gyeolreport.com · 전화 050-6664-8562");
    expect(copy).toContain("10일 안에 처리");
    for (const body of ["1833-6972", "118", "182"]) expect(copy).toContain(body);
    expect(copy).toMatch(/이 방침은 .+부터 시행합니다/);
  });

  it("수집 항목·목적: 이메일·로그인 식별자·현재 하는 일·연애 상태·궁합·선물·이용권·혜택 알림", () => {
    const items = privacyPolicyCollectionItems.join("\n");
    for (const item of ["이메일(필수 동의)", "로그인 식별자", "현재 하는 일", "연애 상태", "상대방의 이름", "선물을 보낸·받은 계정", "이용권 지급·사용·만료 기록", "혜택 알림 동의 여부"]) expect(items).toContain(item);
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

  it("외부 서비스는 실제 쓰는 것만(OpenAI 없음), 국외 이전은 업체별 6칸", () => {
    expect(privacyPolicyProcessorRows.map(([name]) => name)).toEqual(["토스페이먼츠(주)", "Supabase", "Anthropic", "Vercel Inc."]);
    expect(copy).not.toMatch(/OpenAI/i);
    expect(privacyPolicyOverseasHead).toEqual(["이전받는 자 · 국가 · 연락처", "이전 항목", "이전 시기와 방법", "이용 목적", "보유·이용 기간", "거부 방법과 효과"]);
    expect(privacyPolicyOverseasRows.map(r => r[0].split(" · ")[0])).toEqual(["Anthropic, PBC", "Supabase Pte. Ltd.", "Vercel Inc."]);
    for (const row of privacyPolicyOverseasRows) { expect(row).toHaveLength(6); for (const cell of row) expect(cell.length).toBeGreaterThan(5); }
    expect(privacyPolicyOverseasRows[1][0]).toContain("대한민국 서울");
    // Meta 문구·버전은 승인 항목이라 그대로 싣는다.
    expect(copy).toContain(metaTrackingNotice);
    expect(copy).toContain(metaTransferNotice);
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
