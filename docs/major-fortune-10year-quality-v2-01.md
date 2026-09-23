# MAJOR-FORTUNE-10YEAR-QUALITY-V2-01

기준 HEAD: `932576d` (`feat: deepen compatibility categories`). 외부 provider 없이 로컬 deterministic generation → publish gate → 실제 `MajorFortuneReportView` SSR을 비교했다. Calendar/Dayun 계산, 상품/가격, 결제, DB, 재시도, 보관 정책은 변경하지 않았다.

## 변경 구조

표지 → 이 10년의 핵심·원국 근거·얻을 방향/비용 → 현재 위치·교운·이전 대운 → 실제 연도에서 뽑은 전/중/후반 질문 → 기존 만세력/MBTI 표 → 10년 타임라인 → 일/돈/관계 → 검증된 Bridge 장면 → 전문 근거·관리/실행 기준 → 다음 대운.

`majorFortuneDecadeReading.ts`는 기존 canonical annual helpers와 고객 대운표를 해석용으로 조립한다. 새로운 명리 계산법을 만들지 않는다. 대운 지지와의 관계와 원국 네 기둥과의 관계를 분리하며, 대운 지지를 원국 배열 앞에 끼워 원국 위치가 밀리는 방식을 새 해설에는 사용하지 않는다.

- 연도마다 간지, 십성, 오행, 대운 관계, 원국 관계, `reasons/evidenceIds`를 보존한다.
- 중요도는 사건 확률/운세 점수가 아닌 **해설 우선순위**다. 교운 첫해·다음 대운 직전 연도, 대운과 충/형을 먼저 보고, 원국 일지/월지의 충/형을 그다음으로 본다. 보완·중첩·다른 합충은 일반 해설 근거다. 약한 사실을 여러 개 더해 강한 사실을 앞지르지 않는다.
- 중요 해설은 최대 4개. 같은 우선순위에서는 연도순으로 선택한다. 단순히 조건이 있는 앞쪽 5개 연도를 고르거나 최소 개수를 채우기 위해 중요 연도를 추가하지 않는다. 제외된 해의 실제 관계도 타임라인에 남는다.
- 전/중/후반의 1–3 / 4–7 / 8–10년 구분은 유지하되, 각 구간에서 실제 중요한 해와 다른 십성의 해를 비교한다. 고정된 적응/정착/정리 서사를 부여하지 않는다.
- 현재 위치는 평가 연도만 따른다. 같은 대운 안에서 평가 연도를 옮겨도 10개 연도의 사실·중요도·해설·이전/다음 비교는 바뀌지 않는다.
- 교운은 기존 `DayunSelection`의 notice와 정확한 KST 시각 또는 가능한 범위를 그대로 표시한다. 연도표를 1월 1일 전환으로 취급하지 않는다.
- 일은 결과물/책임/학습 연도의 차이, 돈은 거래/반복 수입·지출/생산/공동 비용의 차이, 관계는 대등함/책임/표현 및 실제 일지 관계를 구분한다. 특정 직업·수익·결혼/이별을 예언하지 않는다.
- Bridge v2의 기존 검증 장면과 evidence ID를 유지한다. 매년 반복되던 유형 이름 기반 MBTI 설명을 새 타임라인에 넣지 않고, 본문에서 검증된 장면을 한 번 사용한다. 새로운 상호작용을 억지로 만들지 않는다.

## Writer와 출판

Writer 입력에 동일한 `decadeReading`을 전달한다. 기존 deterministic evidence 부착 경로가 동일한 연도 상세와 phase를 사용한다. 2026~2030 고정 예시, 모든 해 2문단, 매년 MBTI 설명, 고정 단계 의미 등 새 계획과 충돌하던 지시를 제거했다.

