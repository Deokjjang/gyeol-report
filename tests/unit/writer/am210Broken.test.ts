/**
 * AM2-10 4부 시험(호출 0): 깨진 문장 안전망(broken.ts) — P9 원문(참)은 걸리고 저장 책 전수 대조의 오탐 꼴은 걸리지 않는다 · 네 갈래 대응.
 */
import { describe, expect, it } from "vitest";
import { am210Flags, dupPhrase } from "@/lib/writer/chunked/broken";
import { branchOf } from "@/lib/writer/chunked/four";
import { intakeOf } from "../../../tools/annual-major/am2-brief";
import { payloadFor } from "../../../tools/annual-major/am2-6-books";

const { intake } = intakeOf(payloadFor("annual-p6b"));
const keyed = intake.chapters.find(c => c.keys)!;
const sec = (heading: string, ...paragraphs: string[]) => ({ heading, paragraphs });
const flagsOf = (chapter: number, sections: { heading: string; paragraphs: string[] }[], mbtiType = "ISTJ") =>
  am210Flags([{ n: chapter, id: "x", title: "x", source: "writer", chars: 0, sections }] as never, { intake, mbtiType } as never).map(f => f.rule);

describe("AM2-10 깨진 문장 안전망", () => {
  it("「유형 + 도」: 받는 말이 없으면 걸리고, 같은 문장 앞부분 · 앞 문장에 받는 말이 있으면 걸리지 않는다", () => {
    const k = keyed.keys![6].key;
    expect(flagsOf(keyed.n, [sec(k, "남다른 시각은 있지만 남들이 따라오는 데는 시간이 걸릴 수 있습니다. ISTJ도 검증된 것만 믿는 쪽입니다.")])).toContain("mbti_do_orphan");
    expect(flagsOf(keyed.n, [sec(k, "새로 들은 이야기보다 직접 확인해 본 것을 믿는 쪽으로 마음이 기울고, ISTJ도 검증된 것만 믿는 쪽이라 같은 방향을 봅니다.")])).not.toContain("mbti_do_orphan");
  });
  it("끊긴 절 · 겹친 구절(좁힌 꼴만)", () => {
    expect(flagsOf(keyed.n, [sec(keyed.keys![5].key, "연인 사이가 얼마나 가까워졌는지, 마음의 온도가 하루에도 몇 번씩 오르내린다면 그 까닭을 한번 짚어 보셨나요?")])).toContain("cut_clause");
    expect(dupPhrase("설득·글쓰기·말하기처럼 말로 하는 일에서 두드러지고, 상관 기운은 2월 · 임인월처럼 대운과 같은 상관 기운이 겹치는 달이에요.")).toBe("상관 기운");
    // 나란히 쓴 되풀이는 들지 않는다(저장 책 전수 대조 오탐 꼴).
    expect(dupPhrase("이 대운의 주제는 내 이름으로 서는 10년이고, 다음 대운의 주제는 재능을 밖으로 꺼내는 10년이에요.")).toBeNull();
    expect(dupPhrase("아끼는 데 집중하다 꼭 필요한 지출까지 미루기 쉬우니, 필요한 지출 하나는 허락해 주세요.")).toBeNull();
  });
  it("세운 책: 대운 줄 · 대운 이름이 없는 장의 「이 대운」만", () => {
    const n = intake.chapters.find(c => c.n === 1)!.n;
    expect(flagsOf(n, [sec("x", "정미년의 미는 태어난 날 땅 글자 미와 맞물립니다. 이 대운의 땅 글자 축과는 부딪치기도 합니다.")])).toContain("dayun_orphan");
    expect(flagsOf(n, [sec("x", "신유 대운 안에서 2027년은 네 번째 해예요. 이 대운의 땅 글자 축과는 부딪치기도 합니다.")])).not.toContain("dayun_orphan");
  });
  it("짝 key의 MBTI 문장이 핵심 관계 · 관계 말과 채움 · 인과로 이어지면(잘못된 연결 백업)", () => {
    const kp = keyed.keys!.find(k => k.pair)!;
    expect(flagsOf(keyed.n, [sec(kp.key, "하던 방식을 끝까지 밀고 가는 ISTJ의 편은 바뀌어야 할 때 유연함이 모자라기 쉬운데, 이 달의 부딪침이 그 빈 곳을 채웁니다.")])).toContain("pair_outside");
  });
  it("깨진 글자(U+FFFD)가 남은 문장(P10 annual-p6a 원문)", () => {
    expect(flagsOf(keyed.n, [sec("x", "쉬어 가기 좋은 달은 뚜렷하게 �잡히지 않아요.")])).toContain("bad_char");
    expect(flagsOf(keyed.n, [sec("x", "쉬어 가기 좋은 달은 뚜렷하게 잡히지 않아요.")])).not.toContain("bad_char");
  });
  it("네 갈래: 깨진 다섯은 깨진 문장 · 짝 밖 이음은 잘못된 연결", () => {
    const c = { entered: { job: false, rel: true, children: false }, relationship: "married", inputs: {} as never, mbtiType: "ISTJ", pairedAt: () => true };
    for (const r of ["dayun_orphan", "mbti_do_orphan", "cut_clause", "dup_phrase", "bad_char"]) expect(branchOf({ chapter: 1, section: 0, rule: r, sentence: "x" }, c)).toBe("broken");
    expect(branchOf({ chapter: 1, section: 0, rule: "pair_outside", sentence: "x" }, c)).toBe("link");
  });
});
