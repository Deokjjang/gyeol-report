# Source Verification 인수 계약

이 overlay는 원본 참조의 기술적 확인 결과다. 실제 개인 Evidence, 후보 생성, Binder, 고객 해석 승인을 제공하지 않는다.

## 입력과 안정적 연결

기준은 `51420fdebd4af81b503128a64f2c5c4d5beb3714`의 카탈로그와 원본 파일이다. 기존 59개 생성 JSON은 변경하지 않았다. 기존 원본 locator의 sourceVersion도 보존한다.

`source-verification-overlay.json`의 `originalCatalogKey`, `originalField`, `originalEdgeOrdinal`로 원래 unresolved occurrence를 찾는다. `referenceKey`는 원래 from/field/kind/target/reason/ordinal의 canonical JSON hash다. 같은 참조를 반복한 occurrence도 다른 키를 가진다. `receiptReference`는 `source-verification-receipts.json#/배열인덱스` 형식이다. 원본 target은 receipt에 그대로 남는다.

`EXACT_SOURCE_VERIFIED`, `UNIQUE_ALIAS_VERIFIED`, `FRAGMENT_VERIFIED`, `AUDIT_AND_ORIGINAL_VERIFIED`만 기술적 복구로 센다. `verificationStrength=DECLARATION_ONLY`는 타입·함수·파일 선언의 존재 확인이며, 계산된 사실이 아니다. `DOCUMENTARY_REFERENCE_ONLY`와 `FUTURE_REQUIREMENT_ONLY`는 복구 수에 포함하지 않는다.

## 후속 사용의 필수 gate

각 receipt의 13개 `sourceReviewState`를 독립적으로 검사한다. 참조 해결 PASS만으로 다른 차원을 승인하면 안 된다. 모든 receipt는 `customerApproved=false`, `establishesPersonalEvidence=false`, `needsHumanReview=true`다.

1. 원본 의미·전통 문헌·MBTI sourceCoverage의 검토 상태 확인. direct/inferred는 원천 편집 상태이며 개인에 대한 실증 상태가 아니다.
2. 원본 source kind와 실제 producer/계산 결과의 구분.
3. 모든 ancestor domain 및 상품·관계 유형의 명시적 허용 여부 확인. 현재 businessPartner의 WORK/CAREER/THINKING/MONEY/INVESTMENT 차단을 확장하지 않는다.
4. 실제 인물·방향·원국/기간 layer·적용 시간·교운 전후 범위 확인. 정의가 존재한다고 실제 고객의 특징이나 사건을 생성하면 안 된다.
5. 입력되지 않은 계약·지분·직무 권한·연애 상태 등 고객 사실의 공급 여부 확인.
6. Fusion의 원국·MBTI 양쪽 원천, 같은 owner, hash와 사용 조건 확인. Fusion 연구는 새로운 독립 사실이 아니다.
7. source group의 AND를 모두 충족. 조건별 displayed group을 서로 합치지 않는다. 불명확한 group은 보류한다.
8. 같은 fact root를 독립 근거로 중복 집계하지 않는다.
9. 명시적 고객 사용 승인 이후에만 실제 Binding을 별도 작업으로 검토한다.

## Queue 사용

`domain-review-queue.json`은 2,966개 원본 domain을 보존한다. 직접 unresolved overlap은 0이지만 원본 REFERENCES/REQUIRES/REUSES_SOURCE와 검증된 연결을 따라가면 482개 domain에서 1,835개 occurrence 의존 링크가 나온다. 그중 331개는 미해결 출처에 의존한다. 각 링크는 occurrence별이며 독립 사실 수가 아니다.

A~F 분류는 겹칠 수 있다. A 331, B 의미 검토 2,966, C 상품 정책 검토 2,145, D 기존 정책 금지 464, E 명시적 unsupported producer 일치 0, F 명시적 승인된 mapping 0이다. E/F가 0이어도 producer나 의미 대응이 승인된 것은 아니다. 강점 축과 양극 축, wealth와 RESOURCE_SENSE 등의 대응을 자동 생성하지 않는다.

위험도는 현재 Production 영향이 아니라 향후 잘못 연결될 가능성과 원래 catalog 종류·실제 역방향 참조 의존성에 따른 우선순위다. CRITICAL 733, HIGH 3,522, MEDIUM 1,994, LOW 241. HIGH/CRITICAL 4,255건 모두 후속 gate가 남아 있으며, 이 중 기술적으로 미복구인 항목은 2,465건이다.

8개 오용 사례는 `binding-safety-contract.json` 및 신규 unit fixture에 있다. 이는 입력 식별 정보와 후속 gate 검증이며 실제 Binder 구현이 아니다.

## 실행과 재현

```sh
node scripts/knowledge-source-verification/verify.mjs
node scripts/knowledge-source-verification/verify.mjs /tmp/gyeol-source-verification-repeat
```

고정된 저장소 입력만 읽는다. 기존 SourceReader/ReferenceResolver와 hash/serialization을 재사용한다. 기존 compile CLI는 import만으로 실행되므로 검증 CLI의 작은 TypeScript loader만 별도로 둔다. 로드는 frozen hash가 일치하는 기존 저장소 모듈 및 신규 검증 모듈로 제한한다. fetch와 Node HTTP(S)는 차단된다. 고객 API에서 실행하지 않는다.

20개 검증 JSON에 실행 시각을 넣지 않는다. 현재 시각은 시스템 임시 폴더의 `gyeol-source-verification-run-PID.json`에만 기록된다. 원본 파일 변경 시 CLI는 실패한다. 원본 자료 변경을 승인하는 도구가 아니다.

후속 출처 내용·의미·domain 검토의 입력 준비만 완료했다. Evidence Graph, Binder, Global Planner, 한국어 표현 연결, 고객 생성기 변경은 시작하지 않았다.
