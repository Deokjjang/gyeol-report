import { GYEOL_BUSINESS_INFO } from "./businessInfo";
import { refundPolicyRequiredNotices } from "./refundPolicy";
import { AI_WRITTEN_NOTICE_KO } from "./aiNotice";
import { POLICY_EFFECTIVE_DATE_KO, POLICY_HISTORY } from "./policyVersions";
import { COMP_TICKET_EXPIRES_AT, EVENT_TICKET_DAYS, GIFT_EVENT_DEFAULT_END, GIFT_EVENT_DEFAULT_START, parseEventInstant, SIGNUP_CAMPAIGN_START, SIGNUP_TICKET_DAYS } from "../ops/config";

/**
 * F: 이벤트 기간 문구는 설정값(src/lib/ops/config.ts 기본 기간 상수)에서 만든다 — 1+1을 연장할 때 GIFT_EVENT_DEFAULT_END 하나만 바꾸면
 * 1+1 발급·팝업·배너·가입 이용권 캠페인 끝·/free·이 약관 문구가 함께 바뀐다(약관은 화면 묶음에도 실리므로 env가 아니라 상수를 읽는다).
 */
const kstParts = (ms: number) => { const d = new Date(ms + 9 * 3_600_000); return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), h: d.getUTCHours(), mi: d.getUTCMinutes(), s: d.getUTCSeconds() }; };
const kstDayKo = (ms: number) => { const p = kstParts(ms); return `${p.y}년 ${p.m}월 ${p.d}일`; };
const kstEndKo = (endMs: number) => { const p = kstParts(endMs - 1000); return `${p.y}년 ${p.m}월 ${p.d}일 ${String(p.h).padStart(2, "0")}:${String(p.mi).padStart(2, "0")}:${String(p.s).padStart(2, "0")}`; };
const GIFT_START_MS = parseEventInstant(GIFT_EVENT_DEFAULT_START, "start"), GIFT_END_MS = parseEventInstant(GIFT_EVENT_DEFAULT_END, "end");
/** 「2026년 11월 6일 ~ 2026년 11월 30일 23:59:59」 */
export const GIFT_EVENT_PERIOD_KO = `${kstDayKo(GIFT_START_MS)} ~ ${kstEndKo(GIFT_END_MS)}`;
/** 「2026년 11월 10일 ~ 2026년 11월 30일 23:59:59」(끝 = 1+1 끝) */
export const SIGNUP_CAMPAIGN_PERIOD_KO = `${kstDayKo(parseEventInstant(SIGNUP_CAMPAIGN_START, "start"))} ~ ${kstEndKo(GIFT_END_MS)}`;
const COMP_TICKET_UNTIL_KO = kstEndKo(Date.parse(COMP_TICKET_EXPIRES_AT) + 1000);

export type TermsPolicySection = {
  readonly titleKo: string;
  readonly bodyKo: readonly string[];
};

/** 시행일 = 배포일(policyVersions.POLICY_EFFECTIVE_DATE). 가격 숫자는 약관에 적지 않는다(상품 페이지·결제 화면 기준). */
export const termsPolicyEffectiveDateKo = POLICY_EFFECTIVE_DATE_KO;

export const termsPolicyDescriptionKo =
  "결리포트 유료 디지털 리포트 서비스의 이용 기준입니다.";

