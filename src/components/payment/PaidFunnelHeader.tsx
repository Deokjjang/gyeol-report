import GyeolBrandHeader from "../brand/GyeolBrandHeader";
import styles from "./paidFunnel.module.css";

export default function PaidFunnelHeader({ title, ready, compatibility = false, description }: {
  readonly title: string;
  readonly ready: boolean;
  readonly compatibility?: boolean;
  readonly description?: string;
}) {
  return (
    <>
      <GyeolBrandHeader />
      <header className={styles.intro}>
        <h1>{title}</h1>
        <p>{description ?? (compatibility ? "두 사람의 기본 정보와 관계를 입력해 주세요." : "나를 이해하기 위한 기본 정보를 입력해 주세요.")}</p>
        <ol className={styles.progress} aria-label="구매 진행 단계">
          <li aria-current={!ready ? "step" : undefined}><span>01</span> 정보 입력</li>
          <li aria-current={ready ? "step" : undefined}><span>02</span> 확인</li>
          <li><span>03</span> 결제</li>
        </ol>
      </header>
    </>
  );
}
