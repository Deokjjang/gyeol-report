# v5 백로그

## B1. 한국 음력 변환 (보류, 2026-10-28)
- 현황: 엔진 음력 변환(`src/lib/saju/solarTerms.ts` `lunarToSolarDate`)은 lunar-javascript의 중국 음력(UTC+8)이다. 한국 음력(KST 합삭)과 1930~2025년 1,152개월 중 43개월의 초하루가 다르다(하루 차이 38, 윤달 위치 차이 3: 1965·2012·2017). 목록 `docs/v5/oracle-lunar-differences.csv`, 근거 `docs/v5/p01-report.md` §2.1.
- 영향 없음: 운영 입력 75건이 전부 양력이고, 입력 화면·유료 생성은 양력만 받는다.
- 결정: **음력 입력은 열지 않는다.** 열기 전에 한국 음력 기준(KASI 표 또는 천문 계산)으로 바꾸고, `tests/oracle/lunarScan.oracle.ts`로 차이 0을 확인한다.
