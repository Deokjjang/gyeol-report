# V4-FOUNDATION-ENGINE-COMPLETE-01

기준: `2ec4284f15ffa89bfdf5aa8693fa6d7d5976d502` (요청의 `52a9921b` 이후 원격의 기존 3개 커밋을 보존). 작업 브랜치: `v4/foundation-evidence-contract-01`. 지속 경로: `/Users/Deokmin/Developer/gyeol-worktrees/v4-foundation-engine-complete-01`.

상태: A–F 구현과 검증 완료. 검출된 신규 실패는 모두 해소·재검증했다. 기존 전체 suite는 실패 상태이며, 이 결과는 master 병합·판매 품질·Production 배포 승인이 아니다.

## 실제 개선

- **A / `691bc28d`**: `evidenceFoundation`의 문자열 접두사 판정을 생산자가 실제 반환한 inventory 조회로 교체했다. `period-ten-god:정재`, `input:jobStatus`처럼 생긴 문자열만으로 계산 근거를 만들 수 없다. 반대로 실제 `natal:day:stem:甲` atom은 직접 연결한다. 기존 canonical/depth alias를 재사용하고 동일 lineage·일간/일주의 중복 지지를 분리한다. 출처 문서 경로만 있는 lineage는 독립 근거가 아니다.
- **B / `7a7da621`**: 기존 6상품 어댑터에서 이미 생성한 명리·MBTI·Fusion 프로필의 ID, 출처, 대상, 영역, dependency를 전달한다. 새 프로필 재계산이나 DB 요청은 없다. MBTI는 실제 `SCORING_SEMANTIC` trait의 `direct`/`inferred`를 구분하고 dimension prior·문구 label을 근거로 승격하지 않는다. Fusion은 양쪽 dependency가 모두 실제 inventory에 있어야 한다.
- **C / `adb16160`**: 기존 Fusion selector가 사용한 source side의 axis/direction/scope/기여도와 proof identity·context fit을 재검증한다. 존재하는 ID를 붙이고 score나 scope를 바꿔도 거부한다. 기존 AND 근거 판정도 공통 독립성 검사로 연결했다. 검토된 96개 의미 규칙·점수 공식은 변경하지 않았다.
- **D / `0a872555`**: 실제 `planChapter`와 여섯 상품의 공통 `collectComprehensiveCandidates` 경로에 적용했다. 다른 인물·시간 범위의 material, 등록되지 않은 Fusion, 누락된 dependency를 선택 후보에서 차단한다. 누락 ID를 필터링해 숨기지 않고 후보에 보존하면서 `UNRESOLVED_SOURCE_DEPENDENCY`로 제외한다. 기존 장별 domain·예산·novelty 정책은 재사용한다.
- **E / `05abb17f`**: 새 `foundation-engine-01` 발행에 문단별 참조와 미해결 provenance를 봉인한다. `validateV4Publication`은 저장된 생산 결과만으로 이 계약을 확인하며 계산기·Writer·현재 시각을 호출하지 않는다. 기존 revision 없는 V4는 기존 검증 계약을 유지한다. 실제 연도·절기 구간·대운 전환 범위, A/B 및 방향별 관계를 구분한다. 고객 본문에 진단 ID를 넣지 않는다. 기존 한국어 조사 유틸리티를 공통 `particle`에 재사용하여 따옴표·숫자·ㄹ 예외를 처리한다.
- **F**: `foundationRuntime.test.tsx`는 실제 paid-runtime의 생성 함수, publication validator, `projectBook`, 기존 `BookReader` 전체 페이지를 실행한다. 6상품 + 궁합7유형×정방향/교환 + 미상/대략/MBTI변경/사주변경 = 24개 사례를 보존된 이전 결과와 비교한다. 최종 F에서는 JSONB 키 순서 회귀를 수정했고, 대운·세운의 참조 inventory는 기존 `projections[0].natalProfile`에서 가져온다. 연구가 참조하는 `timeProductContext.ts`는 기준과 바이트 동일하다.

## 이전 판단과 새 판단

