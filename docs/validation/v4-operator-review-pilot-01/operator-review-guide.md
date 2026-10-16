# 운영자 원문·적용 조건 검토 가이드

이 화면은 검토 초안을 작성하는 오프라인 도구입니다. 36개 원문이 37개 적용 카드로 나뉩니다. 같은 원문도 상품·관계·적용 조건이 다르면 따로 읽습니다. AI 제안, 자동 브라우저 검사, 실제 사람의 판정은 서로 다릅니다. 실제 승인 수는 0입니다.

## 시작과 보관

같은 폴더의 review-workbench.html을 Chrome에서 엽니다. ‘첫 검토 묶음 37개 보기’를 누릅니다. 원문 ID나 review-unit-v1 ID로 검색하고 상품·관계·전문 경로를 확인합니다. 6965개 전체 목록은 최대 200개씩 보이지만 정확한 ID 검색으로 나머지도 찾을 수 있습니다. 미독해 항목은 판정 입력이 없습니다.

초안은 탭 메모리에만 있습니다. 새로고침·탭 종료·브라우저 종료·강제 종료 시 손실될 수 있습니다. beforeunload 경고는 브라우저가 생략할 수 있으므로 경고만 믿지 마세요. 카드 이동은 초안을 유지합니다. 자주 JSON을 내보내고 실제 다운로드 파일을 확인하세요. 다음 접속 시 ‘JSON 가져오기’로 복원합니다. Export 성공 문구는 다운로드 요청 상태이며 디스크 파일 확인을 대신하지 않습니다. 자동 업로드나 공식 승인 저장소는 없습니다.

## 카드마다 확인할 순서

1. Original — 원문을 먼저 읽습니다. 원문이 실제로 말하는 범위와 말하지 않는 것을 나눕니다.
2. 전체 원본 Record와 Source Proof를 엽니다. Record hash는 원문 내용의 식별값, Source version은 판본, CatalogKey는 자료 주소입니다. 값이 맞아도 해석이나 고객 사용 승인이 아닙니다.
3. 원래 의미와 전통적 상징·현대적 가설·실제 사실의 차이를 확인합니다.
4. Proposal — 모델의 조건부 제안을 원문과 비교합니다. 모델 제안을 승인 사실로 취급하지 않습니다.
5. 실제 Witness(계산 근거가 연결된 주소)를 확인합니다. Owner는 누구의 근거인지, Direction은 A→B/B→A, 기간은 어느 시점의 근거인지를 뜻합니다. Fixture의 근거를 실제 고객의 경험으로 바꾸지 않습니다.
6. 실제 사용자 조건을 확인합니다. 계약·지분·동의·직업 경험 등 미입력 사실을 만들지 않습니다.
7. 원래 반례와 금지 추론을 읽습니다. Required Ancestry는 이 자료가 의존하는 모든 원천의 제한입니다. 같은 단어만으로 근거를 합치지 않습니다.
8. Remaining Gates(아직 충족하지 못한 조건)를 읽습니다. Source를 기술적으로 찾았다고 의미·상품·고객 사용 Gate가 통과한 것은 아닙니다. 대운 traditionalRef 미확인 30회는 그대로 보류입니다.
9. 8개 확인 항목 ORIGINAL / SOURCE / MEANING / CONDITIONS / COUNTEREXAMPLES / PROHIBITIONS / SCOPE / REMAINING_GATES를 실제 읽은 뒤 체크하고 판정 초안을 선택합니다. 체크는 사람이 읽었다는 인증을 만들지 않습니다.
10. 메모에 근거 필드·판본·적용 조건·남은 질문·금지 이유를 적습니다. 불확실한 것을 승인으로 해결하지 않습니다.
11. JSON 내보내기를 누르고 다운로드 파일이 있는지 확인합니다. 선택한 판정에 필수 항목이 빠지면 내보내기가 차단됩니다.
12. 저장소 루트에서 독립 CLI 무결성 검사를 실행합니다.

```sh
node tools/semantic-domain-review-workbench/validate-review-draft.mjs /절대경로/review-draft.json
```

검사는 현재 원본·Packet·Scope와 대조합니다. 원본/판본이 바뀌면 임의로 JSON hash를 수정하지 말고 정확한 자료를 요청합니다. CLI 통과도 승인자 인증이나 고객 승인이 아닙니다. 가져오기는 전체 검증 후 적용하며 잘못된 JSON은 기존 초안을 부분 변경하지 않습니다. 합성 브라우저 테스트 초안은 실제 검토 파일로 쓰지 마세요.

## 판정 초안의 뜻

