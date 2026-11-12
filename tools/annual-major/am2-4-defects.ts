/**
 * AM2-4 8부 — P3 판독 두 건(annual-1 · major-1)의 차단·경계(하나씩). am2-hit.ts가 저장된 P3 발행 원고에 지금 검사를 대어 적중을 센다.
 * det = 결정론 검사로 잡는 규칙(이것이 비면 결정론으로 잡기 어려운 뜻 판단 — proof에 근원 고침). frag = 판독 인용 문장의 고유한 조각(한자 주석 뺀 꼴).
 */
import type { Defect } from "./am2-3-defects";

type D4 = Omit<Defect, "src"> & { readonly src: "P3-annual-1" | "P3-major-1" };
const I = "src/lib/writer/chunked/intake.ts", C = "src/lib/writer/chunked/check.ts", P = "src/lib/writer/chunked/prompt.ts", R = "src/lib/writer/render.ts", AN = "src/lib/brief/design/annual.ts", RX = "src/lib/brief/prescriptions.ts", K = "src/lib/writer/chunked/card.ts", CU = "src/lib/writer/chunked/cut.ts";

export const DEFECTS4: readonly D4[] = [
  // ───────── P3 세운 annual-1: 차단 7 ─────────
  { id: "P3A-b1", src: "P3-annual-1", sev: "차단", loc: "2.2 ¶1", frag: "한 해의 절반이 넘는 달에 연애 기운이 오릅니다", what: "개수 말(절반)", layer: "rule", fix: [[P, "R_BASE 개수 말 규칙"], [C, "am24Flags count_claim"]], det: ["count_claim"] },
  { id: "P3A-b2", src: "P3-annual-1", sev: "차단", loc: "4.2 ¶1", frag: "오르는 달에는 넓히고, 흔들리는 달에는 맡은 일부터 지키는 것이 기준이에요", what: "month_list 오탐이 앞 문장을 지워 남은 고아", layer: "check", fix: [[C, "month_list 마디별 대조"], [CU, "LEANS 달 목록 지시어"], [C, "orphan_ref"]], det: ["orphan_ref"] },
  { id: "P3A-b3", src: "P3-annual-1", sev: "차단", loc: "5.1 ¶1", frag: "쇠에 해당하는 기운은 속도를 낮추고", what: "십이운성 쇠 ↔ 오행 쇠(금) 동음", layer: "card", fix: [[I, "STAGE_HANJA 쇠(衰)"], [C, "homonym"]], det: ["homonym"] },
  { id: "P3A-b4", src: "P3-annual-1", sev: "차단", loc: "7·경술월 ¶1", frag: "흐름이 거센 편인 달이라", what: "한자 주석이 「거센 편인(=편이다) 달」에 偏印", layer: "check", fix: [[R, "annotateChapter 편인 관형형 가드"]], det: [], proof: "렌더 단계 고침 — 작가 원문 「흐름이 거센 편인 달이라」에 주석을 붙이지 않음(tests/unit/writer/am24.test.ts)" },
  { id: "P3A-b5", src: "P3-annual-1", sev: "차단", loc: "7·경술월 ¶1", frag: "화국이 태어난 달·태어난 날 자리와 맞물려", what: "자리 버그(unitFix) — 엔진은 태어난 해·날", layer: "card", fix: [[K, "unitFix (?<!태어난)"], [C, "cardEngineIssues · seat_badge"]], det: ["seat_badge"] },
  { id: "P3A-b6", src: "P3-annual-1", sev: "차단", loc: "7·계축월 ¶1", frag: "무계합이 태어난 달·태어난 시각 자리와 맺혀", what: "자리 버그(unitFix) — 엔진은 태어난 해·시각", layer: "card", fix: [[K, "unitFix"], [C, "seat_badge"]], det: ["seat_badge"] },
  { id: "P3A-b7", src: "P3-annual-1", sev: "차단", loc: "8.1 ¶1", frag: "나머지 달의 일정을 가볍게 비워 두는 것입니다", what: "할 것 = 달 목록에서 지어낸 처방 · 바람 달과 어긋남", layer: "plan", fix: [[I, "할 것·피할 것 행동 줄만(ACTION_LINE)"], [C, "cardEngineIssues plan_advice_only · wish_conflict"]], det: [], proof: "설계도 고침 — 8장 「할 것」 근거에 달 목록(Y41)·영역 이름(Y42·Y43)을 주지 않음(브리프 검사 plan_advice_only 0)" },
  // ───────── P3 세운 annual-1: 경계 20 ─────────
  { id: "P3A-g1", src: "P3-annual-1", sev: "경계", loc: "1.1 ¶2", frag: "새로 벌이기보다 맡은 자리를 다듬어 보세요", what: "다른 카드 줄을 「니」로 이은 처방", layer: "rule", fix: [[P, "카드 줄 인과 금지 예시"], [C, "card_join"]], det: ["card_join"] },
  { id: "P3A-g2", src: "P3-annual-1", sev: "경계", loc: "1.3", frag: "송금이 먼저인 사람이라, 연락처가 곧 재산이에요", what: "짝 이유 안의 두 말을 인과로", layer: "rule", fix: [[P, "R_MBTI 짝 이유 그대로"]], det: [], proof: "작가 규칙(짝 이유의 나란한 두 말을 인과로) — 짝 이유 한 줄 안이라 결정론으로 가르기 어렵다" },
  { id: "P3A-g3", src: "P3-annual-1", sev: "경계", loc: "2.1 ¶1", frag: "이 해의 연애 신호는 오름입니다", what: "칸 이름·값 직역", layer: "card", fix: [[C, "label_leak"]], det: ["label_leak"] },
  { id: "P3A-g4", src: "P3-annual-1", sev: "경계", loc: "3.2 ¶1", frag: "이 두 달에는 기분 따라 지르는 소비가 늘기 쉬운 쪽이에요", what: "해 줄을 두 달에 묶음(설계도)", layer: "plan", fix: [[I, "근거의 집 장 · 다른 각도 한 줄"]], det: [], proof: "설계도 몫(달 표시 없는 해 줄과 달 목록 줄을 한 소제목에) — 뜻 판단" },
  { id: "P3A-g5", src: "P3-annual-1", sev: "경계", loc: "3.2 ¶2", frag: "어느새 합계가 낯선 숫자가 되어 있기도 합니다", what: "습관 단정(「~기도 합니다」)", layer: "rule", fix: [[P, "경험 가정 금지"]], det: [], proof: "작가 규칙 — 「~기도 합니다」는 일반 서술과 갈리지 않는다" },
  { id: "P3A-g6", src: "P3-annual-1", sev: "경계", loc: "5.1 ¶2", frag: "보고서 수정본에 고칠 곳이 보일 때도", what: "입력 밖 역할(검토자)", layer: "plan", fix: [[P, "personRules 검토 역할 금지"], [I, "장면 씨앗 묶음당 하나"]], det: [], proof: "작가 규칙·설계도(직무 미입력 → 검토 역할 금지 줄, 씨앗 솎기)" },
  { id: "P3A-g7", src: "P3-annual-1", sev: "경계", loc: "7·1~4월(5곳)", frag: "축오해(태어난 날 자리와)는", what: "카드 이름 꼴 노출", layer: "card", fix: [[I, "관계 값 「태어난 날 자리와 축오해」"], [C, "label_leak"]], det: ["label_leak"] },
  { id: "P3A-g8", src: "P3-annual-1", sev: "경계", loc: "7·신축월 ¶2", frag: "이유 없이 서로 미워지는 짝이 만나 사람 관계가 까끌해지는 달입니다", what: "관계 주어 + 「…달입니다」", layer: "card", fix: [[I, "relFlow 「…흐름」"], [C, "subject_unit"]], det: ["subject_unit"] },
  { id: "P3A-g9", src: "P3-annual-1", sev: "경계", loc: "7·갑진월 ¶1", frag: "글자끼리 서로를 눌러 손봐야 할 일이 드러나는 달입니다", what: "관계 주어 + 「…달입니다」", layer: "card", fix: [[I, "relFlow"], [C, "subject_unit"]], det: ["subject_unit"] },
  { id: "P3A-g10", src: "P3-annual-1", sev: "경계", loc: "7·임인월 ¶2", frag: "세 번 말하는 장면이 떠오르죠", what: "습관 단정(떠오르죠)", layer: "rule", fix: [[C, "habit_assert"]], det: ["habit_assert"] },
  { id: "P3A-g11", src: "P3-annual-1", sev: "경계", loc: "7·임인월 ¶3", frag: "궁금했던 돈 공부를 책 한 권으로 시작해 보세요", what: "할 일 씨앗의 「-던」 + key 본문 행동", layer: "card", fix: [[RX, "allocateTodos CARD_TIME 「궁금했던」"], [C, "screen_repeat(key 본문 행동)"]], det: ["screen_repeat"] },
  { id: "P3A-g12", src: "P3-annual-1", sev: "경계", loc: "7·갑진월 ¶3", frag: "연락이 끊긴 오랜 친구 한 명에게", what: "지난 일 전제 할 일 씨앗 + key 본문 행동", layer: "card", fix: [[RX, "CARD_TIME 「연락이 끊긴」"], [C, "screen_repeat"]], det: ["screen_repeat"] },
  { id: "P3A-g13", src: "P3-annual-1", sev: "경계", loc: "7·계묘월 ¶2", frag: "도와주는 사람이 곁에 생기고 쉬는 만큼 회복이 잘 되니", what: "카드 줄 그대로 앞날 확정 + 인과 이음", layer: "card", fix: [[C, "card_join"]], det: ["card_join"] },
  { id: "P3A-g14", src: "P3-annual-1", sev: "경계", loc: "7·기유월 ¶3", frag: "선을 그어 두세요", what: "따옴표 「이번 한 번」 + key 본문 행동", layer: "card", fix: [[C, "screen_repeat"]], det: ["screen_repeat"] },
  { id: "P3A-g15", src: "P3-annual-1", sev: "경계", loc: "7·경술월 ¶3", frag: "할 일 하나를 내일로 넘기세요", what: "상대 시점 말 「내일」", layer: "card", fix: [[C, "time_extra(TIME_REL)"], [RX, "CARD_TIME 「내일」"]], det: ["time_extra"] },
  { id: "P3A-g16", src: "P3-annual-1", sev: "경계", loc: "7·임자월·계축월", frag: "같은 생활 결", what: "칸 이름 「생활 결」", layer: "card", fix: [[I, "같은 생활 결 줄 없음"], [C, "label_leak · CODE"]], det: ["label_leak", "code_leak"] },
  { id: "P3A-g17", src: "P3-annual-1", sev: "경계", loc: "8.3 ¶1", frag: "원국에 쇠(금)이 없어서", what: "조사 호응(쇠(금)이)", layer: "card", fix: [[AN, "luckyOf josa"], [C, "GRAMMAR 쇠(금)이"]], det: ["grammar"] },
  { id: "P3A-g18", src: "P3-annual-1", sev: "경계", loc: "9.1 ¶1", frag: "이 바람은 일과 사람의 영역으로 이어집니다", what: "바람 영역 매핑(좋아하는 사람 → 연애 빠짐)", layer: "card", fix: [[AN, "TOPICS 좋아하는 사람 → 연애 · 바람 달 = 오르고 늦추지 않는 달"], [C, "wish_conflict"]], det: [], proof: "카드·설계도 고침 — 바람 영역에 연애 포함, 바람 달 ↔ 늦출 달 겹침 0(브리프 검사 wish_conflict)" },
  { id: "P3A-g19", src: "P3-annual-1", sev: "경계", loc: "10.2 ¶2", frag: "춤추듯 청소하는 시간에 머리가 정리돼요", what: "습관 단정", layer: "rule", fix: [[P, "경험 가정 금지"]], det: [], proof: "작가 규칙 — 성향 서술과 습관 단정이 결정론으로 갈리지 않는다" },
  { id: "P3A-g20", src: "P3-annual-1", sev: "경계", loc: "10.2 ¶2", frag: "다음 달의 제안이 또렷해집니다", what: "상대 시점 말 「다음 달」", layer: "rule", fix: [[C, "time_extra(TIME_REL)"]], det: ["time_extra"] },
  // ───────── P3 대운 major-1: 차단 2 ─────────
  { id: "P3M-b1", src: "P3-major-1", sev: "차단", loc: "8.1 ¶3", frag: "적어 주신 바람을 향한 걸음도 가벼워집니다", what: "바람 없는 책의 「적어 주신 바람」", layer: "rule", fix: [[P, "R_WISH_* 바람 있을 때만"], [C, "wish_absent"]], det: ["wish_absent"] },
  { id: "P3M-b2", src: "P3-major-1", sev: "차단", loc: "9.1 ¶2", frag: "결단으로 남길 하나를 고르는 일이 쇠의 기운이 돕는 몫이에요", what: "짝 없는 장 명리 × MBTI(앞 문장)", layer: "plan", fix: [[I, "짝 없는 절 나눔"], [C, "pair_link(앞 문장 MBTI)"]], det: ["pair_link"] },
  // ───────── P3 대운 major-1: 경계 20 ─────────
  { id: "P3M-g1", src: "P3-major-1", sev: "경계", loc: "1.1 ¶3", frag: "오늘 밤에는 10년 단위로 내 방향을 한 줄 적어 보세요", what: "시점 말 「오늘 밤」", layer: "rule", fix: [[C, "time_extra(TIME_REL)"]], det: ["time_extra"] },
  { id: "P3M-g2", src: "P3-major-1", sev: "경계", loc: "2.2 ¶2", frag: "같은 일을 하는 동료를 보면", what: "지난 대운(만 22세 전) 직장 소품", layer: "card", fix: [[I, "young() N 줄"], [C, "past_work"]], det: ["past_work"] },
  { id: "P3M-g3", src: "P3-major-1", sev: "경계", loc: "3.1 ¶3", frag: "사무실 에어컨 온도 하나로도 신경이 곤두서는 날이 있어요", what: "경험 단정·일터 전제", layer: "plan", fix: [[C, "habit_assert(날이 있어요)"]], det: ["habit_assert"] },
  { id: "P3M-g4", src: "P3-major-1", sev: "경계", loc: "3.2 ¶3", frag: "그래서 사람 사이에서 정리할 일이 하나씩 보일 수 있어요", what: "관계 줄 뜻을 사람 영역으로", layer: "plan", fix: [[I, "각도 이름 고객 말"]], det: [], proof: "뜻 판단(관계 뜻의 영역 옮김) — 설계도 각도 몫" },
  { id: "P3M-g5", src: "P3-major-1", sev: "경계", loc: "4.2 ¶1", frag: "쓸 말이 이어지는 날이 있을 거예요", what: "앞날 단정(날이 있을 거예요)", layer: "rule", fix: [[C, "habit_assert"]], det: ["habit_assert"] },
  { id: "P3M-g6", src: "P3-major-1", sev: "경계", loc: "5·2027 ¶1", frag: "번뜩임을 값으로 바꾸는 쪽에도 마음이 갑니다", what: "두 카드 줄을 「와서」로 엮어 새 해석(상관생재)", layer: "rule", fix: [[P, "R_BASE 카드 줄 인과 금지 예시(이 문장 그대로)"]], det: [], proof: "판독이 「결정론으로 잡기 어려운 것」으로 둔 꼴(B6) — 앞쪽은 화면 쉬운 뜻 「꾸준한 돈」, 뒤쪽은 지어낸 해석이라 카드 줄과 겹치지 않는다. 같은 판독의 B7·B8은 card_join이 잡는다" },
  { id: "P3M-g7", src: "P3-major-1", sev: "경계", loc: "5·2031 ¶1", frag: "평가와 기준이 또렷해지는 만큼, 남들이 안 보는 분야에서 실력이 쌓이기 좋은 해입니다", what: "다른 십성 줄을 「만큼」으로", layer: "rule", fix: [[C, "card_join"]], det: ["card_join"] },
  { id: "P3M-g8", src: "P3-major-1", sev: "경계", loc: "5·2032 ¶2", frag: "혼자 있고 싶어져 연락이 뜸해지기 쉬우니, 몸을 움직이는 일정도 따로 필요합니다", what: "이유를 다른 줄로(「니」)", layer: "rule", fix: [[P, "R_BASE 카드 줄 인과 금지 예시(이 문장 그대로)"]], det: [], proof: "판독이 「결정론으로 잡기 어려운 것」으로 둔 꼴(B8) — 결과가 처방 꼴(「…필요합니다」)이라 「A하기 쉬우니 B하세요」 같은 바른 처방과 갈리지 않는다(이유가 바뀐 것은 뜻 판단)" },
  { id: "P3M-g9", src: "P3-major-1", sev: "경계", loc: "5·2032 ¶3", frag: "궁금했던 돈 공부를 책 한 권으로 시작해 보세요", what: "할 일 씨앗 「-던」 + key 본문 행동", layer: "plan", fix: [[RX, "CARD_TIME 「궁금했던」"], [C, "screen_repeat"]], det: ["screen_repeat"] },
  { id: "P3M-g10", src: "P3-major-1", sev: "경계", loc: "5·2033 ¶2", frag: "무계합은 태어난 해 자리와 산과 이슬비가 어울려", what: "관계 틀 비문", layer: "rule", fix: [[C, "relation_frame"]], det: ["relation_frame"] },
  { id: "P3M-g11", src: "P3-major-1", sev: "경계", loc: "5·2033 ¶3", frag: "흐름이 잔잔한 편이라 서두를 일이 없습니다", what: "흐름 값에서 앞날 단정 + 화면 사실 되풀이", layer: "rule", fix: [[C, "habit_assert · screen_repeat"]], det: ["habit_assert", "screen_repeat"] },
  { id: "P3M-g12", src: "P3-major-1", sev: "경계", loc: "5·2034 ¶1", frag: "갑기합은 태어난 시각 자리와 나무와 땅이 어울려", what: "관계 틀 비문", layer: "rule", fix: [[C, "relation_frame"]], det: ["relation_frame"] },
  { id: "P3M-g13", src: "P3-major-1", sev: "경계", loc: "5·2035 ¶1", frag: "묘술합은 태어난 달 자리와 꽃과 마른 땅이 만나", what: "관계 틀 비문", layer: "rule", fix: [[C, "relation_frame"]], det: ["relation_frame"] },
  { id: "P3M-g14", src: "P3-major-1", sev: "경계", loc: "6.2 소제목", frag: "사람 곁에서 대등함을 찾는 10년", what: "소제목 조건 지움", layer: "rule", fix: [[C, "HEADING_ASSERT 찾는"]], det: ["heading_form"] },
  { id: "P3M-g15", src: "P3-major-1", sev: "경계", loc: "7.2 ¶1", frag: "내 이름을 걸수록 생각을 더 날카롭게 다듬게 됩니다", what: "짝 문장을 인과로", layer: "rule", fix: [[P, "R_MBTI 같은 나이대 = 같은 시기만"]], det: [], proof: "작가 규칙(짝 이유 「같은 나이대」를 인과로) — 뜻 판단" },
  { id: "P3M-g16", src: "P3-major-1", sev: "경계", loc: "8.1 ¶1", frag: "2026년 무렵의 기준 해는", what: "카드 값 「기준 해」", layer: "card", fix: [["src/lib/brief/design/major.ts", "planNear 「이 책을 쓴 2026년 무렵」"], [C, "CODE 기준 해"]], det: ["code_leak"] },
  { id: "P3M-g17", src: "P3-major-1", sev: "경계", loc: "8.1 ¶1", frag: "남의 일을 돕는 데서 내 이름을 건 일 쪽으로", what: "입력 밖 가정에 가까운 단정", layer: "rule", fix: [[P, "personRules"]], det: [], proof: "뜻 판단 — 결정론으로 가르기 어렵다(판독 제안 「결정론으로 잡기 어려운 것」)" },
  { id: "P3M-g18", src: "P3-major-1", sev: "경계", loc: "8.2 ¶2", frag: "10년 뒤의 수입은 5년 뒤에 정해 둔 원칙 위에서 자랍니다", what: "돈 결과 단정", layer: "rule", fix: [[P, "결과 단정 금지"]], det: [], proof: "뜻 판단(판독 제안 「결정론으로 잡기 어려운 것」)" },
  { id: "P3M-g19", src: "P3-major-1", sev: "경계", loc: "9.2 ¶1", frag: "ENTP의 가장 센 쪽인 가능성이", what: "칸 이름 「가장 센 쪽」", layer: "card", fix: [[I, "MBTI 줄 칸 이름 뺌"], [C, "CODE 가장 센 쪽인"]], det: ["code_leak"] },
  { id: "P3M-g20", src: "P3-major-1", sev: "경계", loc: "9.2 ¶3", frag: "다음 연락처를 열면", what: "조사 빠짐 비문", layer: "rule", fix: [], det: [], proof: "작가 비문(조사 빠짐) — 결정론으로 가르기 어렵다" },
];
