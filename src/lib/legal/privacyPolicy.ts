/**
 * 개인정보처리방침 원문(v5 최종3). 화면 두 곳(/privacy 예전 문서 화면, 책 화면의 정책 문서)이 이 sections를 그대로 그린다.
 * 항목·위탁·국외 이전·보관 기간은 코드에서 실제로 쓰는 것만 적는다(추출 표: docs/v5/final3/legal-ops-report.md).
 * 문구를 바꾸면 CHECKOUT_POLICY_VERSIONS.privacy를 올린다(회원 재동의). 예외: 운영 Q(2026-11-07)·광고 측정 기본 허용(결정 A, 2026-11-09) 개정은 덕짱님 결정으로 문서 개정 공지만(동의 버전 그대로, policyVersions.ts).
 * Meta 광고 측정 문구는 analytics/metaConsent 한 곳에서 고친다(광고 설정 창과 13번이 같은 문장).
 */
import { GYEOL_BUSINESS_INFO as business } from "./businessInfo";
import { POLICY_EFFECTIVE_DATES_KO, POLICY_HISTORY } from "./policyVersions";
import { META_DEFAULT_FROM_KO, META_NOTICE_FROM_KO, META_OPTIN_UNTIL_KO, metaBehaviorRows, metaChangeRows, metaOptInNotice, metaOptInTransferNotice, metaTrackingNotice, metaTransferNotice } from "../analytics/metaConsent";
import { META_OPTOUT_POLICY_EFFECTIVE_DATE_KO } from "./policyVersions";

export type PolicyTable = { readonly captionKo: string; readonly head: readonly string[]; readonly rows: readonly (readonly string[])[] };
export type PolicyBlock =
  | { readonly kind: "p"; readonly text: string }
  | { readonly kind: "ul"; readonly items: readonly string[] }
  | { readonly kind: "table"; readonly table: PolicyTable };
export type PolicySection = { readonly titleKo: string; readonly blocks: readonly PolicyBlock[] };
const p = (text: string): PolicyBlock => ({ kind: "p", text });
const ul = (...items: string[]): PolicyBlock => ({ kind: "ul", items });
const table = (captionKo: string, head: readonly string[], rows: readonly (readonly string[])[]): PolicyBlock => ({ kind: "table", table: { captionKo, head, rows } });
/** 문서 한 편의 모든 글(시험·검사용): 문단·목록·표 칸. */
export const policyText = (sections: readonly PolicySection[]) => sections.flatMap(s => [s.titleKo, ...s.blocks.flatMap(b => b.kind === "p" ? [b.text] : b.kind === "ul" ? b.items : [b.table.captionKo, ...b.table.head, ...b.table.rows.flat()])]);

export const privacyPolicyProcessingScopeKo =
  `${business.businessName}(이하 "회사")는 결리포트 서비스를 운영하면서 아래 목적에 필요한 범위에서만 개인정보를 처리하고, 개인정보 보호법 등 관련 법령을 지킵니다.`;

/** 1. 처리 목적 */
export const privacyPolicyPurposeItems = [
  "회원 가입·로그인과 회원 식별",
  "리포트(책) 만들기와 열람 제공",
  "결제 처리, 주문 확인, 영수증 안내",
  "이용권 관리(증정·사용·선물·만료)",
  "환불·재생성 요청과 고객 문의 처리",
  "서비스 공지와 긴급 안내(제작 지연, 장애, 정책 변경 등 꼭 알려야 하는 안내)",
  "같은 사람의 이전 리포트 참조(같은 계정에서 이름·생년월일·출생시간이 같은 사람의 이전 리포트와 표현이 겹치지 않게 하기)",
  "혜택 알림 보내기(새 책·이벤트·할인 소식, 따로 동의한 회원만)",
  "광고 성과 측정(아래 13번, 「광고 설정」에서 거부할 수 있음)",
  "부정 이용 방지, 서비스 안정성 확보, 법령에 따른 기록 보존",
] as const;

