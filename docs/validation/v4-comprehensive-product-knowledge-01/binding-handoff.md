# 종합 상품 후속 근거 연결 요구 — 이번에는 미구현

이 문서는 [Fusion 연결 요구](../v4-fusion-semantic-knowledge-depth-01/fusion-binding-handoff.md)와 [의미 축 Evidence 초안](../v4-semantic-axis-knowledge-expansion-01/evidence-binding-blueprint.md)을 참고한 종합 전용 요구사항이다. 새 producer·selector·allocator·validator·writer·점수·DB 구조를 구현하지 않았다. 제안 타입도 실행 함수가 아니다.

## 주소와 원천

기본 주소는 `saju_mbti_full → CH01~CH13 → P1~P4 → S1~S4 → cpr:material:*`이다. 원래 title·Domain·Context·purpose·208 role 문구는 그대로 유지한다. C1~C10은 별도의 내부 편집 계약이다. 참고 매트릭스를 실제 배정·소유권의 일대일 변환으로 사용하지 않는다.

| 단계 | 실제로 확인할 입력 | 출력과 중단 조건 |
|---|---|---|
| 원천 정의 | 실제 file/export/index 또는 JSON pointer·버전/hash·원래 검토 상태 | 연구 참조를 얻음; direct/inferred·repository_only를 실증으로 승격하지 않음 |
| 명리 계산 | 실제 본인 입력·기존 producer/version·원국 scope | 기존 Evidence만 사용; 연구 ID·MBTI로 계산 사실 발급 금지 |
| 원국 적용 | 월령·통근·강약·위치·투출·성립·반대조건·미상 영향 | 지원되지 않거나 조건 부족이면 보류; 새 계산·가중치 금지 |
| MBTI 원천 | 실제 입력 유형·primary node·pointer/hash·동일 owner | prior/reference-only/pair로 개인 행동을 만들지 않음 |
| 의미 조건 | 같은 대상·영역·과제·원래 facet 조건·본인 적합성 | 축 점수만으로 세부 행동 확정 금지; 반례면 보류 |
| Fusion | 양측 실제 원천·등록 계약·source assignment·split·Context | `fkr:` 연구 후보를 현재 등록 Fusion ID로 변환하지 않음 |
| 독자 역할 | 실제 CH/P/S 역할과 후보 기여의 일치 | 출처 누락으로 원래 질문을 다른 질문으로 바꾸지 않음 |
| 중복·회수 | canonicalFactKey·주장·대상·조건·definitionOwner·실제 도입 ledger | 동일 root의 facet·별칭·Fusion·Claim·Resonance를 독립 사실로 세지 않음 |
| 고객 표현 | 승인된 의미와 실제 원천·입력 | 가상 장면·편집 응용을 과거 경험·확정 성격으로 쓰지 않음 |

## 원천 종류별 조건

- 명리 정의·전통 상징과 현대 생활 응용을 구분한다. 천을·장성·태극·도화의 전통 분류가 실제 도움·직책·능력·호감을 보증하지 않는다.
- 일부 기초 정의의 `repository_only` 상태는 유지했다. 별도 심층 정의·기존 전거를 함께 참조해도 현대 행동·개인 적용이 검증되지는 않는다. 같은 정의의 여러 출처는 추가 독립 사실이 아니다.
- 문창의 전통 배치와 현행 표, 재고 projection·전거, 반안 전거, 갑자·자중 장간 응용의 부족 조건은 미해결 목록에 남아 있다. 단순 원천 ID 존재로 승인하지 않는다.
- 신규 개별 MBTI 연구·Pair 연구는 기존 원천과 구분한다. 이번 종합 입력에 상대 정보가 없으므로 Pair의 방향·관계 비교를 한 개인의 성격으로 사용하지 않는다.
- 기간 연구는 타고난 성격의 증거가 아니다. 대운·세운·월운·교운·절입의 사실을 종합의 미래 성공 예측으로 이전하지 않는다.
- Claim·Resonance·Guidance는 원천을 이어 쓰는 파생/응용 계층이다. 강한 claim label이나 조언의 존재가 신규 계산 사실을 만들지 않는다.

