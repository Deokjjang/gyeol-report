# V4 Compatibility Friendship Specialist Engine 01

상태: **OFFLINE_IMPLEMENTED**. 실제 고객 의미 승인·선택·Claims는 모두0입니다. 기존 Writer/Reader/Book과 Production은 연결하거나 변경하지 않았습니다.

## 기준과 범위

- Base: `06ef1cc69c1b607445aafc3468f2c4f111596f99`
- Branch: `v4/compatibility-friendship-specialist-engine-01`
- 독립 worktree에서 신규 오프라인 코드·테스트·CLI·산출물만 추가했습니다. 기존5013개 파일, 기존52개 worktree, 원본 미커밋11개를 보존했습니다.
- 2138 Registry records는 view 포함입니다. 직접 연구는36개(Conditional32 중 REPAIR4, RECALL4)이며173 Catalog 후보 및20 실제 생성 관찰과 별도 집계합니다.

## 실제 동작과 보류

원본36 Material → 기존 Foundation/Question Matcher → Source Inventory resolution → 원본 hash·owner·native producer 검사 → 기존 ActualBindingIndex/Binder12 Gate → 전체 필수 ancestry/domain → Friendship context/동의/정보 공개/자발성/안전 → 정확한 선행 표시 그룹 → 의미 검토 → 운영자 Worklist입니다.

Source Inventory는 계산 Evidence가 아닙니다. 구체적인 claim selector가 없는 연결을 새 AND로 만들거나 승인하지 않습니다. 동일173후보×1Graph의 실제 Binder 비교는 Source342→342, Evidence28→28, Facts8→8, Structural8→8, SourceGroup PASS0→0입니다. 별도 Inventory 관찰 표는 매칭 증가나 claim 승인이 아닙니다.

REPAIR와 RECALL은 별도 모드입니다. Group 내부는 AND, 호환 대안 Group 사이에는 OR를 적용하며 실제 표시된 원래 Material·주소·사람·유형·Root·source group·방향·의미·claim·맥락·안전을 확인합니다. CH09.P2는 CH01.P2의 실제 표시가 필요합니다. 고객 Display Ledger는 발급하지 않습니다.

만남 제안과 수락, 연락 요청과 응답 의무, 정보 소유와 공개 허락, 호의와 채무, 사과와 용서, 용서와 재접촉을 구분합니다. 발신자 동의로 수신자 동의를 대신할 수 없습니다. 확인되지 않은 과거 이력과 관계 지속을 창작하지 않습니다.

## 검증

- 신규 엔진: 237 PASS. 기존 관련24 files의 고유2244개 검증식 확인(최초 배치2243 PASS/1 timeout; 원본 기본 제한 독립 재실행360 PASS/1 timeout; CLI30초 전체 파일361 PASS). 산출물 테스트28 PASS. 각 코호트를 단순 합산하지 않습니다.
- 기존 관련24 files의 최초 실행은2243 PASS /1 FAIL이며, 변경하지 않은 BusinessPartner 산출물 쓰기 테스트가5.463초로 Vitest 기본5초 한도를 넘었습니다. 설치된 runner의 withTimeout/STACK_TRACE_ERROR 경로를 확인했습니다. 같은 원본 파일의 기본 제한 독립 재실행도360 PASS /1 timeout(5.453초)이었습니다. 원본 코드·설정은 보존하고 명령행 testTimeout만30초로 실행해361개 검증식 전체를 확인했습니다. 별도 pristine Base 압축 해제본의 해당1개 테스트도 기본 제한으로 대조했으며360개는 필터로 미실행했습니다. pristine Base에서도 해당 테스트가 기본5초 한도로 실패했습니다. 결과는 test-results.json의 recheck에 원본 그대로 구분합니다. 원래 실패를 성공으로 덮어쓰지 않고 동일 테스트 이름 집합으로 검증을 대조합니다.
- 알려진 실패16 files:5837 PASS /46 FAIL 전후 동일. 전체46개 오류 메시지를 ANSI와 동일 checkout 경로만 정규화해 비교했습니다. 전체 Suite PASS라고 주장하지 않습니다.
- 초기 신규 테스트는 fixture context ID 계약 위반으로 setup 중단(208 pending)됐고 수정 후208 PASS였습니다. 중간 소스 검증 실행은 대체됐고, 수정 중 fixture가 바뀐 publish CLI2회는 SYNTHETIC_SOURCE_HASH_MISMATCH로 정상 차단됐습니다. 최종237 PASS와 source hash가 일치하는 verified CLI2회만 완료 증거로 사용합니다.
- 최종43 JSON은 독립 CLI2회 Byte 일치. 기존 Foundation64 JSON도 양쪽 실행에서 정확히 재생성됐고 하위 Catalog/Source/Semantic/Graph/Binder CLI의 원본 검증을 유지합니다. 다른6개 전문 엔진 CLI 전체를 반복하지 않았으며 기존 관련 테스트와 모든 원본 source/output hash로 보존을 검증했습니다.
- 17권/102 digest 및20 Friendship/140 digest 보존. 전체 Narrative·Integration·Book 객체와40 full profiles(308,432,008 bytes/side)를 Byte 비교했습니다. 저장본은 운영 DB 접근 없이 기존 storedBook offline roundtrip으로 확인했습니다.
- TypeScript0→0, lint/build0 warnings, diff-check PASS. NFT88 App/Server+2 Next root의90 경로와 의존 집합이 동일하며 신규 customer trace 유입0입니다.
- 성능/RSS/임시경로는 Git 외부 로그에만 있습니다. 생성 JSON에는 실제 입력 이름·생년월일·secret을 노출하지 않습니다.

