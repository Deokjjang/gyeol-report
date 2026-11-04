import "server-only";
import { resolveBirthTimeCalculation } from "../../saju/birthTimePrecision";
import type { Pillar } from "../../saju/types";

const KO: Record<string, string> = {
  甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계",
  子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해",
};
const KEYS = [["year", "년주"], ["month", "월주"], ["day", "일주"], ["hour", "시주"]] as const;
export type PillarCell = { label: string; value: string };
export type ManseSummary = { ok: true; pillars: PillarCell[] } | { ok: false; reason: string };

const show = (p: Pillar) => `${p.stem}${p.branch}(${KO[p.stem] ?? p.stem}${KO[p.branch] ?? p.branch})`;

/**
 * 만세력 네 기둥(관리자 확인용, 기존 엔진의 출생 시각 해석을 그대로 쓴다). 시간 모름이면 시주를 만들지 않는다.
 * 절입 경계처럼 한 기둥이 정해지지 않으면 후보를 "/"로 보인다(책 생성과 같은 판단: 섞지 않는다).
 */
export function manseSummary(person: unknown): ManseSummary {
  if (!person || typeof person !== "object") return { ok: false, reason: "입력 없음" };
  const p = person as Record<string, unknown>;
  if (typeof p.birthDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(p.birthDate)) return { ok: false, reason: "생년월일 없음" };
  const unknownTime = p.birthTimeUnknown === true || p.birthTimePrecision === "unknown";
  try {
    const c = resolveBirthTimeCalculation({ birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, birthTimePrecision: p.birthTimePrecision, approximateBirthTimeSlot: p.approximateBirthTimeSlot });
    const pillars = KEYS.filter(([k]) => k !== "hour" || !unknownTime).flatMap(([k, label]) => {
      const one = c.confirmed[k];
      if (one) return [{ label, value: show(one) }];
      const options = c.candidates[k] ?? [];
      return options.length ? [{ label, value: `${options.map(show).join(" / ")} (미확정)` }] : [];
    });
    return pillars.length ? { ok: true, pillars } : { ok: false, reason: "계산 불가" };
  } catch { return { ok: false, reason: "계산 불가(입력 확인)" }; }
}
