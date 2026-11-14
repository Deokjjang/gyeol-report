import { BookLegalPage } from "../../../src/components/book/BookLegalRoutes";
// Compare the retained legacy document branch with the V4 policy presentation.
vi.mock("../../../src/lib/book/publicGate", () => ({ bookExperiencePublicEnabled: () => false }));
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import Terms from "../../../src/app/terms/page";
import Privacy from "../../../src/app/privacy/page";
import Refund from "../../../src/app/refund/page";
import Business from "../../../src/app/business/page";
import LegacyTerms from "../../../src/app/legal/terms/page";
import LegacyPrivacy from "../../../src/app/legal/privacy/page";
import LegacyRefund from "../../../src/app/legal/refund/page";
import LegacyBusiness from "../../../src/app/legal/business-info/page";
import Footer from "../../../src/components/legal/BusinessFooter";
import { GYEOL_BUSINESS_INFO as business } from "../../../src/lib/legal/businessInfo";
import { termsPolicySections } from "../../../src/lib/legal/termsPolicy";
import * as privacy from "../../../src/lib/legal/privacyPolicy";
import { refundPolicyHistoryLinesKo, refundPolicyStateRows, refundPolicyRequiredNotices, refundPolicySupportRequestGuidanceKo } from "../../../src/lib/legal/refundPolicy";
import { LegalAccordion, LegalDocument } from "../../../src/app/dev/book-preview/BookLegal";
import { PreviewFooter } from "../../../src/app/dev/book-preview/BookPages";
import { REFUND_POLICY_TOP_LINES, SUPPORT_CHAT_LABEL, SUPPORT_CHAT_URL, SUPPORT_FOOTER_LINE } from "../../../src/lib/legal/socialLinks";

const pages = [["/terms", Terms, LegacyTerms], ["/privacy", Privacy, LegacyPrivacy],
  ["/refund", Refund, LegacyRefund], ["/business", Business, LegacyBusiness]] as const;
const text = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");

