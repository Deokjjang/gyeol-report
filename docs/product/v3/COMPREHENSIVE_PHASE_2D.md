# 종합 V3.2 Final — 현실 공감과 근거별 다양성

2026-09-28, `v3/rebuild`. 신규 명시적 종합 V3만 `comprehensive_v3.2-final.1`을 사용한다. V3.2의 구조·계산·Compound Engine·strength-aware prominence는 그대로 두고 종합 전용 편집 레이어를 추가했다. 공유 계산기, MBTI 원문/pair DB, 다른 5상품, 결제·DB·배포 설정 변경 및 실제 OpenAI 호출 없음. master push 없음.

## 고객 검토

가온: http://127.0.0.1:3100/reports/report_ffasjye79sb45

[전체 고객 화면 텍스트](COMPREHENSIVE_FINAL_REVIEW.txt)는 만세력·전체 기운·계산 기준·MBTI 상세까지 모두 펼친 실제 브라우저의 텍스트다. 아래 링크들은 로컬 preview-memory 생성물이며 Production URL이 아니다. 개발 서버가 종료되면 메모리 리포트가 사라질 수 있다.

| Fixture | 입력 차이 | 본문 글자 | 새 공감 예시 / 전체 질문 | 마지막 방향 | 주요 기운 | reportId |
| --- | --- | ---: | ---: | --- | ---: | --- |
| A 가온 | ENTJ, 소프트웨어 기획, 재직, 연애 | 7,970 | 6 / 5 | 확장형 | 27 | report_ffasjye79sb45 |
| B 나래 | INFP, 브랜드 디자인, 프리랜서, 싱글 | 6,799 | 4 / 6 | 안정형 | 25 | report_z8og5mnx6jpog |
| C 다온 | ISTP, 제조 품질, 사업, 기혼 | 5,936 | 4 / 5 | 표현형 | 22 | report_dza993z5m44vi |
| D 라온 | ENFJ, 학생, 싱글 | 6,534 | 5 / 6 | 연결형 | 22 | report_f5e0a45oib5sb |
| E 마루 | MBTI 미입력, 구직, 싱글 | 6,346 | 5 / 5 | 리더형 | 23 | report_qr9g2tiu2xi2o |
| F 이든 | ESTP, 외부 프로젝트 영업, 프리랜서, 연애 | 5,093 | 3 / 4 | 탐구형 | 14 | report_i64q8m106aajy |

글자 수는 표·공통 UI를 제외한 `comprehensiveV3CustomerText` 기준. 전체 화면 텍스트는 13,127자다. 6건 모두 로컬 create HTTP 200, publish PASS, 외부 호출 0회.

## 다양성을 만드는 실제 조건

- V3.2가 실제 선택한 confirmed 근거 중 기존 `storySupport`가 substantial로 판정한 근거만 새 공감 예시에 사용한다. 임의 샘플링·이름 해시·랜덤 문장 변형 없음.
- 16유형의 실제 source trait + 별도 축의 8개 대체 trait, 사랑 trait 16개, 현침 ENTJ/INFP 대조 2개를 명리 근거와 함께 매칭한다. 기본 trait에 근거가 없으면 다른 실제 trait을 검토하며, 억지로 같은 성격을 모든 원국에 붙이지 않는다.
- 단순히 MBTI 라벨만 붙이지 않는다. 현침 + ENTJ는 잘못을 보는 순간 수정 순서까지 떠올리는 모습, 현침 + INFP는 평소 넘기다가 가치가 침해되면 정확하게 짚는 모습으로 갈린다.
- 겁재는 경쟁의 자극, 화개/고신은 사람을 좋아해도 혼자 회복하는 장면, 비견은 도움과 선택권을 구분하는 장면을 쓴다. 한 예시는 1~2문장, 한 장에 최대 하나, 전체 최대 6개다. 기존 질문까지 포함한 총량을 관리한다.
- 십성별 자기 인식과 학습 설명을 분리했다. 편인의 숙성/연결과 비견의 독립 판단을 같은 설명으로 처리하지 않는다. 중복 제거 후 제목만 남던 학습 블록은 해당 강한 근거의 학습 방식으로 채운다.
- 직업 상세 입력은 분야 인식 정도로 유지하고 작업 지시 수준의 문구는 줄였다. 학생/구직/상태 미입력에서는 해당 상황 또는 보편적 생활을 사용하며 나이만으로 직업·결혼을 추정하지 않는다.
- 기존 가중치·천간 노출·선택 근거로 우세 십성을 정해 8가지 결론(확장·축적·리더·표현·연결·탐구·안정·변화)을 고른다. 정인과 강한 천을귀인의 연결형도 실제 두 근거를 보존한다. 6개 대표 fixture는 6방향과 서로 다른 끝 문장을 얻었다.

### 좋은 패와 오행

장성은 명예와 이름을 남기는 힘, 반안은 자리와 인정, 재고는 재물·기술·경험의 축적으로 직접 표현했다. 귀인은 인복과 도움의 통로로 말한다. 없는 길신을 채우지 않고, 강한 십성이 선택된 F에는 편인의 탐구 자원을 설명한다. 사건·승진·자산 증가를 약속하지 않는다.

오행은 목의 가지, 화의 불, 토의 바닥, 금의 칼, 수의 흐름이라는 이미지와 생활 장면을 연결했다. 기존 선택 가능한 실용 팁을 유지하며 본문에서 가중치 숫자를 반복하지 않는다.

