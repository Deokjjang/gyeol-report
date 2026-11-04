/**
 * 개인정보처리방침 개정 초안(P6d-ops, 2026-11-04). 운영 반영은 배포 때: 이 내용으로 privacyPolicy.ts를 바꾸고 CHECKOUT_POLICY_VERSIONS.privacy를 올린다(회원 재동의).
 * 지금은 /privacy/draft(검색 제외)에서만 보인다. 덕짱님 확인 전에는 운영 문구가 아니다.
 */
export const PRIVACY_DRAFT_VERSION = "2026-11-04.draft";

export const privacyDraftCollection = [
  { sourceKo: "카카오 로그인", itemsKo: "이메일(필수 동의), 닉네임, 카카오톡 채널(결리포트) 추가 상태(선택 동의)" },
  { sourceKo: "Google 로그인", itemsKo: "이메일, 이름" },
  { sourceKo: "가입 정보 화면(직접 입력)", itemsKo: "이름(필수), 이메일(필수), 휴대폰 번호(선택), 마케팅 정보 수신 동의 여부(선택)" },
  { sourceKo: "책 만들기 입력", itemsKo: "이름 또는 닉네임, 생년월일, 출생시간(모르면 생략), 성별, MBTI(선택), 직업·관계 상태(선택). 궁합은 상대방의 같은 항목" },
  { sourceKo: "비회원 결제", itemsKo: "구매자 이름, 이메일, 휴대폰 번호(선택)" },
  { sourceKo: "결제", itemsKo: "주문코드·주문번호, 결제 금액, 결제 승인·취소 기록, 영수증 주소(카드번호 등 결제수단 정보는 토스페이먼츠가 처리하며 회사는 보관하지 않음)" },
  { sourceKo: "문의·환불 요청", itemsKo: "문의 사유와 내용, 처리 기록" },
  { sourceKo: "자동 수집", itemsKo: "접속 기록, 책 열람 기록, 이용권 사용 기록" },
] as const;

export const privacyDraftPurposes = [
  "회원 식별과 로그인",
  "주문 확인, 결제 처리, 영수증 안내",
  "환불·재생성 안내와 문의 처리",
  "서비스 공지(제본 지연, 장애, 정책 변경 등 꼭 알려야 하는 안내)",
  "책(리포트) 만들기와 열람 제공",
  "부정 이용 방지, 법령에 따른 기록 보존",
] as const;
export const privacyDraftMarketingKo = "새 책·이벤트·할인 소식(마케팅)은 가입 정보 화면에서 따로 동의한 경우에만 이메일·문자·카카오톡으로 보내며, 동의하지 않아도 서비스를 이용할 수 있습니다. 동의는 언제든 끌 수 있습니다.";

export const privacyDraftRetention = [
  { categoryKo: "회원 정보(계정, 이름, 이메일, 휴대폰, 카카오 채널 추가 상태)", periodKo: "회원 탈퇴 시까지(탈퇴 즉시 삭제)" },
  { categoryKo: "책 입력 정보(출생 정보 등)와 책 결과", periodKo: "생성일로부터 90일(탈퇴하면 즉시 삭제)" },
  { categoryKo: "계약·청약철회, 대금 결제·재화 공급 기록(주문코드, 구매자 이름·이메일·휴대폰, 결제 기록)", periodKo: "5년(전자상거래 등에서의 소비자보호에 관한 법률). 탈퇴 시 분리 보관" },
  { categoryKo: "소비자 불만·분쟁 처리 기록(문의·환불 요청)", periodKo: "3년(같은 법률)" },
  { categoryKo: "접속 기록", periodKo: "3개월(통신비밀보호법)" },
  { categoryKo: "마케팅 수신 동의·철회 기록", periodKo: "동의 철회 또는 탈퇴 시까지(동의·철회 사실 증빙은 보관)" },
] as const;

export const privacyDraftDestructionKo = [
  "보관 기간이 끝나거나 처리 목적을 이루면 지체 없이 파기합니다. 전자 파일은 되살릴 수 없는 방법으로 지웁니다.",
  "법령에 따라 보관해야 하는 기록은 다른 정보와 분리해 보관하고, 보관 기간이 끝나면 파기합니다.",
  "회원 탈퇴 시: 계정·연락처·출생 입력을 바로 지우고, 구매한 책은 열람이 끝납니다(되살릴 수 없음). 남은 이용권은 사라집니다. 카카오로 가입했다면 카카오 계정 연결을 끊습니다. 주문·결제 기록만 위 법정 기간 동안 분리 보관합니다.",
] as const;

export const privacyDraftThirdParty = [
  { recipientKo: "토스페이먼츠(주)", purposeKo: "결제 처리(승인·취소·환불, 영수증)", itemsKo: "주문번호, 상품명(주문코드 포함), 결제 금액, 구매자 이름·이메일·휴대폰(선택)", periodKo: "결제 처리 목적 달성 후 관계 법령에 따른 보관 기간" },
] as const;

export const privacyDraftProcessors = [
  { providerKo: "Supabase", purposeKo: "회원·주문·책 정보 저장, 로그인 처리", overseas: true },
  { providerKo: "Anthropic(Claude), OpenAI", purposeKo: "입력값과 계산된 해석 근거로 책 문장 생성(학습에 쓰지 않는 API)", overseas: true },
  { providerKo: "Vercel", purposeKo: "웹 서비스 호스팅", overseas: true },
  { providerKo: "카카오", purposeKo: "카카오 로그인, 카카오톡 채널", overseas: false },
  { providerKo: "Google", purposeKo: "Google 로그인", overseas: true },
] as const;

export const privacyDraftRightsKo = "이용자는 언제든 개인정보 열람·정정·삭제·처리정지를 요청할 수 있고, 내 서재 → 계정 정보 → 회원 탈퇴에서 직접 탈퇴할 수 있습니다.";
