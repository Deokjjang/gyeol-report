# V4-COMPREHENSIVE-READER-VALUE-PROBE-01

종합 리포트만 대상으로 기존 최종 발행 원고 A와 연구 기반 실험 문장 B를 8쌍 비교했다. 결과는 **PARTIAL_EDITORIAL_POTENTIAL_NOT_PROVEN_GLOBAL_QUALITY_GAIN**이다. 계산의 위치, 적용 조건과 반례, 오류 관찰과 수정 권한의 차이처럼 좁은 설명상의 이득은 있다. 그러나 일부 B는 기존 질문을 바꾸거나 기존 MBTI·Fusion 설명을 잃었다. 전체 책의 반복 감소, 독립적인 새 개인 사실, 독자 만족도 향상은 입증하지 못했다.

**B 전체: RESEARCH_ONLY_EDITORIAL_PROTOTYPE / RESEARCH_ONLY_NOT_CUSTOMER_APPROVED.** 고객 승인·적격·선택·발행 Claim·Book 배정은 모두 0이다. 기존 12 Hard Gates와 Writer에는 변경이 없다.

[실제 A/B 비교 화면](reader-value-comparison.html)에서 A와 B 전체 문장, 질문, 비교 한계, 개선·악화, 문장별 조건을 읽을 수 있다. 데스크톱은 좌우 비교, 모바일은 A 다음 B 순서다. 기술 JSON만으로 판단한 실험이 아니다.

## 기준과 실험 범위

- Base: `v4/operator-review-pilot-01`, `b88cf5dd6f7dda903a568955c4f736408b856c86`.
- 작업 브랜치: `v4/comprehensive-reader-value-probe-01`.
- 독립 worktree: `/private/tmp/gyeol-comprehensive-reader-value-probe-01`.
- 상품: `saju_mbti_full`만 사용. 기존 A/F 입력을 그대로 사용했고 표시 별칭은 **검토 가 / 검토 나**다.
- 평가 시각: `2026-10-12T12:00:00+09:00`.
- 두 입력은 같은 기본 출생 정보에서 MBTI·시간 가용성이 다른 사례다. 독립된 두 사람의 다양성 실험으로 해석하면 안 된다.
- A: ENFJ 및 정확한 시간 입력. F: MBTI·출생시간 미상. F의 시주와 MBTI를 보충하지 않았다.
- 신규 오프라인 도구·실험 문장·테스트·보고서만 추가했다. 계산, 12 Specialist, Binder/Foundation, Global Integration, Source/Domain Resolution, Workbench/Pilot, Writer/Reader/Book 등 기존 파일 5,464개의 바이트를 보존했다.
- 고객 DB, 결제, 환경변수, Production에 접근하지 않았다. 외부 원고 API를 호출하지 않았으며 실행기 네트워크를 기존 오프라인 bootstrap으로 차단했다.

## A가 실제 최종 발행본인지 확인

기존 `src/lib/book/paidRuntime.ts`가 사용하는 `generateV4ShadowReport` 경로를 오프라인으로 실행했다. 실제 생성 순서는 입력·명리 계산·MBTI DB·Fusion → 종합 편집 계획 → Manuscript → Release → Release Validation → 선택된 최종 Narrative → Publication Validation → Book 투영이다. 기존 구조를 바꾸거나 승인 정책을 완화하지 않았다.

두 사례 모두 실제 선택된 발행 버전은 `comprehensive-editorial-quality-fix-01-v1`이다. 13장·52문단 전체가 선택된 Release의 문장과 같고 최종 Book에 포함되며 Publication Validation이 통과한다. Fallback은 없다. Draft를 Published Edition이라고 표시하지 않았다. 선택한 8문단의 원문·입력/계산/Profile/Evidence/Narrative/Book hash와 원래 문장별 provenance를 보존했다.

요청된 `narrativeHumanAudit.ts`는 존재하지 않았다. 실제 관련 파일 `manuscriptHumanAudit.ts`를 조사했다. [발행본 감사](baseline-published-edition-audit.json)와 [A 전체 8문단](baseline-published-paragraphs.json)에 경로·해시·선택 상태가 있다.

## 연구 원문과 실제 근거

179개 원본을 기존 SourceReader/ExactSourceResolver로 읽고 ID·CatalogKey·record hash·source version·파일 hash를 검증했다. 이 중 **B에 직접 사용한 원문 7개를 모델이 깊이 읽었다**. 나머지 172개는 인덱스 조사이며 모두 독해했다고 주장하지 않는다. 메타데이터만으로 B를 작성하지 않았다. 원문에 없는 필드는 `FIELD_ABSENT_NOT_INVENTED`로 남겼다.

