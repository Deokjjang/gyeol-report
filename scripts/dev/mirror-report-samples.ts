/**
 * 결 보고서 견본 10개(D5 통과 조건): 합성 데이터(seededRandom, DB · 네트워크 없음)로 서로 다른 답 패턴 10가지 보고서를 만든다.
 *   pnpm exec tsx scripts/dev/mirror-report-samples.ts [--out <폴더>]
 * 기본 저장 위치: ~/Desktop/gyeol-review/mirror-01/reports-10/ — NN-이름.txt(reportToText) · NN-이름.json(스냅샷) · 00-index.txt(패턴 · 열린 꼭지 · 판정 · 애착).
 * 패턴: 친구 1명 60개 / 3명 / 9명 / 40명 / 아는 사이만 / 가까운 사이만 / 싱크로율 높음 / 싱크로율 낮음 / 나만 아는 면이 많음 / 2호(지난 호 비교).
 * 자가 애착 유형은 10개 전체에서 안정형 · 불안형 · 회피형 · 불안-회피형이 각각 한 번 이상 나오게 정했다.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { MIRROR_FACET_IDS, MIRROR_ITEMS, type FacetId } from "../../src/data/mirror/items";
import type { StoryKind } from "../../src/data/mirror/stories";
import { friendAttachment, openItemCount, selfAttachment, type AttachmentType, type Choice, type Closeness, type FriendChoice, type FriendSession, type SelfAnswers } from "../../src/lib/mirror/engine";
import { hash32, seededRandom } from "../../src/lib/mirror/hash";
import { pickBundle } from "../../src/lib/mirror/order";
import { buildReport, repetitionFindings, reportToText, sameOwnerSkeletons, styleFindings } from "../../src/lib/mirror/report/engine";
import type { ReportSnapshot, ReportStory } from "../../src/lib/mirror/report/types";

const args = process.argv.slice(2);
const OUT = (() => { const i = args.indexOf("--out"); return i >= 0 ? args[i + 1] : join(homedir(), "Desktop/gyeol-review/mirror-01/reports-10"); })();

/** 친구 눈에 잘 보이는 면일수록 주인 답과 잘 맞는다(scripts/dev/mirror-seed.ts와 같은 값). */
const VISIBLE: Readonly<Record<FacetId, number>> = { soc: .86, lead: .8, emp: .78, trust: .62, plan: .8, drive: .74, imag: .58, inq: .66, emo: .55, worry: .5, check: .6, dist: .62 };
/** 애착 유형 → 확인(check) · 거리(dist) 면 A쪽 수. 확인 A = 자주 확인(불안), 거리 B = 혼자 해결(회피). */
const ATTACH_SELF: Readonly<Record<AttachmentType, { check: number; dist: number }>> = { secure: { check: 1, dist: 4 }, anxious: { check: 4, dist: 4 }, avoidant: { check: 1, dist: 1 }, fearful: { check: 4, dist: 1 } };

type Group = { closeness: Closeness; count: number; answers: number | "all" };
type Pattern = {
  file: string; title: string; name: string; attach: AttachmentType | "secure-near";
  self?: Partial<Record<FacetId, number>>;
  groups: Group[];
  /** 정확도 배율(1 = 기본 VISIBLE). */
  accuracy?: number;
  /** 면별 친구가 A쪽을 고를 확률(주인 답과 무관) — 친밀도별로 다르게 줄 수 있다. */
  bias?: Partial<Record<FacetId, number | Partial<Record<Closeness, number>>>>;
  stories?: number;
  /** 2호: 앞의 세션 n개로 1호를 만든 뒤, 전체로 2호(previous = 1호). */
  issue2From?: number;
  skip?: number;
};