/** 2. 처리 항목(수집 경로별). */
export const privacyPolicyCollectionRows = [
  ["카카오 로그인", "카카오 회원 식별자(로그인 식별자), 이메일(필수 동의), 닉네임, 이메일 확인 여부, 카카오톡 채널(결리포트) 추가 상태(선택 동의)"],
  ["Google 로그인", "Google 계정 식별자(로그인 식별자), 이메일, 이름, 이메일 확인 여부"],
  ["가입 정보 입력", "이름(필수), 이메일(필수), 휴대폰 번호(선택), 혜택 알림 동의 여부와 동의·철회 일시(선택)"],
  ["약관 동의", "동의한 문서와 버전, 동의 일시"],
  ["리포트 입력", "이름 또는 닉네임, 생년월일, 출생시간(모르면 입력하지 않음), 성별, MBTI(선택), 현재 하는 일(직업 상태·하는 일, 선택), 연애 상태(선택), 관심 분야(선택), 세운 리포트의 「이루고 싶은 것이나 요즘 고민」(선택, 200자 이내 — 리포트를 쓰는 자료로만 쓰며 다른 입력값과 같은 기간 보관·삭제)"],
  ["궁합 리포트 입력", "관계 종류, 상대방의 이름 또는 닉네임·생년월일·출생시간·성별·MBTI"],
  ["이용권·선물", "이용권 증정·사용·만료 기록(장수, 증정 사유, 만든 상품과 책), 선물을 보낸·받은 계정, 선물 링크(원문 대신 암호화한 값), 받은 일시, 가입 이용권을 받은 로그인 계정의 되돌릴 수 없게 바꾼 값(로그인 제공자와 회원번호로 만든 해시 — 같은 사람에게 두 번 주지 않기 위해, 원래 값·이메일은 남기지 않음)"],
  ["결제", "주문코드·주문번호, 상품, 결제 금액, 결제 승인·취소·환불 기록, 결제 키, 영수증 주소, 구매자 이름·이메일·휴대폰 번호(선택), 결제 전 동의 기록(동의 항목·문서 버전·일시, 만 14세 이상·미성년 여부)"],
  ["문의·요청", "요청 종류(책이 안 나오거나 안 열림, 두 번 결제), 접수할 때의 기기·브라우저 종류(예: 아이폰 사파리), 처리 방법과 처리 기록"],
  ["자동 수집", "최근 로그인 일시, 리포트 생성·열람 기록, 쿠키·브라우저 저장소 값(아래 10번), 서비스 이용 중 서버가 받는 접속 정보(IP 주소, 브라우저 정보, 요청 주소), 광고 성과 측정용 행태정보(아래 13번)"],
] as const;
/** 화면 요약·시험용: 항목 열만. */
export const privacyPolicyCollectionItems = privacyPolicyCollectionRows.map(([, items]) => items);

export const privacyPolicyPaymentNoticeKo =
  "결제는 결제대행사 토스페이먼츠의 결제창에서 토스페이(주식회사 비바리퍼블리카) 또는 카카오페이(주식회사 카카오페이)로 합니다. 결제수단 정보는 이 회사들이 처리하며, 회사는 결제수단 상세 정보를 저장하지 않습니다.";
export const privacyPolicyPartnerConsentKo =
  "궁합 상대·선물을 받을 사람의 정보는 그 사람에게 동의를 받은 뒤 입력해 주세요. 회사는 입력한 상대 정보를 리포트를 만들고 보여 주는 데만 씁니다.";
export const privacyPolicySensitiveInfoLimitKo =
  "회사는 건강정보, 질병정보, 정신질환 정보, 정치적 견해, 종교, 성생활 정보, 범죄경력 등 민감정보 입력을 요구하지 않습니다. 문의 과정이나 세운 리포트의 「이루고 싶은 것이나 요즘 고민」 칸에 건강·금융처럼 민감한 내용은 적지 않아도 됩니다.";
export const privacyPolicyNoResidentRegistrationNumberKo = "회사는 주민등록번호를 수집하지 않습니다.";

