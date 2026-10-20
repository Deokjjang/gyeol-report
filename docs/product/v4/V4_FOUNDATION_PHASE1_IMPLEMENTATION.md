# 결리포트 V4 — 1차 지식 DB·근거·엔진 기반 고도화 구현 계약

Base master: 2921cc8a9c48bfe458882d9fd9723494251c56e0
Work branch: v4/foundation-evidence-contract-01
Status: 진행 중. 문서·테스트 추가만으로 완료라고 판단하지 않는다.

## 공통 정책

여섯 상품에서 이미 사용 중인 명리 계산, MBTI16 소스, Fusion, V4 Composer, 실제 Book Reader를 먼저 재사용한다. 새 Writer/병렬 계산 엔진·새 운영 DB 테이블을 설계 실적을 위해 만들지 않는다.
실제 코드와 테스트를 변경하고 **실제 6개 Book 생성 결과**로 검증한다.
Production, master, 운영 고객 DB, 결제·이용권·권한, 공유 토큰, V2/V3/기존 V4 스냅샷, 궁합 구버전 점수는 변경하지 않는다.
별도 Meta Work 브랜치 feat/meta-opening-ready-20261020의 Pixel/CAPI/가입 전환/광고 동의/개인정보방침/광고 초안 및 관련 DB·UI는 절대 수정하지 않는다. 무관한 local Dirty·Git Ref/Worktree도 보존한다.
서버 로그에 이름·DOB·출생시간·개인 해석 원문·결제키를 남기지 않는다.

## 1A. DB 자료의 표준 식별과 적용 범위

대상: src/lib/report-knowledge/{sajuKnowledgeBase,mbti/sourceRuntimeAdapter,fusionKnowledgeBase,knowledgeSelectors}, src/lib/interpretation-v4/{materialRegistry,materialDepth,materialPacket,evidencePolicy,fusion}.

1. 계산한 Observation, 검증된 규칙, 작성된 MBTI trait, reviewed Fusion, 고객 입력 맥락, 조건부 장면, provenance-only 표기를 타입과 역할로 분리한다.
2. feature aliases → canonicalFeatureId는 원본 sourceRefs·lineage를 보존하며, 같은 원국 사실의 다른 이름을 독립적인 증거로 합산하지 않는다.
3. natal/시기별, personA/personB, observed/derived/unsupported, time precision, confidence 등 원래 스코프를 유지한다.
4. sourceRefs가 많다고 독립 증거가 많다고 처리하지 않는다. seed나 scene 텍스트는 계산 근거가 아니다.
5. selected/held/not-applicable/inferred 상태를 혼동하지 않는다. 출생시간 미상자의 보이지 않는 글자를 확정하지 않는다.
6. 누락 DB의 수를 자동으로 채우는 게 아니라 실제 출판에서 필요하지만 연결되지 않은 근거만 우선 보완한다.

Done: 실제 registry/MaterialPacket/Fusion의 ID 충돌, 유효/보류 선택, 근거 범위를 검사한 동작 코드와 재현 테스트.

## 1B. 독립성 판단 및 강도

대상: evidenceFoundation.ts, contentEvidence.ts, assertionPermission.

- 서로 다른 feature ID라도 lineage가 같으면 dependent.
- 일주/일간의 같은 바탕을 두 독립 근거로 세지 않는다.
- lineage가 누락된 두 근거는 independent가 아니라 unknown; 불확실성을 보존한다.
- 같은 근거를 다른 상품·장에 쓰는 것을 금지하지 않고, 새 독자 질문과 새 발현 조건을 제공하는지 판단한다.
- confidence는 확정 개인 미래/심리검사 정확도가 아니라 사용 권한의 수준이다.
- 강한 근거로 해석을 직접 쓰는 경우와 조건부 예시를 구분한다.

Done: alias/overlap/disjoint/missing lineage, subject/period 변경, 한 사실 재사용에 대한 테스트.

## 1C. 지식 자료의 실제 활용도

대상: evidenceFoundation.inspectMaterialCoverage와 실제 V4 6개 생성 경로.

- 실제 Book의 source inventory와 선택된 selected/held, authored MBTI/Fusion, 장별 사용/미사용 근거를 연결한다.
- 사용하지 않은 자료는 source absence, not eligible, domain mismatch, duplicate ancestry, ranking, chapter budget 등으로 구분한다.
- 모든 DB 자료를 반드시 출력하도록 강제하지 않는다.
- 원고에 영향을 주는 정보와 출판 후 단순 설명용 전문 용어를 분리한다.
- 원고에서 실제 근거 없이 입력 직업을 사주 재능의 증거로 바꾸지 않는다.
- 품질 지표에는 개인정보 대신 규칙 ID/선택 상태/집계만 사용한다.

