# 후속 Evidence / Expression 연결 계약

설계 문서이며 실행 코드가 아니다. TS의 SourcePointer는 검증 문서의 versioned source catalog를 가리키는 순수 metadata이고, 실제 경로/export/index/원래 ID/hash는 catalog에 보존한다. runtime resolver나 importer를 구현하지 않았다. `bindingDesign.ts`의9단계와 `researchTypes.ts`가 정형 원본이다. 기존 NarrativeMemory/renderer의 introduced root/term 기록을 먼저 재사용할 수 있는지 검토하고, 새 ledger를 이번에 만들지 않는다.

## 흐름

검증 계산 Evidence → 미래 승인된 전문 해석 → 상품 claim → 실제 챕터/문단 배정 → 표현 기능 → 조건부 장면 → typed 문장 → 논리적 연결 → 전체 Book 검수.

| 단계 | 승인 전에 필요한 것 | 실패 시 |
|---|---|---|
| Evidence | 실제 owner/참조자/대상/position/formation/version/기간/확정성 | 해당 claim 보류; 연구 ID를 발급하지 않음 |
| 전문 해석 | 실제 root와 source-local 승인 상태·counterexample·domain | 원천 존재만으로 customer 승인하지 않음 |
| claim | claim/meaning identity·semanticUnits·조건·부정·확정성 | 의미를 채워서 새 주장 만들지 않음 |
| 배정 | 기존 상품 구조·질문·owner/방향/시기·소개/회수 상태 | 적합한 재료 없음을 반환; 일반론으로 분량 채우지 않음 |
| 기능 | 설명/긍정/위험/팩폭/반전 등 실제 목적과 허용 의미 | 위험·반전 근거가 없으면 보류 |
| 장면 | 실제 상태 또는 명시 가상·시점·동의·자원·권한·발달 | 미입력 경험/직업/가족/상대 감정을 만들지 않음 |
| 문장 | noun head/발음/부호, 용언 lemma·surface·주체·높임·시제·부정·조건 | 미확인 발음은 님/조사 없는 구조; 미검토 활용은 유지/보류 |
| 연결 | 실제 앞/뒤 claim·논리 관계·introduced 범위·관점 이동 | 접속어로 인과 추가 금지; 미소개 회수 보류 |
| Book | 각 문장→claim→실제 roots ancestry, 구조·모든 불변식·독해 | 기존 validator/저장 계약 유지; 기존 Book 재생성 금지 |

## 14불변식

1. claim 의미 유지.
2. person owner 유지.
3. A→B/B→A와 수신자 유지.
4. 실제 명리 기간·[start,end)·교운 범위 유지.
5. 계산 사실과 참가자/성립 조건 유지.
6. 확정성 유지.
7. 부정과 조건절의 적용 범위 유지.
8. 실제 provenance와 원천 상태 유지.
9. hypothetical_only 장면 상태 유지.
10. 표현 수로 새 Evidence를 만들지 않음.
11. 문법 slot 타입과 실제 읽기/용언의 호응 유지.
12. 동일 claim의 중복 배정 제한; 필요 회수/비교/새 적용 구분.
13. 의미 없는 문장으로 분량 충족 금지.
14. 기존 immutable Book/snapshot/열람 계약 유지.

## introduced ledger의 필요 정보

최초 소개 chapter/paragraph, claim/meaning identity, 실제 설명한 semanticUnits, source roots, owner, 방향, 시간, 확정성, scene 상태, 용어 정의 소개 여부, 허용 회수 기능, 과용/반례, 다음 질문을 구분해야 한다. 단순 `Set<feature>`만으로 이 모든 의미를 확인했다고 하지 않는다. 이미 존재하는 usedClaims/usedTermDefinitions/root use는 인수 대상으로 검토하며 보존한다. 이 문서가 새 ledger를 구현한 것은 아니다.

같은 claim의 문장 순서/어미를 바꾼 수는 새 정보 수가 아니다. 같은 root의 다른 domain 적용도 실제 적용 조건이 승인돼야 한다. 서로 다른 scope/window의 root는 잘못 합치지 않는다. Pair reference를 개인 claim으로 전용하지 않는다.

## 표현 부족 반환 설계

`missingFunction`, `claimIdentity`, `requiredContext`, `unresolvedSlot`, `missingSourceApproval`, `periodOrDirectionMismatch`, `neededEditorialReview` 같은 원인 정보를 반환하는 계약을 후속 구현에서 검토한다. 이번에는 해당 API나 알고리즘을 구현하지 않았다. 표현 부족을 고객 원고의 generic filler로 대체하지 않는다.

전체 출처/근거 검증, 실제 binding, 지식 선택, 문단 배정, 한국어 결합 엔진, 기존 generator 수정은 별도 승인 작업이다.
