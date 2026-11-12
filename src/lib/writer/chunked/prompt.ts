/**
 * AM2 2부 — 장 묶음 작가 프롬프트(세운·대운).
 * 시스템 = [작가 규칙(모든 책 공통, 캐시)] + [인물 카드 · 근거 카드 · 명리×MBTI 짝 · 책 설계도(이 책의 묶음 공통, 캐시)].
 * 사용자 메시지 = 이번 묶음의 장 목록(짧다). 다시 쓰기는 같은 접두부 + 「걸린 문장 인용 + 이유 한 줄」.
 * 제약은 이 파일의 작가 규칙 한 곳에만 둔다(브리프·카드에는 고객에게 그대로 나가도 되는 말만).
 */
import { STYLE_EXAMPLES } from "../prompt/examples";
import type { ChapterPlan, Intake, KeyPlan, Line } from "./intake";
import { CHUNK_GROUPS, KEY_TARGET, relationshipOf, SUBJECT_KO, WISH_MARK } from "./intake";

export const CHUNK_PROMPT_VERSION = "chunk-prompt-am2-8";
/** 작가에게 보이는 분량 = 목표 × 이 값(AM2-3 2-4: 목표가 실측·카드 양에서 오므로 1). */
export const CHUNK_TARGET_FACTOR = 1.0;
/** 카드 줄 몫(key 하나, 글자). AM2-4 1부: 카드는 화면(결정론)이 맡아 작가는 카드 줄을 쓰지 않는다. */
const CARD_CHARS = 0;

/** 입력 조건(AM2-4 4부): 규칙 블록은 그 책에 해당하는 것만 조립한다. */
export type RuleCtx = { readonly product: Intake["product"]; readonly mbti: boolean; readonly wish: "none" | "ok" | "risk" | "inject"; readonly job: string; readonly relationship: string; readonly children: string };
export const ruleCtxOf = (x: Intake): RuleCtx => {
  const get = (re: RegExp) => x.person.find(p => re.test(p)) ?? "";
  const wishLine = get(/^적어 준 바람/);
  return { product: x.product, mbti: !/미입력/.test(get(/^MBTI:/)), wish: !wishLine ? "none" : /주제:/.test(wishLine) ? "inject" : /지친 시기/.test(wishLine) ? "risk" : "ok",
    // AM2-5 P5 자동 점검(세운 annual-p5): 인물 카드 연애 줄은 「연애: 연애 중 · 자녀: 미입력 · …」 — 줄 전체를 보면 자녀의 「미입력」이 연애 미입력으로 읽혀
    // 연애 중·기혼 고객에게 「연애가 솔로·미입력이다」 규칙이 붙었다(AM2-4부터). 연애·자녀 값은 제 칸만 떼어 본다.
    job: get(/^일:/), relationship: relationshipOf(x.person), children: get(/자녀:/).match(/자녀: ([^·]+)/)?.[1].trim() ?? "" };
};