/** 3. 보유 기간. 리포트 열람은 버전별(v5 이전 90일 / v5부터 탈퇴·삭제 요청·서비스 종료 시까지). */
export const privacyPolicyRetentionRows = [
  ["회원 정보(로그인 식별자, 이름, 이메일, 휴대폰 번호, 카카오톡 채널 추가 상태, 혜택 알림 동의 여부)", "회원 탈퇴 시까지(탈퇴하면 바로 삭제)"],
  ["리포트와 리포트 입력정보 — v5부터 발행한 리포트", "회원 탈퇴, 삭제 요청, 서비스 종료 시까지"],
  ["리포트와 리포트 입력정보 — v5 이전에 발행한 리포트", "처음 발행일로부터 90일"],
  ["결제 후 아직 발행되지 않은 리포트 입력정보", "결제일로부터 90일(그 안에 발행되면 위 리포트 기준)"],
  ["리포트를 만드는 동안 저장하는 AI 작성 원문(다시 시도할 때 같은 글을 쓰기 위한 작업용 사본)", "리포트 발행 완료 30일 뒤 자동 삭제(발행하지 못한 주문은 처리가 끝난 날부터 30일 뒤). 발행된 리포트의 작성 기록에 함께 저장된 원문은 그 리포트의 보유 기간(위 리포트 행)과 같습니다."],
  ["이용권·선물 기록", "회원 탈퇴 시까지. 탈퇴 뒤에는 계정 정보와 분리해 부정 취득 확인과 분쟁 대비를 위해 5년"],
  ["계약 또는 청약철회 등에 관한 기록", "5년(전자상거래 등에서의 소비자보호에 관한 법률)"],
  ["대금 결제 및 재화 등의 공급에 관한 기록", "5년(같은 법률)"],
  ["소비자의 불만 또는 분쟁 처리에 관한 기록(문의·환불·재생성 요청)", "3년(같은 법률)"],
  ["로그인 기록", "3개월(통신비밀보호법)"],
  ["혜택 알림 동의·철회 일시 기록", "동의 철회 또는 탈퇴 후 3년(동의 사실 확인과 분쟁 대비)"],
] as const;
export const privacyPolicyServiceRetentionKo =
  "v5부터 발행한 리포트는 회원 탈퇴, 삭제 요청, 서비스 종료 전까지 계속 열람할 수 있습니다. v5 이전에 발행한 리포트는 처음 발행일로부터 90일 동안 열람할 수 있고, 그 뒤 리포트 원고와 입력정보를 지웁니다(법령에 따라 보관하는 주문·결제 기록은 아래 표의 기간 동안 따로 보관). v5 리포트는 결리포트 새 버전(v5)으로 발행한 리포트이며, 리포트별 열람 기한은 내 서재에서 확인할 수 있습니다.";
export const privacyPolicyLegalRetentionKo =
  "회원 탈퇴 뒤에도 법령에 따라 보관해야 하는 주문·결제·환불 기록은 다른 정보와 분리해 위 기간 동안만 보관합니다.";

/** 4. 파기 */
export const privacyPolicyDestructionItems = [
  "보유 기간이 끝나거나 처리 목적을 이루면 지체 없이 파기합니다. 전자 파일은 되살릴 수 없는 방법으로 지웁니다.",
  "법령에 따라 보관해야 하는 기록은 다른 정보와 분리해 보관하고, 보관 기간이 끝나면 파기합니다.",
  "v5 이전 리포트는 열람 기간(90일)이 끝나면 원고와 입력정보(주문할 때 적은 이름 또는 닉네임, 생년월일, 출생시간 등)를 자동으로 지웁니다. 이때 전자상거래법에 따라 주문번호·상품·결제 금액·결제 일시·처리 상태만 남겨 5년 동안 따로 보관하며, 이 기록은 서비스 화면에 보이지 않습니다. v5부터 발행한 리포트는 자동 삭제 대상이 아니며, 탈퇴·삭제 요청·서비스 종료 때 지웁니다.",
  "리포트를 만드는 동안 저장한 AI 작성 원문(작업용 사본)은 발행이 끝나고 30일 뒤, 발행하지 못한 주문은 처리가 끝나고 30일 뒤 자동으로 지웁니다. 발행된 리포트의 작성 기록에 함께 저장된 원문은 리포트를 지울 때 함께 지웁니다.",
  "회원 탈퇴 시: 계정·연락처·리포트 입력정보를 바로 지우고, 구매한 리포트는 열람이 끝납니다(되살릴 수 없음). 남은 이용권은 사라집니다. 카카오로 가입했다면 카카오 계정 연결을 끊습니다. 주문·결제 기록만 위 법정 기간 동안 분리 보관합니다.",
] as const;

