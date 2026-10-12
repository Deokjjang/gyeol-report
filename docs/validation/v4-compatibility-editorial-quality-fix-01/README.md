# V4-COMPATIBILITY-EDITORIAL-QUALITY-FIX-01

평가 시각: **2026-10-12 12:00 KST**. 기준: `c048218cc5961e0f53a1deab2603511e17559fc3`, `v4/annual-editorial-quality-fix-01`.
독립 worktree `/tmp/gyeol-compatibility-editorial-quality-fix-01`, 작업 브랜치 `v4/compatibility-editorial-quality-fix-01`.

**판정: PARTIAL / 배포 불가.** 궁합 원고의 누락·조합 오류와 방향별 설명을 개선했다. 대상 회귀에서 신규 실패는 없다. 기존 Page export build 오류, 기존 테스트 실패, 부록의 개별 십이운성 설명 부족은 남아 있다. 자동 테스트를 판매 품질의 최종 승인으로 간주하지 않는다.

## 재현 경로와 보관 자료

`generateV4ShadowReport`의 오프라인 실행 → 기존 명리 계산·MBTI DB·Fusion·후보 선택 → `buildV4CompatibilityProduct`의 실제 출판 원고 → `projectBook`을 사용했다. 이 경로는 유료 발행에서 사용하는 V4 생성 함수를 재사용한다. 모든 실행의 `externalCalls`는 빈 배열이다. 결제, DB 저장, 공개 게이트 변경은 하지 않았다.

- [수정 전 A 전체 원고](A-before.txt), [수정 전 전체 Book](A-before.book.json), [수정 후 전체 Book](A-after.book.json).
- [전체 사례의 구조·글자 수·반복 횟수](metrics.json), [실제 입력·근거 ID·점수·만세력·원본 capture 해시](evidence-checks.json).
- 아래 각 사례 링크에는 제목을 포함한 **9장 전체 본문**을 생략 없이 보관했다. Book JSON의 원고와 문장이 같다.
- 전체 생성 패킷과 수정 전후 다른 5상품의 원고·Book은 `/tmp/gyeol-compatibility-quality-validation/{before,after}/`에 별도 보관했다. 대용량 패킷은 Git에 넣지 않았다.
- 입력과 기준 커밋의 계산/본문/Book 해시는 `tests/unit/interpretation-v4/compatibilityQualityFixtures.json`에 고정했다. 새 결과로 기준 해시를 갱신하지 않았다.

## 35/36문단의 원인과 수정

정식 계약은 CH01~CH09, 각 P1~P4, **9장·36문단**이다. 수정 전 A는 생성기부터 `[4,4,4,4,4,4,4,4,3]`으로 나왔다. Book에도 똑같이 35문단이 들어갔다. 화면 투영이나 추출 누락이 아니다. 빠진 문단은 **CH09.P1**이다.

`compatibilityReleaseRenderer.ts`의 이전 CH09.P1은 `compatibilityCharacter`의 `strength`를 명사구로 취급했다. 실제 재료는 다음처럼 이미 끝난 문장이었다.

> 스스로 일을 시작하고 사람들에게 방향을 보여주는 개척력이 큽니다.
>
> 상황에 맞춰 말과 행동을 바꾸며 사람의 관심을 잇습니다.

이를 `${A}에게는 ${particle(a.strength, "이", "가")} 있고…` 형태에 넣자 한 슬롯이 여러 문장으로 인식됐다. `add`의 한 슬롯 한 문장 검사에서 `INSUFFICIENT_DISTINCT_MATERIAL`로 문단 전체가 탈락했다. 기존 발행 판정은 이 품질 진단을 hard error로 취급하지 않아 실제 35문단도 발행됐다. 발행 게이트 자체는 변경하지 않았다.

수정은 완성 문장 재료를 해당 슬롯에서 제거하고, 실제 signed axis가 허용하는 **명사구 facet**을 사용한다. CH09.P1은 각자의 기여를 장기적인 의무로 굳히지 않는 역할을 담당한다.

> 이준혁님의 불편을 알아채고 손을 보태는 세심함은 먼저 보탤 수 있는 몫이며, 매번 책임져야 할 의무는 아닙니다.

MBTI 미상 시 빠지던 CH01.P3도 추측한 유형 대신 직접 반응을 확인하는 4문장으로 채웠다. 제목은 `유형을 모를 때 확인할 두 사람의 반응`이다. 기존 장·문단 ID와 Book 투영 계약을 유지한다.