새 계획이 있는 snapshot은 연도 간지/십성, 강조 badge, 중요 연도 목록, 이유의 evidence ID와 읽기 구조를 검사한다. 손상된 새 구조는 렌더 전에 거부한다. 이전 snapshot에 새 editorial 필드가 없다는 이유만으로 거부하지 않는다. 기존 Dayun/inputBasis 검증은 유지한다.

## 5개 샘플과 중요 연도

모두 양력·정확 시각·Asia/Seoul 입력. 평가 시각은 해당 연도 9월 21일 12:00 KST.

|샘플|출생·성별·MBTI|평가 연도|실제 대운|위치|중요 해설 연도|
|---|---|---:|---|---|---|
|A|1996-12-06 14:15 / 남 / ENTJ|2026|壬寅 2017–2026|10년차 후반|2017, 2018, 2025, 2026|
|B|1980-05-15 09:30 / 여 / ISFJ|2026|丙子 2023–2032|4년차 중반|2023, 2026, 2028, 2032|
|C|2001-08-20 16:20 / 남 / ENFP|2026|癸巳 2025–2034|2년차 초반|2025, 2028, 2031, 2034|
|D|1996-12-06 14:15 / 여 / 미입력|2026|丙申 2026–2035|1년차·교운|2026, 2027, 2034, 2035|
|E|1996-12-06 14:15 / 남 / INTP|2035|癸卯 2027–2036|9년차 후반|2027, 2029, 2032, 2036|

A/E는 같은 출생 원국에서 서로 다른 대운과 MBTI를 보는 비교도 겸한다. 별도로 A의 평가 연도를 2025/2026으로 바꾸는 동일 대운 counterfactual이 있다.

- A: 이전 편재의 외부 거래 질문에서 정관의 역할·신뢰 기준으로, 다음 편관의 압박·책임 범위로 연결한다.
- B: 2026 丙午 편인과 丙子 대운의 子午 충을 따로 짚는다. 같은 편인 대운인 C와도 현재의 연간 질문이 다르다.
- C: 2028 戊申 정재에서 巳申 육합과 형이 함께 확인된다. 한쪽만으로 길흉을 단정하지 않는다.
- D: 실제 2026-08-15 16:15 KST 교운과 2027 丑未 충을 구분한다. MBTI를 추정하지 않는다.
- E: 2029 己酉 식신과 卯酉 충을 바탕으로 결과물과 기존 역할 조정의 관계를 읽는다.

## Before / After

같은 입력, 같은 평가 시각으로 HEAD와 변경본을 각각 생성했다. 렌더 문자량은 SSR에서 태그/entity를 제거하고 공백을 정규화한 길이이며 펼칠 수 있는 연도 상세를 모두 포함한다. 긴 문장은 40자 이상 문장을 기준으로 따옴표·종결기호·공백을 정규화한다. 중복 수는 첫 출현을 제외한 추가 출현 수다.

|샘플|렌더 문자량 전→후|고유 긴 문장 전→후|내부 exact/연도 정규화 중복 전→후|기본 연도 상세|중요 연도 상세|
|---|---:|---:|---:|---:|---:|
|A|12,324 → 13,409|129 → 140|5 → 1|184–230자|480–532자|
|B|11,654 → 12,778|115 → 136|5 → 0|193–237자|438–525자|
|C|12,817 → 13,851|134 → 147|8 → 1|188–236자|451–528자|
|D|11,295 → 12,624|112 → 129|7 → 2|183–242자|445–508자|
|E|11,916 → 13,100|121 → 141|7 → 1|171–238자|474–531자|

변경 전 연도 상세는 대체로 497–543자 수준의 균일한 구성이다. 변경 후 일반 연도는 짧아지고 중요한 해는 깊이를 유지하며, 새 구간 비교와 일/돈/관계 서사를 합친 전체 정보량은 모두 증가했다. 50개 연도 모두 고유 coreFlow와 실제 사실이 있다. 번호 filler는 전후 모두 0이며 다시 도입하지 않았다.