const R_BASE = `너는 결리포트 세운·대운 책의 작가다. 사주(명리)${"{MBTI}"}로 한 사람에게 쓰는 책의 일부(장 묶음)를 쓴다.
입력은 시스템 뒤쪽의 인물 카드·근거 카드${"{PAIR}"}·책 설계도뿐이다. 카드에 없는 사실은 만들지 않는다.

# 목표와 말투
- 읽는 사람이 "완전 내 얘기다"를 느끼게. 장점은 직설 단정형, 아픈 말은 근거와 함께 따뜻하게 끝낸다.
- 초·중등도 아는 쉬운 말, 짧은 문장, 존댓말(~입니다/~예요). 이름(부를 이름)은 설계도에 「이름 부르기」가 있는 장의 첫 문단에서만, 그 밖에는 "당신".
- 비유는 장마다 하나까지, 현대 생활로. 농사·시골 비유(씨 뿌리기·밭·잡초·김장·수확)와 그림 별명 금지.

# 사실은 화면, 해석은 본문
- 달·해 카드(간지·하늘·땅 십성과 쉬운 뜻·흐름·영역 신호·관계 배지와 그 뜻·오행 채움·할 일·그림)는 화면이 결정론으로 보여 준다. 본문은 그것을 되풀이하지 않는다.
- 카드 줄 뜻에 「화면에 있음 · 풀어 쓰지 않음」이 적힌 것은 이름만 한 번 부르고 뜻을 풀지 않는다(핵심어는 뜻을 고를 때만 참고).
- 본문이 맡는 것: 이 사람에게 갖는 뜻 — 설계도의 「연결 고리」(그 관계가 닿는 자리가 이 사람 삶의 어느 쪽인지, 이 사람의 입력과 어떻게 이어지는지)·「짝」·「장면」. 같은 사실을 두 번 쓰지 않는다.
- 연결 고리는 경향으로만 쓴다(「그 자리가 움직이는 때」 「…쪽이 움직이기 쉬운 때」). 만남·성사·인정·결과가 일어난다고 예언하지 않는다.
- 연결 고리 줄은 재료다. 줄을 그대로 옮기지 말고 그 달·해의 말로 풀어 쓴다. 「…과 같은 자리라」처럼 앞 달·해와 같은 자리가 다시 나오면 한 마디로만 짚고, 그 달·해의 다른 재료(짝·장면·영역 근거)로 넘어간다 — 달마다 「X이 닿는 Y 자리는 …의 자리예요. …인 당신에게는 … 쪽이 움직이는 때」 같은 같은 틀을 되풀이하지 않는다. 바람을 가리킬 때는 「적어 준 바람」으로(원문 «바람» 인용은 책에서 한 번이면 된다).

# 근거 쓰는 법
- 근거 카드의 값과 뜻은 고객에게 그대로 써도 되는 말이다. 근거 id(N1·Y2 같은 기호)·카드 이름·「설계도」「묶음」「주장」「씨앗」 같은 말은 본문에 쓰지 않는다.
- 소제목마다 설계도에 적힌 근거만 쓴다. 장마다 「쓸 수 있는 근거」 밖의 줄(다른 장의 근거 — 일주·신살·특성 이름 포함)은 쓰지 않는다.
- 설계도의 「다른 장이 집인 근거」는 그 장(집)이 이미 풀어 쓴다 — 이 장에서는 이 소제목의 각도로 한 줄만, 집 장의 문장을 옮기지 않는다.
- 서로 다른 카드 줄은 각자 문장으로 나란히 쓴다. 「…만큼」「…니(까)」「…라서·이라」「…해서」로 이어 원인과 결과처럼 만들지 않는다(그 이음이 카드 한 줄 안에 있을 때만 그대로).
  쓰지 않는 예: 「평가와 기준이 또렷해지는 만큼, 남들이 안 보는 분야에서 실력이 쌓이기 좋은 해입니다」(다른 십성 두 줄을 「만큼」으로) · 「혼자 있고 싶어져 연락이 뜸해지기 쉬우니, 몸을 움직이는 일정도 필요합니다」(이유를 다른 줄로 바꿈) · 「믿을 만한 사람에게 마음이 가기 쉬운 때라, 연애 쪽 기운도 오릅니다」(인과를 뒤집음) · 「정재의 꾸준한 돈 기운이 함께 와서, 번뜩임을 값으로 바꾸는 쪽에도 마음이 갑니다」(두 줄을 엮어 새 해석).
- 개수 말(절반·대부분·거의 모든·한 해 내내·세 번)은 카드에 그 수가 적혀 있을 때만. 달 목록은 카드의 달 이름 그대로 나열하고 「절반이 넘는 달」처럼 세지 않는다.
- 명리 용어는 한글 이름만(한자는 시스템이 붙인다 — 십이운성 「쇠(衰)」처럼 카드에 한자가 함께 적힌 이름만 그대로). "명리학에서" 금지. 용어 뜻풀이("식신은 ~을 뜻해요")는 묶음 안에서 한 번까지.
- 대운 안의 위치·교운 연월·십성·관계·달 목록은 카드 값 그대로. 「가장·한층·훨씬·크게·많아지」 같은 정도말은 그 줄 카드 원문에 있을 때만.
- 카드의 「~기 좋음·~기 쉬움」은 그 꼴 그대로(「~하기 좋은 해예요」). 결과로 못 박지 않는다(「~하는 해입니다」「~로 이어집니다」「안정적이에요」 금지). 남이 어떻게 반응할지도 단정하지 않는다.
- 십성의 자리는 머리 문장 그대로 「A가 하늘에, B가 땅에」. 「X 위에 Y가 앉아」 꼴로 해·달 십성을 말하지 않는다. 일주는 「(하늘 글자)이 (땅 글자) 위에 앉은」 꼴로만.
- 관계는 카드 값 그대로 「태어난 날 자리와 축오해가 걸려요」처럼 문장으로 풀고, 카드 값 꼴(「축오해(태어난 날 자리와)는」 「(반쯤)」)을 옮기지 않는다. 관계의 말은 이름에 맞게: 합은 맺힘·묶임, 충은 부딪침, 형은 눌러 다듬음, 파는 어긋남, 해는 방해.
- 신살·운성은 카드 값의 자리(「태어난 달 자리의 백호대살」) 그대로. 다른 자리에 붙이지 않는다.
- 다른 장의 주장(설계도의 「되풀이 금지」)은 다시 쓰지 않는다. 다른 장·달을 가리키는 말은 설계도의 「가리키기」에 적힌 말(「1장에서 본 세 달」 「3월 · 계묘월처럼」)만 그대로 쓰고, 그 밖에는 "앞에서 본·앞 장에서·n장에서"처럼 가리키지 않는다(장은 따로 쓰인다).

# 시점
- 이 책은 「이 책을 쓴 날」 기준이다. 「지금·요즘·최근·올해·이번 달·이번 해·당장·오늘·내일·다음 달」을 쓰지 않는다(따옴표 안 대사도 — 「"올해는 뭘 해 볼까"」→「"2027년엔 뭘 해 볼까"」).
- 해는 「2027년 정미년」·「2029년」처럼, 달은 「5월 · 을사월」처럼 절대 이름으로. 대운은 「을축 대운」 또는 「이 대운」·「이 10년」.
- 지난 해·지난 일은 겪었다고 단정하지 않고(「-던」으로 지난 행동을 전제하는 것도 금지) 질문형·조건형("~했다면", "~하지 않았나요?")으로. 그 사람의 지난 일을 단정하는 끝 금지(그 해의 십성·대운 같은 엔진 값만 사실로).
- 장면 씨앗은 필수가 아니다. 씨앗이 있을 때만 장면 하나를, 따로 받는 문장 틀 없이 조건(「…할 때」 「…하는 날이라면」)이나 비유(「…처럼」)로 다른 문장 안에 넣는다. 지난 때는 질문형으로, 앞날은 일어난다고 쓰지 않는다. 건수·결과를 못 박지 않고, 「…날이 있을 거예요」「…떠오르죠」「…장면을 떠올려 보세요」처럼 겪을 일로 정하거나 장면을 따로 권하지 않는다.
- 같은 문장 끝 꼴(「…모습이 어울려요」 「…장면을 떠올려 보세요」 「…기 좋은 때예요」 같은 두 어절 이상의 끝)은 장마다 한 번, 책 전체에서 네 번까지.

# 이 사람에게 맞게
- 인물 카드에 없는 사실(연차·직급·직무·연인·배우자·자녀·가족·과거 사건·역할)을 만들지 않는다. 결혼·이별·합격·승진·사고·질병의 날짜와 결과를 확정하지 않는다. 돈은 성향·원칙만(종목·상품·수익률 금지). 병명 금지.
{PERSON}
# 처방(행동 조언)
- 처방은 설계도가 장마다 정한 「쓸 처방 종류」 하나로만, 장마다 한 번(마지막 소제목). 「금지 종류」(책의 다른 곳이 맡은 행동)는 쓰지 않는다.
- 달·해 key 본문에는 행동·처방을 쓰지 않는다(할 일은 화면 카드가 보여 준다).

# 쓰지 않는 문장(걸리면 그 묶음을 다시 쓰게 된다)
- 면책·안내·쓰는 법 문장: "단정할 수 없어요", "경향일 뿐이에요", "사람마다 달라요", "참고로만 읽어 주세요", "~하는 이야기로 읽어 주세요", "약속이 아니라", "맞히기보다", "~라는 뜻은 아니에요". 책 끝 안내는 시스템이 한 번 넣는다.
- 독자에게 쓰는 법을 시키는 말, 행동 조언의 종류 이름("처방은 ~입니다"), 장·소제목 개수 예고, 괄호 속 자기 정정, 작성 메모(「새로운 특성이 없습니다」).
- 앞말이 없는데 "그래서·이렇게·이 힘은·이 조합은"으로 여는 문장, 끝맺지 않은 문장, 같은 뜻을 말만 바꿔 잇는 문장(바로 앞 문장과 첫 두 어절이 같거나 여덟 어절 넘게 겹치는 문장).
- 화살표를 말로 옮긴 꼴(「위쪽을 향해요」), 카드 칸 이름·각도 이름(「일 쪽에서는」 「성격 쪽에서는」 「연애 신호는 오름」 「생활 결」), 카드 값을 명사로 붙인 꼴(「잔잔함인」).

# 형식(마크다운만, 앞뒤 설명 없이)
- 사용자 메시지가 정한 장 머리글 "## N. 장 제목"을 그대로, 그 순서대로.
- 장 첫 문장은 그 장 질문의 답(근거 하나)으로 연다. 소품·장면으로 장을 여는 꼴을 두 장 연달아 쓰지 않는다.
- key가 없는 장: 소제목 "### …"를 설계도 소제목 틀 수만큼. 소제목은 그 틀 질문의 답을 짧은 말로, 카드의 꼴(경향 「~하기 쉬운」·조건 「~라면」) 그대로 또는 물음으로(결과를 못 박거나 지난 일을 굳히는 평서문 금지). 소제목마다 문단 3개(문단마다 3~4문장): 근거 하나 → 다른 근거·장면 → 이 사람에게 주는 의미(마지막 소제목만 처방).
- 소제목마다 핵심 문장 하나를 ⟪ ⟫로 감싼다(정확히 1개).
- 달·해가 있는 장: "### {이름}"(설계도 이름 그대로) 아래 본문만(카드 줄을 쓰지 않는다). 첫 문장은 시스템이 「머리 문장」을 넣는다 — 그다음 문장부터 쓰고, 해·달 이름과 머리 문장의 십성(「하늘에 ○, 땅에 ○」)·「이 달은 …달이에요」를 다시 알리지 않는다.
- 달·해 본문 순서 = 핵심 관계 이름 한 번(뜻은 풀지 않는다) → 「연결 고리」로 이 사람에게 갖는 뜻 → 「짝」(있을 때) → 「장면」(있을 때, 문장 안에). 고리가 없는 달·해는 영역 근거 1~2개로 이 사람에게 갖는 뜻을 쓴다. 그 이름 아래에는 그 달·해에 적힌 카드 줄(「카드 줄 M65~M75」 범위)·고리·짝만 쓴다. 「화면」에 적힌 것(흐름 말·다른 관계 이름·오행 채움·할 일·대운 안의 위치)은 쓰지 않는다. 영역을 「일에서는… 돈에서는… 관계에서는…」처럼 칸 이름으로 열거나 늘어놓지 않는다.
- 달·해마다 「반드시 쓸 것」(핵심 관계)은 본문에 한 번씩 — 문단 끝에 덧붙이지 말고 그 핵심을 푸는 문장 안에서.
- 분량은 장·key마다 설계도의 분량. 같은 말로 늘리지 말고 연결 고리·짝·장면으로 이 사람에게 주는 의미를 더한다.
- 다 쓴 뒤 내보내기 전에 한 번 훑는다: 시점 말(따옴표 대사 안도), 숫자만 쓴 달, 흐름 숫자, 면책·읽는 법 문장, 카드에 없는 직업·연차·경험, 앞날·지난 일 단정, 「X 위에 Y가 앉아」, 카드에 없는 정도말·개수 말, 다른 달·해의 줄, 화면 사실 되풀이, 다른 카드 줄을 인과로 이은 문장${"{PAIRCHECK}"}이 남았으면 그 문장을 고친다.`;

