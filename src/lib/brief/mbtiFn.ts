/**
 * MBTI 기능·태도 태그(P6e 4). MBTI 특성 문장(행동 차원 양끝·장면 씨앗·직무 조건)에 "이 문장을 만드는 기능(Si·Fe…)·태도(E/I·J/P)"를 단다.
 * 유형의 기능 네 개(주·부·3차·열등, compat FUNCTION_STACK)와 E/I·J/P 글자에 맞지 않는 문장은 그 유형에게 쓰지 않는다.
 * 예: ISFP(Fi·Se·Ni·Te)에게 "숫자·날짜·순서 같은 구체 사실부터 확인"(Si), "말하지 않아도 필요한 것을 먼저 준비"(Fe·Si), "모임이 끝나면 오히려 기운이 남"(E)은 맞지 않는다.
 * 태그가 비어 있으면 어느 유형에도 쓸 수 있는 행동이다(기능 하나로 갈리지 않는 행동).
 */
import { FUNCTION_STACK } from "@/lib/compat/score";

export type Fn = "Ni" | "Ne" | "Si" | "Se" | "Ti" | "Te" | "Fi" | "Fe";
export type Att = "E" | "I" | "J" | "P";
/** fn: 이 가운데 하나가 유형의 네 기능에 있어야 한다. att: 이 글자가 모두 유형 이름에 있어야 한다. */
export type FnTag = { readonly fn?: readonly Fn[]; readonly att?: readonly Att[] };

export const stackOf = (type: string): readonly string[] => (FUNCTION_STACK as Record<string, readonly string[]>)[type] ?? [];
export function tagFits(type: string | null | undefined, tag: FnTag | undefined): boolean {
  if (!type || !tag) return true;
  const stack = stackOf(type);
  if (!stack.length) return true;
  return (!tag.fn?.length || tag.fn.some(f => stack.includes(f))) && (!tag.att?.length || tag.att.every(a => type.includes(a)));
}
export const tagLabel = (t: FnTag) => [...(t.fn ?? []), ...(t.att ?? [])].join("·");

/**
 * 행동 차원 양끝(behavior-ontology.json 31차원)의 기능·태도 태그. 키 = "차원+" / "차원-".
 * 기능 하나로 갈리지 않는 끝(소유·끈기의 +·통제의 - 등)은 비워 둔다.
 */
export const POLE_TAGS: Readonly<Record<string, FnTag>> = {
  "directness+": { fn: ["Te", "Ti"] }, "directness-": { fn: ["Fe", "Fi"] },
  "decisionSpeed+": { fn: ["Te", "Se"] }, "decisionSpeed-": {},
  "riskTaking+": { fn: ["Se", "Ne"] }, "riskTaking-": { fn: ["Si"] },
  "emotionalExpression+": { fn: ["Fe", "Se", "Ne"] }, "emotionalExpression-": { fn: ["Fi", "Ti"] },
  "controlNeed+": { fn: ["Te", "Fe"], att: ["J"] }, "controlNeed-": {},
  "persistence+": {}, "persistence-": { fn: ["Ne", "Se"], att: ["P"] },
  "socialEnergy+": { att: ["E"] }, "socialEnergy-": { att: ["I"] },
  "ruleAdherence+": { fn: ["Si", "Te"], att: ["J"] }, "ruleAdherence-": {},
  "perfectionism+": { fn: ["Si", "Ti", "Te"] }, "perfectionism-": { fn: ["Ne", "Ni"] },
  "possessiveness+": {}, "possessiveness-": {},
  "independence+": {}, "independence-": { att: ["E"] },
  "empathyResponse+": { fn: ["Fe", "Fi"] }, "empathyResponse-": { fn: ["Te", "Ti"] },
  "noveltySeeking+": { fn: ["Ne", "Se"] }, "noveltySeeking-": { fn: ["Si"] },
  "planning+": { att: ["J"] }, "planning-": { att: ["P"] },
  "competitiveness+": {}, "competitiveness-": {},
  "trustThreshold+": { fn: ["Ti", "Te", "Si"] }, "trustThreshold-": {},
  "verbalOutput+": { att: ["E"] }, "verbalOutput-": { att: ["I"] },
  "detailFocus+": { fn: ["Si"] }, "detailFocus-": { fn: ["Ni", "Ne"] },
  "mobility+": { fn: ["Se", "Ne"] }, "mobility-": { fn: ["Si"] },
  "attentionSeeking+": { att: ["E"] }, "attentionSeeking-": {},
  "caretaking+": { fn: ["Fe", "Si"] }, "caretaking-": {},
  "spendingControl+": { fn: ["Si", "Te"] }, "spendingControl-": { fn: ["Se", "Ne"] },
  "statusDrive+": { fn: ["Te"] }, "statusDrive-": { fn: ["Fi", "Ti"] },
  "reactivity+": {}, "reactivity-": { att: ["I"] },
  "introspection+": { fn: ["Fi", "Ni"] }, "introspection-": { fn: ["Te", "Se"] },
  "inquiry+": { fn: ["Ti", "Ne", "Ni"] }, "inquiry-": { fn: ["Si", "Fe"] },
  "dutifulness+": {}, "dutifulness-": { att: ["P"] },
  "conflictApproach+": { fn: ["Te", "Se", "Fe"] }, "conflictApproach-": {},
  "learningDrive+": { fn: ["Ne", "Ni", "Ti"] }, "learningDrive-": { fn: ["Se", "Si"] },
  "intimacyPace+": { att: ["E"] }, "intimacyPace-": { att: ["I"] },
  "boundarySetting+": { fn: ["Te", "Ti"] }, "boundarySetting-": { fn: ["Fe", "Fi"] },
};
export const poleKey = (dim: string, value: number) => `${dim}${value > 0 ? "+" : "-"}`;
/** 이 유형이 이 차원 끝의 행동을 근거로 말해도 되는가. */
export const poleFits = (type: string | null | undefined, dim: string, value: number) => tagFits(type, POLE_TAGS[poleKey(dim, value)]);