| 사례 | 이전 | 변경 후 |
|---|---|---|
| `period-ten-god:정재`라는 임의 ID만 있음 | period로 분류 | 실제 생산 inventory가 없으면 editorial/unresolved |
| 실제 semantic atom이 sourceRefs에 있음 | generic editorial로 분류 | 해당 인물의 계산 atom과 출처로 연결 |
| 같은 계산 사실의 별칭·문서 경로 | 별도 lineage로 오인할 여지 | canonical alias / 동일 ancestry는 중복, 문서뿐이면 unknown |
| 유효 ID에 다른 Fusion side score를 부착 | ID 존재 여부를 통과 | `FUSION_SOURCE_SIDE_MISMATCH` |
| 문단 후보에 없는 upstream atom이 섞임 | 분류 과정에서 missing ID가 사라짐 | 원래 ID 보존 + primary 선택 제외 |
| `‘제안’` + 방향격 / `길` + 방향격 | `‘제안’로` / `길으로` | `‘제안’으로` / `길로` |

이 검증은 해석 이론의 과학적 확정이나 개인의 미래 보장을 뜻하지 않는다. 새로운 명리 이론·고객 사실·MBTI 성향을 창작하지 않았다.

## 실제 원고·Book 비교

[24개 기계 비교](book-comparison.json), [개인화 비교](personalization.json), [16유형 source 집계](source-inventory.json).

24/24에서 계산 결과, 고객 draft, 전체 Book JSON이 변경 전과 같다. 대표 6상품의 integration, 기존 material 선택, Fusion, 장별 계획도 보존했다. 새 snapshot에는 추적 metadata와 revision이 추가되므로 raw packet digest는 새로 계산된다. 기존 packet 자체는 수정하거나 다시 봉인하지 않는다. 새 metadata를 JSONB로 저장할 때 객체 키 순서가 바뀌어도 검증되어야 한다. 초기 E 구현은 세운의 nested period 직렬화 순서에 의존하여 `V4_FOUNDATION_CONTRACT_INVALID`를 재현했다. F에서 기존 `stableV4Json`을 재사용하여 수정했으며, 24개 packet의 모든 객체 키를 역순으로 바꾼 재열람 검증을 통과했다.

같은 사주 + 다른 MBTI: 계산 동일, 원고 다름. 같은 MBTI + 다른 사주: 계산과 원고 모두 다름. 궁합7유형은 각각 양방향 문단과 A/B 입력 교환을 생성했다. 대운14년, 세운12개월은 기존 시각·범위 계산을 유지한다.

## 실제 6상품 구조

| 상품 | 본문 장/문단 | 전체 Book 페이지 | 본문 글자 수(공백 포함) |
|---|---:|---:|---:|
| 종합 | 13 / 52 | 21 | 10,063 |
| 커리어·재물·학업 | 9 / 36 | 17 | 9,192 |
| 연애·결혼·자녀 | 9 / 36 | 17 | 8,078 |
| 궁합 | 9 / 36 | 21 | 9,463 |
| 대운 | 21 / 115, 14년 포함 | 30 | 16,514 |
| 세운 | 17 / 85, 12개월 포함 | 26 | 12,378 |

글자 수는 제목·표·부록을 제외한 실제 문단 text의 합이다. 14년/12개월 외 도입·전환·마무리 장은 기존 구성 그대로다. MBTI16 source 검사, 같은 유형/미상/대략 시간·역할 교환은 `foundationSources`, `compatibilityRelease` 및 실제 24개 packet 검증으로 나누어 확인한다. 직업·관계 상태별 적용은 기존 `careerRelease`/`loveRelease` 테스트를 사용한다. 절기·자정·시간대 경계는 기존 `canonicalCalendar`를 보존한다. 간지 읽기는 기존 `readableSajuText`와 `displayDictionaries`, 조사 처리는 `withKoreanParticle`을 재사용한다.

## 자료 활용과 한계

기존 MBTI JSON 16개에 trait 1,213개(direct 938 / inferred 275), 방향별 관계 256개가 존재함을 재집계했다. 실제 source adapter·semantic projection·96개 Fusion 규칙을 검증하며 원천 DB는 변경하지 않았다. 연구용 Catalog/Binder/Planner/Editorial·승인 계약은 이번 발행의 새 선행 게이트로 넣지 않았다.