원문의 coreMeaning, readerQuestion, positive, risk/shadow, factBomb, twist, actions/application, counterexample, sourceRefs, prerequisites와 실제 존재하는 요구 조건을 확인했다. 7개 전체 원문 및 ancestry/source proof는 [원문 Ledger](research-source-ledger.json), 179개 인덱스는 [연구 목록](research-inventory.json)에 있다.

기존 종합 기준은 13장·52문단·208 Sentence Roles·260 Questions, 179 Materials·200 Applicable Candidates, 4 Graph Fixtures·557 witness 발생 건·23 structural 발생 건이다. 이번 2입력의 실제 재진단은 **180 witness 발생 건·9 structural 발생 건**이다. B Ledger가 참조한 서로 다른 witness 주소는 8개, root node까지 포함한 공개 Graph node는 15개다. 발생 건수·고유 node·승인 후보 수를 혼동하지 않았다.

실제 계산에서 재생성한 Graph의 **모든 node**를 기존 A/F 공개 shard와 비교했다. Producer, producerEvidenceId, 값, Owner, temporal/direction, source, 상태, ancestry parent/root를 확인한 뒤 원래 공개 node/root 주소를 보존했다. Source ID가 있다는 이유만으로 계산 사실이라고 취급하지 않았다. [Actual Graph Ledger](actual-graph-witness-ledger.json)에 원래 node, receipt, shard hash가 있다.

`probe-ga-2`에서 실제 C077 `love` derivation은 same-owner 명리·MBTI 두 root가 존재한다. Fusion wrapper는 제3의 독립 사실이 아니며 `independentFactsAdded=0`을 유지한다. 다른 context의 C077로 대체하거나 모든 관계/업무로 확장하지 않는다.

## 비교의 정확성

`READER_SCHEDULER_BRIDGE_UNVERIFIED`를 유지한다. 기존 Scheduler C1~C10과 연구 Reader CH01~CH13의 번호 대응을 만들지 않았다. **정확한 교체 대응 0, 같은 실제 계산 root를 가진 주제 비교 3, 편집상 주제 비교 5**다. 동일 입력의 관련 질문 비교가 가능하다는 뜻이며 기존 문단의 대체안 승인과 다르다.

일부 연구는 정인·식신·output_heavy 또는 전체 ancestry를 추가로 요구한다. 해당 조건은 미충족 상태로 남겼다. B는 검증된 좁은 사실 및 조건부 질문 부분만 참고하며 전체 Material 적격성을 주장하지 않는다. [Bridge 감사](reader-bridge-audit.json), [조건 범위](conditional-meaning-coverage.json)에 빠진 조건과 모든 원래 Gate 결과를 기록했다.

## 실제 문장 비교와 이득·손실

아래 인용은 발췌이며, 링크된 HTML/JSON에는 A/B 전체 문장이 있다. 각 평가는 B를 작성한 같은 모델의 자기평가다.

| 비교 | A 문단 / 연구 ID | 판단 | 새로 설명한 부분 | 잃거나 확인하지 못한 부분 |
|---|---|---|---|---|
| 가1 | CH03.P2 / `precision-has-a-stop` | MIXED | 실제 시주 상관 위치, 오류 영향·종료 조건·안전 반례 | A의 명리/MBTI 이중 설명 손실 |
| 가2 | CH05.P3 / `boundaries-enable-support` | POTENTIAL_GAIN | 자기 선택과 도움의 범위·책임·상대 선택권 | 성장 질문을 관계 질문으로 변경; 전체 ancestry 미통과 |
| 가3 | CH06.P1 / `help-with-hidden-expectation` | BOUNDARY_ONLY | 유형 자기보고와 실제 경험 구분, 도움 종료 시점 | 숨긴 기대의 핵심은 A에도 존재; 장면·팩폭 약화 |
| 가4 | CH08.P1 / `work-through-shared-purpose` | POTENTIAL_GAIN | 좋은 분위기와 목표 일치 구분, 이견·지원 확인 | 원인 분석이라는 A의 강점을 다른 주제로 변경 |
| 나1 | CH03.P4 / `precision-has-a-stop` | MIXED | 실제 월지 근거와 미상 시주 분리, 점검의 끝 | 혼자 생각하는 A의 질문을 점검 절차로 변경 |
| 나2 | CH05.P2 / `learn-and-transfer` | POTENTIAL_GAIN | 편인 위치, 다른 조건에 적용해 맞지 않는 점 확인 | 전이 주제는 A에도 있음; 정인 조건 미충족 |
| 나3 | CH08.P3 / `overused-output-standard` | POTENTIAL_GAIN | 관찰과 수정 권한, 요청받은 역할 분리 | 시간 압박이라는 A 질문 약화; output_heavy 미검증 |
| 나4 | CH12.P3 / `critique-without-invitation` | NO_CLEAR_GAIN | 친구의 감정/요청을 상징에서 추정하지 않음 | A에도 원하는 응원 확인이 있음; 구체적 성과 비교 긴장 손실 |

