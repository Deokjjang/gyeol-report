# 결리포트 Paid / Free Gating UI Design

## 1. 목적

이 문서는 실제 결제 구현 전에 `FREE_PREVIEW`와 `PAID_FULL` 섹션을 화면에서 어떻게 노출할지 정의한다.

- 결제 전에도 사용자가 리포트의 방향과 가치를 이해할 수 있게 한다.
- production에서 전체 유료 본문이 실수로 노출되는 상황을 막는다.
- 결제 전/후 UI 상태와 CTA 위치를 구현 전에 맞춘다.

## 2. 현재 상태

- report sections에는 이미 `level` 필드가 있다.
- section level은 `FREE_PREVIEW`와 `PAID_FULL`로 나뉜다.
- `/report/new`는 현재 dev preview 성격으로 모든 섹션을 보여준다.
- payment는 아직 구현되어 있지 않다.
- 현재 페이지는 사용자-facing label로 `무료 미리보기`, `전체 리포트`를 표시한다.

## 3. V1 게이팅 원칙

- calculation result는 결제 상태와 무관하게 deterministic하게 생성될 수 있다.
- visibility와 access는 UI와 이후 persistence/payment boundary에서 결정한다.
- free preview는 실제 가치를 제공하되 paid full content 전체를 노출하지 않는다.
- paid unlock은 해석 문장을 바꾸지 않고 접근 가능한 섹션 범위만 바꾼다.
- production에서는 결제 전 `PAID_FULL` 본문을 DOM에 렌더링하지 않는다.

## 4. 무료 미리보기 범위

결제 전 기본 노출 범위는 다음 섹션으로 둔다.

- `INTRO`
- `SAJU_CORE`
- `DAY_MASTER`
- `MBTI_PROFILE`
- `DISCLAIMER`

추후 필요하면 paid section의 제한된 preview snippet을 별도 설계로 추가할 수 있다. 이 경우 전체 본문을 잘라서 숨기는 방식이 아니라, preview 전용 짧은 문구를 따로 둔다.

## 5. 유료 전체 리포트 범위

결제 전 잠금 대상은 다음 섹션으로 둔다.

- `ELEMENTS`
- `TEN_GODS`
- `ADVANCED_PATTERNS`
- `SHINSAL`
- `RELATIONS`
- `SAJU_MBTI_BRIDGE`
- `SAJU_MBTI_SUGGESTION`
- `ACTION_GUIDE`

결제 후에는 같은 report output을 기준으로 잠금 섹션 본문을 표시한다.

## 6. 잠금 표시 방식

잠금 섹션은 결제 전에도 존재를 알 수 있게 하되 본문은 노출하지 않는다.

- section title은 표시한다.
- short summary는 표시한다.
- paid badge는 표시한다.
- content body는 locked card로 대체한다.
- locked card text는 다음 문구를 사용한다.
  - 전체 리포트에서 자세히 확인할 수 있습니다.
- production에서는 unlock 전 hidden full text를 DOM에 렌더링하지 않는다.
- section id, 내부 tag code, enum 값은 사용자-facing copy로 노출하지 않는다.

## 7. 결제 CTA 위치

CTA는 사용자가 무료 미리보기 가치를 확인한 뒤 자연스럽게 볼 수 있는 위치에 둔다.

- `DAY_MASTER` preview 직후
- 첫 번째 paid section 이전
- locked section list 하단

CTA copy는 다음 문구를 기본값으로 둔다.

- 전체 리포트 확인하기

CTA 주변에는 결제 전 확인해야 할 최소 안내와 support contact를 함께 배치한다.

## 8. 결제 전/후 상태

V1 UI 상태는 다음처럼 구분한다.

- `preview`: 무료 미리보기와 잠금 섹션 목록을 보여주는 상태
- `creating`: 리포트 생성 요청이 진행 중인 상태
- `payment_pending`: 결제 요청 또는 provider redirect가 진행 중인 상태
- `paid_unlocked`: 결제 확인 후 전체 섹션 본문을 볼 수 있는 상태
- `payment_failed`: 결제가 실패하거나 취소된 상태
- `report_error`: 리포트 생성 또는 조회가 실패한 상태

각 상태는 사용자-facing 안내 문구를 가져야 하며, 내부 오류 세부 정보는 화면에 노출하지 않는다.

## 9. 개발 Preview 모드

- local/dev 환경에서는 전체 섹션을 보여줄 수 있다.
- production 기본값은 `paid_unlocked`가 아니면 gated 상태로 둔다.
- dev preview badge는 명확하게 표시한다.
- all-section preview가 paid product로 배포되지 않도록 gating mode flag를 둔다.
- release 전 production build에서 gating 기본값을 확인한다.

## 10. 접근성/모바일 고려

- lock state는 색상만으로 구분하지 않고 텍스트로도 표시한다.
- CTA는 preview 이후 모바일에서도 쉽게 도달할 수 있어야 한다.
- locked section list가 길어져도 모바일 사용자가 압도되지 않도록 간격과 요약을 조정한다.
- badges는 작은 화면에서도 읽을 수 있는 크기와 대비를 유지한다.
- 키보드 포커스 순서는 CTA, support link, report section 흐름과 충돌하지 않아야 한다.

## 11. 구현 전 체크리스트

- [ ] gating mode flag가 정의되어 있다.
- [ ] production default가 gated로 설정되어 있다.
- [ ] unlock 전 paid body text가 DOM에 렌더링되지 않는다.
- [ ] CTA copy `전체 리포트 확인하기`가 준비되어 있다.
- [ ] payment/storage boundary 문서와 unlock 기준이 맞다.
- [ ] source tests가 free/paid label, locked card, CTA 위치를 검증한다.
- [ ] 모바일에서 preview, locked list, CTA 흐름을 확인했다.
- [ ] `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm release:check`가 통과한다.

## 12. 다음 개발 Task 제안

1. 37B — source test/docs reference for gating design
2. 38A — implement UI-only gated preview mode behind local flag
3. 39A — minimal report persistence design
4. 40A — payment provider decision document
