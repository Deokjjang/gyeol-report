# Book 및 발행 경계 검증

- 대표 A~H: 신규 궁합 편집본, 각 21페이지 / 9개 본문 챕터 / 36개 문단.
- 앞 목차 9개, 상세 목차 문단 앵커 36개. 실제 `BookReader` SSR에서 모든 본문과 문단 ID를 확인했다.
- 모든 목차 대상은 실제 페이지 ID 또는 앵커를 가리킨다. 새 챕터를 독립 단위로 유지하여 짧은 페이지 병합으로 제목이나 앵커를 잃지 않는다.
- 기존 pair.directions의 두 링크는 실제 CH05 `chapter-direction-ab`, CH06 `chapter-direction-ba`로 재배치된다. 주체/대상/받는 십성은 기존 데이터와 같다.
- 기존 지수 페이지의 점수·항목·판정·주의 안내는 기존 compatibilityIndex를 그대로 투영한다. 새 점수 계산은 없다.
- 신규 JSON snapshot roundtrip 후 직접 열람/공유 열람의 Book 데이터가 동일하다. 공유 주소와 토큰 생성·검증 코드는 변경하지 않았다.
- `tests/fixtures/completed-report/compatibility-editorial-base.json`은 8410716에서 캡처한 합성 고객 저장본이다. 구형 snapshot 재열람과 기준 Book digest를 검증했다. 고객 저장본을 신규 편집기로 재생성하지 않는다.
- 새 편집본은 `compatibility-editorial-release-01-v1`로 명시된다. 저장된 publishedEdition과 readerEdition.version이 같을 때에만 새 목차/문단 메타데이터를 적용한다.
- 원고 안전 오류를 주입한 생성 테스트에서 기존 `compatibility-product-13d-7b-v1`로 복귀하고 기존 유료 publication gate를 통과했다. 밀도 진단만 주입한 경우 신규 편집본을 차단하지 않는다.
- 다른 5상품은 8410716의 원고·evidence·Book 세 digest와 같음을 검증했다. 연애 테스트의 이전 궁합 출력 잠금은 구형 저장본 재열람 잠금으로 보존했다.
- V3 궁합 snapshot→SSR 및 기존 유료 결과 route 테스트가 통과했다. owner·90일·저장본·공유 권한 구현은 수정하지 않았다.

명리 계산, compatibilityIndex, symmetric relations, 양방향 계산, MBTI 원본, Fusion/Claim/Resonance 판정, 결제·환불·Worker·DB·권한·90일·공유 토큰 구현을 변경하지 않았다. 가격 1,490원, 유료 묶음 OFF, 무료 이벤트 SCHEDULED의 소스도 수정하지 않았다. Production 상태를 바꾸거나 실결제로 검증하지 않았다.