### 실제 예: 판단의 경계가 명확해진 부분

가1 A: “금 기운에서는 ‘필요한 것과 필요 없는 것을 가르고 기준을 세우는 기운’이라는 명리적 이유를 읽습니다.”

가1 B: “원국의 시주 천간 을목은 임수 일간을 기준으로 상관으로 계산됩니다.” 이어 “중요한 오류를 찾는 일과 모든 차이를 고치는 일을 나누어 볼 수 있습니다.”라고 조건부 해석을 제공한다. 첫 문장만 실제 계산 사실이며, 두 번째 문장은 미승인 연구의 조건부 의미다. 이 계산은 실제 점검 능력이나 전체 금 기운을 입증하지 않는다. B는 A의 ENFJ 설명을 잃었으므로 무조건적인 우위가 아니다.

나3 A: “분석을 요청받지 않은 상황에서는 긴 설명이 부담이 될 수 있으니, 결론을 먼저 주고 필요한 만큼 근거를 덧붙여 보세요.”

나3 B: “상관의 문제 제기 상징을 업무에 연결할 때에는, 오류를 알아보는 것과 수정할 권한을 갖는 것을 먼저 나누어야 합니다.” A의 설명 분량 조언과 달리 행동 권한이라는 다른 조건을 제안한다. 그러나 권한·현재 업무는 미입력이며 이 의미는 조건부 연구다. 상관 존재만으로 output_heavy 구조나 실제 갈등을 생성하지 않았다.

### 실제 예: 뚜렷한 새 정보로 세지 않은 부분

나4 A: “친구의 목표가 아니라 내 기준을 요구하고 있지는 않은지 살피고, 지금 원하는 응원의 방식을 물을 수 있습니다.”

나4 B: “친구가 새 취미를 이야기하는 상황이라면 고칠 점부터 찾기 전에 함께 즐거워하고 싶은지, 의견을 듣고 싶은지 물어볼 수 있습니다.” 예시는 달라졌지만 원하는 반응을 묻는 핵심은 이미 A에 있다. 새 개인 사실이나 확정된 정보 증가로 세지 않았다. 식신 미매칭도 유지했다.

## Claim 구분과 반복 평가

B 8문단은 32개 실질 문장으로 구성된다. **기존 계산 사실 4, 기존 입력 사실 1, 연구 조건부 의미 27**이다. 새로운 독립 사실 발급 0, E/F 문장 출력 0, 미확인 개인 사건/미래 사건 단정 출력 0이다. 32문장 모두 시작·끝 위치, 원본 연구 필드, Source/Evidence/Owner/Root, 조건, 반례, Domain/승인/Gate 상태가 있다. [문장별 Ledger](sentence-claim-ledger.json)를 참조한다.

실험용 guard는 원래 사실의 Producer·Owner·Root·값, 미상 입력 금지, source field와 조건 표현을 점검한다. 일반 한국어의 진위를 완전히 판별하는 시스템이 아니다. 작성한 32문장을 직접 읽는 검증과 21개 부정 사례를 함께 사용했다. 미검증 가설·금지 주장·가짜 경험·미래 보장·가짜 고객 권한은 부정 사례에서 거절됐으며 실제 선택/승인 시스템에 등록되지 않는다.

A/B 정확한 문장 중복과 같은 root의 재사용, 같은 의미일 가능성을 별도로 기록했다. B의 도움 범위·동의·요청된 역할 조언은 서로도 겹친다. A의 전이·응원·종료 기준을 재서술한 B도 있다. **전체 책의 의미 반복 감소는 UNPROVEN**이다. 같은 root를 썼다는 이유만으로 의미 중복을 확정하지 않았다. [반복 진단](semantic-repetition-analysis.json)에는 검토 대상 원문을 함께 기록했다.

개인화는 일부 문단의 계산 위치·확인 범위가 명확해졌다는 수준이다. 다르게 살아온 개인의 경험이나 능력을 더 알아냈다는 뜻이 아니다. 용어·한계 설명이 길어져 읽는 부담이 증가한 문단도 있다. [품질 기준 80개 평가](quality-evaluation.json)에 동일한 10기준으로 A/B 원문, 개선·악화 여부/이유, source, 사람의 판단이 필요한 질문을 기록했다. 독립 블라인드 검토, 독자 만족도 측정, 공식 의미 승인은 실시하지 않았다.