/**
 * 직무가 요구하는 행동(안 맞는 조건을 그 직무 쪽에서 말할 때). 사람의 성향 설명("ISFP는 ~하는 편")을 반대 끝으로 빌리지 않는다
 * (P6d 커리어: ISFP 조건에 "모임이 끝나면 오히려 기운이 나는 사람의 역할"이 붙어 ISFP 특성처럼 읽혔다).
 */
export const POLE_DEMAND: Readonly<Record<string, string>> = {
  "directness+": "틀린 것을 그 자리에서 바로 짚어야 하는 일", "directness-": "상대 기분을 살피며 말을 돌려야 하는 일",
  "decisionSpeed+": "몇 가지만 보고 바로 결정해야 하는 일", "decisionSpeed-": "선택지를 오래 비교해야 하는 일",
  "riskTaking+": "해 본 적 없는 일을 일단 벌여야 하는 일", "riskTaking-": "검증된 절차만 따라야 하는 일",
  "emotionalExpression+": "기분을 겉으로 보여 줘야 하는 일", "emotionalExpression-": "속상해도 티 내지 않아야 하는 일",
  "controlNeed+": "역할과 순서를 직접 정해 끌고 가야 하는 일", "controlNeed-": "남이 정한 순서를 그대로 따라야 하는 일",
  "persistence+": "진도가 더뎌도 한 가지를 끝까지 붙들어야 하는 일", "persistence-": "흥미가 식으면 바로 다른 일로 옮겨야 하는 일",
  "socialEnergy+": "사람을 계속 만나며 기운을 써야 하는 일", "socialEnergy-": "오래 혼자 머물러야 하는 일",
  "ruleAdherence+": "절차와 기한을 예외 없이 지켜야 하는 일", "ruleAdherence-": "정해진 규칙보다 내 판단으로 길을 바꿔야 하는 일",
  "perfectionism+": "오타 하나, 숫자 하나까지 맞춰야 하는 일", "perfectionism-": "세부는 넘기고 속도를 내야 하는 일",
  "possessiveness+": "내 자리와 몫을 분명히 지켜야 하는 일", "possessiveness-": "내 것을 나눠 쓰고 빌려줘야 하는 일",
  "independence+": "도움 없이 혼자 풀어야 하는 일", "independence-": "처음부터 사람을 모아 함께 풀어야 하는 일",
  "empathyResponse+": "상대 표정을 읽고 감정부터 받아 줘야 하는 일", "empathyResponse-": "감정보다 해결책부터 내놓아야 하는 일",
  "noveltySeeking+": "늘 새것을 찾아 바꿔야 하는 일", "noveltySeeking-": "같은 방식을 오래 반복해야 하는 일",
  "planning+": "일정표와 준비물을 미리 짜 둬야 하는 일", "planning-": "계획 없이 그때그때 맞춰야 하는 일",
  "competitiveness+": "순위와 실적으로 겨뤄야 하는 일", "competitiveness-": "남과 견주지 않고 내 기준만 봐야 하는 일",
  "trustThreshold+": "조건을 하나하나 따져야 하는 일", "trustThreshold-": "상대 말을 믿고 바로 움직여야 하는 일",
  "verbalOutput+": "말을 많이 하며 풀어내야 하는 일", "verbalOutput-": "말을 아끼고 들어야 하는 일",
  "detailFocus+": "숫자·날짜·순서를 하나하나 맞춰야 하는 일", "detailFocus-": "세부보다 전체 방향을 먼저 잡아야 하는 일",
  "mobility+": "출장과 이동이 잦은 일", "mobility-": "한자리에서 오래 쌓아야 하는 일",
  "attentionSeeking+": "앞에 나서 발표하고 주목받아야 하는 일", "attentionSeeking-": "뒤에서 조용히 받쳐야 하는 일",
  "caretaking+": "남의 필요를 먼저 알아채 챙겨야 하는 일", "caretaking-": "부탁받은 몫만 하고 나서지 않아야 하는 일",
  "spendingControl+": "가격을 비교하고 지출을 막아야 하는 일", "spendingControl-": "경험에 돈을 아끼지 않아야 하는 일",
  "statusDrive+": "직함과 평가를 올리려 겨뤄야 하는 일", "statusDrive-": "남이 몰라줘도 묵묵히 해야 하는 일",
  "reactivity+": "거슬리는 말에 그 자리에서 받아쳐야 하는 일", "reactivity-": "그 자리에서는 넘기고 참아야 하는 일",
  "introspection+": "내 기분을 오래 들여다봐야 하는 일", "introspection-": "기분보다 할 일에 바로 붙어야 하는 일",
  "inquiry+": "이유를 끝까지 따져 물어야 하는 일", "inquiry-": "이유를 묻지 않고 지시대로 따라야 하는 일",
  "dutifulness+": "맡은 일을 힘들어도 끝까지 혼자 짊어져야 하는 일", "dutifulness-": "역할을 상황 따라 내려놓아야 하는 일",
  "conflictApproach+": "불편한 문제를 그 자리에서 꺼내 정리해야 하는 일", "conflictApproach-": "부딪힐 일을 피하고 시간을 둬야 하는 일",
  "learningDrive+": "일과 상관없는 공부까지 계속해야 하는 일", "learningDrive-": "아는 것만으로 반복해야 하는 일",
  "intimacyPace+": "처음 본 사람과 빨리 가까워져야 하는 일", "intimacyPace-": "오래 지켜본 뒤에야 마음을 열어도 되는 일",
  "boundarySetting+": "무리한 부탁을 분명히 거절해야 하는 일", "boundarySetting-": "부탁을 받으면 내 일을 미루고 들어줘야 하는 일",
};