/** 5·6. 제3자 제공·처리 위탁 */
export const privacyPolicyThirdPartyKo =
  "회사는 이용자의 개인정보를 이 방침에 적은 범위를 넘어 이용하거나 제3자에게 제공하지 않습니다. 다만 이용자가 따로 동의한 경우(아래 13번 광고 측정의 선택 동의 등)와 법령에 특별한 규정이 있는 경우는 예외입니다. 광고 성과 측정을 위해 Meta에 보내는 행태정보와 거부 방법은 아래 13번에 적었습니다.";
export const privacyPolicyProcessorRows = [
  ["토스페이먼츠(주)", "결제 승인·취소·환불, 결제 내역 확인, 영수증", "국내"],
  ["Supabase", "회원·주문·리포트·이용권 정보 저장, 로그인 처리", "저장 위치 국내(서울), 운영사 국외(아래 7번)"],
  ["Anthropic", "리포트 입력정보와 계산된 명리 해석 근거로 리포트 문장 작성(AI)", "국외(아래 7번)"],
  ["Vercel Inc.", "웹 서비스 호스팅과 서버 실행", "국외(아래 7번)"],
  ["Telegram Messenger Inc.", "운영자 주문 알림·문의 처리", "국외(아래 7번)"],
] as const;
export const privacyPolicyLoginProviderKo =
  "카카오·Google 로그인을 고르면 해당 회사에서 위 2번 항목을 받아 로그인에 씁니다. 카카오로 가입한 회원이 탈퇴하면 카카오에 회원 식별자를 보내 연결을 끊습니다. 공유 기능(카카오톡 공유)은 이용자가 누를 때만 책 제목·주소가 카카오로 전달됩니다.";