describe("legal document rendering", () => {
  it.each(pages)("%s preserves aliases, one main/H1 and current-page navigation", (path, Page, Legacy) => {
    const html = renderToStaticMarkup(<Page />);
    expect(Legacy).toBe(Page);
    expect(html.match(/<main\b/g)).toHaveLength(1);
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).not.toMatch(/<h[3-6]\b|<footer\b/);
    expect(html).toContain(`href="${path}" aria-current="page"`);
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    for (const href of ["/terms", "/privacy", "/refund", "/business", "/"]) {
      expect(html).toContain(`href="${href}"`);
    }
    expect(html).not.toContain("rounded-2xl");
    expect(html).not.toContain("확정 즉시 업데이트");
  });

  it("renders every terms clause and links to canonical details", () => {
    const html = renderToStaticMarkup(<Terms />);
    for (const section of termsPolicySections) {
      expect(html).toContain(`<h2>${section.titleKo}</h2>`);
      for (const paragraph of section.bodyKo) expect(text(html)).toContain(paragraph);
    }
    for (const condition of ["상품 페이지와 결제 화면에 표시된 금액", "30분 안에 제공하지 못하면 이용자가 요청하지 않아도 자동으로 전액 환불", "처음 발행일로부터 90일", "회원 탈퇴, 삭제 요청, 서비스 종료 시까지", "2026년 11월 30일 23:59:59까지", "만 19세 미만", "만 14세 미만", "고의 또는 중대한 과실", "7일 이내"]) {
      expect(text(html)).toContain(condition);
    }
    expect(html).not.toContain(business.businessAddressKo);
    expect(html).not.toContain("parentChild");
  });

  it("renders all ten refund states exactly once without duplicating the product catalog", () => {
    const html = renderToStaticMarkup(<Refund />);
    for (const row of refundPolicyStateRows) {
      expect(text(html).split(row.handlingKo)).toHaveLength(2);
      expect(text(html)).toContain(row.statusKo);
    }
    expect(text(html)).toContain(refundPolicyRequiredNotices[3]);
    expect(text(html)).toContain(refundPolicySupportRequestGuidanceKo);
    // P 추가: 환불정책도 약관·방침처럼 시행일과 변경 이력을 보인다.
    expect(html).toContain("<h2>시행일</h2>");
    for (const line of refundPolicyHistoryLinesKo) expect(text(html)).toContain(line);
    expect(html).toContain('href="/terms"');
    expect(html).not.toContain("판매 상품");
    expect(html).toContain('<th scope="row">');
  });

  it("preserves all privacy items, retention exceptions, overseas scope and rights", () => {
    const html = renderToStaticMarkup(<Privacy />);
    const content = text(html);
    // 최종3: 원문 sections의 모든 글(문단·목록·표 칸)이 그대로 보인다.
    for (const line of privacy.policyText(privacy.privacyPolicySections)) expect(content).toContain(line);
    expect(content).toContain(privacy.privacyPolicyMetaNoticeKo);
    expect(content).toContain(privacy.privacyPolicyMetaRetentionKo);
    expect(content).toContain("결제수단 상세 정보를 저장하지 않습니다.");
    expect(html.match(/<table\b/g)).toHaveLength(6); // 수집·보유·위탁·쿠키·광고 측정 변경 안내·12월 10일부터 행태정보(13번) 표, 국외 이전은 업체별 목록(dl)
    expect(html.match(/data-policy-rows/g)).toHaveLength(1);
    expect(html.match(/<h2\b/g)).toHaveLength(privacy.privacyPolicySections.length + 1);
    expect(content).toContain("행태정보와 광고 성과 측정(Meta)");
    // W3 P2: 대체 작가(OpenAI 임시본)가 없어져 위탁·국외 이전에서도 뺐다.
    expect(content).not.toContain("OpenAI, LLC"); expect(content).not.toMatch(/임시 리포트|임시본/); // 지난 판 변경 이력 한 줄에만 업체 이름이 기록으로 남는다
    expect(html).not.toContain("deterministic");
  });

  it("synchronizes business details and actionable contacts across every relevant surface", () => {
    for (const Page of [Business, Privacy, Refund, Footer]) {
      const html = renderToStaticMarkup(<Page />);
      expect(html).toContain('href="tel:050-6664-8562"');
      expect(html).toContain('href="mailto:support@gyeolreport.com"');
    }
    for (const Page of [Business, Footer]) {
      const html = renderToStaticMarkup(<Page />);
      for (const value of [business.businessName, business.representativeKo, business.businessRegistrationNumber,
        business.businessAddressKo, "2026-인천연수구-2118"]) expect(html).toContain(value);
    }
    const footer = renderToStaticMarkup(<Footer />);
    expect(footer).not.toContain("<dl");
    expect(footer).not.toContain("<details");
    expect(footer.match(/href="\/(terms|privacy|refund|business)"/g)).toHaveLength(4);
    expect(renderToStaticMarkup(<Business />)).toContain(business.hostingProvider);
  });

  it("has no obsolete business values anywhere in user-facing source", () => {
    function checkDirectory(directory: string) {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) checkDirectory(path);
        else if (/\.(tsx?|css|json)$/.test(entry.name)) {
          const source = readFileSync(path, "utf8");
          expect(source, path).not.toContain("010" + "-3156-8568");
          expect(source, path).not.toContain("신고 진행" + " 중");
        }
      }
    }
    checkDirectory(join(process.cwd(), "src"));
  });

  it("provides scoped focus, wrapping, reduced-motion and readable document styles", () => {
    const css = readFileSync("src/components/legal/legal.module.css", "utf8");
    for (const marker of [":focus-visible", "prefers-reduced-motion", "overflow-wrap: anywhere", "font-size: 16px", "min-height: 44px"]) expect(css).toContain(marker);
    expect(css).not.toMatch(/transition:\s*all|animation:/);
  });
});

describe("current V4 legal presentation", () => {
  it.each([0, 1, 2, 3])("document %i opens its own accordion and preserves all policy text", index => {
    const html = renderToStaticMarkup(<BookLegalPage index={index} />);
    expect(html.match(/<main\b/g)).toHaveLength(1);
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    const panels = [...html.matchAll(/<details([^>]*)>/g)];
    expect(panels).toHaveLength(4);
    expect(panels.map(panel => panel[1].includes("open"))).toEqual([0, 1, 2, 3].map(i => i === index));
    for (const section of termsPolicySections) for (const paragraph of section.bodyKo) expect(text(html)).toContain(paragraph);
    for (const row of refundPolicyStateRows) expect(text(html)).toContain(row.handlingKo);
    for (const line of refundPolicyHistoryLinesKo) expect(text(html)).toContain(line);
    for (const line of privacy.policyText(privacy.privacyPolicySections)) expect(text(html)).toContain(line);
    expect(text(html)).toContain("support@gyeolreport.com");
    expect(html).toContain('href="http://pf.kakao.com/_sbHaX/chat"');
  });
});