const PATTERNS: Pattern[] = [
  { file: "01-one-friend-60", title: "친구 1명이 60개를 다 답함", name: "민지", attach: "secure", groups: [{ closeness: 2, count: 1, answers: "all" }], skip: 0, stories: 1 },
  { file: "02-three-friends", title: "친구 3명(친구 · 가까운 사이 · 친구) · 1명당 24개", name: "서준", attach: "anxious", groups: [{ closeness: 2, count: 2, answers: 24 }, { closeness: 3, count: 1, answers: 24 }] },
  { file: "03-nine-friends", title: "친구 9명(아는 사이 3 · 친구 3 · 가까운 사이 3) · 감정 면이 밖에서 다르게 보임", name: "하은", attach: "avoidant", self: { emo: 1 }, bias: { emo: .82 },
    groups: [{ closeness: 1, count: 3, answers: 10 }, { closeness: 2, count: 3, answers: 24 }, { closeness: 3, count: 3, answers: 12 }], stories: 3 },
  { file: "04-forty-friends", title: "친구 40명 · 사교 면이 가까울수록 다르게 보임 · 걱정 면은 반반", name: "지훈", attach: "fearful", self: { soc: 2, worry: 5 },
    bias: { soc: { 1: .2, 2: .6, 3: .88 }, worry: .5 }, groups: [{ closeness: 1, count: 12, answers: 10 }, { closeness: 2, count: 18, answers: 12 }, { closeness: 3, count: 10, answers: 24 }], stories: 6 },
  { file: "05-acquaintances-only", title: "아는 사이만 8명 · 답 160개 안팎", name: "유나", attach: "secure", groups: [{ closeness: 1, count: 8, answers: 20 }] },
  { file: "06-close-only", title: "가까운 사이만 6명 · 스스로는 불안형, 가까운 사람 눈에는 회피형", name: "도윤", attach: "anxious", bias: { check: .15, dist: .18 },
    groups: [{ closeness: 3, count: 6, answers: 24 }], stories: 2 },
  { file: "07-high-sync", title: "싱크로율 높음(친구 12명, 거의 다 맞힘)", name: "수아", attach: "avoidant", accuracy: 1.25,
    groups: [{ closeness: 1, count: 3, answers: 10 }, { closeness: 2, count: 6, answers: 24 }, { closeness: 3, count: 3, answers: 24 }], stories: 1 },
  { file: "08-low-sync", title: "싱크로율 낮음(친구 10명, 반대로 본 장면이 많음)", name: "현우", attach: "fearful", accuracy: .45,
    groups: [{ closeness: 1, count: 3, answers: 10 }, { closeness: 2, count: 4, answers: 24 }, { closeness: 3, count: 3, answers: 24 }] },
  { file: "09-hidden-split", title: "나만 아는 면이 많음(뚜렷하게 답했는데 친구는 반반) · 애착은 약하게 안정형", name: "예린", attach: "secure-near", self: { lead: 5, plan: 0, imag: 5, inq: 0 },
    bias: { lead: .5, plan: .5, imag: .5, inq: .48 }, groups: [{ closeness: 2, count: 10, answers: 12 }, { closeness: 3, count: 5, answers: 12 }], stories: 2 },
  { file: "10-second-issue", title: "2호(지난 호와 비교) · 친구 20명", name: "태민", attach: "anxious", self: { drive: 1 }, bias: { drive: .8 }, issue2From: 9,
    groups: [{ closeness: 1, count: 5, answers: 10 }, { closeness: 2, count: 9, answers: 12 }, { closeness: 3, count: 6, answers: 24 }], stories: 4 },
];

