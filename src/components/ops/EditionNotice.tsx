import "server-only";
import { createOpsStores } from "../../lib/ops/store";
import s from "./ops.module.css";

/** 임시본 여부(P6d-ops 7): 정식 작가가 오래 멈춰 다른 작가가 먼저 쓴 책이면 true. 상태를 못 읽으면 false(아무것도 안 보인다). */
export async function isInterimEdition(reportId: string): Promise<boolean> {
  try { return ((await createOpsStores().generation.call("state", { reportId })).state as { phase?: string } | null)?.phase === "interim"; } catch { return false; }
}

/** 임시본 한 줄 안내. 정식본으로 바뀌면 사라진다(동기 컴포넌트: 상태는 페이지가 먼저 읽는다). */
export function EditionNotice({ interim }: { interim: boolean }) {
  if (!interim) return null;
  return <p className={s.interim} role="note" data-edition="interim">임시본이에요. 정식본이 완성되면 같은 주소에서 자동으로 바뀌어요.</p>;
}
