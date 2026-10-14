# V4-KNOWLEDGE-SOURCE-VERIFICATION-01

## 결과

6,490개 기존 미해결 occurrence를 모두 보존하고 검증 receipt·overlay를 생성하는 오프라인 CLI를 구현했다. **3,288건 기술적 복구 / 3,202건 보류**다. 고객 사용 승인 0, 런타임 연결 0, 실제 개인 Evidence 생성 0이다.

Base branch: `v4/knowledge-unified-catalog-01`
Base SHA: `51420fdebd4af81b503128a64f2c5c4d5beb3714`
작업 branch: `v4/knowledge-source-verification-01`
작업 worktree: `/private/tmp/gyeol-knowledge-source-verification-01`

원본 checkout의 미커밋 11파일과 기존 36개 worktree를 hash·HEAD·branch·status로 비교해 보존했다. 전체 기준 tracked 3,830개 파일은 byte 불변이다. 기존 연구 자료·원고·계산·Book·결제·인증·DB·환경변수·Production 설정은 변경하지 않았다.

## 기준 카탈로그 재현

작업 시작 전에 실제 `node scripts/knowledge-catalog/compile.mjs`를 실행했다. 기존 생성 JSON 59개가 byte 일치했다.

| 항목 | 기준 및 재현 |
|---|---:|
| 연구군 | 20 |
| 연구 레코드 | 18,610 |
| 기초 원천 슬롯 | 4,799 |
| 기존 resolved | 69,098 |
| 기존 unresolved | 6,490 |
| duplicate reference groups | 5,658 |
| source hash mismatch | 0 |

기존 총 참조는 75,588건이며 이번 검증 대상은 그중 미해결 6,490건이다. 기존 카탈로그나 원본 target을 수정해 해결 수를 바꾸지 않았다.

## 상태별 수량

| 상태 | occurrence | 기술적 복구 포함 |
|---|---:|---|
| EXACT_SOURCE_VERIFIED | 1,591 | 예 |
| UNIQUE_ALIAS_VERIFIED | 1,397 | 예 |
| FRAGMENT_VERIFIED | 300 | 예 |
| AUDIT_AND_ORIGINAL_VERIFIED | 0 | 예; 현재 실제 queue에는 없음 |
| DOCUMENTARY_REFERENCE_ONLY | 623 | 아니오 |
| FUTURE_REQUIREMENT_ONLY | 1,418 | 아니오 |
| AMBIGUOUS_SOURCE | 48 | 아니오 |
| ORIGINAL_LOCATOR_MISSING | 78 | 아니오 |
| SOURCE_RECORD_MISSING | 90 | 아니오 |
| UNSUPPORTED_REFERENCE | 945 | 아니오 |
| SOURCE_HASH_MISMATCH | 0 | 아니오 |
| SOURCE_VERSION_MISMATCH | 0 | 아니오 |

미복구 3,202건은 서로 배타적인 위 상태의 합이다. 원본/locator 누락은 합계 168건이다. 분류 완료와 원본 연결 완료를 구분한다. 모든 6,490건에 사람의 내용·의미·상품 적합성 검토와 명시적 사용 승인이 남아 있다.

EXACT의 세부 내용은 MBTI trait 1,309, 실제 export/type member 선언 223, 원본 코드 파일 선언 59다. 별칭에는 코드 파일 bundle의 선언 확인 360건도 포함된다. 선언 확인은 개인의 실제 계산 결과나 해석 사실 확인이 아니다.

## 구현과 참조 검증

구현은 기존 오프라인 경계인 `src/lib/report-knowledge/knowledge-integration-foundation/source-verification/`에 두었다. 기존 runtime 격리 테스트를 수정하지 않고 SourceReader·ReferenceResolver·hash·stableJson을 재사용한다. 기존 compiler/resolver/sourceReader/normalization/validation은 모두 byte 불변이다.