/** 7. 국외 이전(업체별). 열: 이전받는 자·국가·연락처 / 항목 / 시기·방법 / 목적 / 보유 기간 / 거부 방법과 효과. */
export const privacyPolicyOverseasHead = ["이전받는 자 · 국가 · 연락처", "이전 항목", "이전 시기와 방법", "이용 목적", "보유·이용 기간", "거부 방법과 효과"] as const;
export const privacyPolicyOverseasRows = [
  ["Anthropic, PBC · 미국(문장 작성은 Anthropic이 운영하는 다른 지역 서버에서 처리될 수 있음) · 548 Market St, PMB 90375, San Francisco, CA 94104, USA · privacy@anthropic.com",
    "리포트 입력정보(이름 또는 닉네임, 생년월일·출생시간, 성별, MBTI, 현재 하는 일·연애 상태·관심 분야, 궁합 상대의 같은 항목), 계산된 명리 해석 근거, 같은 사람의 이전 리포트에서 겹치지 않게 할 표현",
    "리포트를 만들 때마다 암호화된 통신(HTTPS)으로 전송",
    "리포트 문장 작성(학습에 쓰지 않는 API)",
    "Anthropic 정책에 따라 받은 날부터 30일 이내 삭제(이용 정책 위반으로 판정된 내용은 최대 2년)",
    "이전을 원하지 않으면 리포트를 만들지 않으면 됩니다. 거부하면 리포트(책)를 만들 수 없습니다."],
  // W3 P2(30분 결론): 대체 작가(OpenAI)를 쓰지 않는다 — 처리 위탁·국외 이전 표에서 뺐다(30분 안에 못 만들면 자동 전액 환불·이용권 반환).
  ["Supabase Pte. Ltd. · 싱가포르(운영사). 데이터 저장 위치: 대한민국 서울(AWS 아시아 태평양 서울 리전, ap-northeast-2) · 65 Chulia Street #38-02/03, OCBC Centre, Singapore 049513 · privacy@supabase.com",
    "위 2번의 회원·주문·결제·리포트·이용권·문의 정보",
    "서비스를 이용할 때마다 암호화된 통신(HTTPS)으로 저장·조회",
    "데이터 저장, 로그인 처리",
    "이 방침 3번의 보유 기간까지(위탁 계약이 끝나면 30일 안에 삭제)",
    "회원 가입·결제·리포트 저장에 꼭 필요해 거부하면 서비스를 이용할 수 없습니다."],
  ["Vercel Inc. · 미국(서버 실행 위치: 미국 워싱턴 D.C.) · 440 N Barranca Avenue #4133, Covina, CA 91723, USA · privacy@vercel.com",
    "서비스 이용 중 주고받는 정보(위 2번 항목 포함), 접속 정보(IP 주소, 브라우저 정보, 요청 주소)",
    "웹 페이지를 열거나 요청을 보낼 때마다 암호화된 통신(HTTPS)으로 전송",
    "웹 서비스 호스팅과 서버 실행",
    "요청을 처리하는 동안만 쓰며, 서버 실행 기록은 Vercel 요금제에 따라 최대 30일 보관 후 삭제",
    "웹 서비스 제공에 꼭 필요해 거부하면 서비스를 이용할 수 없습니다."],
  // 운영 Q(2026-11-07 개정, 동의 버전 그대로): 운영자 주문 알림 봇. 이전받는 자·국가·연락처는 Telegram 공식 문서(2026-11-06 확인)만 옮긴다 —
  // https://telegram.org/privacy (1번 「Telegram Messenger Inc.」, 1.4 EEA 밖에 있음, 12번 문의 창구) · https://telegram.org/faq (개발팀 두바이, 여러 데이터센터).
  ["Telegram Messenger Inc. · 아랍에미리트(두바이, 개발팀 소재) 및 여러 나라의 데이터센터 · 텔레그램 앱 설정의 「Ask a Question」(Telegram 개인정보처리방침 12번)",
    "주문코드, 상품, 금액, 결제 시각, 결제수단, 기기 정보",
    "알림이 생길 때 텔레그램 봇 API(HTTPS)로 전송",
    "운영자 주문 알림·문의 처리",
    "처리 후 메시지 정리",
    "주문 처리에 쓰는 운영자 알림이라 따로 거부할 수 없습니다. 이전을 원하지 않으면 결제하지 않으면 됩니다."],
] as const;
export const privacyPolicyOverseasNoteKo =
  "회사는 위 업체와의 계약에서 개인정보 보호 의무를 정하고, 위탁 업무 외 이용을 금지합니다. 광고 성과 측정(Meta)으로 보내는 정보와 거부 방법은 아래 13번에 적었습니다(이메일·휴대폰 번호 해시값은 선택 동의한 경우에만).";

/** 8. 권리 */
export const privacyPolicyUserRightsKo =
  "이용자(정보주체)는 언제든 자기 개인정보의 열람, 정정, 삭제, 처리정지, 동의 철회를 요청할 수 있습니다.";
export const privacyPolicyRightsItems = [
  "내 서재 → 계정 정보에서 혜택 알림을 끄거나 회원 탈퇴를 직접 할 수 있습니다.",
  `그 밖의 요청은 이메일(${business.privacyOfficerEmail}), 전화(${business.customerServicePhone}), 카카오톡 채널 채팅으로 해 주세요. 법정대리인이나 위임받은 사람도 위임장을 내고 요청할 수 있습니다.`,
  "회사는 요청을 받은 날부터 10일 안에 처리하고 결과를 알려 드립니다. 법령에 따라 열람·삭제를 할 수 없거나 미뤄야 하면 그 이유를 알려 드립니다.",
  "리포트 삭제 요청: 탈퇴하지 않고 지우고 싶은 리포트(로그인하지 않고 예전에 산 리포트 포함)는 위 창구로 주문코드 또는 리포트 주소를 알려 주시면 지웁니다.",
] as const;