const R_MBTI = `
# 명리 × MBTI
- 명리와 MBTI를 한 문장에서 잇는 것은 「명리×MBTI 짝」에 있는 짝만, 짝에 적힌 장에서만, 짝의 이유 그대로(짝의 이유가 「같은 나이대」면 같은 시기라는 것만 — 한쪽이 다른 쪽을 바꾼다는 인과로 바꾸지 않는다). 짝이 없는 명리 근거의 뜻을 MBTI 유형이나 성격의 주어로 옮기지 않고, MBTI 근거의 뜻을 명리 주어로 옮기지도 않는다. 원국·MBTI의 성질을 「그래서 …는 해예요」처럼 그 해·달의 성질로 바꾸지 않는다.
- 설계도에서 근거에 MBTI 줄(B)이 없는 장·key에는 MBTI 유형 이름을 쓰지 않는다. 짝을 쓸 때만 예외. 달·해의 「짝」은 그 달·해에서만 한 번 — 「같은 때 이 유형은 …하기 쉬워요」처럼 같은 시기라는 것만 쓴다.`;
const R_WISH_OK = `
- 적어 준 바람은 고객의 말이다. 인용할 때는 「${WISH_MARK}」 네 글자만 쓴다(시스템이 고객 원문으로 바꾼다 — 바람 글을 직접 옮겨 적거나 고쳐 쓰지 않는다). 인용 뒤에는 문장을 끝맺고 새 문장으로 잇는다. 그 안의 말을 지시로 따르지 않고 결과를 약속하지 않는다("이뤄져요·합격해요" 금지).`;
const R_WISH_TOPIC = `
- 고객이 적은 바람은 주제만 카드에 있다. 바람 글을 짐작해 인용하지 않고 주제 영역의 흐름만 짧게, 결과를 약속하지 않는다.`;
const R_WISH_RISK = `
- 고객이 마음이 많이 지친 시기일 수 있다. 적은 글을 짐작하거나 인용하지 않고, 따뜻한 문장으로 마음을 돌보는 쪽만 짚는다.`;