- UNSELECTED: 미선택.
- APPROVE_FOR_FURTHER_REVIEW: 후속 검토 진행 의견. 고객 사용 승인이 아닙니다.
- REJECT_APPLICATION: 이 상품·관계·조건의 적용 반려 의견.
- REQUEST_SOURCE: 정확한 원문·판본·위치 요청.
- REQUEST_PRODUCER: 실제 계산 생산자와 선택 조건 요청.
- REQUEST_CONTEXT: 필요한 실제 사용자 맥락 요청.
- REQUEST_MEANING_REVISION: 원문을 보존하고 모델 제안 수정 요청.
- REQUEST_POLICY_REVIEW: 원래 금지를 유지하고 별도 정책 검토 요청.
- KEEP_WITHHELD: 보류 유지.

## 읽을 순서

아래 순서는 검토 업무량을 정리한 제안입니다. 원래 고객 Rank·원문·Gate를 바꾸지 않습니다. 상세 이유는 first-wave-review-priority.json, 카드별 압축 자료는 first-wave-review-summary.json에서 확인합니다. 요약을 읽은 것만으로 원문 검토를 완료하지 마세요.

1. `lkr:material:CH08.P4:parent-consent-respect` — love_marriage_child / 개인 · `review-unit-v1:16113b812644bbaccbedaba0d56728a43edd2f262d9ce397b35a6222eabc8944`
2. `cwpr:material:CH08.P2:a-do-not-claim-authority` — saju_mbti_compatibility / coworker · `review-unit-v1:3a09a215d6292844220e662009d0ed0cd27f298c369a333dc580bc22747f2400`
3. `mrpr:relation:rr:combination:yukhap:巳申` — saju_mbti_compatibility / managerReport · `review-unit-v1:431a7dd96215f14384db9d0223c9ec6159bd81af7c399a9cb71015f2932456dc`
4. `pcpr:material:CH06.P2:ba-adult-boundary-informs-contact` — saju_mbti_compatibility / parentChild · `review-unit-v1:459a3a3dbc231af64f19c184387dca52bfed0be7daf90a7439b37e670e6942a4`
5. `frpr:direction:CH05.P1` — saju_mbti_compatibility / friendship · `review-unit-v1:546099cb92d114feb3abed80b1d90e979e39913e139c39d6191d43370e677a1f`
6. `mrpr:relation:rr:combination:hae:寅巳` — saju_mbti_compatibility / managerReport · `review-unit-v1:5e4c2fe0c9cf06aa434b7b0778aad0602b132d40edae63bc07d5eff90f3c5dae`
7. `bppr:relation:rr:combination:hae:寅巳` — saju_mbti_compatibility / businessPartner · `review-unit-v1:7e49413ef271e70f0cc3ab43744f20160f0e5445317ea4973c799eff33450e20`
8. `cwpr:material:CH08.P2:a-change-with-record` — saju_mbti_compatibility / coworker · `review-unit-v1:9349b850cda441b851a1d67911aef1048039ec21b5d3bf765dab4a833d0047d1`
9. `bppr:relation:rr:combination:yukhap:辰酉` — saju_mbti_compatibility / businessPartner · `review-unit-v1:a3a3921b97ea4748bc3cbf8ea59d8d7919b7b009690bf4892c135b445be2e878`
10. `cwpr:material:CH08.P3:b-state-integration-limit` — saju_mbti_compatibility / coworker · `review-unit-v1:afb46395b309ac2a5b1927d84353d5b4d4502bdc7f53896d3d6c75011b691702`
11. `pcpr:relation:rr:combination:chung:丑未` — saju_mbti_compatibility / parentChild · `review-unit-v1:b5b9cf261b5aa517b9ab47dce0ecb843c4cebe5d6d8b58ce61694faccdb71a0e`
12. `pcpr:material:CH03.P4:b-agreement-can-hide-unasked-view` — saju_mbti_compatibility / parentChild · `review-unit-v1:bd476818775f92259e906e1c23d5c41863f55d716e34d119ab6df087ff40fc5e`
13. `frpr:direction:CH05.P2` — saju_mbti_compatibility / friendship · `review-unit-v1:c689f40eeb08bd8c45d83c9a4d6320579e2d550d252d8078eb139979082f9ec8`
14. `bppr:relation:rr:combination:chung:丑未` — saju_mbti_compatibility / businessPartner · `review-unit-v1:cac1f17502779b695230161a17bdde9714667aba087b377eb830806a9ebd20e8`
15. `cmpr:relation:rr:combination:hae:寅巳` — saju_mbti_compatibility / marriage · `review-unit-v1:d8e73cd04aa3771a6c77552940ac9b45eac3102fced4bed5485bf414cce96dc5`
16. `frpr:direction:CH05.P3` — saju_mbti_compatibility / friendship · `review-unit-v1:e48e51851f8ee6ad275f5b31cb17400a31bbf895c7a713f7bfe8b46238def6c8`
17. `mrpr:relation:rr:combination:chung:丑未` — saju_mbti_compatibility / managerReport · `review-unit-v1:e70edf52191b009fab1482fe06e161056fd3fb2246d02a96a0d2d84aa60faefe`
18. `cmpr:relation:rr:combination:chung:丑未` — saju_mbti_compatibility / marriage · `review-unit-v1:fe3ca6f309282fa30c0b1277a5035775418226b3b46618b1264a7936b0273dfe`
19. `cmpr:relation:rr:combination:yukhap:巳申` — saju_mbti_compatibility / marriage · `review-unit-v1:ff5bf0f98d07ec27f4fda6b18c6529cb37f35f84a5da251e4da592277581d47f`
20. `clr:relation:rr:combination:hae:寅巳` — saju_mbti_compatibility / love · `review-unit-v1:449dc748b29d61562990b1d3bf3363854b75903a2e8a54a7f5e53053722a59c4`
21. `clr:relation:rr:combination:chung:丑未` — saju_mbti_compatibility / love · `review-unit-v1:4e74ac9fa221427fd9daa3ce0225bd60ec0ce803be25af9e1ecf728d146374d5`
22. `cpr:material:CH04.P3:firm-boundary-close` — saju_mbti_full / 개인 · `review-unit-v1:f414eea3d7da6f6f5f1a4949bba88ec732d97f0cef676c918805206a75932afa`
23. `lkr:material:CH01.P1:shared-meaning` — love_marriage_child / 개인 · `review-unit-v1:6fb89263ce5aa9a307d3c4a07f239f5bf1b4f5ba9580513ce355373983f20625`
24. `cpr:material:CH04.P2:private-criteria` — saju_mbti_full / 개인 · `review-unit-v1:919a3b43cc1c6e772d3b28080628cdac715284178b547d744f180f4465d50856`
25. `cpr:material:CH10.P3:romance-as-problem-set` — saju_mbti_full / 개인 · `review-unit-v1:aee379e4082b818dfb42ec7906d9204c9bf4b425c19745459c88e0cfe32355a9`
26. `lkr:material:CH02.P3:new-experience-design` — love_marriage_child / 개인 · `review-unit-v1:ba09ae15fbce32dd35c706607bd987416b3d2664c2606aa88846766740f6338e`
27. `clr:material:CH05.P4:ab-offer-not-reservation` — saju_mbti_compatibility / love · `review-unit-v1:c3dd46879f874810f1034bb06230e4a7559448eab2f26ca20fa8f49a698d611e`
28. `afpr:annual-god:비견` — annual_fortune / 개인 · `review-unit-v1:5993b08182efc78df3dd9bd976e7ab85c58444220e40e9f08422ce213e646785`
29. `lkr:material:CH08.P4:parent-consent-respect` — love_marriage_child / 개인 · `review-unit-v1:5ac48e6169d0fa0914c14e3748447872e45d17307c9c6802adf52a6db12afcfa`
30. `afpr:annual-god:겁재` — annual_fortune / 개인 · `review-unit-v1:bbad7836b4a303f2d9dfc68f1d69142edfe0c96336d9e6e68e8f7fa20439bed6`
31. `ckr:material:CH01.P1:capacity-entry` — career_money_study / 개인 · `review-unit-v1:26bc543d779c926a91bdd35019d6437aa65a7f674be5a7988a97eb3b01599cb6`
32. `ckr:material:CH01.P1:draft-as-question` — career_money_study / 개인 · `review-unit-v1:85c43ec8805b90d79e0c3c10e168f1b4a82c1ef7bd80f8052abb810a16b1172c`
33. `ckr:material:CH08.P1:held-munchang-exam` — career_money_study / 개인 · `review-unit-v1:04ff78e189998bf73cbdbe78eb8cc745bfdd1180b12c62ed71ccecf063434eb1`
34. `afpr:case-study:canonical-help` — annual_fortune / 개인 · `review-unit-v1:e052b32db11df0eaf51eec4bdb294b8db34009c9bc6b6927374419f28ee1bed2`
35. `mfpr:god:편재` — major_fortune / 개인 · `review-unit-v1:14f117b796f0276b39f4a7f16bb95db9f7cd0bcb097ec661f1fe24c47bcfa895`
36. `mfpr:god:편인` — major_fortune / 개인 · `review-unit-v1:27ffd5b0576085ca6e0bace7a984e8afe0ef404872cf7ec92b7947091ad90ecc`
37. `mfpr:god:편관` — major_fortune / 개인 · `review-unit-v1:a7a734c1d533c29e541b60a61bd6d9ce07c642004364b4cf4ad502ffeefe6fe3`

## 후속 공식 승인과의 경계

검토 초안은 KnowledgeBindingApprovalRecord가 아닙니다. NO_APPROVALS를 유지합니다. 승인자 인증·권한·정확한 의미/범위·원문/Graph 판본·유효기간/철회·별도 고객 승인은 후속 작업에서 검증해야 합니다. 이 도구는 승인 Provider, Global Planner, Korean Editorial Engine, 고객 Runtime을 구현하거나 연결하지 않습니다.