## 문장과 반복 개선

완성 문자열 사후 치환이나 입력 해시로 문구를 고르는 방법을 쓰지 않았다. 관계 질문별 재료, 출처, 문장/명사구의 조합을 수정했다. 명시적 A/B 제목 토큰과 기존 조사 유틸리티를 유지하고, 따옴표 안 명사구에는 `withKoreanParticle`을 사용한다.

| 실제 수정 전 | 실제 수정 후 |
|---|---|
| `재미가 생깁니다라는 장면에 두 사람의 다른 기여를 놓아볼 수 있습니다.` | `각자 좋아했던 장소를 하나씩 소개하면, 상대가 보는 세상을 함께 걸어보는 재미가 생깁니다.` 뒤에 두 사람의 실제 기여를 별도 문장으로 연결 |
| `같은 겁재이라도 이번에는…` | `같은 십성의 자극도 그 사람에게 맞는 속도로 건넬 수 있습니다.` — 양쪽 십성이 실제로 같을 때만 이 표현 사용 |
| `이준혁님은 내게 익숙한 방식으로…` | `이준혁님 쪽에서는 스스로 판단한 뒤 선택을 알리는 방식에 무게가 실립니다.` — 주체와 실제 일간 근거 연결 |
| `검증된 오행 보완이 없을 때에는 … 설명을 만들지 않습니다.` | `이준혁님 쪽의 스스로 판단한 뒤 선택을 알리는 방식과 정유진님 쪽의 상대가 빠뜨린 작은 필요를 챙기는 방식을 같은 선택의 서로 다른 단계에 놓아볼 수 있습니다.` |

A의 해석 본문에서만 센 정확한 부분 문자열 횟수:

| 표현 | 전 | 후 |
|---|---:|---:|
| 내게 익숙한 방식으로 | 10 | 0 |
| 다음 만남의 시간과 장소를 고르는 날 | 8 | 0 |
| 바뀌는 이유를 미리 알 수 있는 약속 | 6 | 5 |
| 내 방식도 존중받는 대화 | 6 | 0 |
| 각자의 장점을 나눠 쓸 여지 | 3 | 0 |

여행 중 쉬는 때 조율(CH01), 연락 가능한 시간(CH02), 취미 제안(CH04), 갑작스러운 일정 변경(CH05~06), 답장 갈등(CH07), 다툼 뒤 재확인(CH08), 익숙해진 관계(CH09)를 나눴다. 양방향은 같은 상황의 서로 다른 수신자를 비교한다.

**의미 반복을 모두 제거했다고 판정하지 않는다.** 이름을 A/B 역할로 정규화한 A/B 원고는 36문단 중 5문단이 정확히 같고, 144문장 중 79문장이 공통이다. 수정 전은 35/36문단 중 2문단, 140/145문장 중 73문장이 공통이었다. 문구 제거와 정보 개선이 전체 고객 간 중복률 감소를 뜻하지 않는다. 같은 토 기운/안정성 및 경계 조건에 근거한 CH02.P2·CH04.P4·CH09.P3, 공통 회복 원칙 CH08.P1·P4가 남는다. E는 두 사람에게 실제 선택된 안정성 조건이 같아 위 약속 표현이 10회다. 이 한계를 숨기거나 없는 차이를 만들어내지 않았다. 정상 사례의 핵심 성향·장점·취약점·두 방향은 이름을 제거한 뒤에도 달라지는지 테스트한다.

## 실제 명리·MBTI·Fusion 및 방향성

원국 계산, 개인 근거, 방향 데이터, 점수는 기준 커밋과 해시가 같다. 선택은 기존 `primaryEligible`, `invalidReasons`, 의미 있는 원국 atom과 axis의 부호를 따른다. 천간 십성과 지장간 십성의 표시 위치를 구분한다. 신규 근거나 관계는 계산하지 않는다.