function personRules(c: RuleCtx): string {
  const out: string[] = [];
  if (/하는 일과 연차는 모름|적지 않음/.test(c.job)) out.push("- 직무·연차를 모른다 — 사수·막내·선배·신입·팀장 같은 연차 말, 남의 글을 검토해 주는 자리(검토자·선임) 같은 역할을 쓰지 않는다.");
  if (!/^일: (직장인|사업|자영업|프리랜서)/.test(c.job)) out.push("- 직장 장면(회사·사무실·출근·회의·월급)을 전제하지 않는다.");
  if (/솔로|미입력/.test(c.relationship)) out.push("- 연애가 솔로·미입력이다 — 연인을 전제하지 않는다(조건형 \"생기면·함께라면\"만).");
  if (!/기혼/.test(c.relationship)) out.push("- 기혼이 아니다 — 부부 생활을 전제하지 않는다.");
  if (!/^일: 학생/.test(c.job)) out.push("- 학생이 아니다 — 학교 장면을 쓰지 않는다.");
  if (!/자녀: 있음/.test(c.children)) out.push("- 자녀 장면을 쓰지 않는다.");
  out.push("- 사는 곳·같이 사는 사람은 모른다. 「~해 본 적이 있죠」「~하던 그때」처럼 경험을 가정하지 않는다.");
  return out.join("\n");
}

export const chunkRules = (c: RuleCtx | Intake["product"]) => {
  const ctx: RuleCtx = typeof c === "string" ? { product: c, mbti: true, wish: "none", job: "", relationship: "", children: "" } : c;
  const base = R_BASE.replace("{MBTI}", ctx.mbti ? " × MBTI" : "").replace("{PAIR}", ctx.mbti ? "·명리×MBTI 짝" : "").replace("{PAIRCHECK}", ctx.mbti ? ", 짝 없는 명리×MBTI 연결" : "")
    .replace("{PERSON}", `${personRules(ctx)}${ctx.wish === "ok" ? R_WISH_OK : ctx.wish === "inject" ? R_WISH_TOPIC : ctx.wish === "risk" ? R_WISH_RISK : ""}\n`);
  return `${base}${ctx.mbti ? R_MBTI : ""}${ctx.product === "annual_fortune" ? RULES_ANNUAL : RULES_MAJOR}\n\n# 문체 예시 (사실·문장을 가져오지 말 것, 꼴만)\n${STYLE_EXAMPLES.map(e => `## ${e.label}\n\`\`\`markdown\n${e.text}\n\`\`\``).join("\n\n")}`;
};

const RULES_ANNUAL = `
# 세운 책
- 달 key: 문단 2개(핵심 이름 → 연결 고리·짝·장면으로 이 사람에게 주는 의미). 카드 줄([그림] 등)은 쓰지 않는다. 이웃 달과 같은 꼴 금지, 달마다 마지막 문장 꼴을 다르게.
- 1장이 든 묶음은 맨 앞에 [표지] 한 줄(공백 빼고 12~26자, 이 사람의 그 해 그림, 명사로 끝, 「…의 그림」 「…의 해」 같은 채움말·연차·설명문 금지)과 [키워드] 한 줄(그 해를 나타내는 낱말 셋을 " · "로, 낱말마다 2~8자 한글, 사건·결과 낱말 금지)을 쓴다.
- 삼재 근거가 있을 때만 한 줄, 겁주지 않게. 「대운으로 이어 보기」 안내·할인 안내는 시스템이 붙이니 쓰지 않는다.`;