/** 9. 아동 */
export const privacyPolicyUnder14Ko = "만 14세 미만은 서비스를 이용할 수 없습니다.";
export const privacyPolicyMinorNoticeKo =
  "만 19세 미만 미성년자는 결제 시 법정대리인 동의가 필요하며, 동의 없는 계약은 본인 또는 법정대리인이 취소할 수 있습니다.";

/** 10. 자동 수집 장치 */
export const privacyPolicyCookieRows = [
  ["로그인 유지(Supabase 로그인 쿠키)", "로그인 상태 유지", "로그아웃하거나 로그인 기한이 끝날 때까지"],
  ["로그인 진행·돌아갈 주소", "소셜 로그인 확인과 로그인 뒤 원래 화면으로 돌아가기", "10분"],
  ["친구 초대·캠페인 연결", "초대·캠페인으로 들어온 경우 혜택 연결", "10분"],
  ["광고 설정 기록", "광고 성과 측정 동의·거부 기록, 광고 측정 안내를 봤는지", "1년"],
  ["로그인 완료 표시", "방문 통계에서 로그인 완료를 한 번 세기(값은 「member」뿐, 식별자 아님)", "2분(읽으면 바로 지움)"],
  ["운영자 시험 표시", "운영자(관리자) 계정으로 로그인한 브라우저를 방문 통계·광고 측정에서 빼기(값은 「1」뿐, 식별자 아님)", "1년"],
  ["유입 표시", "처음 들어온 광고 주소의 유입 값(utm_source·utm_campaign·utm_content — 예: meta·free_book_1111)을 기억해, 로그인 뒤 가입·무료 책·결제를 그 유입의 방문 통계로 세기(광고 주소의 값뿐, 식별자 아님)", "30일"],
  ["브라우저 저장소(세션)", "입력 중인 리포트 정보 임시 저장, 결제·이용권 진행 상태 확인, 광고 측정 변경 안내를 이번 방문에 미뤘는지, 방문 통계(유입 표시를 쿠키에 못 쓸 때의 사본, 같은 단계를 한 번만 셌는지)", "브라우저 창을 닫을 때까지"],
  ["브라우저 저장소(로컬)", "안내 창을 이미 봤는지 기억", "이용자가 지울 때까지"],
] as const;
/** F: 방문 통계(개인을 알아볼 수 없는 집계). */
export const privacyPolicyVisitStatsKo =
  "방문 통계: 서비스를 고치는 데 쓰려고 날짜·방문 단계(예: 상품 화면 조회, 입력 완료, 결제 완료)·유입 표시(처음 들어온 광고 주소의 utm_source·utm_campaign·utm_content 값)별 횟수만 셉니다. 회원 식별자·IP 주소·쿠키 식별자는 저장하지 않아 개인을 알아볼 수 없습니다.";
export const privacyPolicyCookieRefuseKo =
  "브라우저 설정에서 쿠키 저장을 거부하거나 지울 수 있습니다(예: 크롬 설정 → 개인정보 및 보안 → 서드파티 쿠키 및 사이트 데이터). 다만 로그인 쿠키를 거부하면 로그인·결제·내 서재를 이용하기 어렵습니다. 광고 성과 측정은 사이트 맨 아래 「광고 설정」에서 언제든 거부할 수 있습니다(아래 13번).";