기존 명리 자료는 `materialRegistry`/`materialDepth`의 canonical alias, `evidencePolicy`, `structureEvidence`, `foundationNatalProfile`, `foundationSupplement`, `foundationIntegratedProfile`의 실제 계산 투영을 사용한다. 천간·지지·십성·오행·관계·신살·귀인 등은 해당 생산자가 지원하는 범위에서만 사용한다. 전체 연구 자료를 모든 상품으로 강제 연결하지 않는다. 기존 `held`/unsupported 관계 및 confidence 한계는 유지한다.

추적되지 않은 generic metadata/문구 label/모호한 역할 ID는 `unresolved`로 남긴다. 원국 근거가 없는 안내 문단을 가짜 계산 주장으로 채우지 않는다. 대표 6상품의 editorial-only 문단은 커리어1·연애1·궁합4·세운1이며, 전체 문단의 자연스러움이나 판매 품질 PASS를 대신하지 않는다. 기존 현대 적용 예시·rank/confidence의 해석 수준을 새 사실로 승격하지 않는다. 추적 metadata로 새 packet의 저장 크기가 늘어난다. 이번 작업은 성능 최적화가 아니므로 운영 응답시간이나 저장 비용 개선을 주장하지 않는다.

## 검증 환경과 실행

Node `24.22.0`, 기존 lockfile·dependency 보존. 환경변수/secret 파일 복사 없음. 원격 master는 Meta PR #3가 반영된 `489911c5a8bc7a3230fa4f234df2263361df5321`이다. Meta 코드는 병합·cherry-pick하지 않았다.

기준 전체 테스트는 변경되지 않는 `git archive 2ec4284f` 소스에서 실행했다. 기존 역사 커밋을 읽는 테스트를 위해 Git object DB를 읽기 전용으로 제공했다. 기준과 수정 코드는 동일 Node·pnpm을 사용한다. 기준은 worker 2개, 최종은 자원 사용을 확인한 뒤 worker 4개로 실행했다. 동시성 차이 때문에 시간 초과 실패는 동일 worker 조건의 개별 재현으로 구분한다. 테스트 삭제·skip 추가·timeout 증가·Vitest 설정 변경은 없었다. 새로운 metadata와 기존 발행 버전의 계약만 명시적으로 분리했다. 기존 beforeAll 실패로 실행되지 않은 테스트는 성공으로 세지 않는다.

- A: 17/17.
- B: 34/34 (16개 실제 MBTI 포함).
- C: 442 PASS / 기존 2 FAIL. 기준도 동일 두 테스트 FAIL (V4가 고객 경로에 없다는 과거 경계 주장). 상세 원본 로그 보관.
- D: 58/58.
- E/F 최종 집중 검사: **61/61 PASS**, 24개 완전한 Book의 새/이전 발행 계약·JSONB 키 순서·위조 차단 포함. 생성 시각은 기존 fixture의 `2026-10-01T03:00:00Z`로 고정했다.
- `pnpm exec tsc --noEmit`: 신규/기존 진단0.
- `pnpm lint`: 최종 수정 코드 PASS, 경고0.
- `pnpm build`: 최종 수정 코드의 Next16.2.4 Turbopack 전체 Production build PASS, 경고0. 배포는 하지 않았다.
- 전체 `pnpm test` 기준: **27,271 PASS / 731 FAIL / 3,053 미실행**, 파일 477 PASS / 142 FAIL / 2 사전 skip (621).
- 수정 코드의 첫 전체 실행: **27,225 PASS / 754 FAIL / 3,124 미실행**, 파일 473 PASS / 148 FAIL / 2 사전 skip (623). [원본 비교](test-comparison.json).
- 검출된 신규 실패39개: 새 packet metadata와 이전 digest 비교34개, 연구 원문 파일 해시2개, 수정된 조사 규칙1개, 병렬 실행 timeout2개였다. 새로 초기화가 중단된 suite2개에서 기존 PASS70개도 미실행이었다.
- 후속 version 집중 실행: 33 PASS / 기존6 FAIL, 세운 추가 보호 검사: 4 PASS / 기존1 FAIL. 이름 필터 밖의 테스트는 실행하지 않은 것으로 기록하며 PASS에 넣지 않는다.
- 실제 저장·서재·공유·발행 재실행(worker2): **104 PASS / 기존2 FAIL**, 추가 skip0. 기존 V3 이력 테스트의5초 timeout과 이미 유료 경로에 연결된 V4를 금지하는 과거 import 경계 기대값이 남는다.
- 새 실패39개 및 추가 미실행70개 모두 최종 PASS 확인. 후속 검사에서 기준 PASS→FAIL은0. [테스트별 해소 결과](regression-resolution.json).
- 마지막 수정 뒤 전체 suite를 다시 전부 실행했다고 주장하지 않는다. 전체 전후 실행 + 영향받은 계약/경로 집중 재실행으로 판정했다. 기존731개 실패 전체가 해결되었다고 주장하지 않는다.
- `git diff --check`: PASS.