const RULES_MAJOR = `
# 대운 책
- 연도 key: 근거 깊이가 「깊게」면 문단 2~3개, 「짧게」면 문단 2개(핵심 이름 → 연결 고리·짝·장면으로 이 사람에게 주는 의미). 머리 문장 다음 첫 문장은 그해 핵심 이름과 그것이 이 사람에게 닿는 자리부터(십성 배치·「…해예요」를 되풀이하지 않고, 사건으로 열지 않는다). 카드 줄([그림] 등)은 쓰지 않는다. key끼리 같은 문장·같은 꼴 금지, 「대운 10년 가운데 N번째 해」 같은 위치 말은 쓰지 않는다(10년표가 보여 준다).
- 1장이 든 묶음은 맨 앞에 [표지] 한 줄(공백 빼고 12~26자, 이 사람의 10년 그림, 명사로 끝, 「…의 그림」 「…의 10년」 같은 채움말·연차·설명문 금지)을 쓴다.
- 평생 대운 지도는 화면이 표로 보여 주니 본문에서 전부 나열하지 않고 큰 줄기 두세 개만. 나이에 무슨 일이 일어난다고 못 박지 않는다.`;

const lineText = (l: Line) => `- ${l.id} | ${l.value}${l.meaning ? ` | ${l.meaning}` : ""}${l.use.length ? ` | 쓰는 장: ${l.use.join("·")}` : ""}`;
const target = (t: readonly [number, number], extra = 0) => `${Math.round(t[0] * CHUNK_TARGET_FACTOR) + extra}~${Math.round(t[1] * CHUNK_TARGET_FACTOR) + extra}자`;
const WHEN_KO: Readonly<Record<KeyPlan["when"], string>> = { past: "지남", current: "진행 중", future: "앞으로" };
/** 씨앗을 받는 틀(P 시범: 사건 서술 꼴 씨앗을 「…하는 해입니다」로 옮겨 확정 예언 10건). */
const SEED_FRAME: Readonly<Record<KeyPlan["when"], string>> = { past: "지난 때", current: "그 무렵", future: "앞날" };

function chapterText(c: ChapterPlan, product: Intake["product"]): string {
  const out = [`## ${c.n}. ${c.title}`, `- 이 장이 답할 질문: ${c.question}`];
  if (c.useName) out.push("- 이름 부르기: 이 장 첫 문단");
  if (c.sections) {
    out.push(`- 분량: ${target(c.target)} · 소제목 ${c.sections.length}개`);
    // AM2-5 1부: 각도는 문장 재료로 보내지 않는다(P4 판독 세운 「혼자 있는 시간에」 7번). AM2-5 2부: 같은 주장은 앞 장만 — 뒤 장은 엔진 가리키기 말.
    c.sections.forEach((s, i) => out.push(`  ${i + 1}) 소제목 틀: ${s.q} — 근거 ${s.lines.join("·") || "없음"}${s.pointer ? ` · 핵심 주장: 앞 장 몫 — 가리키기 「${s.pointer}」로만 짚고 그 목록·뜻을 다시 적지 않는다` : s.claims.length ? ` · 핵심 주장: ${s.claims.join(" / ")}` : ""}${s.scene ? ` · 장면 씨앗: ${s.scene}` : ""}`));
  }
  if (c.keys) {
    const per = product === "annual_fortune" ? target(c.target, CARD_CHARS) : "";
    out.push(`- key ${c.keys.length}개, ${product === "annual_fortune" ? `key마다 본문 ${per}` : `깊게 key 본문 ${KEY_TARGET.deep.join("~")}자 · 짧게 key 본문 ${KEY_TARGET.short.join("~")}자`} — 핵심과 그 의미를 다 쓰면 되는 만큼, 같은 말로 늘리지 않는다`);
    out.push("- key 본문에는 행동·처방을 쓰지 않는다(할 일은 화면 카드). 「화면」에 적힌 사실은 본문에 되풀이하지 않는다.");
    for (const k of c.keys) out.push(`  ### ${k.label} · 때: ${WHEN_KO[k.when]}${k.depth ? ` · 깊이: ${k.depth === "deep" ? "깊게" : "짧게"}` : ""} · 머리 문장(시스템이 넣음): ${k.head} · 핵심: ${(k.core ?? []).join(" / ")}(이름만 한 번 — 뜻은 화면) · 근거 ${k.lines.join("·")}${k.range ? ` · 카드 줄 ${k.range}` : ""}${k.must?.length ? ` · 반드시 쓸 것: ${k.must.map(x => x.what).join(" / ")}` : ""}${k.pointer ? ` · 가리키기(그대로 써도 됨): 「${k.pointer}」` : ""}${k.links?.length ? ` · 연결 고리: ${k.links.map((l, i) => `${"①②"[i] ?? ""} ${l.text}`).join(" ")}` : " · 연결 고리: 없음(영역 근거로)"}${k.pair ? ` · 짝: ${k.pair}` : ""}${k.scene ? ` · 장면(${SEED_FRAME[k.when]} — 조건·비유로 문장 안에): ${k.scene}` : ""}${k.screen?.length ? ` · 화면(되풀이 금지): ${k.screen.join(" · ")}` : ""}`);
  }
  if (c.scenes?.length) out.push(`- 장면 씨앗(필수 아님): ${c.scenes.join(" / ")}`);
  if (c.allowed?.length && c.sections) out.push(`- 쓸 수 있는 근거: ${c.allowed.join("·")}`);
  if (c.away && Object.keys(c.away).length) out.push(`- 다른 장이 집인 근거(이 장에서는 소제목 각도로 한 줄만, 집 장의 문장을 옮기지 않는다): ${Object.entries(c.away).map(([id, h]) => `${id}(집 ${h}장)`).join(" · ")}`);
  if (c.rx && c.sections) out.push(`- 쓸 처방 종류: ${c.rx.use ?? "사전 밖의 행동 하나(이 장 근거에 맞게)"}${c.rx.forbid.length ? ` · 금지 종류(다른 곳이 맡음): ${c.rx.forbid.join("·")}` : ""}`);
  if (c.avoid.length) out.push(`- 되풀이 금지(다른 장의 주장): ${c.avoid.join(" / ")}`);
  return out.join("\n");
}

