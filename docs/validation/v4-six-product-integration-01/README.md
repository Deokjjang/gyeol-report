# V4 Six Product Safe Integration 01

판정: **6상품 통합 보존 PASS / 전체 출시 준비 PARTIAL / DEPLOY_READY: NO**. 원고를 추가로 개선하지 않았다. 기존 Page export build 오류, 기존 TypeScript 진단과 테스트 부채를 유지했다. master 병합·push, Production 배포·DB 접근·실결제는 실행하지 않았다.

## 기준과 격리

- 원본 checkout: `/Users/Deokmin/Dev/projects/gyeol-report`, `v4/annual-editorial-quality-fix-01`, `c048218cc5961e0f53a1deab2603511e17559fc3`.
- 새 worktree: `/private/tmp/gyeol-six-product-integration-01`, 새 브랜치 `v4/six-product-integration-01`.
- 시작 SHA: 세운 최종 `f1994d13eb1ac40b913ec1419a1e0c24e7c89407`. 세운은 재병합하지 않았다.
- 원본의 미커밋 11개(`.gitignore`, `AGENTS.md`, `supabase/.temp/` 9개)와 기존 8개 worktree의 HEAD·Git status·tracked/untracked 파일 SHA256을 시작/완료 비교했다. 모두 동일하다. 무시되는 빌드/테스트 캐시는 파일 보존 비교 대상에서 제외했다.
- 원본 여섯 원격 branch SHA는 작업 시작에 모두 일치했다. 최종 push 후에도 다시 확인한다.

|상품|원본 브랜치|고정 SHA|
|---|---|---|
|종합|`v4/comprehensive-editorial-quality-fix-01`|`1edcf3fb9f22e42b144706bd4b25ea2fb5c89462`|
|커리어|`v4/career-editorial-quality-fix-01`|`80409f8a96c5a2b4bf93792ea6f5d1c97bbc1fa4`|
|연애|`v4/love-editorial-quality-fix-01`|`544f14c36ba5de557b1d746879f1a69a5f57817f`|
|궁합|`v4/compatibility-editorial-quality-fix-01`|`21da9173461f3530c5e945e4d306303e7660986b`|
|대운|`v4/major-fortune-reader-quality-polish-01`|`9460df97d929735d2d835216952948a202ad8af3`|
|세운|`v4/annual-fortune-reader-quality-polish-01`|`f1994d13eb1ac40b913ec1419a1e0c24e7c89407`|

## 공통 조상과 병합

순서: 세운에서 시작 → 대운 → 종합 → 커리어 → 연애 → 궁합. 각 단계에서 관련 테스트를 실행한 후 merge commit을 기록했다. 코드 충돌은 **0개**이며 ours/theirs 일괄 선택이나 파일 전체 덮어쓰기를 사용하지 않았다.

- 대운과 세운의 merge-base: `4e8deb242f78310ff9bc3fbcba4fb364a48503e4`. 대운 1개 커밋만 병합했고 세운 개선 파일은 유지했다.
- 나머지 네 상품과 세운의 merge-base: `c048218cc5961e0f53a1deab2603511e17559fc3`. 각 브랜치의 단일 최종 개선 커밋을 병합했다.
- 각 상품 소스 35개 파일은 해당 지정 SHA의 파일과 byte-identical이다. 공통 계산·MBTI DB·Fusion·발행·결제·인증·공유·Supabase·gate·설정 파일의 추가 수정은 없다.
- 상세 목록: [ancestry.json](ancestry.json), [source-file-parity.json](source-file-parity.json).

병합 순서와 부모:

```text
4274ac5 b3a582c 21da917 Merge compatibility editorial quality into six-product integration
b3a582c ae44318 544f14c Merge love editorial quality into six-product integration
ae44318 01e08e1 80409f8 Merge career editorial quality into six-product integration
01e08e1 dc75183 1edcf3f Merge comprehensive editorial quality into six-product integration
dc75183 f1994d1 9460df9 Merge major fortune reader polish into six-product integration
```

### 검증 fixture 조정

상품 개선 브랜치의 “다른 상품은 불변” 검사는 각 브랜치의 과거 기준을 기대한다. 통합에서는 해당 개선 상품의 **지정 원본 SHA에서 먼저 생성한 결과**로 cross-product 기대값만 갱신했다. 통합 결과를 보고 기대값을 새로 생성하지 않았다. 엔진 lock, 기존 저장본 JSON과 본문은 바꾸지 않았다.

갱신 대상: comprehensive/career `other-products.json`, love `loveQualityLocks.json`, compatibility `compatibilityQualityFixtures.json`, major/annual `*ReaderQualityLocks.json`와 `annualEditorialQualityLocks.json`, 기존 release lock의 새로 통합되는 comprehensive/career/love 항목. 기존 Love/Compatibility release의 major/annual 오래된 해시 실패 4개는 기존 부채로 그대로 남겼다.

