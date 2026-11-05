/**
 * 궁합 사람별 고정 성격표(최종판2 1-3): 에너지(E/I) · 앞에 나서는지 · 다툼 때 반응 · 표현 방식 · 결정 속도.
 * MBTI 글자(지식 DB 유형)와 엔진 값(행동 차원 벡터: 특성 dimensionTags + MBTI dimensionTags, 장성살)에서 결정론으로 만든다.
 * 브리프 맨 앞에 한 줄로 고정하고(작가), 장면 주인(who)·차이 목록이 쓰는 행동 차원 값도 이 표로 맞춘다(모든 장이 이 표를 따른다).
 * 검사(pair_profile)는 같은 표로 문장을 대조한다.
 * 실제 결함(장덕민 ENTJ × 최지우 ISTJ, 최종판): 상관 하나 때문에 ISTJ 최지우가 "가운데에 서고 발표를 자원", "그 자리에서 받아치는" 쪽으로 적혔다.
 */
export type ProfileCodes = {
  readonly energy: "E" | "I" | null;
  /** front = 앞에 나서서 이끄는 편, back = 앞에 나서기보다 뒤에서 챙기는 편. */
  readonly lead: "front" | "back" | null;
  /** now = 그 자리에서 말함, later = 정리한 뒤 말함. */
  readonly conflict: "now" | "later" | null;
  /** 마음을 드러내는 길. */
  readonly express: "말" | "말·표정" | "행동" | null;
  /** fast = 빨리 정함, slow = 오래 비교하며 미룸, mid = 따져 본 뒤 정함. */
  readonly decide: "fast" | "mid" | "slow" | null;
  /** 최종판3 2h: 새 제안 반응(J = 한 번 묵혔다가 받아들임, P = 일단 반기고 해 봄). */
  readonly offer?: "hold" | "open" | null;
  /** 최종판3 2h: 돈 습관(지식 DB 유형별 돈 신호의 기질 묶음: SJ 계획·기록, NJ 목표에 크게, SP 그때그때, NP 관심 분야에 몰아). */
  readonly money?: "plan" | "goal" | "now" | "interest" | null;
};
export type PairProfile = ProfileCodes & { readonly name: string; readonly line: string };

const JANGSEONG = "shinsal:TWELVE_JANGSEONGSAL";
const sgn = (v: number, th = 0.5) => (Math.abs(v) < th ? 0 : Math.sign(v));

/** 한 사람의 성격표. mbti: 유형(없으면 null), vec: 행동 차원 벡터(dimensionVector), hitIds: 엔진 특성 id. */
export function profileCodes(mbti: string | null, vec: ReadonlyMap<string, number>, hitIds: readonly string[]): ProfileCodes {
  const v = (d: string) => vec.get(d) ?? 0;
  const jang = hitIds.includes(JANGSEONG) ? 1 : 0;
  if (mbti && /^[EI][NS][TF][JP]$/.test(mbti)) {
    const e = mbti[0] === "E", t = mbti[2] === "T";
    return {
      energy: e ? "E" : "I",
      lead: e ? "front" : "back",
      conflict: e ? "now" : "later",
      express: e ? (t ? "말" : "말·표정") : "행동",
      decide: v("decisionSpeed") >= 2 ? "fast" : v("decisionSpeed") <= -2 ? "slow" : "mid",
      offer: mbti[3] === "J" ? "hold" : "open",
      money: mbti[1] === "S" ? (mbti[3] === "J" ? "plan" : "now") : (mbti[3] === "J" ? "goal" : "interest"),
    };
  }
  // MBTI가 없으면 엔진 값만(특성 dimensionTags, 장성살은 앞에 나섬에 더한다).
  const se = sgn(v("socialEnergy")), lead = sgn(v("attentionSeeking") + v("controlNeed") + jang), cf = sgn(v("conflictApproach") + v("reactivity"));
  const ex = sgn(v("verbalOutput") + v("emotionalExpression"));
  return {
    energy: se > 0 ? "E" : se < 0 ? "I" : null,
    lead: lead > 0 ? "front" : lead < 0 ? "back" : null,
    conflict: cf > 0 ? "now" : cf < 0 ? "later" : null,
    express: ex > 0 ? "말" : ex < 0 ? "행동" : null,
    decide: v("decisionSpeed") >= 2 ? "fast" : v("decisionSpeed") <= -2 ? "slow" : v("decisionSpeed") === 0 ? null : "mid",
  };
}

