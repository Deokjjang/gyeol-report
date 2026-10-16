# V4-SEMANTIC-DOMAIN-REVIEW-WORKBENCH-01

오프라인 원문·의미·상품 적용 검토 도구다. 실제 운영자 승인, 고객 승인·선택·Claim·Book 배정은 모두 0이다. UI에서 고르는 값은 인증되지 않은 검토 초안이며 Binder ApprovalRecord가 아니다.

## 실행

```sh
node tools/semantic-domain-review-workbench/verify.mjs /tmp/gyeol-review-workbench
node tools/semantic-domain-review-workbench/validate-review-draft.mjs /path/to/review-draft.json
```

첫 명령은 비어 있는 출력 폴더를 받는다. 인수 없이 실행하면 이 검증 보고서 폴더에 재생성한다. 기존 Base 파일은 Git blob 및 SHA256으로 확인한다. CLI는 fetch/http/https 호출을 차단하며 DB·고객 Runtime에 등록되지 않는다.

[오프라인 검토 화면](review-workbench.html)을 브라우저에서 연다. 외부 서버·CDN·이미지·폰트를 사용하지 않는다. 12개 전문 경로, 상품, 관계, Source/Domain 상태, Structural/Witness, 독해·초안 상태로 필터링하고 원문 ID·의미로 검색한다. 목록은 한 번에 최대 200개를 표시하며 필터로 범위를 좁힌다. 원문 미독해 항목에는 판정 입력을 제공하지 않는다.

같은 원문과 다른 적용 범위는 별도 주소를 유지한다. 공통 원문은 독해 수에서 한 번만 집계하고 다른 적용 카드로 이동할 수 있다. Original/Proposal을 나란히 읽고 Source, 실제 Witness, 정책·전체 ancestry, 반례·금지, 남은 Gate를 펼쳐 확인한다.

## 기준과 인수

- Base: `820f8dcdf71b73aa2601bcdae8e70d99762bb9e8`
- Branch: `v4/semantic-domain-review-workbench-01`
- 독립 worktree에서 신규 파일만 작성했다. 기존 checkout·55개 worktree·미커밋 11개·Base 5,337개 파일을 보호했다.
- Catalog의 20 research families/18,610 records 및 4,799 foundation records를 읽었다.
- 전체 해석 후보 4,270개와 전문 평가에 직접 포함된 고유 원문 2,367개는 서로 다른 지표다. 전문 평가 밖의 공통 연구 1,903개도 인수한다. 실제 상품 범위가 없는 항목은 `UNSPECIFIED`로 보류하고 적용 범위를 요청한다.
- 기존 12 Specialist/27 Graph/5,073 평가를 기존 무손실 gzip/shard Reader로 인수한다. 각 원래 Receipt 및 순서 있는 12 Gate의 hash를 확인한다. 이번에는 Specialist를 새로 실행하거나 Gate를 다시 판정하지 않는다.
- 원래 Source before/after 10,536/11,170, Evidence 917/1,489, Structural 81은 불변이다.
- 기존 Resolution 3,202개 중 기술 복구 525, 보류 2,677, overlay 재평가 559, selector refinement 508, Source delta +48/Evidence +0/Structural +0을 유지한다.
- Domain 2,966개 전체와 명시 금지 1,040개를 원래 판정 그대로 인덱싱한다. Source Groups 192개/보류 188개도 유지한다.

## 검토 단위와 첫 독해 묶음

Unit ID는 CatalogKey·Record hash·Claim·상품·관계·원래 적용 조건에서 결정한다. Fixture 평가 ID나 같은 십성·축·키워드만으로 의미를 같다고 판정하지 않는다. 실제 평가가 없는 공통 연구에는 실제 Gate PASS나 상품·관계를 만들지 않는다.

Structural 81회는 고유 원문 65개다. 첫 독해 묶음에는 그중 27개 원문/32회 평가가 연결된다. 나머지도 전수 matrix에서 찾을 수 있다.

기존 직접 독해 31개와 Resolution Packet 12개는 Original ID·CatalogKey·Record hash로 대조했으며 겹침 0, 고유 원문 43개였다. 이를 실제 운영자 검토 43건으로 집계하지 않는다.

첫 묶음은 기존 Packet 12개를 원본 및 기존 packet compiler로 재검증하고 새 원문 24개를 직접 읽어 구성했다. 36개 고유 원문, 적용 카드 37개이며 12개 전문 경로·6상품·궁합 7관계를 포함한다. 새 24개는 이전 43개와 겹치지 않는다. 기존 독해 전체 누적과 이번 36개 묶음은 별도 지표다. Fusion 개인 scope 계약 1개는 supporting 독해이며 36개 원문 수에 더하지 않는다.

