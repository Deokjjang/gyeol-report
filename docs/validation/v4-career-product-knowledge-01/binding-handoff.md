# 커리어 전용 근거 연결 인수 — 미구현

기본 주소는 career_money_study → CH01~CH09 → P1~P4 → S1~S4 → ckr:material:* 이다. K1~K10은 별도 내부 질문이다. 참조 행렬은 실제 배정·추천 순위의 변환 코드가 아니다. 192개 후보가 생성기에 자동 연결된 상태가 아니다.

| 단계 | 확인할 입력 | 출력·보류 조건 |
|---|---|---|
| 원천 | file/export/index 또는 pointer, 버전/hash, 원래 검토 상태 | 연구 키; direct/inferred를 실증으로 승격 금지 |
| 원국 Evidence | 기존 producer ID/version, owner, 위치·월령·강약·성립·반례·시간 support | 실제 계산 사실; 연구 ID로 Evidence 발급 금지 |
| 의미 | 같은 기능·대상·범위, signed axis/facet 조건 | 자료가 있어도 점수만으로 세부 행동 확정 금지 |
| MBTI | 실제 입력 유형·분야·trait·primary node·pointer/hash | 미상은 보류; 다른 유형·Pair로 보충 금지 |
| Fusion | 등록 ID·양측 근거·source assignment·domain/context·조건 split | 신규 조건부 후보는 등록으로 승격 금지 |
| status | 실제 10값, 입력된 고용 상태와 현재 과제 | 상황 질문만 바꿈; 의미 점수·원국 변화 금지 |
| detailJob | 입력 원문, V3 parser와 V4 override의 실제 결과, 확인한 과제·권한 | 직업 이름만으로 경험·실력·고객·자격·소득 생성 금지 |
| 전문 후보 | 명리/선호와 실제 업무 기능의 교집합, 추가 학습·반례 | 추천 연구가 현재 추천을 만들거나 순위를 바꾸지 않음 |
| 문단·역할 | 원본 36 purpose·144 role, 질문·독립 기능·원천 부족 | 역할이 충족되지 않으면 보류; 다른 질문으로 바꿔 채우지 않음 |
| 중복·회수 | canonical fact root, owner·유형·맥락, 실제 introduced ledger | 동일 root 별칭·파생 Fusion을 독립 사실로 중복 계산 금지 |
| 고객 표현 | 별도 승인된 내용과 실제 입력 사실 | 가상 장면을 과거 경험·예언으로 바꾸지 않음 |

## 실제 상태와 직무를 분리

프리랜서 사진가 A의 최종 workFunction은 unknown이다. 사진가 직접 분류는 현재 없다. self_employed에서는 넓은 business_operations 분기로 갈 수 있지만 사진 분야 인식이 아니다. 상품/인물 사진가 S 모두 unknown이다. 새 parser는 미구현이다.

번역가는 V3 직접 function unknown이지만 V4 workManifestation의 언어 override로 language_mediation이 된다. 매장 운영은 employee일 때 customer_service, self_employed일 때 retail_operations가 된다. homemaker의 caregiving·unemployed의 recovery는 상황 분기이며 가족 구성·질병의 사실이 아니다.

사진의 목적·선별·보정·납품, 재무의 기간·가정, 개발의 재현·검증, 교육의 이해·전이, 돌봄의 관찰·인계는 서로 다른 업무 기능이다. 새 자료가 존재한다고 실제 고객이 이를 수행했다거나 능력이 확인됐다고 말하지 않는다. 사진 현장 적응의 개인 원천 연결 1건은 보류했다. 기존 단계 운영 의미를 기술 숙련으로 자동 이전하지 않는다.

직업 상태 미입력에 회사·구직·사업을 만들지 않는다. MBTI 미상에서는 유형·Fusion 역할을 보류하며 명리 단독 자료는 실제 원국 전제가 맞을 때만 검토한다. 시간 미상에서 시주·전체 부재·완성 구조·숨은 가족 사실을 합성하지 않는다.

## 추천·경제·학습 계약

CH03.P2/P3는 실제 legacy 추천 proof·원래 순위를 받아 설명해야 한다. 23직무 자료는 모두에게 추천될 목록이 아니다. CH03.P4는 실제 avoid proof를 확인하고 조정과 회피를 나눈다. 기존 recommendedJobs 190/avoid 120 가운데 unresolved trait가 있는 3항목은 연결 전 확인할 공백이다. 이번에는 원본 JSON·추천 알고리즘을 고치지 않았다.

명리 재성·유형의 돈 선호는 실제 소득·자산·투자 능력이 아니다. 수입·매출·회수·남는 자원·준비·수정·유지 시간을 구분한다. 특정 가격·저축 비율·수익률·성과 보장은 만들지 않는다. 학습 흥미·수료·자격·새 조건 수행·직무 권한은 각각 다르다. 자격과 공고의 최신 요건은 후속 실제 작업에서 별도 확인한다.

## CH09 회수

선행MeaningRefs는 가능한 후보 풀이다. INTP·INTJ, ISFJ·ENFJ 등 서로 다른 유형의 대안이 한 입력에 모두 성립한 목록이 아니다. 같은 owner·실제 유형·상태·fact root·맥락에서 앞서 실제 소개된 호환 부분집합만 회수한다. 새 성격·명리·MBTI·기간·추천·소득 사실은 0이어야 한다.

## 원고와 Book 보호

기존 renderer의 facet당 4 primary 사용, root 사용 횟수 정렬, 같은 장 facet 중복 방지, 최소 3~최대5 문장·동일문장 차단은 변경하지 않는다. 부족하면 기록하는 기존 shortages 정책을 유지한다.

기존 validator의 8,000~10,000자·문단/문장 수·중복·회수 진단은 qualityIssues다. 알 수 없는 근거·미지원 직장 맥락·발명 MBTI·운명 확정은 hardErrors다. current/money/roles/study/direction 필수 섹션과 opening이 있고 hardErrors가 없어야 release를 선택한다. qualityIssues만으로 fallback이 결정되는 것은 아니다. 새 자료가 이 정책을 바꾸지 않는다.

계산·축·Fusion·추천·원고 선택·한국어 조합·발행·저장·재열람·Worker·결제·인증·DB는 후속 작업을 승인하기 전까지 그대로 둔다. 기존 Book은 저장 snapshot으로 읽고 연구 자료로 재생성하지 않는다. bindingProposalTypes는 위 계약의 타입 제안이며 실행 validator·engine이 아니다.
