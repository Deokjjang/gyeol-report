import "server-only";
import { createOpsStores } from "../../lib/ops/store";
import s from "./ops.module.css";

/** 임시본 표시(P6d-ops 7): 정식 작가가 오래 멈춰 다른 작가가 먼저 쓴 책이면 위에 한 줄. 정식본으로 바뀌면 사라진다. 상태를 못 읽으면 아무것도 안 보인다. */
export async function EditionNotice({ reportId }: { reportId: string }) {
  let phase: string | undefined;
  try { phase = ((await createOpsStores().generation.call("state", { reportId })).state as { phase?: string } | null)?.phase; } catch { phase = undefined; }
  if (phase !== "interim") return null;
  return <p className={s.interim} role="note" data-edition="interim">임시본이에요. 정식본이 완성되면 같은 주소에서 자동으로 바뀌어요.</p>;
}