Source ID·metadata만 있는 자료는 독해 완료로 만들지 않는다. 짧더라도 실제 독자 질문은 내용으로 인정한다. 원문 전체, 실제 의미 필드, Record/File hash, 판본 및 내용 hash를 검증한다. Git 판본은 해당 commit의 동일 파일과 비교한다. 외부 페이지를 이번에 새로 읽었다고 주장하지 않는다.

MBTI supporting source는 정확한 원문과 Source Coverage를 가져와 적용 경계를 검사한다. 이 자동 검사 전체를 모델의 직접 의미 독해로 집계하지 않는다. `direct/inferred`는 실증 수준이나 개인의 관찰 사실이 아니다. Fusion은 같은 사람의 실제 명리/MBTI primary root·rule·source assignment·context를 요구하며 세 번째 독립 사실이나 Pair 점수를 만들지 않는다.

## 실제 독해의 구분 사례

| 원문 | 원문이 뒷받침하는 범위 | 만들면 안 되는 확장 |
|---|---|---|
| `cpr:material:CH04.P2:private-criteria` | 혼자 판단 기준을 정돈할 여건과 공동 응답 기한을 나누는 질문 | 외향 행동을 가면으로 해석하거나 단독 결정권 생성 |
| `ckr:material:CH01.P1:capacity-entry` | 투입과 지킬 결과를 같이 비교하는 착수 방식 | 실제 카페·예산·고객 수·최적 준비량을 추정 |
| `lkr:material:CH01.P1:shared-meaning` | 본인이 중요하게 느끼는 연결과 상대의 이유를 구분 | 상대도 같은 약속·가치를 느꼈다는 단정 |
| `clr:relation:rr:combination:chung:丑未` | 실제 두 자리의 관계 분류와 성립·배제 조건 | 이별·사고·개고재물 예언 |
| `cwpr:material:CH08.P2:a-change-with-record` | 변경분·버전·미확정을 상대가 확인하게 하는 회수형 질문 | 전달을 승인으로, 최신 파일을 정답으로 간주 |
| `pcpr:material:CH03.P4:b-agreement-can-hide-unasked-view` | 실제 TEEN/B 원천과 안전한 의견 통로를 분리 | 숨긴 감정·과거 억압 단정, 자녀에게 부모 회복 의무 부과 |
| `mfpr:god:편재` | 외부 접점·선택을 원국 조건·실제 cycle·비용과 비교하는 연구 | 유입 가능성을 회수 수익·사업 성공으로 전환 |
| `afpr:case-study:canonical-help` | 7월 두 번째 segment의 庚 기준 未 target 관찰 | 후원자 존재·도움 사건 보장, 월간 정재와 월지 본기 정인 혼합 |

원래 문장과 각 source locator/hash는 `original-source-proofs.json`, 실제 조건·반례는 `review-cards.json` 및 UI에서 확인한다. 대운 전환 exact/range, 14년 편집 범위와 실제 10년 cycle, 세운의 12 Gregorian 월과 가변 segment를 그대로 유지한다.

## Source와 승인 경계

Major TenGod 10개×3 fixture의 Source Integrity 실패 30회는 남아 있다. 원본 Record hash는 유효하지만 ancestry의 `traditionalRef` 설명문을 특정 원전·판본 ID로 확인하지 못했다. 이름이 같은 다른 정의로 대체하지 않았다. UI에도 Record 유효/전통 출처 미확인/Source Gate 실패/고객 미승인을 표시한다.

의미 관계와 긍정·위험의 긴장은 모두 제안이다. 같은 정의의 재사용과 같은 실제 계산 사실을 구분한다. 다른 Owner·방향·시기·관계·맥락을 합치지 않는다. 확정 의미 관계·확정 모순은 0이다.

초안 기본값은 `UNSELECTED`다. 내보내기/가져오기는 원문 ID·Record hash·Source version·Product/Relationship·Packet/Proof hash와 필수 검토 항목을 대조한다. 필드 누락·중복·다른 scope·변조된 packet·미허용 decision·승인 필드 위조를 차단한다. `APPROVE_FOR_FURTHER_REVIEW`도 다음 검토 진행 초안일 뿐 고객 승인이 아니다.

