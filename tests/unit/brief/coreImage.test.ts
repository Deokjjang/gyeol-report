import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CORE_IMAGES, coreImage, pairImage, type CoreImageInput } from "@/lib/brief/coreImage";
import { RURAL_PROP, SIMILE } from "@/lib/writer/safety/patterns";

const dir = join(process.cwd(), "src/data/knowledge-v5/myeongri");
const nicknames = readdirSync(dir).flatMap(f => (JSON.parse(readFileSync(join(dir, f), "utf8")).features as { easyName: string }[]).map(x => x.easyName));
const lines = Object.values(CORE_IMAGES).flatMap(t => [t.hot, t.cold, t.peer, ...Object.values(t.excess), ...Object.values(t.place).flatMap(p => Object.values(t.subject).map(s => `${p} ${s}`))]);
const base: Omit<CoreImageInput, "stem" | "season"> = { strength: "BALANCED", levels: { WOOD: "보통", FIRE: "보통", EARTH: "보통", METAL: "보통", WATER: "보통" }, strongest: { element: "EARTH", level: "보통" } };

describe("핵심 이미지(P6b B-4)", () => {
  it("과제 예시: 甲·여름·신약·수 없음 → 아스팔트 위 큰 나무, 甲·신강·수 많음 → 넓은 대지의 고목", () => {
    expect(coreImage({ ...base, stem: "甲", season: "summer", strength: "WEAK", levels: { ...base.levels, FIRE: "없음", WATER: "없음" } }).line).toBe("한여름 도시 아스팔트 위에 선 큰 나무");
    expect(coreImage({ ...base, stem: "甲", season: "autumn", strength: "STRONG", levels: { ...base.levels, WATER: "많음" }, strongest: { element: "WATER", level: "많음" } }).line).toBe("넓은 대지에 뿌리 내린 오래된 고목");
  });
  it("기본 규칙은 계절 자리 + 강약 주인공", () => {
    expect(coreImage({ ...base, stem: "癸", season: "autumn", strength: "VERY_WEAK" })).toMatchObject({ line: "가을 아침 창가에 살짝 맺힌 이슬", ruleId: "R5:癸:autumn:weak" });
    // 최종판2 1-1: 작가에게는 그림 없는 뜻만(엔진 그림 줄을 본문에 옮기지 않게).
    expect(coreImage({ ...base, stem: "癸", season: "autumn", strength: "VERY_WEAK" }).meaning).toBe("계수(스며들어 적시는 힘) · 가을 태생 · 타고난 힘이 여린 편");
  });
  it("모든 줄: 한 줄(40자 이하)·그림 별명 없음·농촌 소품 없음·비유 표지 없음·서로 다름", () => {
    for (const l of lines) {
      expect(l.length, l).toBeLessThanOrEqual(40);
      expect(nicknames.find(n => l.includes(n)), l).toBeUndefined();
      expect(RURAL_PROP.test(l), l).toBe(false);
      expect(SIMILE.test(l), l).toBe(false);
    }
    expect(new Set(lines).size).toBe(lines.length);
  });
  it("궁합 관계 이미지: 생극 방향과 조사", () => {
    const img = (stem: keyof typeof CORE_IMAGES) => ({ stem, image: coreImage({ ...base, stem, season: "spring" }) });
    expect(pairImage(img("壬"), img("甲")).line).toBe("큰 강이 큰 나무를 적셔 키우는 사이");
    expect(pairImage(img("甲"), img("壬")).line).toBe("큰 강이 큰 나무를 적셔 키우는 사이");
    expect(pairImage(img("丙"), img("庚")).line).toBe("해가 강철을 달궈 다듬는 사이");
    expect(pairImage(img("甲"), img("乙")).line).toBe("큰 나무와 덩굴이 나란히 서 있는 사이");
  });
});
