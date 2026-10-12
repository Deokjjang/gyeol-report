# V4-SAJU-TEMPORAL-INTERACTION-KNOWLEDGE-01

독립 기간 상호작용 연구 DB를 작성했다. 신규 자료를 생성기·runtime lookup·barrel·의미축·Fusion·MBTI·Book과 연결하지 않았다. 원래 계산·근거·원고·저장 Book을 변경하지 않았다. 연구 작성 완료와 고객 사용 승인·판매 품질·배포 승인은 별개다.

기준: `v4/saju-relation-knowledge-01` / `3117327c80e8a35e9a476646114ffc3ae42f93ed` (원격 일치 확인).
작업: `v4/saju-temporal-interaction-knowledge-01` / `/private/tmp/gyeol-saju-temporal-interaction-knowledge-01`.
평가: 2026-10-12 12:00 KST. 외부 자료 열람: 2026-10-13.

## 실제 산출물

신규 소스16개(자료15·타입1), 연구 레코드401개, 출처9개. 이 수치는 독립 명리 사실의 수가 아니다. 기본 정의9종·조합64개는 기존 rr ID로 참조했다. 원천 연구와 고객용 문장을 같은 승인 상태로 합치지 않았다.

| 자료 | 수 | 상태·의미 |
|---|---:|---|
| 기간 개념 | 5 | 계산 B와 긍정·주의·반전 C 필드 구분 |
| 대운·세운·월운 심층 조건 | 18 | 각각6개; 간/지·기준·배합·전환·대표선택 등 |
| 상호작용 scope | 6 | owner·유효 교집합·지원·미지원 구분 |
| 기간별 십성 역할 | 10 | 장기/연간/짧은 구간 각각 별도 내용 |
| 십성 조합 검토칸 | 100 | 동일 일간 기준; 25기능군 비교로 수렴, 100독립 사실 아님 |
| 오행 방향 비교 | 25 | 동일/생/받음/극/받음; 강약·희기 계산 없음 |
| 관계×시간 범위 | 54 | 지원40·부분1·미지원13; 정의와 64조합 복제 없음 |
| 전환·절입·출처 경계 | 17 | exact/range/beforeFirst/half-open/입춘 등 |
| 중첩 조건 | 12 | 같은/다른 십성·다중 source·미상·관계 없음 등 |
| 분야별 응용 | 48 | 6범위×8분야, 서로 다른 조건부 질문 D |
| 실제 연도 응용 | 42 | A/B/C×14년, 실제 원시 근거 연결 D |
| 실제 월별 응용 | 36 | A/B/C×12월, 각각24구간 전후 대조 D |
| 미검증/미지원 보류 | 11 | E4·G7; 빈도를 사실로 채우지 않음 |
| 반려 해석 | 14 | 불행/성공/경험/건강 단정·source 혼동 등 F |
| 직접 확인한 전통 원칙 | 3 | A; 문헌의 존재와 실증 예측을 구분 |

전체 분류: A3/B22/C212/D126/E4/F14/G20. 관계 미지원13개와 별도 보류G7을 합친 G20이다. 명시적인 긍정·주의·반전 묶음은178개다. 78실제기간 응용은 역할·scope 묶음을 참조하며 이 수에 다시 더하지 않았다. 모든 레코드는 `connectedToRuntime=false`, `approvedForCustomer=false`, `runtimeEvidenceIds=[]`다. observedSignature/evidenceRefs는 오프라인 실제 계산 관찰의 참조이지 연구 ID를 Evidence ID로 등록한 것이 아니다.

## 검토할 파일