/**
 * 문장 단서 → 기능·태도(장면 씨앗·신호 문장 검사용, 결정론). 유형 파일 안의 문장이 그 유형의 기능·태도와 어긋나는지 본다.
 * 단서는 뜻이 분명한 꼴만 둔다(넓게 잡으면 맞는 문장까지 걸린다).
 */
export const FN_CUES: readonly { readonly re: RegExp; readonly tag: FnTag; readonly why: string }[] = [
  { re: /구체 사실(부터|을 하나씩)|숫자[,·와 ]{1,3}날짜|하나씩 확인|지난번(과|처럼) 같은 순서|예전 기록(부터|을 꺼내)|늘 하던 순서/, tag: { fn: ["Si"] }, why: "지난 경험·구체 사실 확인(Si)" },
  { re: /말하지 않아도 (필요한 것|먼저)|부탁(하기|받기) 전에 (먼저 )?(챙|준비)|분위기를 (먼저 )?맞추|모두의 기분을 (먼저 )?(살피|챙기)/, tag: { fn: ["Fe", "Si"] }, why: "주변 마음 먼저 챙기기(Fe)" },
  { re: /모임이 끝나면 (오히려 )?(기운|힘)이 (나|솟)|사람 (속|사이)에서 (충전|기운을 얻)|사람을 만나야 (힘|기운)이 (나|난)/, tag: { att: ["E"] }, why: "사람 속에서 충전(E)" },
  { re: /약속이 (이어지|연달아 잡히)면 지(쳐|친)|혼자 (있는|보내는) 시간이 (꼭|반드시) (있어야|필요)|혼자서 충전/, tag: { att: ["I"] }, why: "혼자서 충전(I)" },
  { re: /전날 (미리 )?(정리|챙겨|짜)|일정표를 (미리|먼저) (짜|만들)|계획표대로|예정대로 (움직|진행)/, tag: { att: ["J"] }, why: "미리 짜는 생활(J)" },
  { re: /닥쳐서 (정하|하)|계획 없이 (떠나|움직)|그때그때 (정하|바꾸)/, tag: { att: ["P"] }, why: "그때그때 정하는 생활(P)" },
  { re: /원리(부터|를 따지)|논리(가|부터) 맞는지|정의(부터|를 먼저) (따지|세우)/, tag: { fn: ["Ti", "Te"] }, why: "논리로 따지기(Ti)" },
  { re: /몸으로 (먼저 )?느끼|촉감|그 자리의 (온도|공기)를 (바로|먼저)/, tag: { fn: ["Se", "Si"] }, why: "감각으로 먼저 느끼기(Se)" },
];
export function cueTags(text: string): { tag: FnTag; why: string; re: RegExp }[] {
  return FN_CUES.filter(c => c.re.test(text)).map(c => ({ tag: c.tag, why: c.why, re: c.re }));
}
/** 유형에 맞지 않는 단서(없으면 빈 배열). */
export const cueMisfits = (type: string, text: string) => cueTags(text).filter(c => !tagFits(type, c.tag));

