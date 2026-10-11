# V4-COMPATIBILITY-TITLE-SAFETY-FIX-01

기준: `72d9a972c124e67034f1d7a47c6c83fce86d9986` / `v4/compatibility-editorial-release-01`

## 원인과 최소 수정

`compatibilityReleaseRenderer.ts`의 문단 소제목 생성에서 `pc.purpose.replace(/A/g, a.name).replace(/B/g, b.name)`을 사용했다. 이 때문에 `MBTI`의 B까지 이름으로 바뀌고, A 이름에 포함된 B도 두 번째 치환 대상이 될 수 있었다. `A가`, `B가`, `A는`, `B는`의 조사도 이름의 받침과 무관하게 남았다.

명시적인 `{{A}}`, `{{B}}`, `{{A:subject}}`, `{{B:topic}}` 같은 표시 토큰만 콜백으로 한 번 치환한다. 새 `titleTemplate`은 표시 전용이다. 기존 `purpose`, 문장 역할, semanticTheme와 근거 식별자는 그대로 유지한다.

한글 완성형으로만 된 이름은 기존 `withKoreanParticle`을 재사용한다. 영어·공백·특수 표기는 발음을 추측하지 않고 `A&B님이`, `Bobby님은`처럼 님에 조사를 붙인다. 이/가·은/는·을/를를 양쪽 역할에서 검증했다.

## 출력 경로 점검

- 문단 소제목 → `compatibilityReaderPages`의 Book heading → `compatibilityReaderContents` 상세 목차로 같은 오류가 전달됐다. 실제 런타임 Book 본문·상세 목차·SSR·저장/공유 재열람에서 수정 제목을 확인한다.
- 9개 챕터 제목의 인물명은 직접 문자열 보간 및 님은/님이로 생성되며 전역 A/B 치환을 사용하지 않는다. 만세력/MBTI 페이지 제목, 양방향 요약, 공유 제목도 직접 보간 경로다.
- 궁합 생성/Book 경로 검색 결과, 동일한 임의 A/B 전역 치환은 발견 지점 한 곳이었다. 별도 구형 초안 validator의 Partner/Family A/B 조사 교정은 경계를 둔 명시적 문구에만 적용되어 이번 범위에서 변경하지 않았다.

## 실제 생성 제목 전후

| 사례 / 문단 | 수정 전 | 수정 후 |
|---|---|---|
| 01-love / CH01.P3 | M소연TI가 보여주는 우리 | MBTI가 보여주는 우리 |
| 01-love / CH06.P1 | 소연는 현우에게 어떤 자극을 주는가 | 소연은 현우에게 어떤 자극을 주는가 |
| 02-marriage / CH01.P3 | M서윤TI가 보여주는 우리 | MBTI가 보여주는 우리 |
| 02-marriage / CH06.P1 | 서윤는 민재에게 어떤 자극을 주는가 | 서윤은 민재에게 어떤 자극을 주는가 |
| 03-parent / CH01.P3 | M지우TI가 보여주는 우리 | MBTI가 보여주는 우리 |
| 03-parent / CH02.P2 | 예린가 관계에서 중요하게 여기는 것 | 예린이 관계에서 중요하게 여기는 것 |
| 03-parent / CH05.P1 | 예린는 지우에게 어떤 자극을 주는가 | 예린은 지우에게 어떤 자극을 주는가 |
| 04-coworker / CH01.P3 | M나영TI가 보여주는 우리 | MBTI가 보여주는 우리 |
| 04-coworker / CH02.P2 | 서진가 관계에서 중요하게 여기는 것 | 서진이 관계에서 중요하게 여기는 것 |
| 04-coworker / CH05.P1 | 서진는 나영에게 어떤 자극을 주는가 | 서진은 나영에게 어떤 자극을 주는가 |
| 04-coworker / CH06.P1 | 나영는 서진에게 어떤 자극을 주는가 | 나영은 서진에게 어떤 자극을 주는가 |
| 05-manager / CH01.P3 | M하린TI가 보여주는 우리 | MBTI가 보여주는 우리 |
| 05-manager / CH02.P2 | 도윤가 관계에서 중요하게 여기는 것 | 도윤이 관계에서 중요하게 여기는 것 |
| 05-manager / CH05.P1 | 도윤는 하린에게 어떤 자극을 주는가 | 도윤은 하린에게 어떤 자극을 주는가 |
| 05-manager / CH06.P1 | 하린는 도윤에게 어떤 자극을 주는가 | 하린은 도윤에게 어떤 자극을 주는가 |
| 06-business / CH01.P3 | M준호TI가 보여주는 우리 | MBTI가 보여주는 우리 |
| 06-business / CH02.P2 | 다은가 관계에서 중요하게 여기는 것 | 다은이 관계에서 중요하게 여기는 것 |
| 06-business / CH05.P1 | 다은는 준호에게 어떤 자극을 주는가 | 다은은 준호에게 어떤 자극을 주는가 |
| 07-friend / CH01.P3 | M유진TI가 보여주는 우리 | MBTI가 보여주는 우리 |
| 07-friend / CH06.P1 | 유진는 지아에게 어떤 자극을 주는가 | 유진은 지아에게 어떤 자극을 주는가 |
| 08-love / CH01.P3 | M정우TI가 보여주는 우리 | MBTI가 보여주는 우리 |

