import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge } from "@/lib/brief";
import { jobEntryBlock } from "@/lib/brief/jobEntry";
import { renderWriterBrief } from "@/lib/writer/prompt";
import { groupClaimMismatch } from "@/lib/writer/safety/lint";

// 최종 A-6(신약 × 비겁·인성 강 한 문장 틀)·A-7(직군 거르기). 호출 0.
const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));
const person = (birthDate: string, birthTime: string, gender: "MALE" | "FEMALE", jobStatus = "employee", detailJob = "") =>
  ({ name: "가", gender, birthDate, birthTime, birthTimeUnknown: false, mbtiType: "ISTP" as never, context: { relationshipStatus: "single", jobStatus, detailJob } });

describe("A-6 신약인데 비겁·인성 강 → 한 문장 틀", () => {
  const brief = buildBrief({ product: "career_money_study", baseDate: "2026-11-05", person: person("1964-04-09", "21:48", "MALE") }, k);
  it("강약 라벨 대신 한 문장, 묶음 단계는 「있음」", () => {
    expect(brief.chart.strength.level).toBe("WEAK");
    expect(brief.chart.strength.label).toBe("나를 돕는 기운(내 방식의 힘·비겁)은 있지만 태어난 계절에 눌려 전체 힘은 약한 편");
    expect(brief.chart.groups?.levels.비겁).toBe("있음");
  });
  it("작가 브리프에 「신약」과 「비겁 강」이 함께 없다", () => {
    const text = JSON.stringify(renderWriterBrief(brief, { knowledge: k }));
    expect(text).not.toMatch(/신약/);
    expect(text).not.toMatch(/(비겁|내 방식의 힘)\)?\s*"?강(?![가-힣])|"비겁":"강"/);
  });
  it("검사: 「있음」 묶음을 강하다·약하다로 말하면 잡는다", () => {
    expect(groupClaimMismatch("내 방식의 힘이 강해서 고집이 셉니다.", brief.chart.groups!.levels as never)).toBe("비겁:강≠있음");
  });
  it("충돌이 아닌 사람은 그대로(매우 신약 + 비겁 보통)", () => {
    const b = buildBrief({ product: "career_money_study", baseDate: "2026-11-05", person: person("1986-08-09", "08:14", "MALE") }, k);
    expect(b.chart.strength.label).toBe("매우 신약");
    expect(b.chart.groups?.levels.비겁).toBe("보통");
  });
});

describe("A-7 직군 거르기(나이·상황)", () => {
  const catalog = k.catalog;
  it("나이 15~75 × 상태 전부에서 직군마다 3개 이상 남는다", () => {
    const statuses = ["student", "job_seeker", "employee", "freelancer", "self_employed", "business_owner", "homemaker", "unemployed", "other"];
    for (let age = 15; age <= 75; age++) for (const jobStatus of statuses) for (const detailJob of ["", "회계 사무직 재취업 준비"]) {
      for (const cl of catalog.clusters) {
        const left = catalog.jobs.filter(j => j.cluster === cl.id && !jobEntryBlock(j.title, { age, jobStatus, detailJob }));
        expect(left.length, `${cl.id} ${age} ${jobStatus} ${detailJob}`).toBeGreaterThanOrEqual(3);
      }
    }
  });
  it("규칙: 채용 연령 상한·체력 현장직·긴 훈련·운전직", () => {
    expect(jobEntryBlock("부사관", { age: 31, jobStatus: "job_seeker" })).toBe("채용 연령 상한 30세");
    expect(jobEntryBlock("부사관", { age: 22, jobStatus: "job_seeker" })).toBeNull();
    expect(jobEntryBlock("소방관", { age: 41, jobStatus: "employee" })).toBe("채용 연령 상한 40세");
    expect(jobEntryBlock("경호원", { age: 53, jobStatus: "job_seeker" })).toBe("체력 검정 현장직");
    expect(jobEntryBlock("항공 조종사", { age: 53, jobStatus: "job_seeker" })).toBe("여러 해 훈련·자격");
    expect(jobEntryBlock("항공 조종사", { age: 17, jobStatus: "student" })).toBeNull();
    expect(jobEntryBlock("시내버스 기사", { age: 17, jobStatus: "student" })).toBe("운전 면허·경력 요건");
    expect(jobEntryBlock("시내버스 기사", { age: 53, jobStatus: "job_seeker", detailJob: "회계 사무직 재취업 준비" })).toBe("재취업 목표와 다른 운전직");
    expect(jobEntryBlock("시내버스 기사", { age: 53, jobStatus: "job_seeker", detailJob: "버스 운전 재취업" })).toBeNull();
  });
  it("윤도윤(53·구직·회계 사무직 재취업 준비): 직군 목록에 거른 직업이 없다", () => {
    const b = buildBrief({ product: "career_money_study", baseDate: "2026-11-05", person: { ...person("1973-04-16", "06:19", "FEMALE", "job_seeker", "회계 사무직 재취업 준비"), mbtiType: "ENFJ" as never } }, k);
    const lines = b.chapters.flatMap(c => c.materials).flatMap(m => (m.kind === "evidence" && /^job/.test(m.key) ? m.facts : []));
    const text = lines.join("\n");
    for (const banned of ["부사관", "소방관", "경호원", "항공 조종사", "시내버스 기사", "감정평가사", "보험 계리사", "세무사"]) expect(text, banned).not.toContain(banned);
    expect(text).toContain("예시 직업: 교육 담당자, 채용 담당자, 업무 지원 코디네이터, 임원 비서, 복리후생 담당자");
  });
});