## 화면·저장 호환성

주요 기운은 중요도 상위 10개를 기본 표시하고 나머지는 네이티브 `details`로 접는다. `위치·출처`는 `계산 기준`으로 바꿨다. 고객 DTO는 이름·설명·힘·허용된 한글 계산 기준만 가진다. raw source/feature ID를 CSS로 가리는 것이 아니라 JSX 속성·React key·클라이언트 경계에서 제외했다.

6개 리포트의 서로 다른 주요 기운 64행을 읽어 검토했다. 고신·과숙·겁살·육해·지살 및 좋은 패 문구를 정리하고, 천살·년살·월살·괴강·원진에 남은 범용 데이터 설명을 기존 taxonomy 의미로 교체했다. 일주의 빈 힘 설명은 기존 60일주 원문의 coreKeywords를 사용한다. 합·충은 사건 예언 없이 사실적 관계 설명을 유지한다.

이전 V3/V3.1/V3.2는 각각 버전별 작성기로 검증한다. 기존 V3.2 A~F draft SHA-256이 작업 전과 동일하고 JSON 저장 후 publish도 통과한다. 선택 필드의 `undefined`는 JSON 저장에서 생략되므로 검증용 안정 비교도 동일하게 생략하도록 수정했다. DB schema/persistence migration은 없다. 기존 V3.2 A URL도 HTTP 200 및 SSR PASS다.

Next.js/React 검토 기준에 따라 서버 렌더링·기존 클라이언트 펼침 경계를 유지했다. 새 네트워크 호출, client state/effect, hydration 우회, hydration 경고 억제는 추가하지 않았다. 표의 caption·행/열 scope·키보드 focus와 네이티브 summary를 유지했다.

## 검증

- 관련 11파일 **226 tests PASS**. V2/다른 5상품의 고정시각 draft/evidence/HTML 해시 회귀 포함.
- 6원국 × 16 MBTI **96조합** 모두 generate → JSON round-trip publish → SSR PASS. 각 원국의 16유형 본문이 서로 다르고, 각 유형의 6원국 본문도 이름을 지운 뒤 서로 다르다. MBTI만 바꿨을 때 계산 결과 해시는 동일하다.
- 별도 A의 16유형+미입력 17건도 본문이 서로 다르며 미입력에 MBTI 근거를 붙이지 않는다. 실제 현침 ENTJ/INFP 문장 차이, 학생/상태 미입력의 성인 상황 미가정, 동일 입력의 결정성을 검사했다.
- A~F 새 예시 반복 0, 선택되지 않은/약한 새 예시 근거 0, weak compound hero 0, 문체 guard 위반 0. 40자 이상 본문 문장 중복 0. 원국 강도가 부족한 요소를 예시 개수 때문에 승격하지 않는다.
- 실제 6개 URL SSR 및 브라우저 HTML에서 `canonical-*`, `SajuCalcResult:*`, `v1:*`, feature/provenance 문자열 0. 주요 기운 기본 10개, 전체 펼침 14~27행. 만세력·MBTI·하위 기능 정보 펼침과 계산 기준 Enter 키 동작 PASS.
- **390 / 768 / 1440px × 6건** document overflow 0, 표 clipping 0. 가온 세 폭 스크린샷 직접 확인. 브라우저 오류·hydration 오류·Next 오류 overlay 0.
- `pnpm lint`, `pnpm build`, `git diff --check` PASS.
- 전체 suite: **4,171 PASS / 기존 3 FAIL**. `legalPagesSource.test.ts`, `policyPagesSource.test.ts`의 과거 약관 날짜 기대값과 `compatibilityPreviewPageSource.test.ts`의 제거된 점수 marker 기대값이다. 이번 범위 밖이라 수정하지 않았다.
- 별도 `tsc --noEmit`: 기존 테스트 파일 진단 384건이 남는다. src 및 V3 테스트에 새 진단 없음. 전체 타입 검사까지 깨끗하다고 보고하지 않는다.

검증의 한계: 96개가 전부 다른 본문이라는 것은 모든 문장이 서로 다르거나 모든 고객이 고유 문장을 받는다는 뜻이 아니다. 같은 실제 근거에는 같은 설명을 공유한다. 완전한 전 인구 고유성이나 해석의 과학적 정확성을 보장하지 않으며, 유사성 회피를 위해 없는 특성이나 임의 점수를 만들지 않는다.

## 재현

```sh
pnpm exec vitest run tests/unit/interpretation-v3 tests/unit/api/createReportRoute.test.ts tests/unit/app/reports/completedReadingExperience.test.tsx tests/unit/report-generation/deterministicProductQuality.test.tsx tests/unit/persistence/paidReportLookupBoundary.test.ts tests/unit/components/report-tables/ManseRyeokCommonTable.test.tsx --silent
FINAL_REVIEW_OUTPUT=1 pnpm exec vitest run tests/unit/interpretation-v3/comprehensiveExperience.test.tsx --silent
pnpm lint
pnpm build
git diff --check
```

선택적 테스트 출력은 `/tmp/gyeol-final-{A..F}.json/.txt`, `/tmp/gyeol-final-matrix.json`에 남긴다. fixture 개인정보는 모두 테스트용이다. unrelated `.gitignore`, `AGENTS.md`, `supabase/.temp/`는 커밋에서 제외한다.