## 추가로 해결해야 할 것

1. 정확한 Reader 질문·Source·실제 root의 연결이 없다. 번호나 비슷한 주제만으로 교체하지 않는다.
2. 일부 Material의 필수 사실·ancestry, actualUserState와 실제 행동 맥락이 부족하다. 확인한 좁은 사실로 전체 의미를 승격하지 않는다.
3. 의미/domain/counterexample/source policy 및 고객 승인 Gate가 미통과다. B가 읽기 좋아 보여도 원래 12 Gate를 우회할 수 없다.
4. 일부 문단의 질문 변경·기존 설명 손실·용어 부담·반복이 남았다. 편집 개선 가능성과 고객 사용 가능성을 분리한다.

다음 권장 작업은 **이번 종합 비교의 질문/Source/Root 연결을 명시적으로 검증하고, 같은 모델의 자기평가와 분리된 블라인드 독해를 받는 것**이다. 연구량 추가, 52문단 교체, 다른 상품 확대, Global Planner, 고객 승인/Runtime 통합을 시작하지 않았다.

## 보존 및 기술 검증

| 항목 | 실제 결과 |
|---|---|
| 신규 실험 테스트 | 19 PASS / 0 FAIL; 실제 CLI 두 번 생성 및 바이트 비교 포함 |
| 신규 부정 사례 | 21 PASS / 0 FAIL |
| 기존 종합 Specialist 테스트 | 62 PASS / 0 FAIL |
| 기존 알려진 실패 묶음 | 5,837 PASS / 46 FAIL; 기준 Pilot 실행의 46개 이름·전체 정규화 메시지·signature 동일 |
| BusinessPartner 기본 5초 | 과거 exact-base Pilot 383 PASS; 이번 fresh exact-base 382 PASS / 1 FAIL; 현재 382 PASS / 1 FAIL |
| BusinessPartner 분리 기본 실행 | 0 PASS / 1 FAIL / 360 FILTERED; fresh base/current와 동일 failure signature |
| TypeScript | 기존 0 → 현재 0, 신규 0 |
| lint | PASS |
| Production build | Node 24.22.0 / Next 16.2.4 PASS; 관측 경고 0 |
| diff-check | `git diff --cached --check` PASS |
| NFT | 90경로(88 server + 2 root)와 dependency 집합 동일; 실험 파일 유입 0 |
| 기존 17권 | 102 digest 동일 |
| Friendship 20사례 | 140 digest·40 profile 동일; profile 각 측 308,432,008 bytes |
| 기존 소스 | Base의 5,464파일 바이트 동일; 새로운 Runtime import 0 |
| 결정론 | 독립 CLI 2회, 핵심 23개 실제 파일 모두 동일 |
| 브라우저 | 실제 Chrome 155, 7폭(320/390/430/768/1024/1440/1920), A/B 16문단 문자 일치, overflow/외부 요청/page error 0 |

전체 저장소 모든 테스트가 통과했다고 주장하지 않는다. 기존 46개 실패의 원문 메시지는 [실패 비교](baseline-failure-comparison.json)에 있다. BusinessPartner의 현재 5초 사례는 별개다. raw 메시지는 `STACK_TRACE_ERROR`이며 각각 5초를 넘겨 종료됐다. 이번 fresh base 5561.49ms, 현재 5472.19ms, 분리 5765.61ms로 이름·정규화 메시지·signature가 같다. 기존 기본 예산에 민감한 실패로 기록하며 기존 timeout/테스트/설정은 변경하지 않았다. [별도 비교](baseline-timeout-comparison.json)를 참조한다.

CUA native pipe 시작 실패를 기록했다. 기존에 사용자에게 허용된 독립 Playwright 대체 경로로 실제 설치된 Chrome을 실행했다. 14개 screenshot과 원시 로그는 외부 검증 폴더에만 있다. 사람 운영자의 독해 승인이나 실제 고객 UI 일치 검증은 아니다.

시작 당시 기존 worktree 57곳과 원본 미커밋 11파일을 snapshot했다. 기본 short status는 디렉터리를 접어 3행이며, 펼치면 수정 2파일과 미추적 9파일이다. 그 중 8곳은 이미 `.git` 표식이 없었으며, 기존 공통 Git admin을 읽어 상태·파일을 비교했다. 복구·prune·정리를 하지 않았다. 기존 모든 HEAD/branch/status 및 tracked/nonignored-untracked 파일 바이트를 전후 비교했다. [작업공간 보존](workspace-preservation.json)에 이 예외와 검증 범위가 있다.