- 정확한 CatalogKey, 명시적 file/export/pointer, 원래 ID·family를 대조한다. 주어진 locator가 실패하면 다른 ID 검색으로 우회하지 않는다.
- 원본 record hash와 frozen file hash, sourceVersion을 검사한다. JSON_INSERTION, JSON_CANONICAL, plainKo, 40자리 commit version과 64자리 file-hash version을 구분한다. 상충하는 ID·kind·state·pointer·version은 차단한다.
- MBTI는 실제 16개 JSON에서 TYPE/AREA/trait ID가 정확히 한 번 존재하는지 확인한다. 배열 위치·pointer·record/file hash·plainKo·sourceCoverage를 보존한다. 필드에 함께 선언된 nested locator도 대조한다.
- `mbti:ISTJ:traits:money:family_responsibility_spending`은 실제 `/traits/money/4`에 존재한다. sourceCoverage는 **inferred**다. 전체 MBTI 검증 1,309건은 direct 1,026 / inferred 283이며 개인의 실증적 성격 사실로 승격하지 않는다.
- MBTI `:plainKo` suffix 14건은 현 5부분 ID 문법에 포함되지 않아 보류한다. 유사 trait으로 대체하지 않았다.
- sm2는 서로 다른 source registry/판본이 있다. 원래 copied record의 `sourceId+originalHash`로 upstream family를 확인한 240건만 해당 판본 registry에 연결한다. 원문 웹 내용을 새로 읽거나 예측 타당성을 검증했다는 의미가 아니다. TRADITIONAL_SOURCE_REVIEW는 UNREVIEWED다.
- wonjin/pa는 실제 URL registry와 profile key를 kind로 구분한 86건이다. 원래 ID는 바꾸지 않는다. 남은 48건은 모호성을 유지한다.
- temporal scope alias 420건은 원래 TEMPORAL_SCOPES의 명시적 scope 값이다. 실제 고객 기간 Evidence가 아니다.
- Saju source prefix/file/export/원래 key의 정확한 조합 275건, 실제 source field 참조 240건을 확인한다. 지원 producer와 실제 계산 인스턴스는 별개다.
- 원래 60개 `#core,positive,risk`는 기존 inheritedMeaningRef 선언에 한정한 문법으로 세 필드를 전부 검사한다. 다른 문맥에서 임의 comma split을 하지 않는다. 위 240건을 합해 fragment 총 300건이다.
- Fusion repository alias는 기존 검증 문서가 명시한 파일 **전체**의 hash를 검사한다. 문서 snapshot은 DOCUMENTARY_REFERENCE_ONLY다. authored 연구 선언 ID 374건도 documentary로 남긴다.
- audit는 family-local 문서·정확한 entry/key·snapshot hash를 확인한다. 원래 AUDIT_WITHOUT_ORIGINAL_LOCATOR 46건은 모두 감사 문서만 확인됐다. 기타 audit 6건을 포함해 audit-only는 52건이며 원본으로 세지 않는다. 실제 원본 locator까지 있는 synthetic positive fixture는 별도로 검증한다.
- 구조화되지 않은 문자열, 문법이 확인되지 않은 path/export 조합, fixture 원본이 없는 참조는 보류한다. namespace는 우선 명시적 문법으로 분류하며, 선언된 별칭의 실제 종류와 자격은 resolutionMethod/SourceProof에 따로 기록한다.

## 상태·domain·그룹과 오용 방지

13개 독립 review 차원과 원본 상태를 분리한다. receipt에는 원래 CatalogKey/field/target/ordinal, 후보, matched locator/ID/version, hash 방식·expected/actual, proof, 차단 사유·후속 조치·위험도가 있다. 단일 verified=true 필드는 없다.

Domain queue는 2,966건 전체를 보존한다. 직접 unresolved overlap 0, ancestor overlap 482개 domain / 1,835개 occurrence 의존 링크다. A 출처 불완전 331, B 의미 검토 2,966, C 상품 정책 2,145, D 명시적 기존 정책 금지 464, E 명시적 unsupported producer 일치 0, F 승인된 명시 mapping 0이다. 분류는 겹치며 합계를 독립 레코드 수로 사용하지 않는다. 모든 domainApproved는 false다. E/F가 0이어도 producer 지원이나 의미 동치가 승인된 것이 아니다.

Source group은 192개(ALL_DIRECT 136 / AND_WITHIN_CONDITIONAL_DISPLAYED 56)다. 188개에 필수 출처 차단이 남아 있다. 나머지 4개도 실제 owner/direction/time 및 고객 승인 gate가 남는다. displayed 대체 그룹은 서로 합치지 않고 AND 내부 필수 항목 전체를 검사한다. owner/type 충돌·빈 필수 출처·UNKNOWN semantics는 보류한다.

위험도: CRITICAL 733 / HIGH 3,522 / MEDIUM 1,994 / LOW 241. HIGH/CRITICAL 4,255건은 모두 향후 사용 gate가 남으며, 기술적으로도 미복구인 것은 2,465건이다. 현재 Production 영향도나 독립 사실 수를 의미하지 않는다.

