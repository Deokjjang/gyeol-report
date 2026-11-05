import { permanentRedirect } from "next/navigation";

/** P6d-ops 개정 초안은 v5 최종3에서 정식 방침(/privacy)에 합쳤다. 예전 주소는 정식 방침으로 보낸다. */
export default function PrivacyDraftPage() {
  permanentRedirect("/privacy");
}