실제 승인자 identity/signature/issuedAt/expiresAt을 만들지 않는다. 시뮬레이션은 ACTUAL_GATE_STATE/HYPOTHETICAL_REVIEW_OUTCOME/STILL_REQUIRED_GATES를 분리하고 실제 Gate 승격 0을 유지한다. 공식 승인 권한·인증·유효기간·철회·고객 승인 연결은 후속 별도 작업이다.

## 개인정보와 UI 검증 한계

새 Witness 표시본에서 원본 person hash를 null 처리하고 원본 Witness hash 및 fixture owner·출처·방향·기간을 보존한다. 이 작업은 원래 감사 자료나 Graph를 수정하지 않는다. 원래 일부 참여자 필드에 남아 있던 원본 person hash는 추가 privacy 검사에서 발견·차단됐다.

원문은 JSON script escaping과 DOM textContent로 표시한다. inline script/style은 정확한 CSP hash를 사용하며 외부 연결·이미지·폰트·frame·form을 금지한다. 가상 입력의 이름·생년월일·원본 person hash 및 secret 필드를 검사한다.

실제 생성 HTML을 실행한 JSDOM 기능 테스트로 필터·비교·초안 다운로드/가져오기·위조 차단·XSS 표시를 검증했다. CUA의 native pipe startup 오류로 실제 브라우저 시각·모바일 layout과 브라우저 CSP enforcement는 검증하지 못했다. DOM 통과를 실제 브라우저 확인으로 보고하지 않는다. 운영자 브라우저 확인은 남은 항목이다.

## 검증 및 산출물

최종 수치와 실제 실행 결과는 `technical-validation.json`, `known-failure-comparison.json`, `baseline-timeout-comparison.json`, `book-preservation.json`, `runtime-isolation.json`, `deterministic-rebuild.json`, `offline-ui-functional-validation.json`, `final-report-fields.json`을 참조한다. 전체 Suite를 실행했다고 주장하지 않는다.

기존 46 FAIL은 같은 테스트 이름과 전체 메시지/stack을 checkout의 정확한 경로 별칭만 정규화해 비교한다. BusinessPartner 기본 5초의 과거 실패는 별도 기준선으로 보존하며 이번 full/default·isolated/default·CLI 30초 결과를 각각 기록한다. 기존 테스트·fixture·timeout·설정은 수정하지 않았다.

두 독립 CLI의 모든 물리 JSON/gzip/shard/HTML을 byte 비교했다. 기존 DeterministicArtifactWriter/readGlobalArtifact를 재사용한다. 시간·PID·임시 경로·성능 로그는 결정론 산출물에 넣지 않는다. Book 및 40개 전체 개인 프로필의 비교 원본·raw test/성능 로그는 Git 외부에 둔다.

최종 commit SHA·원격 일치·Vercel Preview는 커밋/푸시 후 별도 최종 응답과 외부 검증 영수증에 기록한다. 이 보고서는 확인 전 Preview READY나 판매·배포 승인을 선언하지 않는다.

이번 구현은 공식 Operator Approval, Global Book Planner, Korean Editorial Engine, 고객 Runtime을 시작하거나 연결하지 않았다. master·Production·DB·환경변수·결제·Auth·Worker·기존 원고·기존 Book은 변경하지 않았다.

## 실제 측정 결과

- Review Units 6965; 고유 원문 36; 적용 카드 37; 첫 묶음 Domain Queue 직접 독해 3/2966.
- 신규 엔진/무결성 테스트 87 PASS, 기존 Source/Domain/artifact 110 PASS, 실제 생성 HTML DOM 12 PASS.
- 기준/현재 관련 기준선 5,837 PASS / 46 FAIL. 실패의 이름·전체 정규화 메시지/stack 동일.
- BusinessPartner: 기준/현재 기본 full 383 PASS; 기준/현재 선택 실행 1 PASS/360 filtered; 현재 CLI 30초 full 383 PASS. 과거 기본 실패 기록 보존, 수정 주장 없음.
- TypeScript 기준 0/현재 0/신규 0, lint/build/diff-check PASS. NFT 88+2 경로·의존성 집합 동일, 신규 코드/JSON 유입 0.
- 17 Book/102 digest, Friendship 20사례/140 digest, 40개 전체 프로필/308,432,008 bytes per side 및 stored roundtrip 동일.
- 확정 의미 관계·모순·운영자 승인·고객 승인·선택·Claim·Book 배정·ApprovalRecord 발급 모두 0.
- 브라우저 시각·모바일 layout 확인은 UNVERIFIED이며 운영자 직접 확인이 필요하다.