| 문단/해석 | 실제 근거 |
|---|---|
| A의 자율적 결정 | `natal:day:stem:甲` / ESTP `mbti:ESTP:traits:love:freedom_in_love:plainKo` |
| B의 필요를 챙기는 성향 | `natal:day:stem:乙` / ISFJ `mbti:ISFJ:traits:love:devoted_partner:plainKo` |
| A의 강점: 표현과 상대 반응의 결합 | `foundation:yin_yang:STRONG_YANG`, `mbti:ESTP:traits:relationships:intent_reader:plainKo`, `fusion:COMPLEMENT:C050:social:EXPRESSION:1:SOCIAL_ATTUNEMENT:1` |
| B의 강점: 조심스러운 말과 배려 | `foundation:yin_yang:EXTREME_YIN`, `mbti:ISFJ:traits:communication:careful_word_choice:plainKo`, `fusion:COMPLEMENT:C055:social:COMMUNICATION_STYLE:-1:CARE:1` |
| CH01 육합 | `six_harmony:29a2534854378270a988c1f8:month:申\|b425792e04d53877ee951f97:day:巳` |
| CH07 해 | `harm:29a2534854378270a988c1f8:day:寅\|b425792e04d53877ee951f97:day:巳` |
| A→B | `29a2534854378270a988c1f8:to:b425792e04d53877ee951f97`, 받는 B의 乙에서 주는 A의 甲을 읽은 겁재 |
| B→A | `b425792e04d53877ee951f97:to:29a2534854378270a988c1f8`, 받는 A의 甲에서 주는 B의 乙을 읽은 겁재 |

수정 전 두 방향은 모두 “같이 도전하고 싶은 마음”과 같은 만남 장면 중심이었다. 수정 후 십성의 뜻 자체는 보존하되, A→B는 **A의 독립적 판단 → B의 거절할 선**, B→A는 **B의 세심한 챙김 → A의 변경 이유/선택권**을 설명한다.

> A→B: 정유진님의 일간 乙 기준에서 이준혁님의 일간 甲에 해당하는 십성은 겁재입니다. … 정유진님에게 중요한 무리한 몫을 거절할 수 있는 선을 함께 지켜야 이 자극이 선택 가능한 제안으로 도착합니다.
>
> B→A: 이준혁님의 일간 甲 기준에서 정유진님의 일간 乙에 해당하는 십성은 겁재입니다. … 이준혁님이 필요로 하는 바뀌는 이유를 미리 알 수 있는 약속을 먼저 살피면, 같은 십성의 자극도 그 사람에게 맞는 속도로 건넬 수 있습니다.

B 사례는 辛이 乙을 받는 **편재**, 乙이 辛을 받는 **편관**이다. 이 경우 “같은 십성”이라고 쓰지 않는다. C의 인물 교환은 canonical 두 방향을 뒤집고 점수/불변 근거는 유지한다. MBTI 선호는 해당 원천 node의 실제 axis에서 풀어 쓰며 영문 유형 글자만으로 성향을 추정하지 않는다. 기존 pair MBTI 비교 데이터도 보존한다. Fusion 문장은 실제 명리 atom과 MBTI node를 모두 기록한다. 상세 sentence proof는 `evidence-checks.json`에 있다.

육합·해는 일어난 사건이나 관계의 결말이 아니라 활용 조건으로 설명한다. 천을귀인은 A의 확인된 개인 기운이며, 상대가 반드시 귀인이라는 뜻으로 확대하지 않는다. 모든 생활 장면은 “한다면/때/볼 수 있다” 형식이다.

## 실제 전체 원고 독해와 구조

각 원고의 CH01~CH09, P1~P4를 순서대로 읽었다. A/B는 전체 본문을 독해하고, 다른 사례는 이미 읽은 동일 문장을 대조하면서 모든 변경 문장을 해당 문단 맥락에서 읽었다. 정규식 검사만으로 판정하지 않았다. 아래 길이는 제목/표/표지/부록을 제외한 36문단을 `\n`으로 연결한 공백 포함 글자 수다.

