import { LAUNCH_NOTICE, type LaunchEventView } from "../../lib/growth/launchEvent";
import s from "./bookShare.module.css";

export function BookEventNotice({ view, remaining, recipient = false, invitation }: { recipient?: boolean; invitation?: boolean; view: LaunchEventView | null; remaining: number | null }) {
  const state = view?.state === "ACTIVE" && remaining === 0 ? "ENDED" : view?.state;
  const active = state === "ACTIVE" && remaining !== null && remaining > 0 && view?.budgetApproved && view.referralAvailable && view.inviterAvailable;
  const text = active ? recipient ? "친구의 초대 링크로 처음 가입하고 필수 동의를 마치면 무료 이용권 1장을 받을 수 있어요." : invitation === false ? "일반 책 공유 링크입니다. 무료 이용권 혜택은 유효한 친구 초대 링크로 참여할 때 적용됩니다." : "내 책의 초대 링크로 친구가 처음 가입하고 첫 리포트까지 완성하면 나에게도 이용권 1장이 추가돼요."
    : state === "SCHEDULED" ? "무료 이용권 이벤트 시작 전 · 책 공유는 이용할 수 있습니다."
    : state === "PAUSED" ? "무료 이용권 혜택 일시 중단 · 책 공유는 이용할 수 있습니다."
    : state === "ENDED" ? "무료 이용권 이벤트 종료 · 책 공유는 계속 이용할 수 있습니다."
    : "이벤트 혜택 상태 확인 중 · 책 공유는 이용할 수 있습니다.";
  return <div className={s.event}>
    <p className={s.notice}>{text}</p>
    {active ? <p className={s.notice}>필수 동의·가입 자격과 발행 완료를 확인한 뒤 지급합니다. 가입 혜택 1장 + 초대 추가 혜택 1장, 계정당 최대 2장입니다.</p> : null}
    <details className={s.conditions}><summary>무료 이용권 참여 조건 보기</summary><p>{LAUNCH_NOTICE}</p></details>
  </div>;
}