const TEXT = {
  energy: { E: "에너지 E(사람을 만나면 기운이 나는 편)", I: "에너지 I(혼자 있는 시간이 꼭 필요한 편)" },
  lead: { front: "앞에 나서서 이끄는 편", back: "앞에 나서기보다 뒤에서 챙기는 편" },
  conflict: { now: "다툼 때 그 자리에서 말하는 편", later: "다툼 때 속으로 정리한 뒤 말하는 편" },
  express: { "말": "마음을 말로 바로 드러내는 편", "말·표정": "마음이 말과 표정에 바로 드러나는 편", "행동": "마음을 말보다 행동으로 보여 주는 편" },
  decide: { fast: "결정이 빠른 편", mid: "따져 본 뒤 정하는 편", slow: "선택지를 오래 비교하는 편" },
  offer: { hold: "새 제안은 한 번 묵혔다가 받아들이는 편", open: "새 제안을 일단 반기고 해 보는 편" },
  money: { plan: "돈은 계획해 쓰고 기록하는 편", goal: "돈은 목표에 맞춰 크게 쓰는 편", now: "돈은 그때 마음 가는 데 쓰는 편", interest: "돈은 관심 가는 것에 몰아 쓰는 편" },
} as const;

export function profileLine(name: string, c: ProfileCodes, mbti: string | null): string {
  const parts = [c.energy && TEXT.energy[c.energy], c.lead && TEXT.lead[c.lead], c.conflict && TEXT.conflict[c.conflict], c.express && TEXT.express[c.express], c.decide && TEXT.decide[c.decide], c.offer && TEXT.offer[c.offer], c.money && TEXT.money[c.money]].filter(Boolean);
  return `${name}${mbti ? `(${mbti})` : ""}: ${parts.join(" · ")}`;
}

/**
 * 성격표를 행동 차원 벡터에 반영한다(장면 주인 who 줄·차이 목록이 표와 같은 쪽을 가리키게).
 * 표와 같은 부호면 원래 값을 두고, 반대이거나 0에 가까우면 표 쪽 끝으로 바꾼다(크기 1). 결정 "따져 본 뒤"는 어느 끝도 아님(0).
 */
export function applyProfile(vec: ReadonlyMap<string, number>, c: ProfileCodes): Map<string, number> {
  const out = new Map(vec);
  const set = (d: string, s: number) => { const x = out.get(d) ?? 0; if (s === 0) { out.set(d, 0); return; } if (Math.sign(x) !== s || Math.abs(x) < 0.5) out.set(d, s); };
  if (c.energy) set("socialEnergy", c.energy === "E" ? 1 : -1);
  if (c.lead) set("attentionSeeking", c.lead === "front" ? 1 : -1);
  if (c.conflict) { set("reactivity", c.conflict === "now" ? 1 : -1); set("conflictApproach", c.conflict === "now" ? 1 : -1); }
  if (c.express === "행동") { set("verbalOutput", -1); set("emotionalExpression", -1); }
  if (c.express === "말") set("verbalOutput", 1);
  if (c.express === "말·표정") { set("verbalOutput", 1); set("emotionalExpression", 1); }
  if (c.decide === "fast") set("decisionSpeed", 1);
  if (c.decide === "slow") set("decisionSpeed", -1);
  if (c.decide === "mid") set("decisionSpeed", 0);
  return out;
}

