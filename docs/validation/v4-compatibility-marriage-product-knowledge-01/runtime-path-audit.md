# 기존 marriage 실행 경로 재감사

기준 be3c00ed36c9bb96ab6a104c8241a5137ef27094. source-module-audit.json의 21파일과 existing-pair-inventory.json의 실제 export 값을 다시 확인했다. 선행 연구의 공통 producer inventory는 reused-inventory-provenance.json에 경로·hash를 남겼다. 해당 자료는 새 결혼 의미로 집계하지 않는다.

1. reportInputTypes.ts의 compatibility payload는 personA/personB, productKey/productSlug, compatibilityRoleVersion, relationshipType를 받는다. 혼인·동거·소득·재산·자녀·가사 실력·부모 성격은 받지 않는다.
2. compatibilityProductAdapter.ts:34는 marriage를 내부 relationshipStatus:married로 매핑한다. 개인 편집 context이며 실제 혼인 사실을 검증한 데이터가 아니다.
3. compatibilityEvidence.ts와 compatibilityDirectionEvidence.ts는 개인별 원국·MBTI 및 양쪽 관계를 구분한다. 실제 person ID는 이름·생년월일·시간 정밀도·성별에 영향을 받으며 MBTI와 A/B 슬롯·카테고리 자체는 ID의 근거가 아니다. A/B 전체 교환과 이름만 교환의 차이를 실제 검사했다.
4. 원국의 단일-person 관계와 cross-person relation은 다르다. 현재 교차 지원은 six_harmony/three_harmony/half_harmony/clash/harm. 기존 64조합 중 34는 구성 membership을 지원하고 30은 미지원이다. 같은 글자의 해와 원진을 바꾸어 설명하지 않는다. 실제 관계 refs·기둥·소유자·producer ID가 없으면 정의만으로 검출하지 않는다.
5. 실제 A→B는 B.dayMaster를 viewer, A.dayMaster를 target으로 사용한다. B→A는 반대다. 같은 결과는 그대로 유지한다.
6. compatibilityProductView.ts의 Pair 참고는 각 개인 축·Fusion에 합산하지 않는다. 다만 별도의 기존 compatibilityIndex.ts는 notablePairs의 sharedGround/positiveInfluence/friction/repairStrategy 및 카테고리 가중치를 사용한다. 'Pair는 전역적으로 아무 점수에도 쓰이지 않는다'고 오해하면 안 된다. 이번 연구의 existingScoreContribution:false는 새 자료가 어떤 기존 점수에도 기여하지 않는다는 뜻이다.
7. compatibilityReleaseSources.ts의 개인 후보는 primaryEligible, invalidReasons, 실제 signed 명리 root, meaningful/non-amplifier 조건 및 source 소유권을 확인한다. GUIDANCE·fortune·internalComplexity 제외와 우선순위 정렬을 보존했다.
8. compatibilityReleaseRenderer.ts는 preferred axis, 반복 axis 회피, 중복 문장 key와 source 부족을 다룬다. committed는 사용 횟수 기록이며 엄격한 root 재사용 상한은 아니다. 새 registry를 이 흐름에 연결하지 않았다.
9. compatibilityReleaseValidator.ts는 identity/category, source candidate, 개인 root, MBTI/Fusion provenance, 실제 canonical/direction ID, signed root를 hard error로 검증한다. BODY_LENGTH는 qualityIssues다.
10. adapter:88–94의 발행 선택은 hard error 없음, editorial이 Minor 이내, opening/section 비어 있지 않음이다. 길이 진단만으로 legacy fallback됐다고 서술하지 않는다. M/N/AB는 기존 REPEATED_LONG_PHRASE Major 때문에 이전 edition이 선택된다.
11. 기존 CH09는 good card를 사용할 수 있으나 실제 앞선 표시 의미 ledger를 제공하지 않는다. 새 연구의 CH09 회수 계약은 후속 인수 요구이며 이번에는 구현하지 않는다.

## 실제 상태 추론 잔존 — 수정하지 않음

- compatibilityCategoryCopy.ts: marriage opening은 “부부입니다”, scene은 “결혼 후에도”, repair는 “편한 배우자” 맥락을 포함한다.
- compatibilityInteractions.ts:23은 “함께 사는 동안”을 사용한다.
- compatibilityHarmony.ts:93은 “배우자” 및 함께 사는 일상을 가정한다.
- 실제 A reader CH04.P4에는 “공평함을 다시 정하는 부부가 될 수 있습니다”, CH09.P2에는 “배우자 소연님”이 나왔다. actual-reader-excerpts.md에 변경 전후 동일한 원문을 첨부했다.

이번 독립 연구 DB에서는 상태를 UNKNOWN으로 유지한다. 현재 고객 원고를 고친 것으로 보고하지 않는다. 별도 원고·binding 승인 때 미확인 상태 표현을 검토해야 한다.
