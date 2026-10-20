# V4-CONDITIONAL-TEMPORAL-MEANING-SOURCE-REVIEW-01

상태: **PARTIAL**. 10개 십성 × dayun/saeun/wolun의 원본 **30개 의미 필드를 모두 직접 읽고 검토**했다. 실제 외부 전사본 11개에 접근하여 절·판본·본문/주석의 한계·응답 SHA256을 기록했다. 원전 개념에서 확장할 수 있는 현대적 질문 24개와 연결이 더 약한 질문 6개(비견·편인 각 3개)를 구별했다. **30개 생활 해석의 직접 전통 출처·실증 효과·공식 의미 승인은 여전히 미검증**이다. 조건부 제안을 검증된 개인 사실로 세지 않는다.

Base branch: `v4/temporal-ten-god-source-contract-01`.
Base SHA: `5ef91b4d42897237ccfb10e52ae0ee6c9f47eb3f`.
작업 branch: `v4/conditional-temporal-meaning-source-review-01`.
지속 worktree: `/Users/Deokmin/Developer/gyeol-worktrees/v4-conditional-temporal-meaning-source-review-01`.
Git common: `/Users/Deokmin/Dev/projects/gyeol-report/.git`.

## 실제 출처 검토

기존 `repo-gods`, 기초 정의 10개, `traditionalRef`, `mfpr.inheritedRole`과 신규 검토 자료를 구분한다. 기초 정의의 catalog 판본 `6d471…`과 inheritedRole 판본 `565c…`을 덮어쓰지 않았다. 두 Git 판본에서 원래 파일 byte가 일치하는 기존 검증을 재사용하고, 이번에도 실제 선언 버전의 Git 파일·현재 파일 SHA를 확인한다. 새 자료는 별도의 `AUDIT_RECORD` proof로 연결하며 기존 `traditionalRef`를 Source ID로 치환하지 않는다.