| 사례 | 전 문단 | 후 문단 | 후 글자 수 | 독해 확인 |
|---|---:|---:|---:|---|
| [A: 이준혁·정유진 연애](manuscripts/A.txt) | 35 | 36 | 9,823 | 두 일간·육합·해·양방향·개인 Fusion 설명 일치 |
| [B: 김태오·박소민 연애](manuscripts/B.txt) | 36 | 36 | 9,617 | 을목/신금, 편재/편관, CARE/PRECISION 및 다른 Fusion 반영 |
| [C: A/B 교환](manuscripts/C.txt) | 35 | 36 | 9,822 | 원래 사람의 성향 유지, 수신자 및 두 방향 교환 |
| [D: 양쪽 시간 미상](manuscripts/D.txt) | 35 | 36 | 9,743 | 시주 근거 미사용, 확인된 원국으로만 설명 |
| [E: 양쪽 MBTI 미상](manuscripts/E.txt) | 34 | 36 | 9,860 | 유형/MBTI node/Fusion 추측 없음, 실제 반응 확인 문단 |
| [F: 시간·MBTI 미상](manuscripts/F.txt) | 34 | 36 | 9,693 | 시주·유형 근거 생성 없음, 명리와 일반 조건 안내 구분 |
| [결혼](manuscripts/marriage.txt) | 35 | 36 | 9,865 | 살림·양가 행사·공동 지출·기억/계획 수고·분담 재협의 |
| [부모·자녀](manuscripts/parentChild.txt) | 35 | 36 | 9,791 | 안전/선택, 자녀가 부모 감정을 책임지지 않음, 보호 책임 유지 |
| [직장 동료](manuscripts/coworker.txt) | 35 | 36 | 9,883 | 인수인계·초안·검토 시간·결과물/능력 평가 구분 |
| [상사·팀원](manuscripts/managerReport.txt) | 35 | 36 | 9,844 | 권한·보고 기준·재작업·상사의 최종 판단 책임 |
| [사업 파트너](manuscripts/businessPartner.txt) | 35 | 36 | 9,888 | 조건 변경·비용/납기·손실·동의·중단 조건 기록 |
| [친구·인간관계](manuscripts/friendship.txt) | 35 | 36 | 9,854 | 공연 취향·거리·거절 가능한 모임·달라진 생활 반경 |

비연애 유형에는 데이트·스킨십·연애·배우자 표현이 없다. 기존 A~H와 동일 입력/동일 MBTI/근접 입력/한쪽 MBTI 미상/특수 이름도 기존 회귀 테스트로 확인했다. 동일 인물이라고 차이를 지어내지 않고 실제 같은 근거는 같게 남긴다.

장별 역할은 관계의 핵심 → A의 개인적 성향/필요/강점/취약점 → B의 개인적 성향/필요/강점/취약점 → 공통점/기여 → 양방향 자극/좋은 영향/부담/예방 → 갈등의 차이/해/확대 고리 → 발생 뒤 확인/각자 회복/공동 약속 → 장기 자원/좋은 패/변화/마무리 순이다. CH08은 CH05/06의 사전 조정 문구를 그대로 복제하지 않고 이미 생긴 오해를 확인하는 행동을 배정한다.

## 지수·77개 부록·각주

지수는 **54/100 = 15/30 + 19/35 + 13/25 + 7/10**으로 계산 데이터와 실제 BookReader 표시가 일치한다. 기존 오락적 지수/결정 수단이 아니라는 안내를 보존했다. 본문의 육합과 해, 양방향 겁재, MBTI 차이는 점수의 기존 근거와 모순되지 않는다. 좋은 연결 한 개를 관계 전체의 성공으로 확대하지 않는다.

부록 77개는 수정 전후 **전체 item 데이터까지 동일**하다. 소유자별 `(group,name)` 중복은 없다. 원국에서 반복되는 동일 지장간/십이운성 명칭은 기존 계약대로 인물별 1개 설명으로 합쳐지고 위치는 만세력에 남는다.

| 그룹 | 이준혁 | 정유진 |
|---|---:|---:|
| 신살·귀인 | 12 | 6 |
| 십성 | 10 | 8 |
| 십이운성 | 4 | 4 |
| 오행·음양 | 6 | 6 |
| 일간·일주 | 2 | 2 |
| 지장간 | 9 | 8 |
| 합계 | **43** | **34** |

만세력의 천간/지지·십성 표와 대응을 대조했다. 예를 들어 A의 甲 일간에서 戊 편재/乙 겁재/癸 정인, B의 乙 일간에서 己 편재/丁 식신/乙 비견이다. 부록의 모든 지장간·십이운성 집합은 각자의 canonical 표 집합과 같다. feature 목록은 기존 confirmed/calculated 또는 derived-but-supported 판정을 통과한 재료, 확인된 오행/음양에서 생성된다. 보류 기운과 원국 안 관계의 표시 필터는 변경하지 않았다.

**부록 설명 PARTIAL:** A의 건록·묘·쇠·절, B의 목욕·쇠·양·절은 정확히 있지만 개별 뜻은 없다. `bookProjection.ts:73`의 공통 의미만 저장하고 `BookPages.tsx`의 부록은 이를 머리말로 모은다. 실제 화면에서도 각 단계 이름 아래 개별 설명이 비어 있다. 이를 해결하려면 공유 Book 부록 표시 범위의 별도 작업이 필요하므로 이번에 확장하지 않았다.