const STORY_POOL: readonly { kind: StoryKind; body: string }[] = [
  { kind: "thanks", body: "제가 시험 망치고 아무 말도 안 했는데, 다음 날 편의점 쪽지에 '오늘은 내가 산다'라고 적어서 줬어요. 그 쪽지 아직 갖고 있어요." },
  { kind: "funny", body: "수학여행 때 길을 잃었는데 지도를 거꾸로 들고 '여기가 맞다'고 끝까지 우겼어요. 결국 반대쪽으로 한 시간 걸었는데, 그날이 제일 기억에 남아요." },
  { kind: "cool", body: "조별 과제 발표 직전에 자료가 날아갔는데, 당황하지 않고 화이트보드에 그림 그려 가며 설명해서 오히려 박수 받았어요." },
  { kind: "better", body: "같이 아침 운동을 시작하자고 해 줘서 한 달째 하고 있어요. 혼자였으면 사흘도 못 갔을 거예요." },
  { kind: "surprise", body: "늘 조용한 줄 알았는데 노래방에서 랩을 완벽하게 해서 다들 입을 못 다물었어요." },
  { kind: "thanks", body: "이사하는 날 아무 말 없이 와서 박스만 스무 개 날라 주고 갔어요. 고맙다는 말도 제대로 못 했네요." },
  { kind: "funny", body: "카페에서 진동벨이 울리니까 전화인 줄 알고 '여보세요' 했어요. 본인은 아직도 아니라고 해요." },
  { kind: "cool", body: "알바하다 손님이 억지를 부렸는데, 끝까지 웃으면서 차분하게 정리하는 거 보고 진짜 멋있다고 생각했어요." },
  { kind: "surprise", body: "캠핑 가서 텐트를 혼자 십 분 만에 쳤어요. 평소엔 형광등도 못 갈던 사람이라 다들 놀랐어요." },
  { kind: "better", body: "책 읽는 모임에 끌고 가 줘서 요즘은 한 달에 두 권씩 읽어요. 덕분에 말할 거리가 많아졌어요." },
  { kind: "funny", body: "단체 사진 찍을 때마다 혼자 눈을 감아서, 우리끼리는 그 사진들을 따로 모아 둔 앨범이 있어요." },
  { kind: "thanks", body: "제 생일을 다들 잊었는데 혼자 기억하고 케이크 한 조각을 사 들고 왔어요. 그날 울 뻔했어요." },
  { kind: "cool", body: "길에서 넘어진 할머니를 보자마자 달려가서 병원까지 모셔다 드렸어요. 약속 시간은 한참 늦었지만 아무도 뭐라 안 했어요." },
  { kind: "surprise", body: "요리를 전혀 안 하는 줄 알았는데 집들이 때 갈비찜을 직접 만들어 내왔어요. 맛까지 좋아서 더 놀랐어요." },
  { kind: "better", body: "면접 전날 밤새 예상 질문을 같이 짜 줬어요. 그 질문이 실제로 나와서 붙었어요." },
  { kind: "funny", body: "버스에서 졸다가 종점까지 가서, 기사님이랑 같이 다시 돌아왔다는 얘기를 아직도 해요." },
  { kind: "thanks", body: "제가 아플 때 문 앞에 죽이랑 약을 두고 가면서 메시지는 '먹고 자'가 전부였어요. 그게 더 고마웠어요." },
  { kind: "cool", body: "축제 무대에서 마이크가 꺼졌는데 그냥 육성으로 끝까지 노래해서 제일 큰 박수를 받았어요." },
  { kind: "surprise", body: "겁이 많은 줄 알았는데 번지점프를 제일 먼저 뛰겠다고 손을 들었어요." },
  { kind: "better", body: "가계부 쓰는 법을 알려 줘서 처음으로 적금을 들었어요. 지금 석 달째 꼬박꼬박 넣고 있어요." },
  { kind: "funny", body: "고양이한테 말을 너무 진지하게 걸어서, 옆에서 듣다가 우리가 대답할 뻔했어요." },
  { kind: "thanks", body: "시험 기간에 정리한 노트를 통째로 복사해서 나눠 줬어요. 반 전체가 그 노트로 공부했어요." },
];

function selfFor(p: Pattern, rand: () => number): SelfAnswers {
  const counts: Partial<Record<FacetId, number>> = {};
  for (const f of MIRROR_FACET_IDS) counts[f] = Math.floor(rand() * 6);
  if (p.attach === "secure-near") { counts.check = 2; counts.dist = 3; }
  else Object.assign(counts, ATTACH_SELF[p.attach]);
  Object.assign(counts, p.self ?? {});
  const out: Record<string, Choice> = {};
  for (const f of MIRROR_FACET_IDS) {
    const ids = MIRROR_ITEMS.filter(i => i.facet === f).map(i => i.id);
    const order = [...ids].sort((a, b) => hash32(`${p.file}:${a}`) - hash32(`${p.file}:${b}`));
    order.forEach((id, k) => { out[id] = k < counts[f]! ? 0 : 1; });
  }
  return out;
}

function sessionsFor(p: Pattern, self: SelfAnswers, rand: () => number): FriendSession[] {
  const counts = new Map<string, number>(), out: FriendSession[] = [];
  let k = 0;
  for (const g of p.groups) for (let n = 0; n < g.count; n++, k++) {
    const id = `${p.file}-f${k}`, asked = new Set<string>(), answers: { itemId: string; choice: FriendChoice }[] = [];
    const want = g.answers === "all" ? openItemCount(g.closeness) : Math.min(openItemCount(g.closeness), g.answers);
    const skill = (rand() - .5) * .16;
    while (answers.length < want) {
      const bundle = pickBundle({ closeness: g.closeness, asked, ownerCounts: counts, seed: id });
      if (!bundle.length) break;
      for (const item of bundle) {
        if (answers.length >= want) break;
        asked.add(item.id);
        const b = p.bias?.[item.facet], pa = typeof b === "number" ? b : b?.[g.closeness];
        let choice: FriendChoice;
        if (rand() < (p.skip ?? .05)) choice = "skip";
        else if (pa !== undefined) choice = rand() < pa ? 0 : 1;
        else choice = rand() < Math.min(.97, Math.max(.05, VISIBLE[item.facet] * (p.accuracy ?? 1) + skill)) ? self[item.id] : (1 - self[item.id]) as Choice;
        answers.push({ itemId: item.id, choice });
        if (choice !== "skip") counts.set(item.id, (counts.get(item.id) ?? 0) + 1);
      }
    }
    out.push({ id, closeness: g.closeness, answers });
  }
  return out;
}