기존 release tests는 `SHADOW_CLOCK=2026-10-01T12:00:00+09:00`를 사용한다. 주요 비교는 요청한 10월 12일이며, 세 legacy cross-product 입력만 동일한 10월 1일 원본 결과와 별도 비교했다. 시각이 다른 해시를 혼용했던 작업 중 실패 2개는 정확한 원본 시각으로 바로잡아 최종 재실행에서 통과했다.

## 실제 생성·Book 비교

외부 AI·Mock 본문 없이 실제 유료 V4 경로가 사용하는 `generateV4ShadowReport → 계산/MBTI/Fusion/상품별 composer → projectBook → createProductPreviewSnapshot → storedBook`을 오프라인으로 실행했다. fetch는 기존 `tests/networkGuard.ts`가 차단했다. Production gate·정책·DB는 변경하지 않았다.

요청 시각 `2026-10-12T12:00:00+09:00` 61개 + 기존 테스트 시각 3개 = **64개 완전 일치**. 62개 생성 성공 및 2개 기존 `INVALID_REPORT_INPUT / DAYUN_UNCERTAIN` 거절을 확인했다. 주 비교에서 원문·full generation JSON·전체 evidencePacket·계산·integration·Book·snapshot을 객체 전체로 대조하고, 정규화된 SHA256 digest도 비교했다. 생성 성공 62개는 통합에서 같은 입력으로 다시 생성해 결정론성도 확인했다.

세운 2027/2028의 기존 오프라인 사례는 원본 사례의 `policyDate`를 그대로 사용했다. 평가 시각과 정책 입력 모두 원본/통합에서 동일하며 실제 판매 허용 정책은 바꾸지 않았다.

|상품/대표 사례|원고 구조|본문 길이|Book 페이지|원본=통합 Book digest|
|---|---|---:|---:|---|
|종합 A|13장 / 52문단|10302|21|`9f50c7e8d09f9af84a013aa510bc51e08ba09f1925236b6f8b35d7f7d0ce7bf9`|
|커리어 A|9장 / 36문단|9625|17|`0b71f2f9c682d3f60111107aba96e3553c473aa25421521572c698965ef65294`|
|연애 A|9장 / 36문단|8399|17|`b183ec4dd3f673acb417891f2afdd19946b88307270fd5dcd9aafb4cf9b13a68`|
|궁합 A|9장 / 36문단|9823|21|`d1df7738440c105efaf5602b72afe1e193db0948b77b2d0348688a726f1a3d27`|
|대운 S|2023–2036 / 14년|14967|30|`058b63d58e948647071a16d7d749942291783278966a75d210ad4a25eb15539c`|
|세운 H|12개월|10509|26|`80b44421f94d83259a258d5d87b8dda57234eaee0953d429cf47b856e3d6f49f`|

본문 길이는 원본 readerEdition의 bodyLength 또는 시간 상품의 opening/section blocks 텍스트 합이며, 표지·목차·만세력·MBTI 기본표를 포함하지 않는다. 길이로 판매 품질을 새 판정하지 않았다. 전체 64개 입력별 hash·구조·기간은 [book-parity.json](book-parity.json)에 기록했다.

- 종합: A–F와 cross inputs, 13/52, 정상·시간/MBTI 미상, 실제 근거·Fusion 사용을 유지했다.
- 커리어: A–F, 개발자·프리랜서·직장인, 직업 장면·재물·학업·추천 직무의 원고/근거를 유지했다.
- 연애: A–F, 솔로·연애·기혼, 현재 상태별 적용과 내부 DB 문구 차단을 유지했다.
- 궁합: A–F 및 연애/결혼/부모·자녀/동료/상사·팀원/사업/친구 7종. 9/36, A→B/B→A, 역할·점수·근거·제목 안전성을 유지했다.
- 대운: A–F 및 윤시우, 2023–2036 14년, 전환 시각/범위·기간별 근거·최종 개인화를 유지했다. C 전환 `2028-04-23 21:42 KST` 등 source 객체 전체가 같다.
- 세운: A–F 및 한예린·직업/선택 연도 variants, 12개월·절기 경계·월별 근거와 행동 조언을 유지했다.

## 저장본·열람 보호

64개 중 신규 생성된 62개 snapshot을 원본에서 고정해 통합 코드의 소유자/공유 storedBook 재열람과 snapshot 비변경을 확인했다. 별도로 개선 이전 대운 8개와 세운 10개 저장 snapshot도 owner/shared 양쪽에서 기존 Book 그대로 재생됐다(18 PASS). 종합·커리어·연애·궁합의 기존 paid fixture 재열람과 V3 `v2Regression` 6개도 관련 테스트에 포함했다.

