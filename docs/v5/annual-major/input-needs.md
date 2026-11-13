# 입력 조건 꼬리표 표(AM2-7 2부)

- 만든 날: 2026-11-13 · 도구 `tools/annual-major/am2-7-tags.ts` · 낱말표 `src/lib/brief/premise.ts` (premise-68-q1y5od) · 표 `src/data/knowledge-v5/input-needs.json`(3042개).
- 까닭: P6 판독 차단 17 가운데 6이 거르지 못한 씨앗 · 처방 종류였다(호감 ×2 · 자취방 · 월급날 · 킥오프 · 영업 전화). 금지어 목록은 빠진 낱말이 그대로 지나간다 — 항목마다 「필요한 입력」을 달고, 꼬리표가 없는 항목은 쓰지 않는다(기본 거절).
- 모르는 입력은 「없음」으로 본다. 사는 곳 · 차 · 반려동물은 입력 칸이 없어 늘 없음이다.

## 출처별 꼬리표 수

| 출처 | 항목 | 필요 입력 없음 | 필요 입력별 |
|---|---|---|---|
| MBTI 씨앗(mbti-seeds) | 2620 | 1658 | job:employee 209 · job:work 252 · job:active 6 · job:earn 1 · job:business 56 · job:shop 43 · job:freelancer 8 · job:student 26 · job:study 20 · rel:single 210 · rel:partner 226 · residence 16 · other 46 |
| 화면 할 일 문형(action-templates) | 353 | 320 | job:employee 3 · job:work 3 · job:business 1 · job:study 4 · rel:single 21 · rel:partner 1 |
| 십성 시기 장면(ten-god-period) | 70 | 40 | job:employee 16 · job:work 7 · job:shop 1 · job:freelancer 1 · job:student 1 · job:study 2 · rel:single 1 · rel:dating 3 · rel:partner 2 · other 1 |

- 조립 문장(카드 영역 줄 · 화면 살필 점 · 좋은 것 · 그림 · 십성 뜻 · 처방 종류 이름 · 짝 이유)은 내보낼 때 같은 낱말표로 맞춘다(`neutralize` · `fitSegments`): 맞지 않는 말은 중립 꼴로, 중립 꼴이 없으면 그 마디를 뺀다.

## 낱말표

| 말 | 필요 입력 | 중립 꼴(돈 버는 일 있음 / 그 밖 · 연애 중 / 기혼) |
|---|---|---|
| 월급날 대신 | job:employee | work:  · other:  |
| 월급날이 아니어도 | job:employee | work:  · other:  |
| 월급날 | job:employee | work: 수입이 들어오는 날 · other: 돈이 들어오는 날 |
| 월급 밖 수입 | job:employee | work: 본업 밖 수입 · other: 뜻밖의 작은 수입 |
| 월급 | job:employee | work: 수입 · other: 뺌 |
| 연봉 | job:employee | 뺌 |
| 승진 | job:employee | 뺌 |
| 인사 평가 | job:employee | 뺌 |
| 직함 | job:employee | 뺌 |
| 결재 | job:employee | 뺌 |
| 사내 | job:employee | 뺌 |
| 부서 | job:employee | 뺌 |
| 팀장 | job:employee | 뺌 |
| 야근 | job:employee | 뺌 |
| 막내 | job:employee | 뺌 |
| 출근 | job:employee | 뺌 |
| 회사 | job:employee | work: 일터 · other: 뺌 |
| 직장인 | job:employee | 뺌 |
| 동료 | job:work | other: 주변 사람 |
| 윗사람 | job:employee | work: 함께 일하는 사람 · other: 주변 사람 |
| 아랫사람 | job:employee | work: 함께 일하는 사람 · other: 나보다 어린 사람 |
| 이직 | job:employee | 뺌 |
| 회의 | job:work | 뺌 |
| 거래처 | job:work | 뺌 |
| 영업 | job:work | 뺌 |
| 출장 | job:work | 뺌 |
| 업무 | job:work | work: 업무 · other: 할 일 |
| 프로젝트 | job:work | 뺌 |
| 팀원 | job:work | 뺌 |
| 보고서 | job:work | 뺌 |
| 명함 | job:work | 뺌 |
| 실적 | job:work | 뺌 |
| 알바 | job:earn | 뺌 |
| 고정 수입 | job:work | other: 들어오는 돈 |
| 단가 | job:work | 뺌 |
| 일터·사회생활 | job:work | work: 일터·사회생활 · other: 사회생활 |
| 일터 | job:work | work: 일터 · other: 사회생활 |
| 거래 트기 | job:work | 뺌 |
| 가게 | job:shop | work: 일터 · other: 뺌 |
| 가게 장면 | job:shop | 뺌 |
| 손님 | job:shop | 뺌 |
| 재고 | job:shop | 뺌 |
| 장사 | job:shop | 뺌 |
| 매출 | job:business | 뺌 |
| 직원 | job:business | 뺌 |
| 의뢰 | job:freelancer | 뺌 |
| 학교 | job:student | 뺌 |
| 시험 | job:study | 뺌 |
| 면접 | job:study | 뺌 |
| 취업 | job:study | 뺌 |
| 포트폴리오 | job:active | 뺌 |
| 호감 가는 사람 | rel:single | dating: 연인 · married: 배우자 |
| 좋아하는 사람 | rel:single | dating: 연인 · married: 배우자 |
| 호감 | rel:single | 뺌 |
| 소개팅 | rel:single | 뺌 |
| 썸 | rel:single | 뺌 |
| 새 인연보다 | rel:single | dating:  · married:  |
| 새 인연 | rel:single | 뺌 |
| 연인 | rel:partner | married: 배우자 |
| 데이트 | rel:partner | 뺌 |
| 배우자 | rel:married | dating: 연인 |
| 자녀 | children | 뺌 |
| 자취 | residence | 뺌 |
| 운전 | other | 뺌 |
| 대출 | other | 뺌 |
| 주식 | other | 뺌 |
| 반려동물 | other | 뺌 |
| 직군 장면 | other | 뺌 |

## 필요 입력 뜻

- job:employee 직장인 · job:work 돈 버는 일(직장인 · 자영업 · 프리랜서) · job:business 자영업 · 사업 · job:shop 가게를 하는 자영업(일 상세에 가게 · 매장 …) · job:student 학생 · job:study 학생 · 취업 준비
- rel:single 솔로 · rel:dating 연애 중 · rel:married 기혼 · rel:partner 연애 중 · 기혼 · children 자녀 있음 · residence 사는 곳(입력 없음) · other 입력 칸 없는 사실(차 · 반려동물)