describe("A-8 궁합 성격표: 불편을 바로 말하는지 = 다툼 반응 축", () => {
  it("단서·「~도 같은 편」 옮김", async () => {
    const { pairProfileMismatch, pairProfileSameSide } = await import("@/lib/writer/safety/final2");
    const people = [{ names: ["백정우"], codes: { energy: "E", lead: "front", conflict: "now", express: "말", decide: "fast", offer: "open", money: "now" }, label: "백정우" },
      { names: ["오지안"], codes: { energy: "I", lead: "back", conflict: "later", express: "행동", decide: "slow", offer: "hold", money: "plan" }, label: "오지안" }] as never;
    const prev = "백정우님은 불편한 건 참지 않고 바로 말하는 편이라, 에어컨이 너무 차가우면 \"여기 너무 추워요\" 하고 곧바로 리모컨을 집어요.";
    expect(pairProfileMismatch(prev, people)).toBeNull();
    expect(pairProfileSameSide("오지안님도 같은 편이지만 말하는 방식은 더 짧아서 \"온도 좀요\"로 끝납니다.", prev, people)).toBe("오지안:다툼=정리한 뒤(앞 문장 성향을 「같은 편」으로 옮김)");
    expect(pairProfileMismatch("오지안님은 불편한 건 참지 않고 바로 말해요.", people)).toBe("오지안:다툼=정리한 뒤");
    expect(pairProfileMismatch("백정우님은 불편해도 일단 참고 넘겨요.", people)).toBe("백정우:다툼=그 자리에서");
  });
});

describe("A-9 문장 삭제 뒤 접속어 정리·짧은 소제목 기록", () => {
  it("뒤 문장의 접속어만 떼고, 지시어로 시작하는 문장은 그대로", async () => {
    const { removeSentenceAt, stripConnective, thinSections } = await import("@/lib/writer/safety/orphan");
    const { deleteFlagged } = await import("@/lib/writer/repair3");
    expect(removeSentenceAt(["가는 말이다.", "그런데 오는 말도 있다.", "끝이다."], 0).sentences).toEqual(["오는 말도 있다.", "끝이다."]);
    for (const c of ["그래서", "하지만", "그러나", "그리고", "그런데"]) expect(stripConnective(`${c} 오늘은 쉰다.`)).toBe("오늘은 쉰다.");
    expect(stripConnective("⟪그래서, 오늘은 쉰다.⟫")).toBe("⟪오늘은 쉰다.⟫");
    expect(stripConnective("이처럼 오늘은 쉰다.")).toBeNull();
    const ch = (paras: string[]) => [{ n: 2, id: "c2", title: "t", source: "writer" as const, chars: 0, sections: [{ heading: "h", paragraphs: paras }] }];
    const flag = (sentence: string) => ({ chapter: 2, section: 0, paragraph: 0, rule: "fact_term", sentence });
    const r = deleteFlagged(ch(["틀린 문장이에요. 하지만 이 사람은 끝까지 해냅니다. 마지막 문장이에요."]), [flag("틀린 문장이에요.")] as never, new Set(["fact_term"]));
    expect(r.chapters[0].sections[0].paragraphs[0]).toBe("이 사람은 끝까지 해냅니다. 마지막 문장이에요.");
    expect(r.deleted[0]).toMatchObject({ connectiveStripped: true });
    const kept = deleteFlagged(ch(["틀린 문장이에요. 이처럼 끝까지 해냅니다. 마지막 문장이에요."]), [flag("틀린 문장이에요.")] as never, new Set(["fact_term"]));
    expect(kept.deleted[0]).toMatchObject({ kept: "leans" });
    expect(thinSections(r.chapters as never)).toEqual([{ at: "2.0", heading: "h", sentences: 2 }]);
  });
});