// 운영 Q 1부: 고객에게 보이는 문의·환불 안내는 네 곳만(① 푸터 한 줄 ② 환불정책 맨 위 3줄 ③ 서재 문의 창 아래 1줄 ④ 결제 동의 칸 옆 링크).
// 여기서는 책 화면의 ①·②와, 그 밖의 정책 화면에서 같은 안내·상담 전화가 빠졌는지 본다(③은 OrderParts, ④는 checkoutReceipt 시험).
describe("운영 Q: 문의·환불 안내 자리", () => {
  const paragraphs = (html: string) => [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => text(m[1]).trim());
  it("② 환불정책 문서 맨 위 3줄 = REFUND_POLICY_TOP_LINES, 셋째 줄 끝에 카카오톡 채널 링크 — 「문의 방법」 절·전화·이메일은 없다", () => {
    const html = renderToStaticMarkup(<LegalDocument index={2} />);
    expect(REFUND_POLICY_TOP_LINES).toHaveLength(3);
    expect(paragraphs(html).slice(0, 3)).toEqual([REFUND_POLICY_TOP_LINES[0], REFUND_POLICY_TOP_LINES[1], `${REFUND_POLICY_TOP_LINES[2]} ${SUPPORT_CHAT_LABEL} ↗`]);
    expect(html).toContain(`<a href="${SUPPORT_CHAT_URL}" target="_blank" rel="noopener noreferrer">${SUPPORT_CHAT_LABEL} ↗</a>`);
    expect(html).not.toContain("<h3>문의 방법</h3>");
    for (const gone of [refundPolicySupportRequestGuidanceKo, business.customerServicePhone, business.supportContactEmail, "고객센터"]) expect(text(html)).not.toContain(gone);
    // 환불 기준(열 가지 상태)·시행일·변경 이력은 그대로.
    for (const row of refundPolicyStateRows) expect(text(html)).toContain(row.handlingKo);
    for (const line of refundPolicyHistoryLinesKo) expect(text(html)).toContain(line);
  });
  it("정책 화면 머리말·푸터의 정책 창에는 「고객 문의는 카카오톡…」 줄이 없다(푸터 한 줄과 겹침)", () => {
    for (const index of [0, 1, 2, 3]) {
      const html = renderToStaticMarkup(<BookLegalPage index={index} />);
      expect(html).not.toContain("고객 문의는 카카오톡 채널 채팅으로 받고 있습니다");
      expect(html).toMatch(/<h1>[^<]+<\/h1><details/);
    }
    const sheet = renderToStaticMarkup(<LegalAccordion publicPresentation />);
    expect(sheet).not.toContain("고객 문의는 카카오톡 채널 채팅으로 받고 있습니다");
    expect(sheet.match(new RegExp(`href="${SUPPORT_CHAT_URL}"`, "g"))).toHaveLength(1); // 환불정책 맨 위 3줄의 링크 하나
  });
  it("① 푸터: SUPPORT_FOOTER_LINE 한 줄(예전 두 줄 대신), 사업자 정보의 법정 전화번호는 그대로, 전화·메일 링크 없음", () => {
    const html = renderToStaticMarkup(<PreviewFooter publicPresentation />);
    expect(SUPPORT_FOOTER_LINE).toBe("환불 신청과 책 문의는 내 서재에서 할 수 있어요. 상담원 문의는 카카오톡 채널 채팅으로 받고 있어요. 전화 상담은 제공하지 않아요.");
    expect(html.split(SUPPORT_FOOTER_LINE)).toHaveLength(2);
    for (const gone of ["전화 상담은 제공하지 않습니다.", "고객 문의는 카카오톡 채널 채팅으로 받고 있습니다."]) expect(html).not.toContain(gone);
    expect(html).toContain(`<dt>고객센터</dt><dd>${business.customerServicePhone}</dd>`);
    expect(html).not.toMatch(/href="(?:tel:|mailto:)/);
  });
  it("개인정보처리방침(책 화면): 끝의 「개인정보 문의처」(고객센터 전화) 줄은 없고, 권리 행사(8번)·보호책임자(12번) 연락처는 원문 그대로", () => {
    const html = renderToStaticMarkup(<LegalDocument index={1} />);
    expect(html).not.toContain("개인정보 문의처");
    expect(text(html)).toContain(privacy.privacyPolicyOfficerKo);
    expect(text(html)).toContain(privacy.privacyPolicyRightsItems[1]);
  });
});
