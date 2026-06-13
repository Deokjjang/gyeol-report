export const privacyPolicyCollectionItems = [
  "이름 또는 닉네임",
  "생년월일",
  "출생시간",
  "성별",
  "MBTI",
  "결제 거래정보",
  "리포트 생성 및 열람 정보",
  "접속기록",
  "고객 문의 정보",
] as const;

export const privacyPolicyPurposeItems = [
  "리포트 생성 및 제공",
  "결제 처리 및 결제 내역 확인",
  "입력값 확인 및 결과 열람",
  "고객 문의 및 환불·재생성 요청 처리",
  "서비스 장애 대응",
  "부정 이용 방지",
  "법령상 거래기록 보존",
] as const;

export const privacyPolicyRetentionRows = [
  {
    categoryKo: "리포트 입력정보",
    periodKo: "리포트 제공 및 고객 문의 대응에 필요한 기간",
  },
  {
    categoryKo: "리포트 결과",
    periodKo: "온라인 열람 제공 및 고객 문의 대응에 필요한 기간",
  },
  {
    categoryKo: "결제 및 계약 기록",
    periodKo: "관련 법령에 따른 보존기간",
  },
  {
    categoryKo: "소비자 불만 또는 분쟁 처리 기록",
    periodKo: "관련 법령에 따른 보존기간",
  },
  {
    categoryKo: "접속기록",
    periodKo: "보안 및 부정 이용 방지를 위한 필요 기간",
  },
] as const;

export const privacyPolicyExternalServiceRows = [
  {
    providerKo: "토스페이먼츠",
    purposeKo: "결제 승인, 결제 취소, 결제 내역 확인",
  },
  {
    providerKo: "Supabase",
    purposeKo: "입력정보, 결제 주문 정보, 리포트 열람 정보 저장 및 서비스 운영",
  },
  {
    providerKo: "OpenAI API",
    purposeKo: "입력값과 deterministic evidence를 바탕으로 리포트 문장 생성 보조",
  },
  {
    providerKo: "호스팅 제공자",
    purposeKo: "서비스 제공을 위한 웹 호스팅",
  },
] as const;

export const privacyPolicyProcessingScopeKo =
  "회사는 리포트 생성, 결제 처리, 고객 문의 대응, 부정 이용 방지, 법령상 의무 이행을 위해 필요한 범위의 개인정보를 처리합니다.";

export const privacyPolicyServiceRetentionKo =
  "리포트 생성을 위해 입력한 정보와 리포트 결과는 서비스 제공 및 고객 문의 대응에 필요한 기간 동안 보관할 수 있습니다.";

export const privacyPolicyLegalRetentionKo =
  "결제·계약·청약철회·환불·분쟁 처리와 관련된 기록은 관련 법령에 따른 보존기간 동안 별도로 보관될 수 있습니다.";

export const privacyPolicyOverseasProcessingKo =
  "회사는 서비스 제공을 위해 Supabase, OpenAI API, 호스팅 제공자 등 외부 서비스를 이용할 수 있으며, 일부 서비스는 국외에서 제공될 수 있습니다. 국외에서 처리될 수 있는 항목은 리포트 입력정보, 결제 주문 식별 정보, 리포트 생성 및 열람 정보, 접속기록 등 서비스 제공에 필요한 정보이며, 목적은 데이터 저장, 서비스 운영, 리포트 문장 생성 보조, 웹 호스팅입니다. 보유기간은 서비스 제공, 고객 문의 대응, 관련 법령상 보존기간에 따릅니다.";

export const privacyPolicyUnder14Ko =
  "만 14세 미만은 현재 버전에서 서비스를 이용할 수 없습니다.";

export const privacyPolicyMinorNoticeKo =
  "만 19세 미만 미성년자는 결제 시 법정대리인 동의가 필요하며, 동의 없는 계약은 본인 또는 법정대리인이 취소할 수 있습니다.";

export const privacyPolicySensitiveInfoLimitKo =
  "본 서비스는 건강정보, 질병정보, 정신질환 정보, 정치적 견해, 종교, 성생활 정보, 범죄경력 등 민감정보 입력을 요구하지 않습니다. 사용자는 문의 과정에서 민감정보를 포함하지 않도록 주의해 주세요.";

export const privacyPolicyNoResidentRegistrationNumberKo =
  "회사는 주민등록번호를 수집하지 않습니다.";

export const privacyPolicyUserRightsKo =
  "이용자는 개인정보 열람, 정정, 삭제, 처리정지 요청을 할 수 있습니다.";

export const prePaymentPrivacyNoticeKo =
  "리포트 생성을 위해 이름 또는 닉네임, 생년월일, 출생시간, 성별, MBTI가 처리됩니다.";