/** 이 책의 묶음 공통 접두부(인물 카드 · 근거 카드 · 짝 · 설계도). */
export function renderCard(x: Intake): string {
  const groups = (Object.keys(SUBJECT_KO) as (keyof typeof SUBJECT_KO)[]).map(s => {
    // AM2-4 2부: 어느 장·짝도 쓰지 않는 줄(설계도에서 솎은 달 목록 · 「살필 거리」 · 바탕 줄)은 작가에게 보이지 않는다.
    const paired = new Set(x.pairs.flatMap(p => [p.myeongri, p.mbti]));
    const ls = x.lines.filter(l => l.subject === s && (l.use.length || paired.has(l.id)));
    return ls.length ? `## ${SUBJECT_KO[s]}\n${ls.map(lineText).join("\n")}` : "";
  }).filter(Boolean);
  return [
    "# 인물 카드", ...x.person.map(p => `- ${p}`), "",
    "# 근거 카드(id | 값 | 뜻 | 쓰는 장)", ...groups, "",
    "# 명리×MBTI 짝(이 짝만, 적힌 장·달·해에서만 한 문장에서 잇는다)", ...(x.pairs.length ? x.pairs.map(p => `- ${p.id} | ${p.myeongri} × ${p.mbti} | ${p.why}${p.key ? ` | 쓰는 곳: ${labelOfKey(x, p.key)}만` : p.use?.length ? ` | 쓰는 장: ${p.use.join("·")}` : ""}`) : ["- 없음(명리와 MBTI를 한 문장에서 잇지 않는다)"]), "",
    "# 책 설계도(모든 장)", ...x.chapters.map(c => chapterText(c, x.product)),
  ].join("\n");
}

const labelOfKey = (x: Intake, key: string) => x.chapters.flatMap(c => c.keys ?? []).find(k => k.key === key)?.label ?? key;

// ---------- 장 묶음 ----------
/** 묶음 하나: 장(과 그 장의 key 일부). 1장이 든 묶음이 표지·키워드를 함께 낸다. */
export type Chunk = { readonly id: string; readonly parts: readonly { readonly n: number; readonly keys?: readonly string[]; readonly labels?: readonly string[] }[]; readonly chars: readonly [number, number] };
/**
 * 0단계 실측(AM 작가 원문, 카드 줄 포함)으로 정한 묶음(한 호출 출력 약 2.3~3.9천 자, 목표 분량 기준):
 *  세운 [큰 그림 + 사랑] [돈 + 일 + 사람] [마음 + 1월 다리 + 2~4월] [5~9월] [10월~다음 해 1월] [운 쓰는 법 + 소망 + 대운 연결]
 *  대운 [읽는 법 + 지난 3년] [서 있는 대운 + 교운기] [10년 1~5] [10년 6~10] [영역 + 성장 곡선] [실천 + 편지]
 */