## 재현과 산출물

저장소 루트에서 실행한다. 기존 입력과 자료를 수정하면 seals 또는 보존 검사가 실패한다. 고객 Writer를 실행하거나 생성 결과를 저장/발행하는 명령은 없다.

```sh
node tools/comprehensive-reader-value-probe/run.mjs /tmp/gyeol-reader-value-rebuild
node node_modules/vitest/vitest.mjs run tests/unit/report-knowledge/comprehensiveReaderValueProbe.test.ts
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/eslint/bin/eslint.js
NODE_OPTIONS=--max-old-space-size=4096 node node_modules/next/dist/bin/next build
git diff --check
```

`run.mjs`는 기존 자료를 읽고 오프라인 계산을 재현한 뒤, seal이 맞는 실험 문장을 출력한다. 새로운 AI 원고를 매 실행 작성하지 않는다. 기존 DB/원고 원문을 임의 수정하지 않는다. build는 Node 24.22.0으로 확인했다. Chrome 확인 도구는 외부 설치된 Playwright와 실제 Chrome을 사용하므로 저장소 dependency를 추가하지 않았다.

| 산출물 | 파일 |
|---|---|
| Manifest / 동결 입력 계약 | [experiment-manifest.json](experiment-manifest.json), [selected-fixtures.json](selected-fixtures.json) |
| Published Edition / A 원문 | [baseline-published-edition-audit.json](baseline-published-edition-audit.json), [baseline-published-paragraphs.json](baseline-published-paragraphs.json) |
| 원본 연구·출처·실제 Graph | [research-source-ledger.json](research-source-ledger.json), [actual-graph-witness-ledger.json](actual-graph-witness-ledger.json) |
| B 원문 / Claim provenance | [experimental-prose.json](experimental-prose.json), [sentence-claim-ledger.json](sentence-claim-ledger.json) |
| Reader Bridge / A/B 전체 비교 | [reader-bridge-audit.json](reader-bridge-audit.json), [paragraph-comparison.json](paragraph-comparison.json) |
| 품질·반복·안전성 | [quality-evaluation.json](quality-evaluation.json), [model-evaluation-limitations.json](model-evaluation-limitations.json), [semantic-repetition-analysis.json](semantic-repetition-analysis.json), [grounding-violation-audit.json](grounding-violation-audit.json), [negative-grounding-tests.json](negative-grounding-tests.json) |
| 조건·결론·다음 작업 | [conditional-meaning-coverage.json](conditional-meaning-coverage.json), [research-value-assessment.json](research-value-assessment.json), [remaining-blockers.json](remaining-blockers.json), [next-stage-decision.json](next-stage-decision.json) |
| 실제 비교 화면 | [reader-value-comparison.html](reader-value-comparison.html), [browser-validation.json](browser-validation.json), [comparison-html-integrity.json](comparison-html-integrity.json) |
| 결정론·Privacy·보존 | [deterministic-rebuild.json](deterministic-rebuild.json), [privacy-audit.json](privacy-audit.json), [book-preservation.json](book-preservation.json), [original-preservation.json](original-preservation.json), [nft-isolation.json](nft-isolation.json), [workspace-preservation.json](workspace-preservation.json) |
| 테스트·실패 비교 | [technical-validation.json](technical-validation.json), [baseline-failure-comparison.json](baseline-failure-comparison.json), [baseline-timeout-comparison.json](baseline-timeout-comparison.json) |
| 신규 소스 seal / 최종 필드 | [experiment-source-hashes.json](experiment-source-hashes.json), [final-report-fields.json](final-report-fields.json) |

가상 이름·생년월일·원래 person hash는 공개 검증 산출물에 넣지 않았다. raw 입력·계산·전체 Book과 원시 테스트/브라우저 로그는 `/tmp/gyeol-comprehensive-reader-value-probe-01-validation/`에만 있다. 공개 Graph 원래 주소/owner/roots 및 검증 hash는 Ledger로 보존한다. 원문 DB와 기존 발행본은 수정하지 않았다.

최종 commit/push와 정확한 SHA의 Vercel Preview 상태는 이 문서가 들어간 commit을 생성한 **후** 확인한다. 자기 자신의 SHA를 그 commit 안에 미리 기입하지 않는다. 최종 SHA·원격 일치·project-scoped Preview READY receipt는 최종 응답 및 외부 `release-receipt.json`에 기록한다. branch push에 따른 Preview 확인만 허용되며 master 통합·Production 배포·고객 연결·승인은 없다.