각주는 A의 CH09.P2에 `1`/`각주 1 천을귀인`, 장 끝의 같은 번호/정의, 실제 클릭 시 `천을귀인` 상세창의 같은 정의를 확인했다. 실제 생성 데이터로 기존 `BookReader`와 `DetailSheet`를 실행하는 **로컬 검수용 wrapper**로 확인했으며 Production 인증/결제 페이지를 검증했다고 주장하지 않는다. 모든 77개 항목에 본문 각주가 있다는 뜻도 아니다. 이번 원고의 원국 atom은 sentence proof로 연결되며 부록 전 항목 각주 기능을 새로 만들지 않았다.

## 검증과 보호

| 검증 | 기준 커밋 | 수정 후 |
|---|---|---|
| 기존 궁합 5개 suite | 102 PASS / 2 FAIL | 동일 suite 102 PASS / 동일 2 FAIL |
| 새 실제 생성/근거/Book/다른 상품 회귀 | 없음 | **18/18 PASS** |
| 합계 궁합 6개 suite | 104 tests | **120 PASS / 2 기존 FAIL (122)** |
| 전체 원고 capture | 17/17 | **17/17** |
| Book public flow + 방향성 + Annual preflight | 73 PASS / 1 FAIL | **73 PASS / 동일 1 FAIL** |
| Book reading 13b, hook timeout 120s | 13 PASS / 3 FAIL | **13 PASS / 동일 3 FAIL** |
| lint | PASS | **PASS** |
| webpack build | Page export FAIL | **Page export FAIL** |
| TypeScript noEmit | 391 (소스 389 + Next 생성 타입 2) | **390 (소스 389 + Next 생성 타입 1)** |
| diff-check | — | PASS |

기존 실패는 그대로 보고한다.

1. `compatibilityRelease.test.ts`: 대운·세운의 본문/근거/Book을 오래된 `8410716`에 고정한 2개 테스트. 기준 `c048218`에서도 실패한다. 해당 옛 해시와 테스트는 바꾸지 않았다. 새 회귀는 실제 `c048218`의 5상품 전체 본문/근거/Book 해시로 보호하며 모두 일치한다.
2. `bookAnnualPreflight.test.ts`: 주문 응답 400 예상/403 실제. 수정 전후 같다.
3. `bookReading13b.test.tsx`: career/love/compatibility의 앞·뒤 목차 동등성 3개 실패. 수정 전후 같은 테스트가 실패한다. 기본 10초 beforeAll은 양쪽에서 timeout이어서 로직 수정 없이 CLI의 `--hookTimeout=120000`으로 실제 16개를 끝까지 실행했다.
4. build: `src/app/report/new/page.tsx`의 기존 `getAsiaSeoulCurrentYear`/`getAnnualFortuneYearOptions` export가 Next Page 계약에 어긋난다. 기준과 수정 후 webpack 컴파일은 통과하고 TypeScript 단계에서 실패한다. 이 두 export 모두 기준 커밋에 존재한다. NFT 단계에 도달하지 않아 NFT 경고 수를 판정할 수 없다. 기본 Turbopack은 독립 worktree 밖을 가리키는 node_modules symlink를 거부하므로 동일 비교는 `npm run build -- --webpack`으로 실행했다.
5. TypeScript는 생성된 `.next/dev/types` 파일의 유무 때문에 총수가 1개 다르다. `.next/`를 제외한 **389개 진단의 경로/위치/내용 집합은 전후 완전히 같다. 신규 소스·테스트 진단 0개**다.

새 테스트는 실제 paid generator, 원국/개인/방향/점수 해시, 실제 atom/node/Fusion/relation ID 존재, 9×4 구조, 원문 Book 투영, 7유형, 미상, 특수 이름, 이름을 제거한 핵심 해석 차이, 결정론성, 각주 SSR, 기존 저장 Book 재열람을 검증한다. 제목만 변경하던 과거 whole-output 잠금은 새 본문을 의도적으로 허용하도록 바꿨으나, 제목 잠금·canonical 해시·과거 저장 Book 파일은 보존했다.

명리 엔진·궁합/점수 계산·MBTI DB·Fusion 계산·기존 근거 ID·V4 공개 게이트·다른 5상품·결제/환불·DB/migration·환경변수·기존 구매자 Book은 수정하지 않았다. 다른 상품 브랜치 병합, master push/merge, Production 배포도 하지 않았다. 원래 저장소의 branch/HEAD/status 및 보호 파일은 작업 전후 해시로 대조한다.