Done: 대표 입력에서 사용/미사용/보류·추가 설명 필요 항목을 재현하는 리포트와 테스트.

## 1D. 장별 Planner/Selector

대상: contentEvidence.planChapter, contentSynthesis, comprehensiveAllocator, product Composer.

선택의 7단계:
1 인물과 대상 사람, 시기에 실제 적용 가능?
2 해당 상품·장·도메인의 질문과 맞는 근거인가?
3 calculation strong, reviewed Fusion 또는 conditional-only인가?
4 이미 사용한 뿌리와 독립적인가? lineage unknown을 독립으로 간주하지 않는가?
5 독자에게 새로운 정보·장면을 추가하는가?
6 MBTI와 함께 쓰는 경우 trait·domain·semantic axis를 실제로 대조했는가?
7 장별 예산과 긴 책의 서사·긍정/주의/결론 균형에 맞는가?

신규성을 위해 관련 없는 귀인/십성 사용 금지. 이전 근거의 정의를 후반부에서 생략하더라도 왜 현재 해석에 적용하는지 독자가 이해해야 한다.
Selector 개선으로 원고가 달라지면 version을 구분하고 전체 원고를 비교한다. 기존 구매자의 Book을 갱신하지 않는다.

Done: 같은 입력의 출력 변화 이유, 장별 root 사용 지도, 누락/중복 해석 방지 테스트.

## 1E. Fusion 정교화

대상: fusion.ts, fusionRules, contentMbti, contentRelationshipMbti, mbtiSemanticProfile.

- overlap/contrast/complement는 같은 문장으로 뭉개지 않는다.
- 실제 명리 provenance·MBTI source trait·semantic axis, domain, target, direction 검증.
- 모순은 앞뒤 맥락으로 설명할 수 있을 때만 통합, 설명할 자료가 없으면 support-only/held로 남긴다.
- MBTI가 없으면 새 MBTI 성향이나 유형을 지어내지 않는다.
- 직업·관계·시기별 융합 장면을 원래 데이터가 지원하는 범위에서만 사용한다.
- 16개 유형 전체 DB의 총량을 늘리기보다 실제 원고 생산 경로의 사용률과 적합성을 먼저 확인한다.

Done: 같은 원국/다른 MBTI, 같은 MBTI/다른 원국, 대상 A/B 변경, 미상 시간, 대비되는 축의 테스트.

## 1F. 출판 안전성과 버전

대상: runtimeShadow.ts, runtimeProjection.ts, storedReport, Book, worker.

- 구조 오류(중복 ID·빈 내용·잘못된 근거 스키마)는 새 발행 전 검증.
- 과도한 반복·약한 표현 등 독해 품질 issue는 review signal로, 결제한 책의 출판 실패로 처리하지 않는다.
- 데이터가 바뀌는 구현은 book/editorial revision과 이전 버전 검증을 구분한다.
- Digest는 고객 권한 증명이 아니며, 권한은 기존 DB·소유권 검사에서만 결정.
- 기존 저장본은 재계산하지 않고 원래 검증 계약으로 그대로 열람.
- 새 관계 점수 공식 변경은 2차 6상품 전문 엔진의 일부이며 이번 1차에서 수정 금지.

Done: 이전 V4/V2/V3 저장 Book 그대로 열림, 신규 6상품 발행 오류 없음.

## 1G. 검증 매트릭스

- 서로 다른 6명 + 6개 상품 전체 Book, 궁합 7관계 유형.
- 출생시간 정확·대략·모름, MBTI 있음/없음, 다른 직업·관계 상태, A/B 교환.
- 대운 14년, 세운 12개월 절입 전후 시각, 궁합 양방향과 구버전 지수 보존.
- 동일 입력·시각의 동일 JSON, 원고/기본 계산 digest, 이전 Book 불변.
- 개발실 검증과 동일한 로컬 QA 경로·실제 Reader 사용. 컴포넌트 unit만으로 완료 선언 금지.
- Vitest, TypeScript 0진단, ESLint, Production Build, diff-check. 기존 FAIL은 Base SHA에서도 재현.
- Preview READY는 build 근거이고 상품 본문 완성과 사용자 승인 근거는 아니다.
- 테스트/빌드가 불가능한 환경에서는 미실행이라고 적는다. 테스트를 삭제하거나 임의 skip 금지.

**실패 시**: 새 오류를 억지 Golden 수정으로 덮거나 Production에 임의 병합하지 않는다.
**완료 시**: 변경 전후 검증 자료, 실제 6개 Book URL, 브랜치/커밋/SHA, 새 회귀, 남은 P2~P5를 보고한다.
1차 전체 완료 전 2차·UI·운영 DB·Production 작업을 독단적으로 시작하지 않는다.