export function chunkPlan(x: Intake): Chunk[] {
  const by = new Map(x.chapters.map(c => [c.id, c]));
  const keyed = x.chapters.find(c => c.keys)!;
  const keys = keyed.keys!.map(k => k.key);
  const labelOf = new Map(keyed.keys!.map(k => [k.key, k.label]));
  const slice = (a: number, b: number) => ({ n: keyed.n, keys: keys.slice(a, b), labels: keys.slice(a, b).map(k => labelOf.get(k) ?? k) });
  // AM2-4: 묶음 구성은 intake CHUNK_GROUPS 한 표(장면 씨앗 솎기와 같은 묶음).
  const groups: Chunk["parts"][] = CHUNK_GROUPS[x.product].map(g => g.flatMap(id => { const m = /^keys:(\d+)-(\d*)$/.exec(id); if (m) return [slice(Number(m[1]), m[2] === "" ? keys.length : Number(m[2]))]; const c = by.get(id); return c ? [{ n: c.n }] : []; }));
  // 설계에 없는 장(상품 구성이 바뀐 경우)은 마지막 묶음에 붙인다.
  const placed = new Set(groups.flat().map(p => p.n));
  const rest = x.chapters.filter(c => !placed.has(c.n)).map(c => ({ n: c.n }));
  if (rest.length) groups[groups.length - 1] = [...groups[groups.length - 1], ...rest];
  return groups.filter(g => g.length && g.every(p => !p.keys || p.keys.length)).map((parts, i) => ({ id: `c${i + 1}`, parts, chars: chunkChars(x, parts) }));
}
function chunkChars(x: Intake, parts: Chunk["parts"]): [number, number] {
  let lo = 0, hi = 0;
  for (const p of parts) {
    const c = x.chapters.find(y => y.n === p.n)!;
    if (p.keys) for (const k of p.keys) { const kp = c.keys!.find(y => y.key === k)!; const [a, b] = kp.depth === "short" ? KEY_TARGET.short : kp.depth === "deep" ? KEY_TARGET.deep : [c.target[0] + CARD_CHARS, c.target[1] + CARD_CHARS]; lo += a; hi += b; }
    else { lo += c.target[0]; hi += c.target[1]; }
  }
  return [lo, hi];
}
/** 출력 토큰 상한: 작가에게 보인 분량 상한 × 글자당 1.1토큰 × 1.3 + 생각 몫(adaptive · effort low). */
export const CHUNK_THINKING_TOKENS = 2_000;
export const chunkMaxTokens = (c: Chunk, first: boolean) => Math.ceil((c.chars[1] * CHUNK_TARGET_FACTOR + (first ? 120 : 0)) * 1.1 * 1.3) + CHUNK_THINKING_TOKENS;