- [coverage-manifest.json](coverage-manifest.json): 전체 연구 ID·상태·수량·유한 범위
- [producer-inventory.md](producer-inventory.md), [기계 inventory](producer-inventory.json): 계산·증거·편집·발행 29경로
- [support-time-matrix.json](support-time-matrix.json): 관계54칸의 실제 지원·적용 시간·이전64참조
- [offline-comparisons.md](offline-comparisons.md): A/B/C 42연도·72월구간과 A–V 시나리오
- [semantic-audit.md](semantic-audit.md): 실제 의미 차이·중복·수렴 이유 독해
- [sources-and-variants.md](sources-and-variants.md): 직접 열람3전거·판본/주석·이견
- [source-preservation.json](source-preservation.json): 기존961소스 SHA256
- [handoff.md](handoff.md): 미지원과 기존 경로 한계, 연결 전 조건
- `src/lib/report-knowledge/temporal-interaction-research/`: 실제 정적 연구 자료
- `tests/fixtures/temporal-interaction-01/offline-periods.json`: 실제 생산자가 생성한 고정 관찰
- 신규 테스트2개: `sajuTemporalInteractionResearch.test.ts`, `sajuTemporalScenarios.test.ts`

## 중요한 확인과 남은 한계

1. V4 annualEvidence에는 실제 `annualStemRelations` 원국–세운 천간합 투영이 있다. 이전 기본7종 지원표와 달리 이 특정 경로를 추가 확인했다. 선택 연주 기준이므로 입춘 전 actual effectiveAnnualPillar로 자동 확대하지 않는다. 기존 관계 연구32파일은 수정하지 않았다.
2. 십성100칸은 natal 일간 기준의 대운 십성과 세운 십성 비교다. 실제 `crossPeriods.flowGod`는 대운 천간을 기준으로 연간을 비교하므로 별도의 기준과 방향을 보존한다.
3. majorEvidence의14년 row는 nominal cycle의 annual reading 하나를 택한다. 전환 시각은 horizon에 있으나 관계가 전후 상세 ledger로 모두 계산됐다는 뜻은 아니다. C 2028의 4월23일21:42 이전과 이후를 혼동하지 않도록 제한했다.
4. `majorFortuneEvidence.ts`의 레거시 혼합 배열 `[currentCycle.branch,...natalBranches]` ordinal은 실제 natal 기둥 위치가 아니다. 최신 분리 경로와 동일한 provenance로 사용하지 않는다. 실제 고객 영향·수정 여부는 별도 조사 과제다.
5. exact 교운은 정각부터 새 운이다. 범위는 earliest 이상 latest 미만에서 후보이며, 첫 운 이전은 빈 운 목록이다. stable은 정확시각을 뜻하지 않는다. 미상 출생시간의 안정 범위 성공과 불안정 거절을 모두 검증했다.
6. 월운은12양력월 안의 실제 절입·교운 분할이다. 실효 연주·월지 본기·source·certainty·끝 제외 경계를 유지한다. 절입과 교운이 가까운 실제12월 사례도 두 경계를 합치지 않았다.
7. 전체삼형2건, 기간간 천간합/원진, 3기간 삼합의 신규 승인, 합화·격국변화·강약/용신·영향크기는 현재 연구에서 계산하지 않는다. 현대 질문의 고유 사건 효력·교운 잔류 학설·일부 월운 전거는 추가 검토가 필요하다.
8. A/B/C 같은 시각의14년 연도 라벨은 모두2023–2036이다. 달라지는 것은 실제 운·십성·접점이다. 사건 차별화를 위해 연도나 관계를 꾸미지 않았다. 과거 질문도 입력받지 않은 경험을 단정하지 않는다.

## 보존과 검증

기존 worktree16개를 전수 기록한 뒤 신규1개를 추가했다(총17). 원본 branch/HEAD/status와 기존 tracked·untracked 파일 SHA256을 전후 비교했다. 원본은 `v4/annual-editorial-quality-fix-01` / `c048218cc5961e0f53a1deab2603511e17559fc3`, `.gitignore`·`AGENTS.md`와 `supabase/.temp/` 9파일을 포함한 미커밋11개를 그대로 보존했다. .env는 복사·수정하지 않았고 node_modules만 기존 설치에 ignored symlink로 연결했다.

검증 결과는 [validation-results.json](validation-results.json)과 [test-results.md](test-results.md)에 기록한다. 기준 SHA의 foundationAdapter.test.ts:116 known failure를 먼저19PASS/1FAIL로 재현했으며 삭제·skip·수정하지 않았다. 추가로 customerDayunGeneration.test.ts:50의 기존2실패를 기준 SHA archive에서17PASS/2FAIL로 재현했다. 관련14파일은1,018PASS/기존3FAIL/신규0이며 신규198테스트·6상품64사례는 모두 통과했다. 전체 저장소 테스트를 PASS라고 주장하지 않고 요청 관련 집합의 실제 결과를 보고한다. 원고 생성 외부 API 호출 없이 기존 writer-disabled 오프라인 경로만 사용했다. master·Production·DB·결제·이벤트 변경은 없다.