## 장별 필요한 새 정보

CH01은 대표적인 선택 방향을 좁혀 소개하고 CH02가 근거의 층위를 설명한다. CH03은 양측이 같은 말을 하는지·다른 역할인지·조건부 차이인지 검토한다. CH04는 밖으로 표현한 정보와 본인이 확인할 내면을 구분한다. CH05는 기능과 타인에게 남는 실제 변화를 설명하며 두 번째 재능의 기능·root 독립성을 확인한다.

CH06은 같은 기능의 과용 조건·의도와 수신의 차이를 다룬다. CH07은 실제 긍정 명리 상징의 전거·성립·현실 사용 조건을 따로 확인한다. CH08은 실제 입력 상태의 과제·환경·배움에 한정하고, CH09는 상징·선호·실제 자원 자료를 분리한다. CH10은 개인의 친밀감, CH11은 실제 합의 역할, CH12는 자발적 우정의 선택을 질문한다.

CH13은 새로운 성격·명리·MBTI·기간 사실을 추가하지 않는다. 앞서 실제 소개된 동일 개인·유형·맥락의 호환되는 의미만 선택 기준으로 회수한다. `precedingMeaningRefs`는 **도입 가능 후보 풀**이며 전부가 한 사람에게 동시에 성립했다는 목록이 아니다. 실제 도입 주소·underlyingFactKey·context·type이 일치하는 부분집합을 검증해야 한다. 앞선 의미가 없으면 회수 후보도 보류한다.

## 미상·입력 범위

MBTI 모름에서는 명리 단독 후보만 실제 원국 조건에 맞춰 검토한다. 두 체계 비교가 필수인 역할은 보류한다. 명리에서 유형을 만들거나 기존 role 문구를 다른 질문으로 바꾸지 않는다. 회수도 선행 의미의 가용성을 따른다.

출생시간은 기존 exact/approximate/unknown 결과를 사용한다. stable·candidates·confirmed와 지원 범위를 보존하며 시주·완성 구조·전체 부재를 합성하지 않는다. 정확한 시간도 실제 가족 구성·현대 행동을 보증하지 않는다.

기존 jobStatus·relationshipStatus만 사용한다. `provided`는 MBTI 입력의 연구 그룹으로 새 enum이 아니다. 관계 `other`는 지원하지 않는다. 가족 구성·현재 직무·수입·학력·자격·상대 유형·교제 경험은 실제 입력이 없으면 생성하지 않는다.

## 기존 발행과 저장본 보호

현재 release의 root당 3회·facet당 5회 primary 예산, facet:context 중복 방지, conflict와 recall 조건은 변경하지 않는다. 연구 자료의 수가 많아졌다는 이유로 한도를 늘리거나 새 root를 발급하지 않는다. 향후 연결 시 새 정보와 같은 사실의 재사용을 별도로 장부화해야 한다.

원래 hardErrors와 qualityIssues는 다른 계약이다. 현재 9,000~11,000자·문단 수·반복 진단을 새 결제/발행 Gate로 바꾸지 않는다. release hardErrors는 `COMPREHENSIVE_RELEASE_UNSAFE`로 실패하며, qualityIssues만으로 legacy fallback이 발생하는 것은 아니다. 실제 fallback 조건과 문단 부족은 별도 생성기 작업에서 검증해야 한다.

기존 Book은 원래 snapshot·버전·저장본으로 읽는다. 신규 연구가 기존 Book·reader·공유 URL을 재생성하거나 수정해서는 안 된다. 실제 연결 작업에는 별도 승인·계산/원고/Book digest 비교·사용자 입력 상태별 회귀·전체 독해 검수가 필요하다.

`bindingProposalTypes.ts`는 위 요구를 표현하는 타입이며 현재 사용 가능한 실행 validator가 아니다. 이번 단계의 runtime 연결·고객 승인·추가 독립 Evidence는 모두 0이다.