/**
 * 행동 차원 끝의 본문 단서(래칫 ② 'MBTI 행동 특성'과 원고 검사 mbti_misattr가 쓴다). 설명 문장의 핵심 꼴만.
 */
export const POLE_CUES: Readonly<Record<string, RegExp>> = {
  "directness+": /결론부터 말|그 자리에서 (바로 )?짚/, "directness-": /말을 고르느라|돌려 말/,
  "decisionSpeed+": /두세 가지만 보고|뒤돌아보지 않/, "decisionSpeed-": /선택지를 (다 )?늘어놓|결정을 미루/,
  "riskTaking+": /일단 (시작|해 보)|가면서 고치/, "riskTaking-": /검증된 방법|보장된 결과/,
  "emotionalExpression+": /기분이 (바로|표정에) 묻어|표정과 말에/, "emotionalExpression-": /티를 (내지 않|안 내)|속상해도/,
  "controlNeed+": /역할과 순서를 (내가|직접) 정/, "controlNeed-": /누가 이끌든|정해진 대로 따라가/,
  "persistence+": /끝을 보는|정한 일은 끝까지/, "persistence-": /흥미가 식으면/,
  "socialEnergy+": /모임이 끝나면 (오히려 )?(기운|힘)/, "socialEnergy-": /약속이 이어지면 지|혼자 있는 시간이 꼭/,
  "ruleAdherence+": /절차와 기한을 그대로|예외를 싫어/, "ruleAdherence-": /더 나은 길이 보이면/,
  "perfectionism+": /오타 하나|숫자 하나가 틀리/, "perfectionism-": /큰 틀이 맞으면/,
  "possessiveness+": /내 물건, 내 자리|경계를 분명히/, "possessiveness-": /빌려주고 나누/,
  "independence+": /일단 혼자 해 보|막히면 그때 묻/, "independence-": /처음부터 사람을 모아/,
  "empathyResponse+": /표정 변화를 먼저/, "empathyResponse-": /해결책부터 말/,
  "noveltySeeking+": /안 가 본|안 해 본 일/, "noveltySeeking-": /늘 가던 곳|늘 하던 방식/,
  "planning+": /전날 (미리 )?정리|일정표와 준비물/, "planning-": /닥쳐서 정하|그때그때/,
  "competitiveness+": /등수와 순위|순위가 보이면/, "competitiveness-": /내 기준만 보고/,
  "trustThreshold+": /조건을 하나하나 따져/, "trustThreshold-": /그대로 믿고/,
  "verbalOutput+": /바로바로 말로/, "verbalOutput-": /필요한 말만 짧게|듣는 쪽에 서/,
  "detailFocus+": /구체 사실|숫자, 날짜|숫자와 날짜/, "detailFocus-": /전체 방향부터|큰 그림(부터|을 먼저)/,
  "mobility+": /출장, 이사|자리가 바뀌는 일/, "mobility-": /같은 자리에서 오래/,
  "attentionSeeking+": /가운데에 서|발표를 자원/, "attentionSeeking-": /뒤에서 챙기는/,
  "caretaking+": /말하지 않아도 필요한/, "caretaking-": /부탁받기 전에는 나서지/,
  "spendingControl+": /가격을 비교|지출을 미루/, "spendingControl-": /가격보다 경험/,
  "statusDrive+": /직함과 평가/, "statusDrive-": /내가 만족하면 그만/,
  "reactivity+": /그 자리에서 받아치/, "reactivity-": /나중에 곱씹/,
  "introspection+": /왜 그런 기분이 드는지/, "introspection-": /기분보다 (지금 )?할 일/,
  "inquiry+": /납득될 때까지/, "inquiry-": /이유를 묻지 않고/,
  "dutifulness+": /맡은 일은 힘들어도|남에게 넘기지 않/, "dutifulness-": /상황에 따라 내려놓/,
  "conflictApproach+": /그 자리에서 정리하/, "conflictApproach-": /자리를 피하고 시간을/,
  "learningDrive+": /강의와 책을 찾아/, "learningDrive-": /지금 쓰는 지식으로 충분/,
  "intimacyPace+": /속 이야기를 꺼내/, "intimacyPace-": /오래 지켜본 뒤에야/,
  "boundarySetting+": /분명히 거절/, "boundarySetting-": /내 일을 미루고라도/,
};
