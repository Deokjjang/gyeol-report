# 실제 기간 경로 감사

기준 3117327의 관련 계산·증거·편집·발행 29개 경로를 직접 조사했다. 계산 B와 연구 C/D는 별도다.

| 경로/함수 | 입력 → 출력 | 소유자·시간 | 제한 |
|---|---|---|---|
| `src/lib/saju/customerDayun.ts#calculateCustomerDayun` | 정규화 입력·가능 출생 분 범위 → sect2 순역·시작 KST/범위·12cycles | dayun / exact/approximate/unknown; 불안정 구간 DAYUN_UNCERTAIN | 순서 안정성과 시각 확정은 별개 |
| `src/lib/saju/customerDayun.ts#selectCustomerDayun` | cycles·선택연도·평가시각 → 명목 selectedCycle·activeCycleAtEvaluation·transition | dayun / 정확/범위·첫 운 이전 | 연도 선택이 활성 시각을 대신하지 않음 |
| `src/lib/saju/solarTerms.ts#getSolarTermInstants` | 명시 KST 구간 → 기존 library의 절기 절대시각 | calendar / KST 고객 시각과 UTC8 비교용 시각 분리 | 새 천문 계산 아님 |
| `src/lib/saju/lunarJavascriptPillars.ts#createSajuCalendarContext` | 실제 KST instant → canonical 연월일시주 | calendar / 입춘·절입 전후 | 출생 원국과 기간 구간 context는 다른 소유자 |
| `src/lib/report-knowledge/majorFortuneRules.ts#getMajorFortuneGanjiInfo` | 기존 대운 간지 → 간지·음양·오행 | dayun / 기본 구성 B | 구성에서 길흉 산출 안 함 |
| `src/lib/report-knowledge/majorFortuneRules.ts#getMajorFortuneCycleForYear` | 명목 cycle연도 → 현재/이전/다음 nominal cycle | dayun / 연도 범위 inclusive | 정확 교운 시각 선택 아님 |
| `src/lib/report-knowledge/majorFortuneEvidence.ts#getMajorFortuneBranchInteractions` | 실제 운지·natal 배열 → 육합·충·삼합·형·해·반합·파 | natal_dayun / 원국 자리 유지가 전제 | 레거시 혼합 배열 호출과 분리된 호출 구분 |
| `src/lib/report-knowledge/majorFortuneEvidence.ts#buildMajorFortuneEvidence` | 계산된 원국·대운·맥락 → 십성·오행·관계·기존 신호·MBTI bridge | natal_dayun / source별 실제 조건 | lifeArea 신호·기존 해석은 신규 연구 사실로 재집계 안 함 |
| `src/lib/report-knowledge/majorFortuneDecadeReading.ts#buildMajorFortuneDecadeReading` | packet·선택 cycle·natal → 10개 연주와 cycleRelations/natalRelations 분리 | dayun_saeun + natal_saeun / nominal 연도 단위 | 3·4·3 편집 phase는 새 시간 계산 아님 |
| `src/lib/report-knowledge/annualFortuneYearRules.ts#getTenGodForStemPair` | 기준 stem→대상 stem → 십성10 | reference-sensitive / native 일간 또는 명시 cycle 기준 | 역방향 십성과 문자열 비교만 하면 안 됨 |
| `src/lib/report-knowledge/annualFortuneYearRules.ts#getAnnualGanjiInfo` | 선택 연도 → 연간 간지·오행 | saeun / 선택연도 표 | 입춘 전 actual연주 ledger와 별개 |
| `src/lib/report-knowledge/annualFortuneYearRules.ts#getBranchPairRelations` | 실제 두 지지 → 육합·충·형·해·반합·파 | 기간간3scope / caller가 owner/time 부착 | 삼합·천간합·원진·전체삼형 없음 |
| `src/lib/report-knowledge/annualFortuneYearRules.ts#getAnnualBranchInteractions` | 기간 지지·실제 natal 지지들 → 쌍 + 실제3자 삼합/부분 반합 | natal_period / affectedPillars ordinal은 natal만인 배열 전제 | 동일관계 여러 자리의 중복 vs 실제owner 구분 |
| `src/lib/report-knowledge/annualFortuneEvidence.ts#buildAnnualFortuneEvidence` | 선택연도·원국·customerDayun → 실제 annual packet·calendarMonths·legacy fallback | natal_saeun / 현행 customerDayun있으면 v2 monthly ledger | Dayun미제공 레거시 진단 월배열은 actualJie ledger 아님 |
| `src/lib/report-knowledge/annualFortuneEvidence.ts#buildAnnualMonthlyFortunes` | 레거시 연도·일간·원국 → 옛 월별 고정 seed | legacy monthly / customerDayun없는 진단 fallback | 최신 actual 절입 근거로 승인 안 함 |
| `src/lib/report-knowledge/annualMonthJie.ts#getAnnualJieBoundaries` | 선택 civil year → 실제 월주 바뀌는12절입 | calendar / t-1초 vs t canonical month 변경 | 중기 포함24절기를 전부 월경계로 쓰지 않음 |
| `src/lib/report-knowledge/annualMonthJie.ts#buildAnnualMonthCalendar` | natal dayMaster/branches·customerDayun → 12civilmonth와 다중 segment·effectiveAnnualPillar·대운context | natal_wolun + dayun_wolun + saeun_wolun / [start,end); 교운 earliest/latest 추가분할 | 대운 후보의 관계만 conditional |
| `src/lib/report-knowledge/annualMonthRelationFacts.ts#buildAnnualMonthRelationFacts` | 월주·확인된 natal 지지·분포표지 → 월-natal7관계·missing/heavy 관찰 | natal_wolun / confirmed source month_natal_branch/element | missing/heavy는 신강약·희기·건강 판정 아님 |
| `src/lib/report-knowledge/annualMonthExtendedEvidence.ts#extendAnnualMonthEvidence` | actual calendarMonths·실제 natal anchor → 지정 신살·십이운성·원진 관찰 | natal_wolun / 각 segment의 source/basis 보존 | 원국표지 재투영이 아님; unsupported 유지 |
| `src/lib/report-knowledge/annualFortuneReading.ts#buildAnnualFortuneReading` | actual packet·segments → 기존 고객 해설·crossPeriods | dayun_saeun / 인접 활성운·실효연주 같으면 구간연결 | 설명 문자열과 원시 계산은 별개 |
| `src/lib/interpretation-v3/majorFortuneHorizon.ts#buildMajorFortuneHorizon` | 기존 packet·계산·futureYears10 → 지난3+현재1+미래10=14rows·transition | major_product / actual KST/range 보존 | horizon row는 연간 상세 관계구간 아님 |
| `src/lib/interpretation-v4/majorEvidence.ts#majorNarrativeEvidence` | 실제payload·평가시각 → 14년별 annual reading·원래cycle majorNatal | major_product / writer-disabled; transitionrange유지 | 검증된 원래cycle natal근거를 다음cycle에 복사 안 함 |
| `src/lib/interpretation-v4/annualEvidence.ts#annualNarrativeEvidence` | 실제payload·currentDate·선택year → 12월전체·focus·crossPeriods·annualStemRelations | annual_product / 현재clock과 commerce policyDate분리 | annualStemRelations 선택연주와 actual구간 연주 구별 |
| `src/lib/interpretation-v4/annualEvidence.ts#annualTransitMaterials` | canonical target월 feature → accepted관찰·held목록 | natal_wolun / 망신모호·미지원·비canonical held | 같은feature 관찰합침은 영향 가산 아님 |
| `src/lib/interpretation-v4/timeProductContext.ts#createTimeProductContext` | natal자료·맥락·기존기간근거 → 기간별 관련 응용 후보 | editorial / MBTI/Fusion은 natal반응·대응 관점 | 관련성 점수가 기간 명리 인과관계 아님 |
| `src/lib/interpretation-v4/periodPlanner.ts#planMajorYears` | 14년근거 → 현재·전환·관계 등 편집강조 | major_product / 강조순위 | 좋은운 점수·예측확률 아님 |
| `src/lib/interpretation-v4/periodPlanner.ts#planAnnualMonths` | 12월focus·전체ledger → 월별 편집 강조·boundary 설명 | annual_product / focus는 대표선택 | focus조건을 전체월에 확장 안 함 |
| `src/lib/report-generation/dayunPublication.ts#validateDayunPublication` | 발행 draft·evidence → 기존 대운조건 검증 | publication / 기존저장본·신규발행계약 구별 | 연구자료가 gate를 우회하지 않음 |
| `src/lib/report-generation/annualMonthlyPublication.ts#annualMonthlyEvidenceMatches` | draft·actual monthly packet → 기존 월운 발행 정합성 | publication / legacy와 v2 구별 | 이번에 발행 로직 수정 없음 |

레거시 혼합 배열: majorFortuneEvidence.ts의 1217·1487·1566·1742 근처에서 `[currentCycle.branch,...natalBranches]`를 natal 자리 배열로 넘긴다. 해당 ordinal을 원국 연·월·일·시로 쓰면 안 된다. 최신 분리 경로와 동일하지 않다. 고객 영향은 별도 추적 사항이며 이번에 수정하지 않았다.
