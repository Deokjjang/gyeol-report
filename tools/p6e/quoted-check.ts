/**
 * P6e D: 판독 문장(항목 1~21 인용)이 재생성본에 남아 있지 않은지 grep으로 증명한다(호출 0).
 *   pnpm exec tsx tools/p6e/quoted-check.ts [--dir docs/v5/trial/p6e/final] [--base docs/v5/baseline/p6d]
 * 같은 줄을 기준 원고에도 돌려 "기준에는 있었고 재생성본에는 없다"를 함께 보인다. 궁합 점수(9)·관계 목록(20)은 Book 스냅샷 근거에서 본다.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const arg = (n: string, d: string) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : d; };
const DIR = arg("dir", "docs/v5/trial/p6e/final"), BASE = arg("base", "docs/v5/baseline/p6d");
const read = (dir: string, id: string, ext: string) => { const p = join(ROOT, dir, `${id}.${ext}`); return existsSync(p) ? readFileSync(p, "utf8") : ""; };
const md = (dir: string, id: string) => read(dir, id, "final.md").replace(/[⟪⟫]/g, "");
type Q = { item: string; book: string; quote: string; re: RegExp };
const Q: Q[] = [
  { item: "1 지침 노출", book: "taeo-career", quote: "입력하지 않은 경력과 연차는 쓰지 마세요", re: /쓰지 마세요|적지 마세요/ },
  { item: "2 고아 문장", book: "taeo-career", quote: "성격도 같은 쪽을 가리킵니다", re: /성격도 같은 쪽을 가리킵니다/ },
  { item: "2 고아 문장", book: "chaerin-love", quote: "여기에 식신의 다정함이 더해집니다", re: /여기에 식신(\([^)]*\))?의 다정함이 더해집니다/ },
  { item: "3 신살 주인", book: "pair-business", quote: "백은솔님에게는 겁살에 해당하는 경계심", re: /백은솔님에게는 겁살/ },
  { item: "4 MBTI 오귀속", book: "taeo-career", quote: "구체 사실을 하나씩 확인하는", re: /구체 사실을 하나씩 확인/ },
  { item: "4 MBTI 오귀속", book: "taeo-career", quote: "숫자와 날짜를 먼저 확인하는", re: /숫자와 날짜를 먼저 확인/ },
  { item: "4 MBTI 오귀속", book: "taeo-career", quote: "말하지 않아도 필요한 것을 미리 챙겨 두는", re: /말하지 않아도 필요한 것을 (미리|먼저) 챙/ },
  { item: "4 MBTI 오귀속", book: "taeo-career", quote: "모임이 끝나면 오히려 기운이 나는", re: /모임이 끝나면 오히려 기운/ },
  { item: "5 기둥 자리", book: "taeo-career", quote: "월지의 비견", re: /월지(의|에|에 있는) 비견/ },
  { item: "6 안내 중복", book: "taeo-career", quote: "이 장은 권유가 아니라 성향 이야기예요", re: /이 장은 (투자 )?권유가 아니라/ },
  { item: "7 한자 오기", book: "sodam-full", quote: "편인(偏人)", re: /偏人/ },
  { item: "8 연애 상태", book: "chaerin-love", quote: "프로필 한 줄은 이렇게", re: /프로필 한 줄/ },
  { item: "8 연애 상태", book: "chaerin-love", quote: "첫 만남 30분에는", re: /첫 만남 30분/ },
  { item: "10 씨앗 끼움", book: "sodam-full", quote: "정화의 소수 앞 밝음과", re: /소수 앞 밝음/ },
  { item: "10 책 안 모순", book: "sodam-full", quote: "분위기를 집에 와서야 알아채", re: /집에 와서야 알아채/ },
  { item: "10 이미지 중복", book: "sodam-full", quote: "빗속에서도 꺼지지 않는 캠핑 랜턴", re: /캠핑 랜턴/ },
  { item: "12 기준일 줄", book: "*", quote: "이 책은 ○년 ○월 ○일 기준으로 썼어요", re: /기준으로 썼어요/ },
  { item: "13 직무 단독 문단", book: "taeo-career", quote: "임원 비서는 …자리입니다(직업 하나에 단독 문단)", re: /^(임원 비서|복리후생 담당자|구매 담당자|플로리스트)는 /m },
  { item: "15 면책 반복", book: "taeo-career", quote: "다만 이것은 경향이고 사건을 단정하는 말은 아닙니다", re: /사건을 단정하는 말은 아닙니다/ },
  { item: "15 면책 반복", book: "taeo-career", quote: "실제 누군가를 지목하는 말은 아니에요", re: /지목하는 말은 아니/ },
  { item: "15 면책 반복", book: "taeo-career", quote: "결과를 단정하는 말은 아니에요", re: /결과를 단정하는 말은 아니/ },
  { item: "16 씨앗 직업", book: "sodam-full", quote: "작은 프로그램 · 보고서 서론 · 업무 지시", re: /작은 프로그램|보고서 서론|업무 지시/ },
  { item: "16 씨앗 직업", book: "chaerin-love", quote: "연차 눈치 · 보고서 수정본", re: /연차 눈치|보고서 수정본/ },
  { item: "16 씨앗 직업", book: "taeo-career", quote: "그 틀을 팀에 나눠 주는", re: /팀에 나눠/ },
  { item: "17 MBTI 이름 치환", book: "sodam-full", quote: "지난 경험을 … 지난 경험 기억(Si)", re: /지난 경험을 [^.]{0,30}지난 경험 기억/ },
  { item: "17 MBTI 이름 치환", book: "taeo-career", quote: "가치 기준(Fi)-지금 이 순간 감각(Se) 감각", re: /\((Fi|Se|Ni|Ne|Si|Ti|Te|Fe)\)\s?[-–]|감각 감각/ },
  { item: "18 같은 일주 장면", book: "sodam-full", quote: "퇴근 시간에 맞춰 국물을 데워 두는", re: /국물을 데워/ },
  { item: "19 숫자 표기", book: "*", quote: "남은 해는 1해", re: /(?<![0-9])[1-9] ?(해|달|번|명)(?![가-힣]*(일|월째))(이|가|은|는|을|를|의|에|도|로|와|과|입니다|예요|이에요|\s|[.,])/ },
  { item: "21 비문", book: "sodam-full", quote: "커피를 챙기는 점심 같은 작은 배려로", re: /챙기는 점심 같은/ },
  { item: "21 비문", book: "taeo-career", quote: "어차피 비겁이 강한 당신은", re: /어차피 [^.]{0,20}당신은/ },
];
const BOOKS = ["sodam-full", "taeo-career", "chaerin-love", "seoha-love-single", "pair-business"];
const rows: string[] = [];
let leftover = 0;
for (const q of Q) for (const b of q.book === "*" ? BOOKS : [q.book]) {
  const before = md(BASE, b), after = md(DIR, b);
  if (!after) continue;
  const hb = (before.match(new RegExp(q.re.source, q.re.flags.includes("g") ? q.re.flags : q.re.flags + "g")) ?? []).length;
  const ha = (after.match(new RegExp(q.re.source, q.re.flags.includes("g") ? q.re.flags : q.re.flags + "g")) ?? []).length;
  if (ha) leftover++;
  if (q.book === "*" && !hb && !ha) continue;
  rows.push(`| ${q.item} | ${b} | ${q.quote} | ${before ? hb : "-"} | ${ha} | ${ha ? "남음" : "없음"} |`);
}
// 9 궁합 MBTI 점수와 설명, 20 관계 목록(Book 스냅샷 근거).
const snap = (dir: string, id: string) => { const t = read(dir, id, "snapshot.json"); return t ? JSON.parse(t) as { evidencePacket: { pair?: { relations?: string[]; score?: { components: { name: string; points: number; max: number; reason: string }[]; version?: string } } } } : null; };
for (const [dir, label] of [[BASE, "기준"], [DIR, "재생성"]] as const) {
  const p = snap(dir, "pair-business")?.evidencePacket.pair; if (!p) continue;
  const m = p.score?.components.find(c => c.name === "MBTI");
  rows.push(`| 9 궁합 MBTI | pair-business(${label}) | MBTI ${m?.points}/${m?.max} · ${(m?.reason ?? "").slice(0, 70)}… (${p.score?.version}) | - | - | ${m && m.points === 0 && /겹치지도 부딪치지도/.test(m.reason) ? "불일치" : "일치"} |`);
  const rel = p.relations ?? [];
  const dup = rel.length - new Set(rel.map(r => r.replace(/^.*?(?=[가-힣]+\()/, ""))).size;
  rows.push(`| 20 관계 목록 | pair-business(${label}) | ${rel.length}줄, 같은 관계 중복 ${dup} | - | - | ${dup ? "중복" : "없음"} |`);
}
console.log("| 항목 | 권 | 인용(꼴) | 기준 | 재생성 | 판정 |\n|---|---|---|---|---|---|\n" + rows.join("\n"));
console.log(`\n재생성본에 남은 인용 꼴: ${leftover}`);