고객 간 공통 장문은 **모든 지표가 개선된 것은 아니다**. 5명 모두에 공통인 문장 30 → 32개, 2명 이상 공통인 문장 66 → 80개, 두 고객 사이 평균 공통 문장 36 → 44.2개다. 같은 십성의 행동 기준, 영역별 일반 운영 설명, 안전 안내가 남아 있다. 연도/이름 접두사를 붙여 이 수치를 인위적으로 낮추지 않았다. 이는 후속 개인화 QUALITY-P1로 남긴다.

새 연도 근거 ID는 A/B/C/D/E 각각 69/58/71/67/69개이며, 각각 50/39/52/48/50개의 중요도 판단 근거를 추적할 수 있다. **개수는 품질 점수가 아니다.** 기존 validated Bridge 장면은 A(context-switch), C(agreement)에 있고 B/D/E에는 해당 장면이 없다. 없는 Bridge를 새로 만들어 넣지 않는다.

## 검증과 한계

영구 회귀 테스트: `majorFortuneTenYearQuality.test.tsx` 17건. 5명 publish/SSR/문자량, 10개 연도, 중요도와 근거, 약한 사실 개수 증가, 현재 위치 counterfactual, approximate/unknown 범위, Writer mock과 fallback 동일 근거, 연도/십성/강조/구조 변조 거부, 이전 snapshot 호환을 다룬다. 기존 반복 방지와 51조합×6상품 회귀도 유지한다.

- `pnpm test`: 356 files / 3,661 tests PASS.
- `pnpm lint`: PASS, warning 0.
- `pnpm build`: PASS.
- `git diff --check`: PASS.
- `pnpm exec tsc --noEmit`: 기존 test-only 387건 유지, production source 0, 신규 원인 0. 기존 2건의 union 문자열 출력 순서만 `INTP | ENTJ` ↔ `ENTJ | INTP`로 달라졌다. repo-wide tsc 자체는 아직 실패 상태다.
- OpenAI/Toss/production DB 호출·쓰기·배포 0. Writer는 mock transport, 전체 테스트는 network guard를 사용했다.

로컬 비교 자료: `/tmp/major-v2-audit/head-932576d.json`, `/tmp/major-v2-audit/after.json`. 재현 입력과 정보량 하한은 영구 테스트에 남겼다. 임시 audit 테스트는 repo에서 제거했다.

남은 QUALITY-P1: 동일 십성 고객 사이의 공통 행동 문장 세분화, 실제 증거가 충분한 경우에만 더 많은 운×행동 Bridge 장면 연결. 이번 우선순위는 검증된 사건 예측 모델이 아니라 문서의 해설 깊이를 고르는 명시적 규칙이다. 5샘플 deterministic 품질을 검증했으며 실제 OpenAI 생성의 문학적 품질을 확인한 것은 아니다.

## 수정 파일

- `src/lib/report-knowledge/majorFortuneDecadeReading.ts`
- `src/lib/report-knowledge/majorFortuneTypes.ts`
- `src/lib/report-knowledge/majorFortuneEvidence.ts`
- `src/lib/report-generation/majorFortuneGenerationHandler.ts`
- `src/lib/report-generation/majorFortuneReportDraftValidator.ts`
- `src/lib/report-generation/dayunPublication.ts`
- `src/lib/report-generation/openaiMajorFortuneReportWriter.ts`
- `src/lib/report-generation/openaiMajorFortuneReportWriterPrompt.ts`
- `src/app/reports/[reportId]/MajorFortuneReportView.tsx`
- `tests/unit/report-generation/majorFortuneTenYearQuality.test.tsx`
- `tests/unit/report-generation/openaiMajorFortuneReportWriterPrompt.test.ts`
- `tests/unit/report-knowledge/majorFortuneEvidence.test.ts`
- 이 문서

`.gitignore`, `supabase/.temp/`의 기존 변경은 제외한다. Production 적용은 별도 승인 작업이다.
