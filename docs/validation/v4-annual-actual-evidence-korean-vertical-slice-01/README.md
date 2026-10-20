# V4-ANNUAL-ACTUAL-EVIDENCE-KOREAN-VERTICAL-SLICE-01

실제 기존 Annual 계산 → Actual Evidence Graph → 월별 기술 계약 → 한국어 사실 문장 → 문장별 Ledger → 정적 HTML을 실행했다. **고객용 Book, 신규 Reader Edition 또는 판매 품질 승인 결과가 아니다.**

Base `8f3f75891e007da7c3a57304b4f2e08fbda4fcf3`; branch `v4/annual-actual-evidence-korean-vertical-slice-01`.

## 읽는 방법

[twelve-month-factual-preview.html](./twelve-month-factual-preview.html)을 로컬 브라우저에서 연다. A, F, C2028, Ranged Transition은 각자 1~12월과 모든 원래 canonical 구간을 포함한다. 기간·월주·실효 연주·절입·월간/월지 본기의 십성 역할·확인된 또는 조건부 대운·전후 월주/연주/십성 역할/대운 상태의 Signature 차이·실제 지지 관계의 참가자를 표시한다. 생활 사건 예측과 승인되지 않은 의미는 넣지 않는다. 검증 정보는 고객 원고가 아니며 내부 Source를 볼 수 있는 오프라인 검증 문서다.

## 근거와 보류

기존 `runActualCalculationFixture`, `generateV4ShadowReport`, Graph, Annual Specialist 및 November까지의 실제 Adapter 반환을 사용한다. 원본 Packet/Graph를 변조하지 않는다. 원래 Boundary는 `segment.nodes`와 별도의 `boundaryNodeId`로 읽는다. 새로운 만세력·절입·대운 계산이나 Research 의미 엔진은 없다. 기존 한국어 `typedKoreanSlots`의 copula/clause helper와 유한한 사실 서술 틀만 사용한다. 기존 `generateEditorialDraft`와 STRICT 정책은 그대로다.

1월의 이전 12월 SOURCE_ONLY를 Graph Fact로 넣지 않는다. 2월은 구간의 실효 연주를 읽는다. 전후 구간은 별도 시간의 비교이며 동시에 발생한 사실이 아니다. 대표 Focus와 독해 시각의 현재 활성 구간을 별도로 서술한다. 조건부 대운은 원래 교운 범위와 대안으로 남긴다. 월별 통과 여부는 해당 Fixture의 원래 candidate에서만 가져온다. 코호트 전체의 10/12 계약을 모든 Fixture의 PASS로 바꾸지 않는다.

6월 계산값과 원본 동일 십성 역할의 미확정을 구분한다. 11월 계산값과 Context 관찰 시각의 부재를 구분하고 가상 장면을 사용자의 과거나 미래 상태로 만들지 않는다. 출생시간 미상과 원래 WITHHELD 계산 근거도 표시한다. June/November 후보 0 및 10/12 유지다.

`actual-evidence-to-sentence-ledger.json`은 모든 문장의 ID/Text/Hash, Fixture/Owner, 원래 구간, Producer/Version, Node/Evidence, 원래 Root, 완전 ancestry, Source Record와 심사 상태 및 June/November의 원래 심사 Observation Hash/Witness ID를 담는다. 중복 ancestry와 Source는 원래 ID로 참조하며 재구성 결과가 외부 원문과 정확히 같다. 비교 문장은 전후 Node의 원래 temporal을 각각 보존한다. 직접 rootId=null인 Node에 새 Root를 발급하지 않는다. 반복된 Root 사용은 독립 Fact 수를 늘리지 않는다. Reader Question/Claim/Meaning/Book 배정은 null/0이며 가짜 P/S 주소를 만들지 않는다.

## 재실행과 검증

`node tools/annual-actual-evidence-preview/verify.mjs <존재하지 않는 외부 출력 경로>`는 기존 7개 전체 기준선과 4개 Annual 검증본을 실행한다. 독립 프로세스의 재실행에서 산출물 전체 bytes를 비교한다. 기존 원래 703 Receipt는 ID/전체 Hash 배열로 비교하며 전문을 복제하지 않는다. 44개 후보의 전체 multiset, 422 Units / 164 held / 396 unmatched / 246 Typed Roots / Source FAIL 30을 보존한다. 원래 고객용 Book의 17권·102 digest 및 재열람과 Publication 32 SAFE_OFFLINE/7 WITHHELD도 비교한다.