권한·공유 Token·만료 경로의 관련 로컬 테스트도 비교했다. 기존 정확한 90일 경계 테스트의 공유 레이블 실패 1개는 원본/통합에서 동일하게 남는다. 따라서 해당 테스트 전체를 PASS라고 보고하지 않는다. Production 구매자 DB나 실제 브라우저 로그인/실결제를 통한 E2E 검증은 하지 않았다.

## 테스트와 기존 부채

|범위|기준 PASS/FAIL|통합 PASS/FAIL|새 실패|
|---|---:|---:|---:|
|comprehensive|31/0|31/0|0|
|career|36/0|36/0|0|
|love|75/2|75/2|0|
|compatibility|54/2|54/2|0|
|major|72/0|72/0|0|
|shared|120/4|120/4|0|
|protected|10/21|10/21|0|
|access|36/1|36/1|0|
|새 원본 SHA parity 자동 회귀|—|64/0|0|
|이전 대운·세운 저장본|—|18/0|0|

기존 대상 합계 **434 PASS / 30 기존 FAIL**. 새 parity 64개 및 별도 이전 저장본 18개 PASS. 공통 테스트 최초 실행의 5개 cross-product hash 실패는 원본 최신 해시 반영 후 해당 `annualEditorialQuality.test.ts` 전체를 재실행해 31 PASS로 확인했다. shared 수치는 마지막 파일 실행 결과를 우선한 중복 제거 집계이며 `tests-final-shared-effective.json`에 원 실행/재실행 출처를 기록했다. 실패 이름과 원인/위치의 변화 0개. 테스트/원인 상세는 [test-comparison.json](test-comparison.json), 실행 JSON은 [logs](logs)에 남겼다. 전체 테스트/96·24 콘텐츠 품질 감사는 실행하지 않았다.

기존 실패 분류:

- Annual API/preflight 22개: gate 403과 기대한 HTTP 응답의 불일치 및 JSON 응답 파싱 실패.
- Book 목차 3개: career/love/compatibility 앞/뒤 목차에 실제 anchor가 더 포함되는 기존 기대값 불일치.
- Love/Compatibility release hash 4개: 기존 major/annual edition hash와 이미 변경된 생성 결과의 불일치.
- publication expiry 1개: exact boundary 테스트에서 기존 공유 레이블 `리포트 공유하기` 기대 실패.

필수 도구 결과:

- TypeScript: 동일 Next generated types 조건에서 **390 → 390**, worktree 절대 경로만 정규화한 진단 위치+메시지 multiset 추가/제거 **0**. 새 parity 테스트에 처음 발생한 타입 3건은 검증된 runtime 타입을 사용하도록 고쳐 최종 0건이다. 전체 TypeScript가 깨끗하다는 뜻은 아니다.
- lint: 기준과 최종 PASS.
- 정식 build: 기준/최종 webpack 컴파일 성공 후 동일 `src/app/report/new/page.tsx` invalid Page export로 FAIL. 출력은 각각 `getAsiaSeoulCurrentYear`/`getAnnualFortuneYearOptions`를 지목했다. 해당 소스는 byte-identical이고 TypeScript 진단도 동일하다.
- NFT: 정식 build는 tracing 전에 중단됐다. 별도로 같은 Next CLI의 `--experimental-build-mode compile`을 기준/통합에 적용해 tracing까지 실행했다. 양쪽 모두 경고 0개, 따라서 관측된 경고 유형/import trace 추가 0개. 과거 NFT 경고가 모든 환경에서 해결됐다는 뜻은 아니다. compile-only 성공을 정식 build 성공이나 배포 준비로 해석하지 않는다.
- `git diff --check`: PASS.

재현 명령:

```sh
./node_modules/.bin/vitest run tests/unit/interpretation-v4/sixProductIntegration.test.ts --fileParallelism=false
npm run lint
./node_modules/.bin/tsc --noEmit --pretty false --incremental false
OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 npm run build -- --webpack
OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 npm run build -- --webpack --experimental-build-mode compile
git diff --check
```

추가한 자동 테스트의 기대값은 [source-locks.json](../../../tests/fixtures/six-product-integration-01/source-locks.json)에 고정했다. 전체 원본/통합 raw captures는 `/tmp/gyeol-six-integration-validation/{source,integrated}/`에 보관했다.

## 남은 공통 문제와 종료

공통 문체·일부 의미 반복·고객 간 공통 조언·십이운성 부록 설명은 이번에 수정하거나 품질 재평가하지 않았다. 기존 build/API/Book/TypeScript 부채도 그대로다. 이번 결과는 **통합 보존 PASS**이며 여섯 상품의 최종 판매 품질 전면 PASS 선언이 아니다.

변경은 새 통합 브랜치에만 commit/push한다. 소스 여섯 브랜치·원본 미커밋 11개·master·Production은 보존한다. push 후 원격 SHA 일치 확인은 최종 메시지에 기록한다.

**DEPLOY_READY: NO**. 기존 정식 build 오류가 남는다. 다음 작업이나 배포를 자동 시작하지 않는다.