## 남은 경계

- A0 CH07.P1 및 H0 CH04.P1의 CHILDREN provenance는 기존 Writer에 남아 있습니다. 아동 원문이 출력됐다는 뜻이 아니며 Canonical Index 직접 기여도도 새 인과 검증 없이 주장하지 않습니다. 신규 엔진의 필수 ancestry에서는 차단하고 Publication Safety로 인계합니다.
- L0/M0는 현재도 REPEATED_LONG_PHRASE에 따른 기존 Legacy 발행입니다. Reader Draft9/36과 실제 Published Edition을 별도 기록했고 BODY_LENGTH 진단도 혼동하지 않습니다.
- 원본 Study 주소 연결13개 중 introduced-group bridge4개가 미검증입니다: plan-change의 CH07.P1→CH08.P2, favour-load의 CH07.P3→CH08.P3, relation-symbol의 CH07.P2→CH08.P1/P4. 해당 선행 주소가 원래 대상 REPAIR의 introducedGroups에 없습니다. 원본을 고치거나 가짜 도입으로 승인하지 않고 보류합니다.
- 외부 우정 문헌7개는 원문 일부3/초록3/저자 해설1의 기존 접근 범위만 유지합니다. 명리·MBTI의 개인별 관계 예측을 실증한 자료로 승격하지 않습니다.
- 실제 의미·고객 승인0, 관계 이력UNKNOWN, claim-specific source selectors 및 반례 검토가 남습니다. 후속 Global Planner는 이번 작업에서 시작하지 않습니다.

## 주요 산출물과 실행

- `friendship-material-index.json`, `friendship-question-coverage.json`: 원본 계약과 정확한 연결.
- `friendship-source-inventory.json`, `friendship-requirement-normalization.json`, `friendship-actual-witness-index.json`: 출처 참조와 실제 관찰의 분리.
- `friendship-concept-matrix.json`, `friendship-repair-study-matrix.json`, `friendship-life-context-matrix.json`:26/13/6 원본 연결.
- `friendship-evidence-matches.json`, `friendship-before-after-binding.json`, `friendship-domain-ancestry.json`: 실제173×1 진단과 차단 이유.
- `friendship-introduced-groups.json`, `friendship-synthetic-selection.json`, `friendship-algorithm-comparison.json`: 표시/동의/선택 검증.
- `friendship-operator-worklist.json`:36개 전체 검토 항목.
- `preservation-receipt.json`, `test-results.json`, `other-specialist-preservation.json`, `cli-verification.json`: 실제 보존/회귀 영수증.

```sh
node tools/compatibility-friendship-specialist-engine/verify.mjs /tmp/empty-friendship-audit
pnpm exec vitest run tests/unit/report-knowledge/compatibilityFriendshipSpecialistEngine.test.ts tests/unit/report-knowledge/compatibilityFriendshipSpecialistArtifacts.test.ts --maxWorkers=1
```

## Git/Preview 증거

최종 self SHA와 Preview URL은 commit 이후 확인하므로 이 commit 내부에서 자기 SHA를 예측하지 않습니다. `final-report-fields.json`은 publication 이전 필드를 명시적으로 표시합니다. 실제 최종 SHA·원격 일치·Preview READY 영수증은 완료 응답 및 외부 검증 경로 `/tmp/gyeol-compatibility-friendship-specialist-engine-01-validation/`에 기록합니다. master/Production/운영 DB/결제/Auth/Worker/환경변수는 변경하지 않습니다.
