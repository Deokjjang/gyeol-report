# Comprehensive Editorial Phase B

2026-09-28 · `v3/rebuild` · `comprehensive_v3.3-editorial.1`

## 범위

Phase A의 순수 편집 조립기를 명시적 종합 V3 생성 경로에 적용했다. 계산·명리 강도·Compound 매칭·MBTI 원본과 pair DB·상단 전문표는 변경하지 않았다. 다른 5상품, 결제, provider, persistence, DB schema, Production 및 master는 변경하지 않았다. 외부 OpenAI 호출은 0건이다. B 이후 C Career는 시작하지 않는다.

`v3.2-final.1`은 `buildComprehensiveFinal`로 동결했다. 기존 V3/V3.1/V3.2/V3.2-final은 각 버전의 작성기로 재검증하며, 이번 본문을 저장된 리포트에 덮어씌우지 않는다. 이전 final A~F draft SHA-256은 작업 전과 동일하다. 출생시각 미확정의 기존 보수적 경로도 유지한다.

## 본문 변경

- 십성 10종마다 첫인상·겉과 속·선택·혼자 보내는 시간·일·돈·친구·사랑·배움·과사용·마지막 문장을 따로 썼다. 이름이나 날짜 해시로 문장을 무작위 교체하지 않는다.
- 기존 선택 근거 중 실제로 강한 축을 조합한다. 핵심 인물 묘사, 두 번째 성향의 반전, 좋은 패, 실제 MBTI 반응이 첫 장에 함께 보인다.
- 같은 근거라도 영역의 발현은 다르다. 현침은 논리의 틈, 검수, 친구 말투, 애정의 미세한 변화, 오답의 위치로 나뉜다. 양인은 관찰력이 아니라 결단·독립·경계의 과사용으로 쓴다.
- 16유형의 실제 MBTI trait와 강한 명리 신호가 함께 있을 때만 행동 장면을 붙인다. ENTJ의 수정 순서와 INFP의 가치 경계처럼 같은 현침도 실제 문장이 달라진다. 미입력에는 MBTI 문장을 만들지 않는다.
- 장성의 명예·이름, 반안의 자리·인정, 귀인의 인복·도움, 재고의 축적, 문창의 표현력, 역마의 외부 기회를 직접 말한다. 이미 있는 좋은 패의 실제 장면을 읽으며 사건이나 수익을 약속하지 않는다.
- A의 소량 재성을 큰 재물복으로 승격하지 않는다. 돈에서는 식신의 기술·시간 가치와 겁재의 비교 소비를 읽는다. 강한 재성이 있는 C/D는 각각 교환 감각/축적을 선명하게 말한다.
- 현재 직업은 맥락 한 단락에만 자연스럽게 반영한다. 업무 매뉴얼로 확장하지 않는다. 학생·쉬는 중·상태 미입력에는 직업이나 결혼을 추정하지 않는다.
- 산문·질문·짧은 한 줄·인용형 강조·관찰·팁을 섞는다. 일·관계·배움의 조언은 중간에 놓기도 해서 모든 장이 같은 조언으로 끝나지 않는다. 연속 writing mode는 0건이다.
- 편집기는 문단을 삭제하거나 분위기 이름을 임의 변경해 검사를 통과시키지 않는다. 엄격한 교대 모드에서 같은 장 안의 원고 순서만 결정하며, 뒤에 같은 분위기나 형식이 몰리는 경우까지 확인한다. 기본 Phase A 동작은 그대로다.
- 오행은 기존 가중 계산의 5개 상태를 모두 보여준다. 균형권은 짧은 유지 문장만 두고 나머지는 물상과 생활 장면을 읽는다.
- 마지막은 성격·다른 강한 축·좋은 패·관계·생활 방향을 다시 모은다. A~F 마지막 문장은 전부 다르고 기존 결론 유형도 확장/안정/표현/연결/리더/탐구로 구분된다.

## 대표 원고 직접 검토

가온의 첫 장은 경쟁 자극에 깨어나는 승부욕으로 시작하지만 식신의 편안한 즐거움, 천을의 인복, 편인×ENTJ의 머릿속 정리까지 함께 드러낸다. 돈에서는 “금방 해준 부탁에도 오래 익힌 시간이 들어 있습니다”, 사랑에서는 도움을 주고도 차갑게 받아들여져 억울한 반전으로 이어진다. 마지막은 “앞선 사람만 쫓던 발걸음이, 어느 순간 사람들을 데려가는 길이 됩니다.”로 닫는다.

대조 원고도 검토했다. B는 선택권과 내면 가치, C는 익숙한 방식의 허점과 현실적 교환, D는 배움·돌봄과 세밀한 관찰/홍염, E는 책임과 인정·미입력 MBTI, F는 독자적 탐구와 현장 전환으로 성격이 갈린다. B/C의 MBTI 문장 중 같은 의미를 다시 설명하던 대목은 감정의 결과와 상대가 오해하는 장면으로 다듬었다. D/E의 도화는 확인된 표식이지만 약한 단서를 주인공으로 승격하지 않는다.

### 본문 역할 비율

제목·전문표를 제외한 실제 본문 글자에 저자가 부여한 역할을 집계했다. 자동 의미 판정이나 글자 수 KPI가 아니며, 직접 읽은 편집 검토와 함께 사용한다.