- [三命通會 四庫全書本 卷二 論大運](https://zh.wikisource.org/w/index.php?oldid=761691&title=三命通會_(四庫全書本)/卷02): 萬民英. 원국과 운을 함께 보는 전통 논의, 십년 단위와 기산 설명을 확인했다. 현대의 연간 예산·월별 행동 효과나 현행 천문 계산의 독립 검증은 아니다.
- [三命通會 四庫全書本 卷五](https://zh.wikisource.org/w/index.php?oldid=2082207&title=三命通會_(四庫全書本)/卷05): 印食官財 명의·正官·偏官·正財·偏財·印綬·倒食을 읽었다. 생극 분류와 조건부 전통 해석을 지원한다. 소득·승진·결혼·질병 등 역사적 단정을 고객 사실이나 예측으로 승인하지 않는다.
- [子平真詮 二 論陰陽生尅](https://donglishuzhai.net/chapter/3715.html), [四 論十干配合性情](https://donglishuzhai.net/chapter/3717.html): 沈孝瞻 전통 귀속. 편정 인성의 유사성을 말하는 본문과 다른 문단의 구분을 지적하는 현대 편집자 의견을 분리했다. 편인=대안 탐색, 정인=표준 학습을 실증된 심리 차이로 확정하지 않는다.
- [二十五 論行運](https://donglishuzhai.net/chapter/3738.html): 원국 전체와 운의 간지 비교·조건에 따른 반전·간지 구별을 확인했다. `校`와 `東里山人按`을 원저의 동일 층으로 합치지 않는다.
- [三十七 論食神](https://donglishuzhai.net/chapter/3750.html), [三十八 論食神取運](https://donglishuzhai.net/chapter/3751.html): 설기·생재 및 구성에 따른 취운 조건을 확인했다. 운간 식신 하나로 식신격·생산 능력·보상·휴식 필요를 판정하지 않는다.
- [四十一 論傷官](https://donglishuzhai.net/chapter/3754.html), [四十二 論傷官取運](https://donglishuzhai.net/chapter/3755.html): 수기와 구성별 취운 차이를 확인했다. 상관을 흉 사건 또는 현대 비판 능력 실측으로 번역하지 않는다.
- [四十六 論建祿月劫取運](https://donglishuzhai.net/chapter/3759.html): 구성에 따라 비견·인성의 역할 평가가 달라지는 예를 확인했다. 건록·월겁격의 조건을 모든 비견·겁재운으로 일반화하지 않는다.
- [滴天髓 歲運論](https://zh.wikisource.org/wiki/滴天髓/09): 본문 전통 귀속과 이 전사 해설 저자의 미확정 상태를 구분했다. 대운 배경과 세운 조건의 비유를 확인했으며 실제 사람·사건으로 대입하지 않는다.

11개 모두 HTTP 200과 응답 byte hash·짧은 locator anchor를 외부 로그에 보존했다. Wikisource 두 판본은 oldid로 고정했다. 東里書齋는 접근 당시 응답 hash와 해당 절을 고정했다. 스캔 대조·완전 교감·저자 귀속의 역사학적 확정은 실시하지 않았다. 이들은 **원전의 온라인 전사본**이며 웹사이트나 현대 주석 자체를 고대 원전으로 표시하지 않는다. 성공적으로 읽지 못한 `卷首`·`卷首上`·`3758` 경로는 근거에 포함하지 않았다.

## 30개 의미의 실질 검토

[의미별 검토](temporal-meaning-source-review.json)에 원문·record/hash/version·기초 정의 및 상속 proof·Source 지원 범위·현대 제안·필요 조건·반례·금지 추론을 모두 기록했다. 같은 주장을 기간만 바꾼 것을 독립 지식으로 세지 않는다. **공통 질문 10개 + 적용 조건 30개**, 새로 확인한 독립 기간별 전통 의미 0개다. 분류 C/D와 E/D는 서로 다른 층의 병기다. A/B의 직접 지지나 F의 확정 충돌로 억지 승격하지 않았다.

|십성|개념과 현대 제안의 경계|반례 또는 보류 조건|
|---|---|---|
|비견|동류 관계는 정의 근거, 자기 방식·자율성은 E/D 제안|공동 책임 필수, 단독 결정권 없음|
|겁재|비겁·재의 관계는 개념 근거, 공유·배분은 C/D 제안|공동 자원이 없거나 합의된 비균등 분담|
|식신|설기·생재는 개념 근거, 생산 공정·휴식은 C/D 제안|무보상 취미, 능력 미축적, 건강 진단 불가|
|상관|구성별 수기·취운 차이는 근거, 대안 시험은 C/D 제안|안전 승인·변경 권한 없음|
|편재|재성의 전통 구별은 근거, 접점·탐색은 C/D 제안|제안 없음, 유동성 부족, 수익 미확정|
|정재|재성의 생극·부담은 근거, 확정 예산 확인은 C/D 제안|불규칙 소득, 취소 입금, 묶인 가용 자원|
|편관|통제·제화의 조건은 근거, 긴급 대응은 C/D 제안|실제 요구 없음, 제살 자동 성립 금지|
|정관|공적 역할 상징은 근거, 평가·마감 확인은 C/D 제안|공식 평가·승인권·규정 미확인|
|편인|생조 구분은 근거, 특화 관점·적용 유예는 E/D 제안|익숙한 답이 적합, 실제 자료 없음, 유예 비용|
|정인|생아·보호 상징은 근거, 학습·문서화는 C/D 제안|지원 자격 없음, 기록이 실행을 방해|

예를 들어 정재 원문 `올해 수입·시간·지출의 실제 확정 항목을 확인`은 정재가 소득을 생성했다는 의미가 아니다. 당해 장부·실제 시간 기록이 추가로 필요하다. 월운의 `이번 구간 예정 자원과 이미 확보된 자원을 구분`은 입춘·절입·교운으로 분리된 해당 구간의 집행 질문이며, 같은 재성의 별도 전통 법칙이 아니다. 편인의 `이번 구간 다른 자료를 비교하되 적용을 유예`는 즉시 대응이 필요한 상황에서 반례가 있으므로 조건 없이 권하지 않는다.

`natalRequired`·`elementRequired`를 시간 십성 하나로 충족하지 않는다. 원국 위치·분포의 실제 연결과 강약·격국·제살·도식 등 별도 조건의 미생산 상태를 남겼다. `extraEvidence`는 실제 협업·소유권·산출·규정·지원 자격 등을 요구한다. positive/risk/reversal/forbidden은 관측 사실이 아니라 제안의 조건·이점·위험·반례·금지 경계로 검토했다. 미입력 경험·권한·수입·지원자·미래 사건은 생성하지 않는다.

## Typed 경로와 실제 계산

기능 소스는 신규 2개다. `conditionalTemporalReviewMaterial.ts`는 실제 출처와 개별 독해 결과, `conditionalTemporalMeaningReview.ts`는 실행 계약이다.

- `reviewTemporalMeaning`: 기존 `TemporalTenGodSourceResolver.temporalContract`와 exact proof를 재사용한다. Workbench의 `meaningDecomposition`으로 원문과 제안을 구분한다. 기존 extractor가 기간 필드를 포함하지 않으므로 검증한 필드만 명시적으로 전달하며 기존 extractor·Review Registry·frozen packet은 변경하지 않는다.
- `applyTemporalMeaningReview`: 기존 `verifyTemporalTenGodCalculation`을 호출한다. 요청된 의미의 hash/기간과 실제 Owner·방향·기준/대상·십성·Producer·ancestry·실효 구간을 검증한다. 고객 승인이나 Binder gate를 발급하지 않는다.
- `SOURCE_VERIFIED`는 정확한 저장소 정의와 새 접근/검토 record의 기술적 proof에 한정한다. `SOURCE_UNVERIFIED`는 현대 생활 해석의 정확한 전통 출처에 적용한다. `CONDITIONAL_MEANING_PROPOSED`, `MEANING_REVIEW_REQUIRED`, `PRODUCT_REVIEW_REQUIRED`, `CUSTOMER_APPROVAL_PENDING`을 별도 유지한다.
- 외부 문헌의 조건을 새로운 계산 Fact/Root로 만들지 않는다. FLOW_GOD의 대운간 기준과 원국 일간 기준 십성을 바꾸지 않고, 원국 십성을 기간 근거로 대체하지 않는다.

이전 767관찰 중 **749개 검증 관찰**을 원본 파일 hash `748e4ced…`로 재사용했다. 18개 ranged-transition FLOW_GOD 미검증은 그대로 보류한다. 이 관찰은 독립 사실이나 승인 수가 아니다. 추가로 동일 기존 입력 Major A/F/C·Annual A/F/C2028의 실제 계산을 다시 실행했다. 6 Fixture의 429 관찰이 계산 검증을 통과했고, 의미와 맞는 340 연결 중 294개가 실효 구간까지 유효했다. 나머지는 계속 WITHHELD다. 두 관찰 집합은 겹치므로 합산하지 않는다.

기존 cohort에는 **식신·정인·겁재·비견의 DAYUN_STEM 관찰이 없다**. 30개 의미 중 26개에 해당 origin의 실제 관찰이 있으며, 위 4개 대운 의미는 해당 실제 연결을 확인 완료로 표시하지 않는다. 이는 십성 계산 지원 자체가 없다는 뜻이 아니다. 신규 계산이나 임의 Fixture Fact를 만들어 빈칸을 채우지 않았다. [적용 결과](temporal-meaning-applicability.json)에 분모·관찰 hash·예시·미확인을 별도 기록했다.

입춘·절입·교운은 기존 계산을 사용한다. Annual A의 2026-02-04 05:02:08 KST 전후 실효 연주, C2028의 2028-04-23 21:42 KST 전후 대운간 기준, unknown-hour 입력, start-inclusive/end-exclusive 및 범위 확대 차단은 기존 Temporal 테스트와 새 적용 테스트로 확인한다. Major의 명목 연주에 정확한 연간 endpoints가 없는 경우 기간 적용은 보류한다.

## Source Integrity 재평가

**30개 의미 필드**와 **10 mfpr 연구 × 3 실제 Fixture의 Source 실패 30건**은 다른 집합이다. [원래 30건 비교](source-integrity-comparison.json)는 원본 ID/빈도와 SOURCE_INTEGRITY gate를 이전 영수증과 대조한다. 기존 receipt와 12 gates를 수정하지 않는다. 새 출처를 exact audit proof로 실행 연결했지만, 원래 자연어 참조가 정확한 현대 해석의 Source Identity로 성립하지 않으므로 **30 FAIL → 30 FAIL**, 해결 0이다. 승인 gate도 계속 보류한다.

처음 만든 로컬 검증 Fixture는 새 Owner alias로 인해 동일 FAIL의 actualEvidence node 주소가 달랐다. 계산·Source 결함이 아니라 검증 입력 identity 차이였다. 이전 관찰의 정확한 Owner/Fixture ID를 사용해 다시 검증했으며 초기 로그도 외부에 남겼다. 기존 원본·hash·gate를 바꿔 비교를 맞추지 않았다.

## 검증 및 보존

최종 실행 결과와 workspace 비교는 아래 확정 기록 및 외부 로그에 남긴다. 전체 저장소 suite PASS를 주장하지 않는다.

외부 로그: `/Users/Deokmin/Documents/gyeol-validation/v4-conditional-temporal-meaning-source-review-01/`.
원본 전사 응답·749개 관찰·전체 API receipt를 repository에 대량 복제하지 않았다. 기계 산출물에는 공통 Source table·proof/hash와 개별 원문·검토 결과를 저장한다.

새 branch/worktree/index/ref/reflog와 commit/object/upstream 등록은 의도한 Git metadata 변경이다. 기존 source 변경 0, 연구 원본 변경 0, DB·결제·Auth·Worker·고객 Runtime·Production 변경 0이다. 일반 임시 경로 위험과 활성 지속 환경 보존은 별도 지표로 보고한다. 복구·정리·prune/remove/repair/reset/clean/gc를 하지 않았다.

Preview 확인에는 Vercel deployments-cicd skill을 사용한다. 정확한 최종 commit SHA의 READY만 빌드 검증으로 기록하고, 판매·의미·고객 승인 또는 Production 배포라고 표시하지 않는다. 최종 Git/Preview receipt는 외부에 남긴다. 이번 작업 이후의 연결·연구는 자동 시작하지 않는다.

### 최종 실행 결과

- 신규 의미 검토 테스트 **67 PASS / 0 FAIL**; 기존 Temporal Source **49 PASS / 0 FAIL**.
- 다른 관련 13파일 **887 PASS / 2 FAIL**. 선택 실행 합계 **1003 PASS / 2 FAIL**이며 전체 suite가 아니다. 기존 두 Major/Annual Specialist의 `compatibilityProductAdapter.ts` 과거 판본 hash 기대값 실패는 기준 실행과 경로 정규화 후 **전체 오류 메시지까지 동일**하다. 테스트 삭제·skip·hash 재설정 0.
- TypeScript strict 진단 **0**. ESLint 최종 오류 **0 / 경고 0**. Webpack Production build **PASS / 관찰 경고 0**. 초기 신규 unused import 경고 2개만 새 파일에서 제거했고 초기 로그도 보존했다. Diff check PASS.
- 원래 **17 Books / 102 digest 전부 일치**. 저장본 roundtrip/reopen, 계산·원고·본문 순서·Book 원본 보존. Publication **32 SAFE_OFFLINE / 7 WITHHELD**, 원래 hash·오류·열람 gate 일치.
- 기존 Synthetic 12경로의 draft digest 동일. 실제 고객 Claim/Approval/Reader Bridge **0/0/0**.
- Public Runtime AST **46 roots / 700 modules**, 원래 digest 동일, 새 offline import 0. NFT **88 route + 2 shared = 90**의 Source·설치 의존성 집합/keys 동일, 신규 연구 trace 유입 0. generated chunk 이름의 byte 일치를 주장하지 않는다.
- 기존 등록 68개 Worktree의 HEAD/branch/status/선택 파일 SHA·표시 파일·symlink 동일. 새 지속 Worktree 1개로 69개. 원본 dirty 11개와 포렌식 915개 보존. 기존 `/private/tmp` 61개도 검사했으며 새 감소는 관찰되지 않았다. 이전 두 사고 합집합 33개·ignored/미기록 자료 미확인·원인 미확정은 별도 legacy 위험이다.
- 기존 Git byte는 precommit 비교에서 변경 0. 이후 새 commit/object/ref/upstream 변경은 의도된 metadata 변경이며 최종 post-push 증거는 외부 receipt로 기록한다. 파일 접근 atime 또는 역사적 ignored 전 파일의 무손실을 보장하지 않는다.

남은 차단: 직접 전통 Source가 없는 생활 해석 30개, 그중 의미 연결이 더 약한 6개, 현 관찰 집합의 대운 origin 적용 사례 4개, 실제 Context/원국·오행 연결 조건, 상품·Domain·공식 의미/고객 승인, 기존 기술 부채 테스트 2개. 검토 산출물과 기술 빌드 검증을 완료했으며 판매·고객 사용 자격은 계속 보류한다.
