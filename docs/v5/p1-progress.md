# P1 지식 DB 진행 기록

브랜치 `v5/p1-knowledge` (v5/main에서 분기). 단위마다 커밋. 세션이 끊기면 이 파일과 커밋 로그로 이어서 한다.

## 단위 목록

| 단위 | 상태 | 비고 |
|---|---|---|
| 0 CLAUDE.md 운영 원칙 추가 | 완료 | 218e9618 |
| 1 현황 조사 → p1-knowledge-plan.md | 완료 | 1a061fff. V4 DB·knowledge-v5 v1·연구용 DB(foundation-deep 236k자) |
| 2 스키마 v2 + lint v2 + v1 legacy/ 이동 | 완료 | 1a061fff. `schema.ts`, `scripts/knowledge-lint.ts`(--only/--strict/--coverage), `scripts/knowledge-render.ts` |
| 3 기준 항목 20개 → p1-gold-samples.md | 완료 | 18 명리 + ENTJ·INFP + Fusion 3. lint 0. pbcopy 완료 |
| 4 대량 작성 (가족별 배치) | 진행 중 | 배치 브리프 `docs/v5/p1-batch-brief.md`. 아래 배치 표 |
| 5 품질 게이트 (검수 로그·커버리지·테스트) | 대기 | |
| 6 완료·병합·보고 | 대기 | |

## 배치 진행 (단위 4)

| 배치 | 파일 | 대상 | 상태 |
|---|---|---|---|
| A1 | myeongri/stem-01.json | stem 10 | 대기 |
| A2 | myeongri/branch-01.json | branch 12 | 대기 |
| A3 | myeongri/day-master-02.json | dayMaster 9 (丁 제외) | 대기 |
| B1~B6 | myeongri/day-pillar-02..07.json | dayPillar 58 (丁丑·庚辰 제외), 10개씩 | 대기 |
| C1 | myeongri/ten-god-02.json | tenGod 7 (偏印·正官·正財 제외) | 대기 |
| C2 | myeongri/ten-god-balance-01.json | tenGodBalance 10 | 대기 |
| D1 | myeongri/shinsal-02.json | shinsal 엔진 15 (현침·반안·장성·도화·홍염·역마 제외) | 대기 |
| D2 | myeongri/shinsal-03.json | shinsal 비엔진 8 (공망·괴강·양인·원진·귀문·천문·음착양차·천라지망) | 대기 |
| D3 | myeongri/gwiin-02.json | gwiin 엔진 5 + 비엔진 6 | 대기 |
| E1 | myeongri/twelve-stage-02.json | twelveStage 11 (帝旺 제외) | 대기 |
| E2 | myeongri/relation-02.json | relation 7 (CHUNG 제외) + variants | 대기 |
| F1 | myeongri/element-02.json | element 목·화 (STRONG/WEAK/MISSING/BALANCED) 8 | 대기 |
| F2 | myeongri/element-03.json | element 토·금 8 + 수 MISSING·BALANCED 2 | 대기 |
| F3 | myeongri/yin-yang-02.json | yinYang 6 | 대기 |
| G1~G4 | myeongri/climate-01..04.json | climate 40, 10개씩 | 대기 |
| H1 | myeongri/structure-01.json | structure 14 | 대기 |
| M1~M4 | mbti/<TYPE>.json | MBTI 14 (ENTJ·INFP 제외), 3~4개씩 | 대기 |
| X1~X6 | fusion/batch-0N.json | Fusion 300+ (상위 60 장면) | 대기(명리 완료 후) |
| T1~T3 | timeline/ganji.json | 60간지 연·월 | 대기 |
| T4 | timeline/ten-god-period.json | 십성 10 × 연/월 | 대기 |
| T5 | timeline/badges.json, flow-rule.json, action-templates.json + 테스트 | 메인 | 대기 |
| Z | id-map.json | V4·v1 → v2 id 매핑 | 대기(명리 완료 후, 메인) |

## 엔진 사실 (2026-10-28 확인)
- `src/lib/saju/`가 내는 id: 신살 27 코드(`ShinsalCode`), 십성 10(한자), 오행 라벨 15(`ElementLabel`), 음양 3, 일간 10, 구조 패턴 14.
- 합충: 천간합·육합·충만 계산한다(`relations.ts`). 삼합·방합·형·파·해·십이운성·조후·공망은 엔진에 없다 → 지식은 먼저 쓰고 `engineSupport: false`로 표시, 엔진 확장은 P2.

## 결정 기록
- (P1-D1) 장면 길이 상한 60→140자, 문장 90자, 평균 길이 상한 폐지. 근거: v1 품질 저하의 직접 원인(조사 결과).
- (P1-D2) id는 엔진 코드·한자 리터럴에 맞춘다(`dayPillar:丁丑`, `shinsal:HYEONCHIMSAL`, `element:WATER:STRONG`).
- (P1-D3) 합충형해 짝은 종류 항목의 `variants`로. 사용자 확인.
- (P1-D4) v1 데이터는 `legacy/`로 이동, P3 이후 제거. 사용자 확인.
- (P1-D5) 조후 40개는 전체 스키마. 사용자 확인.
- (P1-D6) 연구용 DB 추출은 별도 패스 대신 각 가족 배치가 자기 대상의 foundation·deep 항목을 grep해 출처로 쓴다. 출처 없으면 confidence=추정. 근거: 단순함.
- (P1-D7) 서브에이전트는 커밋하지 않는다. 메인이 검수 후 배치 단위로 커밋.
