import { LAUNCH_NOTICE, type LaunchEventView } from "../../lib/growth/launchEvent";
import s from "./bookShare.module.css";

export function BookEventNotice({ view, remaining }: { view: LaunchEventView | null; remaining: number | null }) {
  const state = view?.state === "ACTIVE" && remaining === 0 ? "ENDED" : view?.state;
  const active = state === "ACTIVE" && remaining !== null && remaining > 0 && view?.budgetApproved && view.referralAvailable && view.inviterAvailable;
  const text = active ? "이벤트 진행 중 · 신규 친구에게 1장, 친구의 첫 책 완성 시 나도 1장"
    : state === "SCHEDULED" ? "무료 이용권 이벤트 시작 전 · 책 공유는 이용할 수 있습니다."
    : state === "PAUSED" ? "무료 이용권 혜택 일시 중단 · 책 공유는 이용할 수 있습니다."
    : state === "ENDED" ? "무료 이용권 이벤트 종료 · 책 공유는 계속 이용할 수 있습니다."
    : "이벤트 혜택 상태 확인 중 · 책 공유는 이용할 수 있습니다.";
  return <div className={s.event}>
    <p className={s.notice}>{text}</p>
    {active ? <p className={s.notice}>가입 자격과 계정당 한도에 따라 지급합니다. 가입 보상 1회 · 추천 성공 보상 1회.</p> : null}
    <details className={s.conditions}><summary>무료 이용권 참여 조건 보기</summary><p>{LAUNCH_NOTICE}</p></details>
  </div>;
}