/** 문장 단서(검사 pair_profile): 칸별로 이 단서가 나오면 그 값이라고 말한 것이다. */
export const PROFILE_CUES = {
  E: /모임이 끝나면 (오히려 )?(기운|힘)|사람을 만나면 (오히려 )?기운이 나/,
  I: /약속이 이어지면 지|혼자 있는 시간이 (꼭 )?필요/,
  front: /가운데에 서|발표를 자원|(가장 )?먼저 나서(서|는|고)|앞에 나서(서|는) (이끄|분위기)/,
  back: /뒤에서 챙기는|앞에 나서기보다/,
  // "그 자리에서 짚는"·"따지는"은 직설(directness)이라 다툼 시점 단서로 보지 않는다(ISTJ도 틀린 사실은 바로 짚는다).
  // 최종판3: 「틀린 것은 그 자리에서 짚는」도 다툼=정리한 뒤와 함께 읽으면 모순으로 읽힌다(장소담×전성민 판독).
  now: /그 자리에서 (바로 )?(받아치|말하|말을 꺼내|정리하|맞서|짚)|곧바로 맞서|(바로|곧바로) 말하(려|는|고)|어긋났는지부터 바로/,
  later: /한 박자 (두|쉬)|곱씹|정리한 뒤(에)? (말|꺼내|이야기)|쌓이면 (근거 자료까지 )?(챙겨 (와|와서|서) )?한꺼번에|나중에 (꺼내|말하)|그 자리에서는 (넘기|참)|말을 아끼다가/,
  verbal: /바로바로 말로|바로 말로 풀어내|말로 풀어내는 편|생각이 (바로 )?말이 되어/,
  face: /기분이 (바로 |곧바로 )?(표정에|얼굴에) (묻어|드러)|표정과 말에 (기분이|마음이)/,
  fast: /두세 가지만 보고|뒤돌아보지 않|결정이 빠르/,
  slow: /결정을 미루|선택지를 (다 )?늘어놓/,
  refuse: /듣기 전에 거절|(바로|일단|먼저) 거절|거절하는 버릇|거절부터/,
  hold: /한 번 묵혔다가|묵혀 두었다가|바로 받지 않/,
  impulse: /한 곳만 보고 결제|충동(적으로)? (구매|결제)|바로 결제|기분으로 사|장바구니부터/,
  compare: /가격을 (꼼꼼히 )?비교|가계부|최저가를 (찾|비교)|견적을 여러/,
} as const;
type CueKey = keyof typeof PROFILE_CUES;
/** 그 사람 표와 맞지 않는 단서(칸 이름: 금지 단서들). */
export function forbiddenCues(c: ProfileCodes): { cue: CueKey; slot: string }[] {
  const out: { cue: CueKey; slot: string }[] = [];
  if (c.energy === "E") out.push({ cue: "I", slot: "에너지=E" }); if (c.energy === "I") out.push({ cue: "E", slot: "에너지=I" });
  if (c.lead === "front") out.push({ cue: "back", slot: "앞에 나섬=앞" }); if (c.lead === "back") out.push({ cue: "front", slot: "앞에 나섬=뒤" });
  if (c.conflict === "now") out.push({ cue: "later", slot: "다툼=그 자리에서" }); if (c.conflict === "later") out.push({ cue: "now", slot: "다툼=정리한 뒤" });
  if (c.express === "행동") out.push({ cue: "verbal", slot: "표현=행동" }, { cue: "face", slot: "표현=행동" });
  if (c.decide === "fast") out.push({ cue: "slow", slot: "결정=빠름" }); if (c.decide === "slow") out.push({ cue: "fast", slot: "결정=오래 비교" });
  if (c.offer === "hold") out.push({ cue: "refuse", slot: "새 제안=묵혔다가 받아들임" });
  if (c.offer === "open") out.push({ cue: "refuse", slot: "새 제안=반김" }, { cue: "hold", slot: "새 제안=반김" });
  if (c.money === "plan") out.push({ cue: "impulse", slot: "돈=계획·기록" });
  if (c.money === "now" || c.money === "interest") out.push({ cue: "compare", slot: c.money === "now" ? "돈=그때 마음 가는 데" : "돈=관심 가는 것에 몰아" });
  return out;
}