원래 저장소의 추적/보호 파일 **1,857개 해시가 모두 동일**하고, branch/HEAD/status도 시작 시점과 같다. 보호 대상 11개 미커밋 파일은 수정·스테이징하지 않았다. [보존 확인 결과](git-preserved.json).

재실행 명령(작업 worktree에서):

```sh
npx vitest run tests/unit/interpretation-v4/compatibilityRelease.test.ts tests/unit/interpretation-v4/compatibilityTitleSafety.test.ts tests/unit/interpretation-v4/compatibilityNarrative.test.ts tests/unit/interpretation-v4/compatibilitySafety.test.ts tests/unit/interpretation-v4/compatibilityDiscovery.test.ts tests/unit/interpretation-v4/compatibilityQuality.test.tsx
npx vitest run tests/unit/app/bookPublicFlow.test.tsx tests/unit/report-generation/compatibilityDirectionality.test.tsx tests/unit/api/bookAnnualPreflight.test.ts
npx vitest run tests/unit/app/dev/bookReading13b.test.tsx --hookTimeout=120000
npm run lint
npm run build -- --webpack
npx tsc --noEmit --incremental false
git diff --check
```

로그는 `/tmp/gyeol-compatibility-quality-validation/`의 `tests-final3.log`, `quality-final2.log`, `book-tests-{before,after}.log`, `book-reading-{before-extended,final}.log`, `lint-handoff.log`, `build-final-webpack.log`, `ts-{before,final2}.log`에 보관했다.

## 최종 항목

| 항목 | 결과 |
|---|---|
| STRUCTURE / 9_CHAPTERS / PARAGRAPH_CONTRACT | PASS — CH01~09, 각 4문단, 12개 실제 사례 전부 36 |
| MYEONGLI_EVIDENCE / MBTI_EVIDENCE / FUSION_QUALITY / PAIR_EVIDENCE | PASS — 실제 근거와 출처 확인, 계산 불변 |
| A_TO_B / B_TO_A | PASS — 수신자 기준 십성 및 각자의 성향/부담/조정 구분 |
| SEVEN_RELATIONSHIP_CATEGORIES | PASS — 전체 생성·문단 대조 독해·역할 확인 |
| CROSS_PERSON_DIFFERENTIATION | PASS (검증한 핵심 구간) — 이름 제거 후에도 다른 실제 해석 |
| SEMANTIC_REPETITION | PARTIAL — 주요 공통 추상 문구 제거, 정확히 같은 5문단 및 미상 반복 남음 |
| FALLBACK_QUALITY | PASS (검증 사례) — 새 edition 정상, 미상은 근거 없이 유형을 채우지 않음 |
| INTERNAL_TEXT_LEAKAGE / KOREAN_READABILITY | PASS (검증 사례) — 내부 규칙 직접 노출과 조합 오류 제거 |
| COMPATIBILITY_SCORE | PASS — 기존 54 및 4개 소계 보존 |
| APPENDIX_77 | PARTIAL — 77개 대응·소유자·각주 정상, 개별 십이운성 뜻 부족 |
| NARRATIVE_LENGTH | PASS — 9,617~9,888자, 분량만으로 품질 승인하지 않음 |
| UNKNOWN_INPUT_SAFETY / DETERMINISTIC_GENERATION | PASS |
| BOOK_PRESERVATION / CROSS_PRODUCT_REGRESSION | PASS — 오프라인 발행·기존 snapshot 재열람·5상품 전체 해시 확인 |
| TESTS | 신규 실패 0, 기존 실패 6개 별도 기록 |
| LINT_BUILD | lint PASS / build FAIL (기존 Page export) |
| BRANCH | `v4/compatibility-editorial-quality-fix-01` |
| COMMIT_SHA / REMOTE_SHA_MATCH | 최종 Git handoff에서 확정 SHA 및 원격 일치 결과 보고 |
| REMAINING_ISSUES | build/기존 테스트·타입 부채, 개별 십이운성 설명, 공통 원칙과 미상 반복 |
| RELEASE_QUALITY | **PARTIAL — 원고 개선 완료, 판매 최종 승인·배포 가능 선언 보류** |

다른 상품 수정이나 후속 Phase는 시작하지 않는다.