| Fixture | 인물/현실/재미 | 가벼운 근거 | 조언 | 질문 |
| --- | ---: | ---: | ---: | ---: |
| A 가온 | 66.1% | 20.8% | 13.1% | 2 |
| B 나래 | 66.9% | 21.4% | 11.8% | 5 |
| C 다온 | 66.5% | 20.1% | 13.4% | 2 |
| D 라온 | 65.5% | 21.6% | 13.0% | 5 |
| E 마루 | 65.4% | 21.7% | 12.9% | 3 |
| F 이든 | 65.4% | 21.0% | 13.6% | 3 |

6건 모두 편집기 거절/리듬 경고/근거 오류 0, 40자 이상 문장 중복 0, 약한 근거의 hero 승격 0, 없는 도화·홍염 생성 0이다. 동일 강한 근거는 공통 원고를 공유한다. 모든 고객의 모든 문장이 고유하다는 보장이나 명리 해석의 과학적 정확성 보장은 하지 않는다.

## 최종 로컬 검토 URL

| Fixture | URL |
| --- | --- |
| A 가온 | http://127.0.0.1:3100/reports/report_uzsdupfr4zya0 |
| B 나래 | http://127.0.0.1:3100/reports/report_xp74ecwh4cm2p |
| C 다온 | http://127.0.0.1:3100/reports/report_vb7dip1b3z6dl |
| D 라온 | http://127.0.0.1:3100/reports/report_0irerqaq2yicb |
| E 마루 | http://127.0.0.1:3100/reports/report_ld27r0xohnb8n |
| F 이든 | http://127.0.0.1:3100/reports/report_s9j6hx6u1rtd4 |

생성 API는 development의 preview_memory 경로만 사용했고 6개 응답 모두 HTTP 200, SUCCESS, externalCallCount 0이었다. URL은 현재 로컬 개발 서버의 미리보기 메모리에 의존하므로 서버 재시작 후 재생성이 필요할 수 있다.

가온 전체 고객 텍스트: [COMPREHENSIVE_EDITORIAL_PHASE_B_REVIEW.txt](./COMPREHENSIVE_EDITORIAL_PHASE_B_REVIEW.txt). 실제 브라우저에서 만세력·모든 기운·각 계산 기준·MBTI·하위 선호 지표/기능 서열까지 펼친 `article.innerText`를 내보냈다. 사이트 공통 사업자 정보와 공유 버튼은 제외했다.

## 검증

- 관련 13파일 **292 tests PASS**: common core, Phase A, 종합 V3 각 버전, 생성 API, snapshot/publish/SSR, 읽기 화면, 다른 5상품의 결정적 결과 회귀, lookup 경계, 만세력.
- 6원국 × (16 MBTI + 미입력) **102조합**: 게시·SSR PASS, 원국별 실제 fusion character 문장 16종 구분, MBTI 변경에 따른 명리 계산 변화 0, 근거 없는 hero 0. 추가 생년월일/남녀 **15건**과 학생/상태 미입력 **2건**도 게시·편집 검사 PASS.
- 현재 6개 실제 URL: 상단 순서 제목 → 목차 → 만세력(오행 통합) → 주요기운 → MBTI → 본문 유지. 기본 기운 10개와 전체 펼침 유지. 실제 SSR/고객 HTML 내부 ID·source 노출 0.
- **390/768/1440px × 6건**: 모든 표와 하위 정보까지 펼친 상태에서 document overflow 및 article 자식 clipping 0. hydration 오류·브라우저 오류·Next overlay 0. 가온/라온의 캡처를 직접 확인했다.
- `pnpm lint`, `pnpm build`, `git diff --check` PASS. Next.js 서버 렌더링/기존 클라이언트 펼침 경계를 유지했고 hydration 억제나 새 effect/state는 추가하지 않았다.
- 전체 **4,237 PASS / 기존 3 FAIL** (총 4,240). 과거 약관 날짜를 기대하는 `legalPagesSource.test.ts`, `policyPagesSource.test.ts`, 제거된 궁합 점수 marker를 기대하는 `compatibilityPreviewPageSource.test.ts`는 범위 밖으로 유지했다.
- 별도 `tsc --noEmit`: 기존 테스트 진단 384건, src/이번 변경 파일의 새 진단 0. 전체 타입 검사가 깨끗하다고 보고하지 않는다.

## 재현

```sh
DEPTH_REVIEW_OUTPUT=1 pnpm exec vitest run tests/unit/interpretation-v3 tests/unit/api/createReportRoute.test.ts tests/unit/app/reports/completedReadingExperience.test.tsx tests/unit/report-generation/deterministicProductQuality.test.tsx tests/unit/persistence/paidReportLookupBoundary.test.ts tests/unit/components/report-tables/ManseRyeokCommonTable.test.tsx --silent
pnpm lint
pnpm build
git diff --check
```

선택적 테스트 export는 `/tmp/gyeol-depth-{A..F}.json/.txt` 및 `/tmp/gyeol-depth-assembly-{A..F}.json`에 남는다. fixture는 테스트용이다. `.gitignore`, `AGENTS.md`, `supabase/.temp/`는 커밋에서 제외한다.