A–H의 실제 생성 챕터 제목 72개와 문단 소제목 288개를 Codex가 직접 읽어 확인했다. 전체 소제목의 기대값은 `tests/unit/interpretation-v4/compatibilityTitleSafetyLocks.json`에 기록했다. 기존 A–H 원고 문서는 기준 SHA 당시의 검증 기록으로 보존하며, 제목 수정 결과는 이 문서를 따른다.

## 7개 관계 및 보존 검증

| 원고 | 관계 | 본문 길이 | 장 / 문단 | 제목 외 전체 결과 |
|---|---|---:|---|---|
| 01-love | 연애 | 9172 | 9 / 36 | 기준 SHA digest 일치 |
| 02-marriage | 결혼 | 9419 | 9 / 36 | 기준 SHA digest 일치 |
| 03-parent | 부모·자녀 | 9337 | 9 / 36 | 기준 SHA digest 일치 |
| 04-coworker | 직장 동료 | 9338 | 9 / 36 | 기준 SHA digest 일치 |
| 05-manager | 상사·팀원 | 9392 | 9 / 36 | 기준 SHA digest 일치 |
| 06-business | 사업 파트너 | 9327 | 9 / 36 | 기준 SHA digest 일치 |
| 07-friend | 친구·인간관계 | 9432 | 9 / 36 | 기준 SHA digest 일치 |
| 08-love | 연애 / 근사 시간 | 9282 | 9 / 36 | 기준 SHA digest 일치 |

수정 전에 실제 기준 SHA 코드로 A–H, 양쪽 MBTI/시간 미상, 영어·특수 이름 총 10개 결과를 생성해 소제목만 마스킹한 전체 product digest를 잠갔다. 수정 후 같은 digest를 검증하므로 본문·명리/MBTI/Fusion 근거·semanticTheme·관계 유형·점수·A→B/B→A 방향·출판 선택·배정 메타데이터까지 보존 여부를 함께 검사한다.

양쪽 MBTI/시간 미상은 기존과 같은 9장·33문단·8,301자다. CH01.P3 등 근거가 부족한 문단의 생략과 진단을 보존하며, 새 MBTI나 시주를 만들지 않는다. G의 시간 미상, H의 근사 시간도 A–H에 포함된다.

미상 입력과 `A&B`/`Bobby` 입력의 실제 생성 제목도 직접 읽어 확인했다. 특수 이름의 글자는 유지되고, 님에 붙는 조사만 선택된다.

## 검증 결과

| 실행 | 결과 |
|---|---|
| 궁합 release / 제목 회귀 | 53 PASS (release 38 + 제목 유틸리티 15) |
| 기존 궁합 narrative/discovery/safety 및 관계 계약 | 75 PASS |
| 미상·특수 이름 실제 제목 추가 확인 | 2 PASS (위 테스트 재확인) |
| 전체 관련 테스트 | 128 PASS + 2건 재확인 |
| lint / 최종 수정 파일 eslint | PASS |
| build | PASS |
| git diff --check | PASS |
| 전체 TypeScript | 수정 전 390건 / 최종 390건; 추가·제거 진단 없음 |

기준 SHA에서 직접 생성한 10개 전체 결과 digest와 소제목 기대값, 기존 canonical 잠금, 다른 5상품의 원고·근거·Book digest가 일치했다. 기존 유료 궁합 저장본의 직접/공유 열람 잠금도 통과했다.

전체 TypeScript 검사는 기존 오류 때문에 clean이 아니다. 최종 build의 NFT 경고는 9건이며, 이전 검증 build의 5건과 동일한 `next.config.ts → localDatabase.ts → bundleLocalReview.ts → dev/account/tickets/api/[action]/route.ts` import trace다. 출력 asset 개수는 달랐으며 해당 개발 경로·설정 파일은 수정하지 않았다. 제목 수정 파일을 가리키는 신규 경고 유형은 없다. 최초 제한 환경 build는 compile 단계에서 대기해 중단했고, 같은 명령을 제한 밖에서 실행해 성공했다. 정확한 최초 대기 원인은 확정하지 않았다.

전체 콘텐츠 품질 테스트, 실결제·환불, 외부 AI 호출은 실행하지 않았다. 이번 수정 파일은 소스 3개, 테스트/잠금 3개, 문서 2개로 한정했다. 최종 커밋 SHA와 원격 일치 여부는 푸시 후 응답에 기록한다.

Production 배포, master merge/push, DB/migration, 환경변수, 결제/환불, 이벤트 상태 변경을 실행하지 않았다. `.gitignore`, `AGENTS.md`, `supabase/.temp/`는 기존 미커밋 상태를 보존했다. 다음 대운·세운 검수는 시작하지 않는다.