/** 이야기 글은 보고서마다 다르게(견본 전체에서 한 번씩만 쓴다). */
let storyCursor = 0;
function storiesFor(p: Pattern, sessions: FriendSession[]): ReportStory[] {
  return Array.from({ length: p.stories ?? 0 }, (_, i) => {
    const s = STORY_POOL[storyCursor++ % STORY_POOL.length], from = sessions[i % sessions.length];
    return { id: `${p.file}-story${i}`, kind: s.kind, body: s.body, closeness: from.closeness, hearts: (hash32(`${p.file}:h${i}`) % 7), createdAt: new Date(Date.UTC(2026, 10, 20 + i)).toISOString() };
  });
}

const ISSUED = "2026-11-27T03:00:00.000Z", NEXT = "2026-12-04T03:00:00.000Z";
mkdirSync(OUT, { recursive: true });
const index: string[] = ["결 보고서 견본 10개(D5) — scripts/dev/mirror-report-samples.ts · 합성 데이터 · 외부 호출 0", ""];
const attachSeen = new Set<string>();
const snapshots: { file: string; snap: ReportSnapshot }[] = [];
const issuePairs: { file: string; prev: ReportSnapshot; snap: ReportSnapshot }[] = [];
for (const p of PATTERNS) {
  const rand = seededRandom(hash32(p.file));
  const self = selfFor(p, rand), sessions = sessionsFor(p, self, rand), stories = storiesFor(p, sessions);
  // 운영과 같은 꼴의 시드(personSeed = 계정 id 해시의 36진수).
  const seedKey = hash32(`mirror-seed:sample-${p.file}`).toString(36);
  let previous: ReportSnapshot | null = null;
  if (p.issue2From) {
    const firstPart = sessions.slice(0, p.issue2From);
    previous = buildReport({ ownerName: p.name, self, sessions: firstPart, stories: stories.slice(0, 1), issueNo: 1, seedKey, issuedAt: "2026-11-20T03:00:00.000Z", nextIssueAt: ISSUED, previous: null });
  }
  const snap = buildReport({ ownerName: p.name, self, sessions, stories, issueNo: previous ? 2 : 1, seedKey, issuedAt: ISSUED, nextIssueAt: NEXT, previous });
  writeFileSync(join(OUT, `${p.file}.txt`), reportToText(snap) + "\n");
  writeFileSync(join(OUT, `${p.file}.json`), JSON.stringify(snap, null, 2) + "\n");
  snapshots.push({ file: p.file, snap });
  if (previous) { issuePairs.push({ file: p.file, prev: previous, snap }); writeFileSync(join(OUT, `${p.file}.1호.txt`), reportToText(previous) + "\n"); }
  const sa = selfAttachment(self), fa = friendAttachment(sessions, self);
  if (sa) attachSeen.add(sa.type);
  index.push(`${p.file}.txt — ${p.title}`);
  index.push(`  이름 ${p.name} · ${snap.issueNo}호 · 친구 ${snap.evidence.friends}명 · 답 ${snap.evidence.answers}개 · 싱크로율 ${snap.verdict.sync}%`);
  index.push(`  판정: ${snap.verdict.title}`);
  index.push(`  열린 꼭지: 한 줄 판정 · ${snap.sections.map(s => s.title).join(" · ")}`);
  index.push(`  애착(자가): ${sa ? `${sa.label}${sa.near ? "(가까움)" : ""}` : "-"} · 가까운 사람이 본: ${fa ? `${fa.label}${fa.near ? "(가까움)" : ""}` : "-"}`);
  index.push("");
}
index.push(`자가 애착 유형 등장: ${[...attachSeen].sort().join(", ")}`);

// 자체 점검: 반복(한 보고서 안 · 같은 사람의 호끼리 · 다른 사람 사이 글자 그대로) + 문장 규칙(명령 3 1-2 a~h, styleFindings). 하나라도 있으면 실패 코드로 끝난다.
const findings = [
  ...repetitionFindings(snapshots.map(x => ({ id: x.file.slice(0, 2), snapshot: x.snap }))),
  ...issuePairs.flatMap(x => sameOwnerSkeletons(x.prev, x.snap).map(k => `${x.file.slice(0, 2)} 1호 · 2호 같은 뼈대 ${k}`)),
  ...snapshots.flatMap(x => styleFindings(x.file.slice(0, 2), x.snap)),
];
index.push("", `자체 점검(반복 · 문장 규칙 a~h): ${findings.length}건`, ...findings.map(f => `  ${f}`));
writeFileSync(join(OUT, "00-index.txt"), index.join("\n") + "\n");
console.log(JSON.stringify({ out: OUT, files: PATTERNS.length, attach: [...attachSeen].sort(), findings: findings.length }));
for (const f of findings) console.log(f);
if (findings.length) process.exitCode = 1;
