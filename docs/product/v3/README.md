# V3 Phase 0–1 공통 해석 코어

최신 종합 V3.2의 읽기 다양성/근거 강도 선별, 상단 UI, 6개 fixture 비교와 전체 고객 텍스트는 [COMPREHENSIVE_PHASE_2C.md](COMPREHENSIVE_PHASE_2C.md)를 보세요.

종합 V3.1의 서사/통합표, V2·V3·V3.1 비교 기록은 [COMPREHENSIVE_PHASE_2B.md](COMPREHENSIVE_PHASE_2B.md)에 보존했습니다.

Phase 2 종합의 명시적 버전 연결, 고객 검토 URL/텍스트, 비교·검증 결과는 [COMPREHENSIVE_PHASE_2.md](COMPREHENSIVE_PHASE_2.md)를 보세요. 아래 내용은 Phase 0–1 기준 기록입니다.

기준 master: `edacb1b613af6cc76df4b30554cba2914a649e7c`. 작업 브랜치: `v3/rebuild`.
실행 코드는 `src/lib/interpretation-v3/`에만 추가했다. 현행 생성기·계산기·렌더러의 import/출력/계약을 변경하지 않았다. 결제·Toss·Supabase·법무·배포 설정 변경과 실제 OpenAI 호출은 없다.

## Coverage — 목록, 재료, 완성 문구를 구분

| 대상 | coverage | 의미 |
| --- | --- | --- |
| 구조화 evidence 범주 | 48/48, 100% | 아래 전체 inventory, 소스별 shape와 상품 경로 포함 |
| 기존 추출기 가능한 feature ID | 124/124, 100% | 86개 직접 파생, 64개 upstream 사실 매핑, 중복 제외 124개 |
| 추출기 feature의 원자 재료 | 124/124, 100% | 기존 의미·활용·주의·태그 재사용 |
| native 신살/귀인 detector | 27/27, 100% | native 코드를 knowledge-only 항목과 분리 |
| 전체 명리 원자 재료 | 195/195, 100% | taxonomy + knowledge ID 합집합 및 native 코드; 별칭 포함 |
| V3 검토 문구가 있는 추출기 ID | 30/124, 24.19% | 판단·체감 질문·지침·주의까지 검토 |
| V3 검토 문구가 있는 전체 원자 | 31/195, 15.90% | 나머지 164개는 기존 source material, 완성 문구 아님 |
| 십성 단일/쌍 | 10/10, 45/45, 100% | 쌍: 의미 28, 긴장 12, 별도 조합 없음 5 |
| MBTI | 16/16 유형, 256/256 방향별 pair | 1,213 traits 및 axes/functions/summary/use cases/hints 전부 목록화 |
| MBTI fusion | 6/6 interaction types | 기존 31개 scene의 실제 명리·trait 조건 재사용 |

전체 감사 행은 2,617개다. 범주·열거형·별칭·지식 레코드를 합한 수이며 서로 독립적인 명리 feature 2,617개가 있다는 뜻은 아니다. 100% inventory는 100% 완성된 상품 문구를 뜻하지 않는다. 십이운성 12개는 fact-only로 보존하며 해석 출처가 더 필요하다. 기존 fusion 1건도 강도 근거가 추가로 필요하다.

- [전체 source inventory](FEATURE_INVENTORY.md)
- [원자별 covered / 빈 재료 / needs-source](ATOMIC_COVERAGE.md)
- [45쌍·혼합 규칙·MBTI·맥락 상세](COMPOUNDS_MBTI_CONTEXT.md)

## 실행 계약과 정책

`adaptNatalTable`, `adaptCalculation`, `adaptMbti`, `adaptMajorFortune`, `adaptAnnualFortune`, `adaptMonthSegment`는 전달받은 기존 구조화 결과만 소비한다. 캘린더·명리·MBTI pair DB 계산은 변경하거나 대체하지 않는다. 새 문구가 없는 운성·관계·구조 등은 사실로 보존하되 자동으로 서사를 만들지 않는다. sourceRef와 subject, scope, period, lineage를 유지한다.

`interpretV3`는 같은 사람·선택한 운 구간을 고르고 상품/domain relevance를 통과한 원자·조합·행동 modifier를 지침으로 구성한다. 원래 입력 facts는 그대로 반환한다. 관련도 순위는 내부 편집 선택 기준일 뿐 궁합 점수/등급이 아니다. 여러 운의 구간을 합치려면 Phase 2에서 기존 canonical 구간 교차를 명시적으로 전달해야 한다. 원국에 미래 사실이나 상대방 표식을 덧붙이지 않는다.

- 독립적인 직접 근거가 같은 규칙을 지지하면 strong, 하나의 직접 근거는 domain 판단.
- 같은 feature/별칭/lineage 중복은 강도를 올리지 않는다. MBTI trait 여러 개도 독립 명리 근거로 세지 않는다.
- 충돌은 tension, 조건부·보조 근거는 체감 질문, 매우 약하거나 무관한 근거는 suppress.
- 좋은 근거는 **이미 가진 힘 → 사용 방향 → 보완**으로 작성한다. 노력의 보상으로 운을 약속하지 않는다. 도화/홍염이 관련 상품에서 선택되지 않으면 명시적 coverage warning을 돌려준다.
- V3 copy guard는 안전 filler와 금액·결혼·합격·승진·질병 사건 보장 문구를 검사한다. regex guard는 의미 검토를 대체하지 않으며 미검토 사전 문장을 무조건 확정형으로 바꾸지 않는다.
- 지침 출력 순서는 판단 → 행동 → 이유 → 전문 근거다. 각 지침은 domain/context와 출처, 고객별 evidence refs를 가진다.
- 오행 생활 선택지는 version이 있는 canonical weighted 결과의 부족/과다만 쓴다. 8글자 개수·legacy missingElements·불확실한 시각만으로 생활 처방을 만들지 않는다. 이사/치료/수익 보장 없음.
- 직업/관계 상태는 장면과 지침만 바꾼다. 직업 taxonomy는 직무 요구의 설명이지 사용자의 능력 판정이 아니다. AI 직업 enricher는 interface만 있다.

## Phase 2 준비 상태

공통 타입, 전체 inventory, 재료 registry, 46개 실행 조합, provenance/strength, 6상품 relevance, 31개 MBTI interaction, 상태별 맥락 및 자유 직업 정규화, 지침·문체 guard를 종합 V3에서 사용할 수 있다. **아직 Production에 연결하면 안 된다.** Phase 2에서 미검토 원자의 문구, 별도 복합 해석이 없는 일간·일주·운성·관계, 상품별 분량/중복과 운 구간 선택, 소비자용 근거 표현을 검토해야 한다. 기존 V2 본문 전면 rewrite는 하지 않았다.

## 검증

`tests/unit/interpretation-v3/`에 category/enum/추출기 전 도메인, 십성 10개/45쌍, 조합 결정성, source trace, 사람/기간 격리, MBTI 6종, 맥락 차이, 긴장·질문·억제, 좋은 신호 정책, 오행 입력 경계, production import 격리 검사를 포함했다. 문서 3종도 같은 registry로 재현되는지 검사한다.

V2 대표 6상품은 2026-09-24 시각을 고정해 deterministic generation → publish gate → SSR을 통과하고 전체 draft/evidence/HTML SHA-256이 기준값과 같다. V3 소비 전후 원본 해시도 같다. 기존 18개 fixture 회귀도 함께 실행한다.

검증 실행 결과와 기존 실패 항목은 [VALIDATION.md](VALIDATION.md)에 기록한다.