8개 fixture는 CHILDREN ancestry, businessPartner 금지 domain, MBTI Pair→개인 성격, 관계 정의→실제 Pair, natal→기간 사건, 교운 전후 혼합, Fusion root 누락, fact root 중복을 차단한다. 실제 개인 조건은 후속 Evidence Graph gate로 남긴다. Binder·후보 배정·원고 생성기는 구현하지 않았다.

## 재현과 산출물

```sh
node scripts/knowledge-source-verification/verify.mjs
node scripts/knowledge-source-verification/verify.mjs /tmp/gyeol-source-verification-repeat
pnpm exec vitest run tests/unit/report-knowledge/knowledgeSourceVerification.test.ts
```

새 CLI 두 독립 실행의 생성 JSON 20개가 byte 일치했다. 실행 시각은 별도 임시 run metadata에만 있다. 네트워크는 자동 실행하지 않으며 fetch/HTTP(S)를 차단한다. 임의 CLI 입력 코드를 실행하지 않는다. frozen 저장소 모듈과 신규 검증 모듈만 로드한다.

주요 산출물:

- manifest / reference-classification / receipts / overlay / verified-source-resolutions
- verified-aliases / verified-alias-declarations / verified-fragments / audit-reference-results
- mbti-source-verification / saju-source-verification / fusion-source-prerequisites
- source-group-review / domain-review-queue / binding-blockers / reference-impact
- source-status-matrix / unresolved-after-verification / verified-file-integrity / binding-safety-contract
- verification-summary / preservation / existing-failures / test-results / deterministic-rebuild / function-trace
- [후속 인수 계약](source-verification-handoff.md)

## 검증

| 검증 | 결과 |
|---|---|
| 신규 source verification | 37 PASS / 0 FAIL |
| 기존 카탈로그 | 12 PASS / 0 FAIL |
| 기존 Korean/실제 Book | 669 PASS / 0 FAIL |
| 기존 실패 재현 관련 28파일 | 7,796 PASS / 46 FAIL, 전후 동일 |
| 관련 테스트 합계 | 8,514 PASS / 기존 46 FAIL / 신규 0 FAIL |
| 6상품 frozen 통합 | 64/64 PASS, 위 기존 그룹에 포함 |
| 실제 Book | 17권 전체 관찰 동일 / 102 digest 일치 |
| TypeScript | 기준 0 → 최종 0 / 신규 0 |
| lint | PASS |
| Production build | PASS |
| diff-check | PASS |
| NFT | 88 trace / 원본 연구·검증 파일 0 |

기존 46건의 파일·테스트명·첫 오류·전체 정규화 오류 hash는 [existing-failures.json](existing-failures.json)에 있다. 기존 실패를 수정·삭제·skip하지 않았다. 전체 프로젝트 테스트를 실행했다는 주장은 하지 않는다.

Sandbox build는 compile 단계에서 약 6분간 유휴 상태여서 SIGINT로 종료했다. 같은 `pnpm build`를 sandbox 밖에서 실행하니 compile 7.1초, TypeScript 20초 및 전체 build가 성공했다. 코드·환경변수·설정 변경은 없었다. 최종 build 로그의 NFT 경고는 0건이다.

최대 로컬 traced path bytes는 54,618,130이다. 원격 압축 함수 크기와 다른 지표다. 기존 Vercel trace 수정 파일과 next.config.ts는 byte 보존했다.

## Git 및 Preview

신규 검증 코드·테스트·자료·보고서만 작업 브랜치에 commit/push한다. master와 Production은 변경하지 않는다. 실제 Preview 상태는 push 후 동일 SHA로 조회하며 아래 별도 receipt에 기록한다. 문서에 포함된 receipt commit 이후 최종 문서 commit의 SHA도 별도로 원격/Preview 일치를 확인한다.

Preview: push 후 확인 예정. 완료 메시지에 최종 SHA와 실제 상태를 기록한다.

## 남은 검토

기술적으로 미복구인 3,202건은 원본/locator 공급, 별칭의 판본·entry 모호성 해소, 미지원 참조 문법의 실제 계약 확인, 또는 실제 Evidence/Binding 요구사항 공급이 필요하다. audit 원문·전통 문헌 내용은 독립적인 사람 검토가 필요하다. 출처·semantic·domain/product·실제 owner/direction/time·고객 사용 승인 gate가 계속 남는다.

후속 출처 내용·domain·의미 검토의 입력과 우선순위 준비만 완료했다. 전체 고객 해석 승인·판매 승인·Evidence Binding 완료·Production 배포 승인을 선언하지 않는다. 다음 단계는 시작하지 않았다.
