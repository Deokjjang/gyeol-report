# V4-SIX-PRODUCT-FULL-CONTENT-REFINEMENT-01

기준: `3fb239f52e2c44aef69877735899e0f8448a2f2c`.
브랜치: `v4/six-product-full-content-refinement-01`.

이 보고서는 Phase별로 이어서 작성한다. A~F 전체 완료 전 최종 완료 또는 판매 품질 승인을 의미하지 않는다. 실제 생성 경로와 기존 Reader를 사용하며 Production, 고객 저장본, 계산, 결제/Auth/Worker는 수정하지 않는다. 기존 3193 검수 서버 및 브라우저 자료는 보존한다.

## Phase A — 종합

기존 signed facet의 내면·재능·일·돈을 서로 다른 독자 질문으로 풀었다. 신규 자료는 원국의 새로운 사실이나 연구 DB가 아닌 조건부 생활 적용 문장이다. 실제 원국의 복합 후보 중 지원 수준과 근거 ID가 확인된 조합을 기존 설명에 연결했다. 없는 조합은 만들지 않는다. 기존 배정·중복 방지·Fusion의 조건 분리·MBTI 근거 검증은 그대로다.

결말은 새 근거를 소개하지 않고 앞서 소개한 핵심·재능·과사용의 인물상을 회고한다. 새 발행 revision은 `comprehensive-full-content-refinement-01-v2`이며 과거 스냅샷은 재작성하지 않는다.

실제 김민서 Book: 13장·52문단·21페이지. 원문 JSON/텍스트·전 페이지 SSR·검수 생성 경로 일치를 외부 기록에 보관했다. 종합 회귀 23 PASS + 기존 외부 스냅샷 조건부 1 SKIP, 신규 회귀 2 PASS, 타입 검사 0진단, 변경 파일 lint 및 diff-check 통과. 나머지 상품과 최종 브라우저 검수는 아직 진행 전이다.

## 검증 자료

`~/Documents/gyeol-validation/v4-six-product-full-content-refinement-01/`

- `preservation-before.json`: 원본 Dirty 11개·기존 86 Worktree·Ref·HEAD 기준
- `before/`: 수정 전 실제 6상품과 궁합 7유형 전체 원문
- `scores-before.json`: 실제 16 가상 입력의 136쌍 × 7유형 점수 및 계산 근거
- `phase-a/`: Phase A 실제 전체 Book 및 생성 packet
- `PROGRESS.json`: 정확한 진행 단계