## 최종 상태

TEMPORAL_KNOWLEDGE_STATUS: OFFLINE_RESEARCH_COMPLETE_WITH_EXPLICIT_GAPS
EXISTING_TEMPORAL_INVENTORY: 29경로 감사
DAYUN_KNOWLEDGE: 기간 개념+심층6+십성10의 장기 역할
SAEUN_KNOWLEDGE: 기간 개념+심층6+십성10의 연간 역할
WOLUN_KNOWLEDGE: 기간 개념+심층6+십성10의 절입 구간 역할
NATAL_DAYUN: 원국 기준과 실제 활성 장기 배경 분리
NATAL_SAEUN: 지지7종+특정 V4천간합 투영, 입춘 제한
NATAL_WOLUN: 지지7종+확장 원진, 실제구간/anchor 보존
DAYUN_SAEUN: 지지쌍6종, nominal year/실효구간 차이 기록
DAYUN_WOLUN: 지지쌍6종, 교운 후보 conditional
SAEUN_WOLUN: 지지쌍6종, effectiveAnnualPillar 기준
TEN_GOD_TEMPORAL_COMBINATIONS: 100칸/25기능군, 기준 방향 명시
ELEMENT_TEMPORAL_COMBINATIONS: 방향25칸, 강약 산출 없음
RELATION_TEMPORAL_COMBINATIONS: 54scope칸/64기존조합 참조
DAYUN_TRANSITION: 확정 전후·범위·첫운 이전 분리
TRANSITION_UNCERTAINTY: 안정 범위와 DAYUN_UNCERTAIN 모두 보존
JIE_BOUNDARIES: 실제12절입, 경계 정각은 다음구간
TIME_SCOPE_INTEGRITY: [start,end)·owner·certainty·입춘 구분
PERIOD_PRODUCER_SUPPORT: 지원40/부분1/미지원13
LONG_TERM_INTERPRETATIONS: 심층6·십성10장기역할·scope별D질문
ANNUAL_INTERPRETATIONS: A/B/C×14=42 실제근거 응용
MONTHLY_INTERPRETATIONS: A/B/C×12=36 질문/72실제구간
CROSS_PERIOD_INTERPRETATIONS: 6scope·12중첩·방향 기준
POSITIVE_MATERIALS: 178명시적 조건부 묶음
RISK_MATERIALS: 178명시적 조건부 묶음
TWIST_MATERIALS: 178명시적 반전 묶음
DOMAIN_APPLICATIONS: 6×8=48 D
SEMANTIC_DIVERSITY: 실제 참가자·기능·시간 차이 독해
DUPLICATION_AUDIT: source중복·원진재투영·삼합/반합 과대집계 금지
SOURCE_VERIFICATION: 직접 전사3개, repo5, authored1
UNVERIFIED_RESEARCH: E4/G20 분리, 고객승인 없음
REJECTED_INTERPRETATIONS: F14
REMAINING_KNOWLEDGE_GAPS: 위7항 및 handoff 참조
CALCULATION_PRESERVATION: 기존961소스 바이트·실제digest 검증
NARRATIVE_PRESERVATION: 6상품 고정digest 검증 결과 참조
BOOK_PRESERVATION: 신규snapshot·저장Book owner/shared 회귀 결과 참조
TESTS: validation-results.json 참조
TYPESCRIPT: 기준0/변경후0
LINT_BUILD: lint PASS/Production build PASS
BRANCH: v4/saju-temporal-interaction-knowledge-01
COMMIT_SHA: 이 보고서를 포함한 최종 commit SHA는 최종 응답에 기록
REMOTE_SHA_MATCH: push후 최종 응답과 외부 검증 로그에 기록
NEXT_STAGE_READY: 후속 근거연결 검토용 자료 준비, 연결·고객사용·배포 승인 아님
