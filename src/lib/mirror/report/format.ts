/**
 * 결 보고서 장면 한 줄 · 날짜 표기(화면 ReportView와 리뷰용 평문 reportToText가 같이 쓴다).
 * 문장 뱅크를 import하지 않는다(화면 묶음을 가볍게).
 */
import type { ReportScene, SectionKey } from "./types";

/** 장면 본문 한 줄(근거 숫자는 scene.count — 작은 줄로 따로). */
export function sceneLine(section: SectionKey, scene: ReportScene): string {
  const q = `“${scene.situation}”`;
  switch (section) {
    case "blind": return `${q} 직접 고른 답은 「${scene.mine}」, 친구 다수는 「${scene.picked}」`;
    case "hidden": return `${q} 직접 고른 답은 「${scene.mine}」`;
    case "closer": return `${q} 가까운 사이는 「${scene.picked}」 쪽`;
    case "one": return scene.mine === scene.picked ? `${q} → ${scene.picked}` : `${q} 직접 고른 답은 「${scene.mine}」, 이 친구는 「${scene.picked}」`;
    default: return `${q} → ${scene.picked}`;
  }
}

/** ISO 시각 → 한국 날짜 「12월 4일」. */
export function kstMonthDay(iso: string): string {
  const d = new Date(Date.parse(iso) + 9 * 3_600_000);
  return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일`;
}