/** 11. 안전성 확보 조치 */
export const privacyPolicySecurityItems = [
  "관리적 조치: 개인정보를 다루는 사람을 최소화하고, 관리자 화면은 지정한 관리자 계정만 열 수 있으며 환불·이용권 증정·내보내기는 관리자 PIN을 다시 확인합니다. 관리자 작업은 기록으로 남깁니다.",
  "기술적 조치: 모든 통신을 암호화(HTTPS)하고, 데이터베이스는 서버에서만 접근하도록 막았습니다. 선물 링크 값은 원문 대신 암호화한 값으로 저장하고, 관리자 화면에서도 이메일·휴대폰 번호는 가려서 보여 줍니다. 결제수단 정보는 저장하지 않습니다.",
  "물리적 조치: 데이터는 보안 인증을 받은 클라우드 사업자(위 7번)의 데이터센터에 보관합니다.",
] as const;

/** 12. 보호책임자 */
export const privacyPolicyOfficerKo = `개인정보 보호책임자: ${business.privacyOfficerName}(대표) · 이메일 ${business.privacyOfficerEmail} · 전화 ${business.customerServicePhone}`;
export const privacyPolicyOfficerNoteKo = "개인정보 관련 문의, 불만 처리, 피해 구제는 보호책임자에게 연락해 주세요. 지체 없이 답변하고 처리합니다.";

/** 14. 권익침해 구제 */
export const privacyPolicyRemedyItems = [
  "개인정보분쟁조정위원회: 1833-6972, www.kopico.go.kr",
  "개인정보침해신고센터(한국인터넷진흥원): 118, privacy.kisa.or.kr",
  "경찰청 사이버수사국: 182, ecrm.police.go.kr",
] as const;

/** 15. 자동화된 결정 */
export const privacyPolicyAutomatedKo =
  "리포트 문장은 AI가 작성하지만, 이용자의 권리나 의무에 영향을 주는 결정(가입·결제 승인 거절 등)을 AI만으로 하지 않습니다.";

export const prePaymentPrivacyNoticeKo =
  "리포트 생성을 위해 이름 또는 닉네임, 생년월일, 출생시간, 성별, MBTI가 처리됩니다.";

// 광고 성과 측정(Meta) 문구는 광고 설정 창과 같은 문장(metaConsent)을 가져온다.
// 13번은 시행일 전후 두 판을 날짜를 박아 함께 싣는다(덕짱님 결정 2026-11-09: 30일 공지 뒤 시행) — 그리는 시각에 따라 바뀌지 않아
// 정적으로 만든 화면도 시행일 앞뒤 모두 맞다. 시행일이 지나 「12월 9일까지」 판을 뺄 때는 변경 이력에 남긴다.
export const privacyPolicyMetaChangeKo = `광고 성과 측정 방식이 ${META_DEFAULT_FROM_KO} 0시(한국 시간)부터 바뀝니다. ${META_OPTIN_UNTIL_KO}까지는 아래 「${META_OPTIN_UNTIL_KO}까지」대로 동의한 경우에만 보내고, ${META_DEFAULT_FROM_KO}부터는 「${META_DEFAULT_FROM_KO}부터」대로 거부하지 않으면 기본으로 보냅니다. ${META_NOTICE_FROM_KO}부터 서비스 화면(첫 방문 안내·사이트 맨 아래 「광고 설정」)과 이 방침에 알립니다.`;
export { metaTrackingNotice as privacyPolicyMetaNoticeKo, metaTransferNotice as privacyPolicyMetaRetentionKo } from "../analytics/metaConsent";

