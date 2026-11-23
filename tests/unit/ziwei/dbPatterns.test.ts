import { expect, it } from "vitest";
import { BANNED } from "./dbCheck";
const hit = (t: string) => BANNED.filter(([, re]) => re.test(t)).map(([n]) => n);
it("금지 꼴 정규식 표본(평범한 문장은 통과, 금지 꼴은 걸림)", () => {
  const ok = ["가는 길에 들른 카페에서 다음 계획을 세웁니다.", "흉내만 내던 일을 끝까지 해냅니다.", "생각하는 사고방식이 남다릅니다.", "월급날 신용카드 결제일부터 확인합니다.", "칠살은 밀고 가는 별이에요.", "규칙을 정해 두면 마음이 편합니다.", "살기 좋은 동네를 고르는 눈이 있어요.", "몸의 리듬이 흐트러지면 먼저 잠을 챙깁니다.", "나무 그늘 평상처럼 편한 사람이에요.", "예상처럼 흘러가지 않아도 웃어넘깁니다."];
  for (const t of ok) expect(hit(t), t).toEqual([]);
  const bad: [string, string][] = [["카드를 보면 알 수 있어요.", "메모 · 내부 말"], ["화면에 뜨는 글", "메모 · 내부 말"], ["입력이 없으면", "메모 · 내부 말"], ["대길한 별입니다.", "등급 낱말"], ["흉한 자리", "등급 낱말"], ["상처를 받습니다.", "흉한 옛말"], ["서른에 결혼합니다.", "확정 예언"], ["살이 끼어 있어", "「살」 공포 꼴"], ["화기가 있으면 위험해요.", "화기 겁주기"], ["건강이 나쁘기 쉽습니다.", "건강 단정"], ["수술을 받게 됩니다.", "병명 · 수술 · 사고 단정"], ["평생 혼자 지냅니다.", "고독 확정"]];
  for (const [t, n] of bad) expect(hit(t), t).toContain(n);
});

it("장면 소품 정규식: 아이디어 · 딸기 · 받아들이다 · 회의적 · 시험 삼아는 소품이 아니다", async () => {
  const { KID_PROP, JOB_PROP, SPOUSE_PROP } = await import("./dbCheck");
  for (const t of ["새 아이디어를 적어 둡니다", "답을 찾아내고 나서야 잠듭니다", "딸기를 고릅니다", "충고를 받아들입니다", "회의적인 눈으로 봅니다", "시험 삼아 해 봅니다"]) expect(KID_PROP.test(t) || JOB_PROP.test(t) || SPOUSE_PROP.test(t), t).toBe(false);
  for (const t of ["아이가 잠든 뒤", "딸에게 말합니다", "팀장에게 보고합니다", "회의에서 먼저 말합니다"]) expect(KID_PROP.test(t) || JOB_PROP.test(t), t).toBe(true);
});

it("장면 용어 정규식: 「~에 대한」은 걸리지 않고 「대한」(10년 흐름)은 걸린다", async () => {
  const { SCENE_JARGON } = await import("./dbCheck");
  expect(SCENE_JARGON.test("친구의 고민에 대한 답을 찾습니다")).toBe(false);
  expect(SCENE_JARGON.test("새 대한이 시작되면")).toBe(true);
});

it("이름 뒤 조사: 「천기이 · 자미은 · 좌보은」은 틀리고 「천기가 · 자미는 · 칠살이」는 맞다", async () => {
  const { particleErrors } = await import("./dbCheck");
  expect(particleErrors("천기이 돕고 자미은 이끌고 좌보은 받칩니다").sort()).toEqual(["자미은", "좌보은", "천기이"]);
  expect(particleErrors("천기가 돕고 자미는 이끌고 칠살이 밀어요")).toEqual([]);
});
