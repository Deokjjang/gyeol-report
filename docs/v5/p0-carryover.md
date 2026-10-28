# P0-2 carryover: 가져온 것 / 버린 것 / 보류

방식: 경로 기반 복원(`git checkout <branch> -- <path>`)과 `git rm`만 사용. rebase·reset·이력 재작성 없음.
기준: origin/master 0dde75a8 위의 v5/main.

## KEEP (v5/main에 반영)

| 항목 | 출처 | 반영 방식 | 사유 |
|---|---|---|---|
| `src/data/knowledge-v5/**` (20 파일, 2.6MB: schema.ts, features 8, mbti 2+프로필, cross 2+발견, ontology, product-narratives, source-index, evidence-contract.ts, cross-score.ts) | q1 580705ae | checkout | 지식 DB 자산·스키마. 지시 항목 |
| `scripts/knowledge-lint.ts` | q1 | checkout | 데이터 품질 게이트(결정론). 이슈 0건 확인 |
| `tests/unit/knowledge-v5/knowledgeLint.test.ts` | 신규 | 작성 | q1에는 관련 테스트가 없어 lint=0을 vitest로 고정 |
| `docs/eval/inputs.json` | q1 | checkout | 기준 입력. 지시 항목 |
| zod, tsx (package.json, pnpm-lock) | q1 | `pnpm add` | zod = 지식 스키마 검증, tsx = lint 스크립트 실행. q1의 package.json을 통째로 복원하면 master가 추가한 `astronomy-engine`이 지워져 쓰지 않음 |
| 로딩 화면: `ReportGenerationStatus.tsx`, `ReportStatusView.tsx`, `reportStatus.module.css` | q2 (82bd44cb + lint 수정 6c9871a8 반영본) | checkout | 단계형 진행 표시 + "멈춘 refresh가 폴링을 영영 끊던" 버그 수정. 단계는 서버 신호가 아닌 경과 시간 기준 |
| `src/app/reports/[reportId]/page.tsx` (retry 경로 8줄), `tests/unit/app/reports/postPaymentExperience.test.tsx` | q2 | checkout | 저장소 일시 장애 시 정적 화면에 멈추지 않고 자동 재확인. 컴포넌트와 한 묶음 |
| `src/app/api/payment-checkout/prepare/route.ts`, `tests/unit/api/birthTimeCheckoutBoundary.test.ts` | q3 b2398fc9 + q3c a12f4919(es2017 정규식) | checkout | 절입일 안내 문구 |
| `src/lib/saju/birthTimeUncertaintyNotice.ts` + 테스트 | q3 e2416585 | checkout | 위 안내 문구가 import하는 헬퍼. 안내문 생성만 하며 계산 로직 변경 없음. writer-v5와 독립(saju 타입·절기 모듈만 사용) |
| annualEvidence 해시 재고정 7파일 | q3 4eab02e0 | checkout | OpenAI 제거로 `annualEvidence.ts`가 바뀌어 필요. 현재 파일 sha256(11a74bd1…)과 일치 확인 |
| OpenAI 작가 코드 제거 (125 파일, +596/−23,679) | q2-openai-removal ca1aad97 (= q2 a7265be7과 파일 목록 동일) | A·M checkout, D `git rm` | 지시 항목. master가 그 사이 바꾼 파일과 겹침 0 |
| `tools/quality-q2/import-graph.mjs`, `module-contract.mjs` | 제거 커밋에 포함 | checkout | 제거 증명·module-contract 재생성 도구 |
| `docs/v5/openai-removal-import-graph.md` | 신규 | 생성 | 제거 전·후 그래프 증명 |

## DROP (가져오지 않음, 보관 브랜치에 남김)

| 항목 | 위치 | 사유 |
|---|---|---|
| `src/lib/writer-v5/**`, `src/lib/evidence-v5/**`, `tests/unit/writer-v5/**` | q2·q3·q3c | 지시: 2파동·입장 원장·판정·수리는 SPEC §3(발행 경로에 LLM 판정·수리 없음)과 충돌 |
| `WRITER_V5_PRODUCTS` 연결 (`comprehensiveProductAdapter.ts`, `runtimeShadow.ts` 변경) | q2 82bd44cb | writer-v5 전제 |
| q3 일관성·반복·시간미상 가드 본체, Q3c 채택 가시성·판정·부분 수리 | q3 e2416585(헬퍼 제외), q3c f3cd8a2a | writer-v5 전제 |
| `/dev/review` 및 리뷰 스토어 | q3c 771574b0·962f3d37·d750e190 | 지시 |
| q3 측정 스크립트 | q3 7e5a79c4 | 지시 |
| `docs/eval/**` 산출물 (baseline, failure-rate, q2·q3 평가, 블라인드 패킷) | q0~q3c | 지시. 보관 브랜치에 있음 |
| `tools/quality-q2/*` 중 eval·replay·blind·probe 계열 | q2 | writer-v5 평가용 |
| `v5/event-1plus1` | 0d87ac3c | 지시: 병합 금지, 보류 |
| `v5/phase0-version-tolerant`, `v5/manseryeok-lmt` | — | 이미 master에 반영(manseryeok-lmt는 재작성 SHA) |

## 보류 (애매 → 가져오지 않고 목록만)

| 항목 | 이유 |
|---|---|
| `scripts/knowledge-build.ts` (q1) | 지식 데이터 재생성기. 데이터는 이미 생성돼 있고 지시 범위에 없음. 필요해질 때 가져온다 |
| `docs/design/knowledge-v5-style.md` (q1) | lint 규칙 설명 문서. lint 헤더가 참조하므로 가져오는 편이 좋을 수 있으나 지시 범위 밖. **권장: 다음 작업에서 가져오기** |
| `docs/design/evidence-contract*.md`, `q1-agent-brief-*.md` (q1) | writer-v5 설계 맥락. SPEC과 충돌 여부 판단 필요 |
| `docs/quality-q0-report.md`, `quality-q1-report.md`, `q1-progress.md`, `q1-review-sample.md`, `phase0-preview-smoke.md` | 이력 문서. 필요 시 보관 브랜치에서 참조 |
| `docs/eval/{knowledge-gaps.md, knowledge-inventory.json, plan-sample*, preview-smoke.json, q1-cross-score-distribution.md}` | docs/eval 산출물 규칙에 따라 제외했으나 knowledge-gaps는 지식 작업에 유용할 수 있음 |
| `scripts/smoke-preview.ts`, `tools/quality-q0/*`, `tools/quality-q1/*` (생성 스크립트 .txt 포함) | 측정·생성 도구. 재현이 필요할 때 보관 브랜치에서 |
| `src/data/knowledge-v5/evidence-contract.ts` | 디렉터리째 가져와 포함됨. 현재 소비하는 코드가 없고 writer-v5 계약 맥락이라 P3 전에 존치 여부 재판단 |

## 기록 사항 (정정)
- 커밋 `54b9bcfa`는 제목이 "loading screen…"이지만 knowledge-v5 자산·lint 스크립트·inputs.json·lint 테스트도 함께 담고 있다(pathspec 오류로 의도한 별도 커밋이 실패하고 `git add -A`가 합쳤다). 이력 재작성 금지 규칙에 따라 amend하지 않고 `d74b22ca` 메시지에 남겼다.
- 제거 커밋 `b811597d`의 제목은 지시문 표현("unused")을 따랐으나, 제거 전 그래프에서 17개 파일은 진입점에서 **도달 가능**했다(런타임 플래그 `OPENAI_REPORT_WRITER_ENABLED=1`일 때만 호출). 제거 후에는 참조 0.