기존 STRICT Planner/Writer/Reader는 등록된 A/F의 새 실제 실행에서 고객 문장·Claim·배정 0을 확인한다. C2028의 실제 계산 주소 fixture-annual-C2028은 기존 Registry의 fixture-annual-transition-C2028과 다르므로 원래 scope assertion이 거절한다. 주소를 바꾸거나 등록 범위를 확대하지 않는다. Ranged는 기존 Registry의 구조상 등록 범위에 포함된다. 이 등록 자체는 Meaning/고객 승인이 아니며, 이번 Preview는 Writer/Reader로 연결하지 않는다. 네 실제 Preview 모두 고객 발행·Planner 사용을 직접 거절하는 API 검증도 통과해야 한다. Ranged는 원래 오프라인 계산 recipe다. 이 검증본 API는 고객/Planner 사용 자체를 거절한다. 기존 전체 Reader 질문은 2,060개다. 신규 사실 경로의 Synthetic Meaning Definition 읽기·사용은 0이다. 기존 STRICT createEditorialInput은 승인되지 않은 정의를 선택하지 않더라도 원래 정의 파일의 무결성을 읽어 검증한다. 이 기존 읽기는 별도 계측하며 선택·Claim·고객 승격은 0이다. 원래 Writer를 고쳐 이 검사를 우회하지 않는다.

신규 부정 검증은 다른 Fixture/Owner/구간, 변조된 실효 연주·절입·Source/Graph, 허위 Context·실제 경험·동시성·Root 중복, 의미/Reader/Book/Customer 승인 위조를 막는다. 실제 Ranged의 조건부 대운을 확정·동시 활성로 바꾸거나 실제 미래 Focus를 현재로 바꾸는 시도도 원래 자료로 거절한다. HTML의 ID/Hash/Text를 Ledger와 다시 비교한다.

관련 테스트만 실행하며 기존 보호 Hash 실패 2개 및 October 5000ms 민감성을 정확한 Base 결과와 구분한다. 테스트 삭제·Skip·Timeout 증가는 없다. 전체 Repository Suite PASS를 주장하지 않는다. strict TypeScript, ESLint, Webpack build, Runtime AST, NFT를 확인한다. 실행 결과는 factual-preview-coverage.json과 외부 검증 로그에 있다.

기존 소스·Research·계산·고객 Runtime/UI·Planner·Writer·Reader·Book·Publisher는 변경하지 않는다. 새 핵심 파일 2개와 테스트/CLI 각 1개 및 문서 5개만 추가한다. 이전 Worktree, 원본 Dirty 11개, Git Ref/Object와 포렌식 915개를 비교한다. 의도된 새 Branch/Worktree/Index/Object/upstream 등록은 Git metadata 변경이며, 기존 임시 경로 위험과 Codex 내부 Ref 변화는 별도 보고한다. 과거 ignored/미기록 파일의 무손실은 UNVERIFIED다. master/Production/DB/결제/Auth/Worker 변경은 없다.

브라우저 도구의 file:// 정책 차단으로 시각 검증은 생성된 HTML 단일 내용만 메모리에서 반환하는 읽기 전용 127.0.0.1 서버로 수행했다. 임의 파일·폴더 탐색·외부 공개·쓰기·브라우저 파일 권한 변경은 제공하지 않는다. 브라우저 검토 Hash와 최종 HTML Hash도 일치해야 한다.

외부 로그: `/Users/Deokmin/Documents/gyeol-validation/v4-annual-actual-evidence-korean-vertical-slice-01/`. 정확한 commit/remote/Preview 확인은 외부 최종 영수증에 기록한다. Preview READY는 기술 빌드 결과이며 발행 승인이 아니다. 후속 작업은 시작하지 않는다.

## 최종 실행 수치

4개 Annual × 12개월 = 48개 월 섹션, 99개 원래 구간 문단, 1052개 bounded 문장 Ledger 레코드. 레코드 하나에 연결된 사실 문장이 여러 개 있을 수 있어 고객용 문단/문장 분량으로 해석하지 않는다. 원본 텍스트·ID·Hash 및 Source Witness 재검증, 독립 실행 2회의 모든 산출물 bytes 일치다.

신규 34 PASS / 0 FAIL. 기존 관련 24개 파일 1399 PASS / 3 기존 FAIL. 정확한 Base의 실패/시간 민감성 비교는 factual-preview-coverage.json의 verification에 있다. 새 회귀 0이며 전체 Suite는 미실행했다. strict TypeScript 진단 0, ESLint 경고 0, Webpack PASS / 경고 0개. Runtime AST 46 roots / 700 modules 및 NFT 90개 소스/의존성 집합은 정확한 Base와 동일하다.

기존 6501개 tracked 파일 변경·누락 0, 이전 81개 Worktree와 Dirty 11개 보존, 포렌식 915개 hash/914개 mtime 일치다. 의도한 신규 Git metadata와 Codex 내부 Ref 변화는 별도 로그에 기록한다. 임시 절전 방지는 검증 프로세스에만 한정하며 OS 전원 설정을 변경하지 않았다.
