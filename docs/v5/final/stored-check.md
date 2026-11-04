# 저장본 검사(최종판 3, 호출 0)

명령: `NODE_PATH=tools/llm/shim pnpm exec tsx tools/final/stored-check.ts --md docs/v5/final/stored-check.md`

## 인용 문장

| 항목 | 책 | 인용 | 잡는 곳 | 결과 |
|---|---|---|---|---|
| 1-6 | p6d/sodam-full | 편인(偏人) → 렌더 사전 표기 | render | PASS — 정리(한자 지움) → 렌더 0곳 "편인(偏印)" |
| 1-13 | p6d/sodam-full | 이 책은 2026년 11월 4일 기준으로 썼어요 | tidy | PASS — 정리 단계에서 바뀜 |
| 1-14 | p6d/sodam-full | 지난 경험을 기준점으로 삼는 지난 경험 기억(Si) — 저장본은 이미 바뀐 꼴이라 작가 원문 'Si'로 다시 봄 | tidy | PASS — 정리 단계에서 바뀜 |
| 1-7 | p6d/sodam-full | 표지 「빗속에서도 꺼지지 않는 카페 불빛」 | 피할 이미지 | PASS — 피할 이미지 명사(불빛) |
| 1-7 | p6d/sodam-full | 1장 첫 소제목 「빗속에서도 꺼지지 않는 캠핑 랜턴」 | 피할 이미지 | PASS — 피할 이미지 명사(랜턴) |
| 1-1 | p6d/taeo-career | 입력하지 않은 경력과 연차는 쓰지 마세요. | lint | PASS — guide_copy @4.1.0 |
| 1-3 | p6d/taeo-career | 성격도 같은 쪽을 가리킵니다. | lint | PASS — orphan_start(성격도) @2.0.0 |
| 1-4 | p6d/taeo-career | 구체 사실을 하나씩 확인하는 | lint | PASS — mbti_misattr @3.0.0 |
| 1-4 | p6d/taeo-career | 말하지 않아도 필요한 것을 미리 챙겨 두는 | lint | PASS — mbti_misattr @3.1.1 |
| 1-4 | p6d/taeo-career | 모임이 끝나면 오히려 기운이 나는 | lint | PASS — mbti_misattr @3.1.3 |
| 1-5 | p6d/taeo-career | 월지의 비견은… | lint | PASS — pillar_claim @1.2.0 |
| 1-12 | p6d/taeo-career | 실제 누군가를 지목하는 말은 아니에요 | lint | PASS — notice_repeat @5.0.2 |
| 1-12 | p6d/taeo-career | 이 장은 투자 권유가 아니라 … | lint | PASS — notice_repeat @8.0.0 |
| 1-12 | p6d/taeo-career | 이 장은 권유가 아니라 성향 이야기예요 | lint | PASS — notice_repeat @8.0.0 |
| 1-14 | p6d/taeo-career | 어차피 비겁이 강한 당신은 | lint | PASS — awkward @5.2.1 |
| 1-3 | p6d/chaerin-love | 여기에 식신(食神)의 다정함이 더해집니다. | lint | PASS — orphan_start(여기에) @2.0.0 |
| 1-8 | p6d/chaerin-love | 연애 중 브리프에 「프로필 한 줄은 이렇게」·「첫 만남 30분에는」 | 브리프 | PASS — 2장·4장 절 질문: 사람을 끄는 내 매력은? / 오래된 사이에서 다시 보이는 내 매력은? / 처음 끌렸던 모습은 어떻게 다시 켤까? / 좋아하는 마음은 지금 어떻게 표현될까? / 둘의 대화 리듬은 어떻게 맞출까? / 마음을 숨길 때와 드러낼 때는? |
| 1-5 | p6d/pair-business | 백은솔님에게는 겁살에 해당하는 경계심이 일지에 | lint | PASS — feature_owner @4.2.1 |
| 1-14 | p6d/pair-business | 매우 신약 → 혼자 버티는 힘이 아주 여린 | tidy | PASS — 정리 단계에서 바뀜 |
| 1-14 | p6e/sodam-full | 충 축미충(P6e) | tidy | PASS — 정리 단계에서 바뀜 |
| 1-2 | p6e/taeo-career | 조건형 | lint | PASS — safety(internal_term) @5.2.1 |
| 1-5 | p6e/taeo-career | 정인이 강해(인성 보통) | lint | PASS — group_claim @1.2.2 |
| 1-10 | p6e/taeo-career | 배움과 보호의 힘 | lint | PASS — group_name(배움과 보호의 힘) @2.0.0 |
| 1-10 | p6e/taeo-career | 돈을 쫓는 힘 | lint | PASS — group_name(돈을 쫓는 힘) @7.0.0 |
| 1-2 | p6e/chaerin-love | 상황 씨앗 | lint | PASS — safety(internal_term) @7.1.0 |
| 1-12 | p6e/chaerin-love | 결혼의 시기나 여부는 여기서 말하지 않아요 | lint | PASS — notice_repeat @7.0.2 |
| 1-5 | p6e/pair-business | 백은솔님에게 없는 쇠(庚 1개) | lint | PASS — element_count @3.0.0 |
| 1-2 | p6e/seoha-love-single | 입력에 없… | lint | PASS — safety(internal_term) @8.1.0 |
| 1-14 | p6e/seoha-love-single | 되려 → 되레 | tidy | PASS — 저장본에 없음(이미 바뀐 꼴) |
| 1-14 | 정리 시험 문장 | 1해 → 한 해 | tidy | PASS — 「남은 해는 1해예요.」 → 「남은 해는 한 해예요.」 |
| 1-14 | 정리 시험 문장 | 기능 하이픈 → '~과 ~', 겹친 '감각' 하나로 | tidy | PASS — 「가치 기준(Fi)-지금 이 순간 감각(Se) 감각이 겹쳐요.」 → 「가치 기준(Fi)과 지금 이 순간 감각(Se)이 겹쳐요.」 |
| 1-14 | 정리 시험 문장 | 지난 경험을 기준점으로 삼는 Si → 성향(Si)(이름 되풀이 없음) | tidy | PASS — 「지난 경험을 기준점으로 삼는 Si의 결과 같은 방향입니다.」 → 「지난 경험을 기준점으로 삼는 성향(Si)의 결과 같은 방향입니다.」 |
| 1-14 | 정리 시험 문장 | 몰려 올 → 몰려올 | tidy | PASS — 「창업, 이사가 동시에 몰려 올 때 챙기세요.」 → 「창업, 이사가 동시에 몰려올 때 챙기세요.」 |
| 1-14 | 정리 시험 문장 | 때 일수록 → 때일수록 | tidy | PASS — 「빨리 정해야 할 때 일수록 멈추세요.」 → 「빨리 정해야 할 때일수록 멈추세요.」 |
| 1-14 | 정리 시험 문장 | 중화 → 세지도 약하지도 않은 가운데(되풀이 하나로) | tidy | PASS — 「내 힘의 세기는 중화라서 세지도 여리지도 않은 가운데예요.」 → 「내 힘은 세지도 약하지도 않은 가운데예요.」 |
| 1-14 | 정리 시험 문장 | (비문은 검사 awkward → 수리) | tidy | PASS — 「어차피 비겁이 강한 당신은 손해를 봐요.」 → 「어차피 비겁이 강한 당신은 손해를 봐요.」 |