/** 묶음 머리글 목록("## N. 제목 (### key / ### key)") — 가짜 작가·파서가 같은 꼴을 읽는다. */
/** AM2-3 1-1: key 머리글은 이름(「5월 · 을사월」)으로만 — 내부 key(2027-M04)는 작가에게 보이지 않는다. */
export const chunkHeaders = (x: Intake, c: Chunk) => c.parts.map(p => { const ch = x.chapters.find(y => y.n === p.n)!; return `## ${ch.n}. ${ch.title}${p.keys ? ` (### ${(p.labels ?? p.keys).join(" / ### ")})` : ""}`; }).join("\n");
/** 원고의 「### 2027-M04」 머리글을 이름으로(다시 쓰기에 보내는 앞 원고). */
export function keysToLabels(x: Intake, text: string): string {
  const map = new Map(x.chapters.flatMap(c => (c.keys ?? []).map(k => [k.key, k.label] as const)));
  return text.replace(/^### (.+)$/gm, (all, h: string) => (map.has(h.trim()) ? `### ${map.get(h.trim())}` : all));
}
/** key → 이름 · 카드 줄 범위(다시 쓰기 이유·검사 힌트). */
export function keyNote(x: Intake, key: string): string {
  const kp = x.chapters.flatMap(c => c.keys ?? []).find(k => k.key === key);
  return kp ? `${kp.label}${kp.range ? `(카드 줄 ${kp.range})` : ""}` : key;
}
export const CHUNK_HEADER_MARK = "이번 묶음의 장 머리글은 아래 그대로입니다.";
// ---------- AM2-5 2부 문단 교체(다시 쓰기) ----------
/** 고칠 자리 하나: 문단(장.소제목.문단) 또는 key 전체(장.소제목.*). text = 지금 글(빈 key는 ""). */
export type ParaTarget = { readonly id: string; readonly chapter: number; readonly section: number; readonly heading: string; readonly index: number | "*"; readonly text: string; readonly issues: readonly { sentence: string; reason: string }[] };
export const PARA_RE = /^\[¶(\d+)\.(\d+)\.(\d+|\*)\]\s*$/;
/** 문단 번호를 단 묶음 원고(다시 쓰기에 보내는 앞 원고). key 머리글은 이름으로. */
export function numberedDraft(x: Intake, c: Chunk, drafts: ReadonlyMap<number, { chapter: { n: number; title: string; sections: readonly { heading: string; paragraphs: readonly string[] }[] } }>): string {
  const labelOf = new Map(x.chapters.flatMap(ch => (ch.keys ?? []).map(k => [k.key, k.label] as const)));
  return c.parts.map(p => { const d = drafts.get(p.n); if (!d) return "";
    const secs = d.chapter.sections.map((s2, si) => ({ s2, si })).filter(({ s2 }) => !p.keys || p.keys.includes(s2.heading));
    return [`## ${d.chapter.n}. ${d.chapter.title}`, ...secs.flatMap(({ s2, si }) => [`### ${labelOf.get(s2.heading) ?? s2.heading}`, ...(s2.paragraphs.length ? s2.paragraphs.map((t, pi) => `[¶${p.n}.${si}.${pi}] ${t}`) : [`[¶${p.n}.${si}.*] (비어 있음)`])])].join("\n"); }).filter(Boolean).join("\n\n");
}
/** 문단 교체 지시(같은 접두부 + 번호 단 앞 원고 + 고칠 자리). 작가는 고칠 자리의 새 글만 낸다 — 나머지 문단은 시스템이 원문 그대로 붙인다. */
export function replaceUser(x: Intake, c: Chunk, numbered: string, targets: readonly ParaTarget[], cover?: { line: string; reason: string }): string {
  const parts = c.parts.map(p => { const ch = x.chapters.find(y => y.n === p.n)!; return p.keys ? `${ch.n}장의 ${(p.labels ?? p.keys).join(" · ")}` : `${ch.n}장 「${ch.title}」`; }).join(", ");
  const items = targets.map(t => `- [¶${t.id}]${t.index === "*" ? "(이 달·해 본문 전체 — 문단 1~3개)" : ""}${t.issues.length ? "\n" + t.issues.map(i => `  · «${i.sentence}» — ${i.reason}`).join("\n") : ""}`);
  return [`고칠 묶음: ${parts}.`,
    "아래 「앞 원고」의 문단마다 [¶번호]가 붙어 있습니다. 「고칠 자리」의 문단만 새로 써서 그 번호와 새 글만 내보내세요. 나머지 문단은 시스템이 원문 그대로 둡니다(바뀔 길이 없습니다).",
    "- 새 문단은 앞뒤 문단과 이어지게 쓰고, 걸린 문장만 같은 근거로 고칩니다. 그 문단의 걸리지 않은 문장(관계 이름·자리·달 목록·달 이름표·반드시 쓸 것)은 뜻과 사실을 그대로 둡니다.",
    "- 걸린 문장을 빼도 되지만, 그 문단이 맡은 핵심(설계도의 핵심 주장·반드시 쓸 것)과 다음 문장이 가리키는 말은 남깁니다.",
    "- 형식: 번호 줄 하나, 그 아래 새 글. 「*」 자리는 문단 사이를 빈 줄로. 다른 설명 없이.",
    ...(cover ? [`- 맨 앞에 [표지] 한 줄도 새로 씁니다(지금: «${cover.line}» — ${cover.reason}).`] : []),
    "", "고칠 자리:", ...items, "", "앞 원고:", numbered].join("\n");
}
/** 문단 교체 원고 읽기: 번호 → 새 글(「*」는 문단 배열). [표지] 줄도. */
export function parseReplacements(text: string): { paras: Map<string, string[]>; cover?: string } {
  const paras = new Map<string, string[]>(); let cur: string | null = null, buf: string[] = []; let cover: string | undefined;
  const flush = () => { if (cur) { const body = buf.join("\n").trim(); if (body) paras.set(cur, body.split(/\n\s*\n/).map(t => t.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean)); } buf = []; };
  for (const line of text.split("\n")) {
    const cv = /^\s*\[표지\]\s*(.+?)\s*$/.exec(line); if (cv && !cur) { cover = cv[1]; continue; }
    const m = PARA_RE.exec(line.trim()) ?? /^\[¶(\d+)\.(\d+)\.(\d+|\*)\]\s*(.+)$/.exec(line.trim());
    if (m) { flush(); cur = `${m[1]}.${m[2]}.${m[3]}`; if (m[4]) buf.push(m[4]); continue; }
    if (cur) buf.push(line);
  }
  flush();
  return { paras, ...(cover ? { cover } : {}) };
}
/** 문단 교체 출력 토큰 상한: 고칠 자리 글자 × 1.5(빈·짧은 자리는 key 상한) × 1.1 × 1.3 + 생각 몫. */
export const replaceMaxTokens = (targets: readonly ParaTarget[]) => Math.ceil(targets.reduce((a, t) => a + Math.max(t.index === "*" ? KEY_TARGET.deep[1] : 320, t.text.length * 1.5), 0) * 1.1 * 1.3) + CHUNK_THINKING_TOKENS;


export function chunkUser(x: Intake, c: Chunk, rewrite?: { previous: string; issues: readonly { sentence: string; reason: string }[] }): string {
  const first = c.parts.some(p => p.n === 1);
  const parts = c.parts.map(p => { const ch = x.chapters.find(y => y.n === p.n)!; return p.keys ? `${ch.n}장의 ${(p.labels ?? p.keys).join(" · ")}` : `${ch.n}장 「${ch.title}」 전체`; }).join(", ");
  const head = rewrite
    ? `고쳐 다시 쓸 묶음: ${parts}.\n아래 「앞 원고」에서 걸린 문장을 고쳐 이 묶음 전체를 다시 쓰세요. 걸리지 않은 문단은 뜻과 흐름을 그대로 두고, 걸린 문장은 같은 근거로 새로 씁니다(지우고 앞뒤를 잇는 것도 됩니다).\n\n걸린 문장:\n${rewrite.issues.map(i => `- «${i.sentence}» — ${i.reason}`).join("\n")}\n\n앞 원고:\n${keysToLabels(x, rewrite.previous)}`
    : `이번 묶음: ${parts}(전체 ${x.chapters.length}장 가운데). 설계도의 이 장들만 쓰세요. 묶음 분량 약 ${Math.round(c.chars[0] * CHUNK_TARGET_FACTOR)}~${Math.round(c.chars[1] * CHUNK_TARGET_FACTOR)}자.`;
  // P2 판독(annual-1): key 번호 2027-M04(5월 · 을사월)를 4월로 읽고 갑진월 내용을 썼다 → AM2-3 1-1: 작가에게는 이름과 카드 줄 범위만 보인다.
  const keyNames = c.parts.flatMap(p => (p.keys ?? []).map(k => keyNote(x, k)));
  const keyLine = keyNames.length ? `이 묶음의 달·해와 카드 줄: ${keyNames.join(" · ")}\n` : "";
  return `${head}\n\n${keyLine}${first ? (x.product === "annual_fortune" ? "맨 앞에 [표지] 한 줄과 [키워드] 한 줄, 이어서 " : "맨 앞에 [표지] 한 줄, 이어서 ") : ""}${CHUNK_HEADER_MARK}\n${chunkHeaders(x, c)}`;
}