## 발행 버전 검사와 기존 실패

`tests/helpers/versionedEditorialLocks.ts`의 테스트 전용 `preFoundationEvidence`는 먼저 새 packet의 전체 publication validation을 통과시킨다. 이후 복제본에서 정확히 `foundationRevision`, `foundation`, `composition.result.foundationReferences`만 제거해 이전 payload/seal을 비교한다. 기존 digest fixture는 한 바이트도 변경하지 않았다. 24개 이전 실제 packet과 객체 전체가 동일한지 추가 검증했다. 이 함수는 고객 생성·저장·재열람 경로에서 사용되지 않는다. 기존 저장본을 재봉인하거나 덮어쓰지 않는다.

한국어 연구의 과거 `길으로` / `‘제안’가` 기록은 그대로 확인하고, 현재 공통 유틸리티의 `길로` / `‘제안’이`도 별도로 검증한다. 소스 해시 오류2개는 연구 registry의 해시를 갱신하지 않고 `timeProductContext.ts`의 변경 자체를 없애 해결했다.

기준 실패에는 `READER_CONTRACT_HASH_MISMATCH`, `INTEGRATION_READER_SOURCE_CHANGED`, 과거 원고/digest·UI source 기대값, 연구 자료 수·계약 불일치, 제한시간 실패가 포함된다. 상세 테스트 이름과 오류 첫 줄은 `test-comparison.json`, 전체 스택과 원본 로그는 외부 검증 디렉터리에 있다. 관련 없는 연구 승인·hash fixture·원고·UI 계약은 수정하지 않았다. CI가 완전한 green 상태라는 주장은 하지 않는다.

## 독해 검수

`/Users/Deokmin/Documents/gyeol-validation/v4-foundation-engine-complete-01/index.html`

기본 브라우저에 이 목록을 열었다. 각 책의 전체 페이지·부록·마지막 페이지는 기존 BookReader SSR로 출력했으며, 정적 표시이므로 고객의 대화형 Reader와 완전히 동일하다고 주장하지 않는다. 원본 packet/Book JSON, 고객 원고 TXT, 전후 24개 결과와 원본 로그가 같은 외부 디렉터리에 있다. 브라우저 자동화는 file:// 프로토콜 정책으로 거부되어 시각적 확인은 미완료다. 우회하지 않았다. 전체 SSR 및 Book 모델 원문 일치는 테스트로 확인했다.

## 보존·통합

운영 DB·Production·결제·Auth·Worker·V2/V3 코드 및 기존 고객 Book에는 접근/변경하지 않았다. [보존 비교](preservation.json): 원본 Dirty11 해시·원본 HEAD/status·기존88개 Worktree 등록/HEAD 불변, 당시 기록된 Git 객체124개 접근 정상이다. 새 지속 worktree1개와 작업 브랜치 커밋은 의도된 변경이다. 기존 `refs/codex/turn-diffs/` 내부 임시 ref2개는 현재 조회에 없지만 대상 객체는 보존되어 있다. 삭제 명령은 실행하지 않았으며 사라진 주체는 확정하지 않는다. 작업 브랜치를 제외한 기존 branch/tag 변경은 없다. 작업 브랜치의 push 및 원격 추적 ref 갱신은 의도된 변경이다. 과거 tmp 경로의 모든 파일 바이트를 재검증했다고 주장하지 않는다.

작업 파일과 Meta master 변경 파일은 겹치지 않는다. Draft PR #4를 이어 사용한다. master 병합·Production 배포는 수행하지 않는다. 향후 승인된 통합 시 최신 master에 대해 CI·공유/결제/Meta consent 경계를 다시 확인해야 한다. 2차 원고·UI 작업은 시작하지 않는다.