잡히지 않은 인용: **0**

## 책별 수리 대상(새 검사)

| 책 | 수리 대상 수 | 규칙별 |
|---|---|---|
| p6d/sodam-full | 6 | seed_copy 4 · awkward 1 · notice_repeat 1 |
| p6d/taeo-career | 24 | group_name 2 · pillar_claim 1 · orphan_start 1 · mbti_misattr 5 · notice_repeat 9 · guide_copy 1 · awkward 1 · seed_copy 1 · db_copy 1 · evidence_missing 2 |
| p6d/chaerin-love | 11 | orphan_start 1 · seed_copy 6 · group_claim 1 · notice_repeat 2 · safety:internal_term 1 |
| p6d/pair-business | 2 | feature_owner 1 · safety:score_mismatch 1 |
| p6e/sodam-full | 3 | nickname 1 · db_copy 1 · notice_repeat 1 |
| p6e/taeo-career | 20 | group_name 8 · group_claim 3 · notice_repeat 5 · db_copy 2 · safety:internal_term 1 · seed_copy 1 |
| p6e/chaerin-love | 7 | group_claim 1 · notice_repeat 3 · safety:internal_term 2 · safety:fact_children 1 |
| p6e/pair-business | 2 | element_count 1 · notice_repeat 1 |
| p6e/seoha-love-single | 5 | farming 1 · notice_repeat 2 · safety:internal_term 1 · safety:fact_children 1 |