export const termsPolicySections = [
  {
    titleKo: "목적",
    bodyKo: [
      "본 약관은 DVEM이 운영하는 결리포트 서비스의 이용조건, 유료 디지털 리포트 제공, 결제, 이용권, 환불, 이용자의 권리와 의무를 정합니다.",
    ],
  },
  {
    titleKo: "사업자 정보",
    bodyKo: [
      `결리포트는 ${GYEOL_BUSINESS_INFO.businessName}이 운영합니다. 사업자 신원 및 고객 문의 정보는 사업자정보에서 확인할 수 있습니다.`,
    ],
  },
  {
    titleKo: "서비스의 성격",
    bodyKo: [
      "결리포트는 사용자가 입력한 이름 또는 닉네임, 생년월일, 출생시간, 성별, MBTI 등을 바탕으로 자동 생성되는 디지털 리포트를 제공합니다.",
      `AI 작성 고지: ${AI_WRITTEN_NOTICE_KO} 회사는 명리 계산 결과와 정해 둔 자료를 AI에 근거로 주고, 근거 없는 내용을 걸러 낸 뒤 발행합니다.`,
      "명리(사주)와 MBTI는 자기이해를 돕는 참고 정보이며, 리포트는 미래를 단정하거나 특정 사건(결혼 시기 등)을 예언하지 않습니다.",
      "본 서비스는 사람에 의한 1:1 상담이 아니며, 의료·법률·투자 자문을 제공하지 않습니다.",
      "리포트는 자기이해와 참고 목적의 정보입니다.",
    ],
  },
  {
    titleKo: "상품 및 제공 방식",
    bodyKo: [
      "판매 상품: 사주×MBTI 종합 리포트, 직업·커리어·돈·학업 리포트, 연애·결혼·자녀 리포트, 궁합 리포트(4종), 그리고 대운 리포트(앞으로의 나)와 세운 리포트(나의 한 해 신년판). 대운·세운 리포트는 서비스 화면에 판매를 연다고 알린 날부터 살 수 있으며, 그 전에는 판매를 멈춥니다. 이미 받은 리포트는 그대로 열람할 수 있습니다.",
      "궁합 리포트는 연애, 결혼, 부모·자식, 직장 동료, 상사·부하, 사업/협업, 친구/인간관계 카테고리를 포함합니다.",
      "상품 유형: 입력값 기반 자동 생성 디지털 리포트",
      "결제 금액: 상품 페이지와 결제 화면에 표시된 금액",
      "제공 방식: 결제 후 온라인 열람",
      "서비스 제공기간: 결제 완료 후 즉시 생성, 최대 24시간 이내 제공",
      "열람 가능 기간: v5부터 발행한 리포트는 회원 탈퇴, 삭제 요청, 서비스 종료 시까지 / v5 이전에 발행한 리포트는 처음 발행일로부터 90일",
      "v5 리포트는 결리포트 새 버전(v5)으로 발행한 리포트이며, 책 끝에 AI 작성 안내가 있습니다. 리포트별 열람 기한은 내 서재에서 확인할 수 있습니다.",
    ],
  },
  {
    titleKo: "회원 또는 이용자 입력정보",
    bodyKo: [
      "이용자는 리포트 생성을 위해 정확한 입력값을 제공해야 합니다.",
      "입력값이 다르거나 부정확한 경우 결과 내용이 달라질 수 있습니다.",
      "결제 전 확인 화면에서 입력값을 수정할 수 있습니다.",
      "생성 시작 후 이용자의 입력 오류로 인한 단순 재생성 또는 환불은 제한될 수 있습니다.",
      "궁합 상대나 선물을 받을 사람 등 다른 사람의 정보는 그 사람의 동의를 받은 뒤 입력해야 합니다.",
    ],
  },
  {
    titleKo: "결제 및 유료 서비스",
    bodyKo: [
      "유료 상품의 가격, 제공 방식, 생성 방식은 상품 페이지와 결제 직전 화면에 표시됩니다.",
      "리포트 결제는 카카오 또는 Google 계정으로 로그인한 회원만 할 수 있습니다.",
      "이용자는 결제 직전 화면에서 입력값, 상품명, 가격, 제공 방식, 환불 안내, 약관 및 개인정보 처리 기준을 확인한 뒤 결제를 진행합니다.",
      "결제 완료 후 리포트 생성 절차가 시작될 수 있습니다.",
      "세운 → 대운 연결 할인: 세운 리포트를 결제한 회원이 그 결제 뒤 7일 안에 세운과 같은 사람(이름·생년월일·출생시간·성별)의 대운 리포트를 결제하면, 세운 결제 1건당 한 번 할인을 받을 수 있습니다. 할인 금액은 결제 직전 화면에 표시되며 서버가 정합니다. 세운 결제가 환불되면 아직 쓰지 않은 할인은 없어지고, 이미 할인받아 결제한 대운 리포트는 그대로입니다.",
    ],
  },
  {
    titleKo: "이용권",
    bodyKo: [
      "이용권은 리포트 한 권을 결제 없이 만들 수 있는 권리입니다. 이용권은 회사가 결제에 따른 이벤트(결제 1건마다 1장 등), 신규 가입, 보상, 고객 응대로 무상 증정하는 것이며 판매하는 상품이 아닙니다. 이용권마다 쓸 수 있는 상품이 정해질 수 있습니다.",
      `결제 1건마다 이용권 1장 증정 이벤트 기간: ${GIFT_EVENT_PERIOD_KO}(KST). 기간을 늘리거나 줄이면 서비스 화면과 이 약관에 함께 표시합니다.`,
      `가입 이용권: 회사는 ${SIGNUP_CAMPAIGN_PERIOD_KO}(KST)에 새로 가입(필수 동의와 가입 정보 입력)을 마친 회원에게 리포트 이용권 1장을 무상으로 증정합니다. 한 사람당 1번이며, 이미 가입한 회원과 탈퇴한 뒤 같은 로그인 계정으로 다시 가입한 경우는 받을 수 없습니다. 가입 이용권은 받은 날부터 ${SIGNUP_TICKET_DAYS}일 동안 쓸 수 있고, 아래 4종 리포트에만 쓸 수 있으며, 선물하거나 다른 사람에게 넘길 수 없습니다. 회사는 부정 가입이 늘어나는 등 운영상 필요하면 가입 이용권 지급을 멈출 수 있습니다(이미 받은 이용권은 그대로 쓸 수 있습니다).`,
      "쓸 수 있는 상품: 이용권으로 만들 수 있는 리포트는 사주×MBTI 종합, 직업·커리어·돈·학업, 연애·결혼·자녀, 궁합 리포트 4종입니다. 대운 리포트와 세운 리포트는 이용권으로 만들 수 없습니다.",
      `유효기간: 이용권의 기한은 이용권에 표시된 날짜까지입니다(결제 1건마다 증정하는 이용권은 받은 날부터 ${EVENT_TICKET_DAYS}일, 이번 보상 이용권은 ${COMP_TICKET_UNTIL_KO}까지, 가입 이용권은 받은 날부터 ${SIGNUP_TICKET_DAYS}일). 기한이 지나면 쓸 수 없습니다.`,
      "선물: 이용권은 선물 링크로 다른 회원에게 한 번 보낼 수 있으며, 받은 이용권의 기한은 처음 이용권에 표시된 날짜 그대로입니다. 받은 이용권은 다시 선물할 수 없고, 가입 이용권은 선물할 수 없습니다.",
      "이용권으로 만든 리포트도 결제한 리포트와 같은 상품입니다. 이용권으로 만든 리포트는 환불하지 않으며, 계산 오류·결과 미제공 등 오류가 확인되면 다시 만들어 드리거나 이용권을 다시 드립니다.",
      "이용권은 무상 증정이므로 현금이나 다른 상품으로 바꿀 수 없고 환불되지 않습니다. 회원 탈퇴 시 남은 이용권은 사라집니다.",
      "부정한 방법(중복 가입, 탈퇴 뒤 다시 가입해 가입 이용권을 또 받는 방식, 결제 취소를 되풀이하는 방식, 타인 정보 도용 등)으로 받은 이용권은 회수하고, 그 이용권으로 만든 리포트의 열람을 막을 수 있습니다.",
      "결제가 환불되면 그 결제로 받은 아직 쓰지 않은 이용권(선물 링크를 만들었지만 아직 받지 않은 이용권 포함)은 회수하고, 그 선물 링크는 더 쓸 수 없습니다. 이미 쓴 이용권(그 이용권으로 만든 리포트, 다른 회원이 받은 선물)은 회수하지 않습니다.",
    ],
  },
  {
    titleKo: "리포트 생성 및 열람",
    bodyKo: [
      "리포트는 결제 완료 후 입력값을 기준으로 자동 생성됩니다.",
      "리포트는 온라인 열람 방식으로 제공됩니다.",
      "시스템 장애나 결과 미제공이 확인되는 경우 회사는 재처리, 재생성 또는 환불 절차를 안내합니다.",
      "v5부터 발행한 리포트는 회원 탈퇴, 삭제 요청, 서비스 종료 전까지 열람할 수 있습니다. v5 이전에 발행한 리포트는 처음 발행일로부터 90일 동안 열람할 수 있습니다.",
    ],
  },
  {
    titleKo: "청약철회 및 환불",
    bodyKo: [
      refundPolicyRequiredNotices[0],
      refundPolicyRequiredNotices[1],
      refundPolicyRequiredNotices[2],
      refundPolicyRequiredNotices[4],
      refundPolicyRequiredNotices[5],
    ],
  },
  {
    titleKo: "미성년자 이용",
    bodyKo: [
      "만 19세 미만 미성년자는 결제 시 법정대리인 동의가 필요합니다.",
      "법정대리인 동의 없는 미성년자 계약은 본인 또는 법정대리인이 취소할 수 있습니다.",
    ],
  },
  {
    titleKo: "만 14세 미만 이용 제한",
    bodyKo: [
      "만 14세 미만은 서비스를 이용할 수 없습니다.",
      "회사는 만 14세 미만 이용자의 법정대리인 동의 확인 절차를 제공하지 않습니다.",
    ],
  },
  {
    titleKo: "개인정보 처리",
    bodyKo: [
      "개인정보 처리에 관한 구체적인 내용은 개인정보처리방침에서 정합니다.",
      "리포트 생성을 위해 이름 또는 닉네임, 생년월일, 출생시간, 성별, MBTI 등이 처리될 수 있습니다.",
    ],
  },
  {
    titleKo: "저작권 및 이용범위",
    bodyKo: [
      "리포트 화면, 서비스 구성, 문구, 디자인, 시스템에 관한 권리는 회사 또는 정당한 권리자에게 있습니다.",
      "이용자는 본인이 결제하거나 이용권으로 만든 리포트를 개인적·비상업적 용도로 열람할 수 있습니다.",
      "회사의 사전 동의 없이 리포트를 대량 복제, 재판매, 스크래핑, 자동 수집, 상업적으로 이용할 수 없습니다.",
    ],
  },
  {
    titleKo: "금지행위",
    bodyKo: [
      "타인의 정보를 동의 없이 입력하는 행위",
      "허위 정보 또는 부정확한 정보를 고의로 입력하는 행위",
      "결제 수단을 부정하게 사용하는 행위",
      "이용권을 부정한 방법으로 받거나 사고파는 행위",
      "서비스 결과물을 무단 재판매하거나 대량 복제하는 행위",
      "서비스를 스크래핑, 자동 수집, 역공학하는 행위",
      "서비스 운영을 방해하는 행위",
    ],
  },
  {
    titleKo: "서비스 변경·중단",
    bodyKo: [
      "회사는 서비스 운영상 필요한 경우 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다.",
      "유료 결제와 관련된 중요한 변경이 있는 경우 서비스 화면 또는 공지사항을 통해 안내합니다.",
      "서비스를 종료할 때는 종료일 30일 전까지 서비스 화면 공지 및 이메일 등으로 알리고, 리포트 열람이 끝나는 날짜를 함께 안내합니다. 종료일 뒤에는 리포트를 열람할 수 없습니다.",
    ],
  },
  {
    titleKo: "면책 및 책임 제한",
    bodyKo: [
      "회사는 관련 법령상 허용되는 범위에서 서비스 이용과 관련한 책임을 부담합니다.",
      "회사의 고의 또는 중대한 과실로 인한 손해에 대해서는 관련 법령에 따라 책임을 부담합니다.",
      "리포트는 참고 목적의 정보이며, 이용자의 최종 의사결정에 대한 책임은 이용자에게 있습니다.",
    ],
  },
  {
    titleKo: "고객 문의 및 분쟁 처리",
    bodyKo: [
      `서비스 이용, 결제, 환불, 재생성, 오류 문의는 고객센터 ${GYEOL_BUSINESS_INFO.customerServicePhone} 또는 ${GYEOL_BUSINESS_INFO.supportContactEmail}로 접수할 수 있습니다.`,
      "회사는 접수된 문의를 확인한 뒤 서비스 운영 기준과 관련 법령에 따라 처리합니다.",
    ],
  },
  {
    titleKo: "약관 변경",
    bodyKo: [
      "약관 변경 시 서비스 화면 또는 공지사항을 통해 안내합니다.",
      "변경된 약관은 안내된 시행일부터 적용됩니다.",
    ],
  },
  {
    titleKo: "시행일",
    bodyKo: [`시행일: ${termsPolicyEffectiveDateKo}`, ...POLICY_HISTORY.terms.map(line => `변경 이력: ${line}`)],
  },
] as const satisfies readonly TermsPolicySection[];