/** 화면 두 곳이 그대로 그리는 순서(법정 필수 항목 전부). */
export const privacyPolicySections: readonly PolicySection[] = [
  { titleKo: "1. 개인정보의 처리 목적", blocks: [ul(...privacyPolicyPurposeItems), p("혜택 알림은 따로 동의한 회원에게만 보내며, 동의하지 않아도 서비스를 이용할 수 있습니다. 서비스 공지와 긴급 안내는 혜택 알림 동의와 상관없이 보냅니다.")] },
  { titleKo: "2. 처리하는 개인정보 항목", blocks: [table("수집 경로별 항목", ["수집 경로", "항목"], privacyPolicyCollectionRows), p(privacyPolicyPaymentNoticeKo), p(privacyPolicyPartnerConsentKo), p(privacyPolicySensitiveInfoLimitKo), p(privacyPolicyNoResidentRegistrationNumberKo)] },
  { titleKo: "3. 개인정보의 보유 기간", blocks: [p(privacyPolicyServiceRetentionKo), table("항목별 보유 기간", ["구분", "보유 기간"], privacyPolicyRetentionRows), p(privacyPolicyLegalRetentionKo)] },
  { titleKo: "4. 개인정보의 파기 절차와 방법", blocks: [ul(...privacyPolicyDestructionItems)] },
  { titleKo: "5. 개인정보의 제3자 제공", blocks: [p(privacyPolicyThirdPartyKo)] },
  { titleKo: "6. 개인정보 처리 위탁", blocks: [table("처리 위탁", ["수탁자", "위탁 업무", "위치"], privacyPolicyProcessorRows), p(privacyPolicyLoginProviderKo)] },
  { titleKo: "7. 개인정보의 국외 이전", blocks: [p("회사는 서비스 제공(계약 이행)을 위해 아래와 같이 개인정보를 국외로 이전하거나 국외 사업자에게 처리를 맡깁니다."), table("국외 이전", privacyPolicyOverseasHead, privacyPolicyOverseasRows), p(privacyPolicyOverseasNoteKo)] },
  { titleKo: "8. 정보주체의 권리와 행사 방법", blocks: [p(privacyPolicyUserRightsKo), ul(...privacyPolicyRightsItems)] },
  { titleKo: "9. 만 14세 미만 아동과 미성년자", blocks: [p(privacyPolicyUnder14Ko), p(privacyPolicyMinorNoticeKo)] },
  { titleKo: "10. 자동 수집 장치(쿠키 등)의 설치·운영과 거부", blocks: [table("쿠키·브라우저 저장소", ["종류", "목적", "보관 기간"], privacyPolicyCookieRows), p(privacyPolicyVisitStatsKo), p(privacyPolicyCookieRefuseKo)] },
  { titleKo: "11. 개인정보의 안전성 확보 조치", blocks: [ul(...privacyPolicySecurityItems)] },
  { titleKo: "12. 개인정보 보호책임자", blocks: [p(privacyPolicyOfficerKo), p(privacyPolicyOfficerNoteKo)] },
  { titleKo: "13. 행태정보와 광고 성과 측정(Meta)", blocks: [
    p(privacyPolicyMetaChangeKo), table(`광고 성과 측정 변경 안내(${META_DEFAULT_FROM_KO} 시행)`, ["구분", "내용"], metaChangeRows),
    p(`[${META_OPTIN_UNTIL_KO}까지] ${metaOptInNotice}`), p(`[${META_OPTIN_UNTIL_KO}까지 · Meta 제공·국외 이전] ${metaOptInTransferNotice}`),
    p(`[${META_DEFAULT_FROM_KO}부터] ${metaTrackingNotice}`), table(`${META_DEFAULT_FROM_KO}부터 광고 성과 측정으로 보내는 행태정보`, ["구분", "내용"], metaBehaviorRows),
    p(`[${META_DEFAULT_FROM_KO}부터 · Meta 제공·국외 이전] ${metaTransferNotice}`)] },
  { titleKo: "14. 권익침해 구제 방법", blocks: [p("개인정보 침해로 상담이나 구제가 필요하면 아래 기관에 문의할 수 있습니다."), ul(...privacyPolicyRemedyItems)] },
  { titleKo: "15. 자동화된 결정", blocks: [p(privacyPolicyAutomatedKo)] },
  { titleKo: "16. 방침의 변경과 시행일", blocks: [p(`이 방침은 ${POLICY_EFFECTIVE_DATES_KO.privacy}부터 시행합니다. 다만 13번 광고 성과 측정의 변경(아래 변경 이력 첫 줄)은 ${META_OPTOUT_POLICY_EFFECTIVE_DATE_KO}부터 시행합니다. 내용이 바뀌면 시행 7일 전(이용자에게 불리한 변경은 30일 전)부터 서비스 화면에 알립니다.`), ul(...POLICY_HISTORY.privacy)] },
];
