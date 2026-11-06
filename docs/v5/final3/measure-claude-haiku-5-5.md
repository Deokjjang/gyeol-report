# 측정 채점 — 검수 모델 claude-haiku-5-5

명령: `NODE_PATH=tools/llm/shim pnpm exec tsx tools/final3/score.ts claude-haiku-5-5`

## 범주별 재현율(문장 단위 알려진 문제, 책에 있는 것만)

| 범주 | 차단급 | 전체 | 결정론 검사 | 검수 | 합(잡음) | 재현율 |
|---|---|---|---|---|---|---|
| F | 예 | 27 | 23 | 5 | 25 | 93% |
| C | 예 | 14 | 8 | 1 | 8 | 57% |
| I | 예 | 14 | 8 | 1 | 9 | 64% |
| L | 예 | 19 | 19 | 4 | 19 | 100% |
| R |  | 19 | 9 | 2 | 10 | 53% |
| T |  | 4 | 4 | 0 | 4 | 100% |
| A |  | 9 | 8 | 0 | 8 | 89% |

**차단급(F·C·I·L) 재현율: 61/74 = 82.4%**

## 알려진 문제별

| id | 책 | 범주 | 문제 | 결정론 | 검수 |
|---|---|---|---|---|---|
| D-F1 | final2-deokmin-full | F | 천덕귀인이 일지에(천덕=일간) | fact_term(천덕귀인은 일간에 있다(일지 아님)) | — |
| D-F2 | final2-deokmin-full | F | 비겁이 강해요 + 같은 문단 매우 신약 | group_claim | — |
| D-F3 | final2-deokmin-full | F | 2026 병오 흙과 물을 건드리지 않는 해(午未합) | fact_relation(2026년(병오)은 원국과 丙辛 천간합·午未 육합·卯午 파로 엮인다) | — |
| D-F4 | final2-deokmin-full | F | 신금 특유의 빠른 손(근거 불명) | — | — |
| D-F5 | final2-deokmin-full | F | 흙이 많고 쇠가 묻히면 표현이 늦다(갑목에게 금=관성) | fact_meaning(갑목 일간에게 쇠 기운은 관성이다(식상의 뜻인 「표현」로 풀지 않는다)) | — |
| D-F6 | final2-deokmin-full | F | ENTJ는 혼자 해 보고 막힌 뒤에야 묻는 편(INTP 특성) | — | — |
| D-J1 | final2-deokmin-full | I | 1장 직업 장면: 마감 사흘 전 기능 | — | — |
| D-J2 | final2-deokmin-full | I | 1장 직업 장면: 사업자 통장 | — | — |
| D-I1 | final2-deokmin-full | I | 투자자 미팅 | input_outside(종합 1장에 직업 장면 「투자자 미팅」 → 직업과 무관한 보편 장면으로) | — |
| D-I2 | final2-deokmin-full | I | 투자 유치 자료 | input_outside(입력에 없는 직업 상황 「투자 유치」(입력: IT 서비스 창업(대표·개발) | — |
| D-I3 | final2-deokmin-full | I | 직원 면접 | input_outside(입력에 없는 직업 상황 「직원 면접」(입력: IT 서비스 창업(대표·개발) | — |
| D-I4 | final2-deokmin-full | I | 팀원 | input_outside(입력에 없는 직업 상황 「팀원이」(입력: IT 서비스 창업(대표·개발) ) | — |
| D-I5 | final2-deokmin-full | I | 평가 시즌에 자기 실적표 | input_outside(입력에 없는 직업 상황 「평가 시즌」(입력: IT 서비스 창업(대표·개발) | — |
| D-R1 | final2-deokmin-full | R | 시동이 걸리면 남들 한 달 치 ×2 | — | — |
| D-R2 | final2-deokmin-full | R | 사람이 먼저 바닥 ×2 | — | — |
| D-R3 | final2-deokmin-full | R | 월덕 먼저 숙이는 ×3 | phrase_repeat(당신은갈등이길어지기전에먼저) | — |
| D-R4 | final2-deokmin-full | R | 서운함 한 줄 ×3 | — | — |
| D-R5 | final2-deokmin-full | R | 사람에게 쓰는 돈 월 한도 ×2 | — | — |
| D-R6 | final2-deokmin-full | R | 어떻게 하고 싶어? ×2 | input_outside(입력에 없는 직업 상황 「팀원이」(입력: IT 서비스 창업(대표·개발) ) | — |
| D-R7 | final2-deokmin-full | R | 장바구니 ×2 | — | — |
| D-C1 | final2-deokmin-full | C | 알아보기도 전에 장바구니부터 ↔ 1,000원 아끼려고 30분 | — | — |
| D-A1 | final2-deokmin-full | A | 눈(Ni)는(조사) | 정리(tidy) | — |
| D-L1 | final2-deokmin-full | L | '이렇게 되면'이라는 가정 아래에서만 | label_leak(생성 규칙·면책 노출 「가정 아래에서만」) | — |
| D-L2 | final2-deokmin-full | L | 부모님이 계시다면 | label_leak(생성 규칙·면책 노출 「부모님이 계시다면」) | — |
| D-T1 | final2-deokmin-full | T | 2026년 11월 한 달 등 연·월 고정 | time_fixed(종합 본문 시점 「2026년 11월」 — 운 설명은 「올해(병오)」 한 ) | — |
| SC-RD | final2-sodam-career | A | 렌더 「만드는 힘, 곧 만드는 힘」 | render_dup(「만드는 힘, 곧 만드는 힘」 같은 말을 두 번(쉬운 이름 치환 겹침)) | — |
| SC-C1 | final2-sodam-career | C | 강의와 책도 찾아 듣는 ↔ 배우는 힘이 약해 직접 부딪쳐 | — | — |
| SC-C2 | final2-sodam-career | C | 카페 사장·창업 직군 ↔ 사업은 덜 맞는 쪽 | — | — |
| SC-C3 | final2-sodam-career | C | 계약서 꼼꼼함 ↔ 꼼꼼히 읽지 않고 서명 | — | — |
| SC-I1 | final2-sodam-career | I | 사업자 통장에 처음 찍히는 입금(이미 운영 중) | input_outside(입력에 없는 직업 상황 「사업자 통장에 처음」(입력: 카페 사장 self) | — |
| SC-I2 | final2-sodam-career | I | 수입이 여러 갈래라 | — | — |
| SC-F1 | final2-sodam-career | F | 직군: 자동차 정비사·기계 설계 | db_copy | — |
| SC-F2 | final2-sodam-career | F | 「말과 글」 직군의 독립 사진작가 | db_copy | — |
| SC-R1 | final2-sodam-career | R | 하루 두고 답하기 ×4 | — | — |
| SC-R2 | final2-sodam-career | R | 몰입 폭발형 ×2 | phrase_repeat(재미가붙으면시간가는줄모르는) | R@288 |
| SC-R3 | final2-sodam-career | R | 벌여 둔 일이 많아 ×2 | phrase_repeat(신호는벌여둔일이많아하나도끝) | — |
| SC-R4 | final2-sodam-career | R | 속상해도 티를 내지 않고 ×2 | — | — |
| SC-F3 | final2-sodam-career | F | 귀인은 식신의 모습으로 와요(근거 불명) | — | F@160 |
| SL-L1 | final2-sodam-love | L | 망신살·십이신살 ×3 | label_leak(내부 분류 라벨 「살·십이신살」) | — |
| SL-F1 | final2-sodam-love | F | 축미충과 축술미형(戌 없음) | fact_relation(「축술미형」: 세 글자가 다 있지 않다(丑未 두 글자 형만 있다)) | — |
| SL-L2 | final2-sodam-love | L | 면책: 만남의 시기는 따로 말하지 않아요 | label_leak(생성 규칙·면책 노출 「시기는 따로 말하지 않」) | L@74 |
| SL-L3 | final2-sodam-love | L | 면책: 시기는 말하지 않고 | label_leak(생성 규칙·면책 노출 「시기는 말하지 않」) | — |
| SL-L4 | final2-sodam-love | L | 면책: 자녀의 성별이나 수, 시기 | label_leak(생성 규칙·면책 노출 「시기는 말하지 않」) | — |
| SL-I1 | final2-sodam-love | I | 두 사람이 함께 모으는 여행 통장 ×2 | — | — |
| SL-C1 | final2-sodam-love | C | 시간과 장소를 정확히 ↔ 약속 날짜를 자주 잊는 | — | — |
| SL-F2 | final2-sodam-love | F | 물(수)이 2로 가장 힘이 센(개수와 세기) | fact_mix(오행 개수(겉 글자 2개)와 세기(가장 셈)는 다른 값 — 개수를 세기의) | — |
| SL-I2 | final2-sodam-love | I | 연애 중인데 초반부터 같이 사업하자는 제안 | input_outside(지금 만나는 사이인데 처음 만남 검증 「초반부터」 → 지금 관계 점검으로) | — |
| SL-I3 | final2-sodam-love | I | 연애 중인데 「내 이야기만 캐묻나요?」(처음 만남 검증) | input_outside(지금 만나는 사이인데 처음 만남 검증 「캐묻나요」 → 지금 관계 점검으로) | — |
| SL-R1 | final2-sodam-love | R | 한강 피크닉 ×2 | — | — |
| SL-R2 | final2-sodam-love | R | 한집살이의 일요일 아침 ×2 | — | — |
| SS-C1 | final2-sodam-seongmin | C | 모두 나중에 곱씹는 ↔ 전성민은 그 자리에서 짚는 | pair_profile(전성민:다툼=정리한 뒤) | — |
| SS-C2 | final2-sodam-seongmin | C | 새 제안 거절 버릇 ↔ 묵혔다가 받아들이는 | pair_profile(전성민:새 제안=묵혔다가 받아들임) | — |
| SS-F1 | final2-sodam-seongmin | F | 반안살(둘 다 丑) 한쪽 귀속 | common_split(반안살은 두 사람 모두에게 있다(공통) — 한 사람만의 특징으로 쓰지 않) | — |
| SS-F2 | final2-sodam-seongmin | F | 천문성(둘 다) 한쪽 귀속 | common_split(천문성은 두 사람 모두에게 있다(공통) — 한 사람만의 특징으로 쓰지 않) | — |
| SS-A1 | final2-sodam-seongmin | A | 「짠하다고」(단어 오용) | — | — |
| SS-I1 | final2-sodam-seongmin | I | 잔고가 빠듯한 주 | — | I@21 |
| SS-I2 | final2-sodam-seongmin | I | 사진을 요청하고 싶을 수 있어요(근거 없는 통제적 묘사) | — | — |
| SS-R1 | final2-sodam-seongmin | R | 전날 일정표·준비물 ×2 | scene_repeat | — |
| SS-R2 | final2-sodam-seongmin | R | 간식으로 사과 ×2 | — | I@21 |
| SS-F4 | final2-sodam-seongmin | F | 선물 고르기 장면에 「속상해도 티를 내지 않고」(장면·근거 불일치) | — | C@102 |
| SS-C3 | final2-sodam-seongmin | C | 책 사이: 소담 「가격을 비교하는 편」 ↔ 커리어 「한 곳만 보고 결제」 | — | — |
| final-1 | p6d-taeo-career | L | 입력하지 않은 경력과 연차는 쓰지 마세요. | guide_copy | — |
| final-2 | p6e-taeo-career | L | 조건형 | safety(internal_term) | — |
| final-3 | p6e-chaerin-love | L | 상황 씨앗 | safety(internal_term) | A@200 |
| final-4 | p6e-seoha-love-single | L | 입력에 없… | safety(internal_term) | — |
| final-5 | p6d-taeo-career | A | 성격도 같은 쪽을 가리킵니다. | orphan_start(성격도) | — |
| final-6 | p6d-chaerin-love | A | 여기에 식신(食神)의 다정함이 더해집니다. | orphan_start(여기에) | — |
| final-7 | p6d-taeo-career | F | 구체 사실을 하나씩 확인하는 | mbti_misattr | — |
| final-8 | p6d-taeo-career | F | 말하지 않아도 필요한 것을 미리 챙겨 두는 | mbti_misattr | — |
| final-9 | p6d-taeo-career | F | 모임이 끝나면 오히려 기운이 나는 | mbti_misattr | — |
| final-10 | p6d-taeo-career | F | 월지의 비견은… | pillar_claim | — |
| final-11 | p6d-pair-business | F | 백은솔님에게는 겁살에 해당하는 경계심이 일지에 | fact_term(겁살은 백은솔의 원국에 없다) | F@127 |
| final-12 | p6e-taeo-career | F | 정인이 강해(인성 보통) | group_claim | F@113,F@235 |
| final-13 | p6e-pair-business | F | 백은솔님에게 없는 쇠(庚 1개) | element_count | — |
| final-15 | p6e-taeo-career | F | 배움과 보호의 힘 | group_name(배움과 보호의 힘) | — |
| final-16 | p6e-taeo-career | F | 돈을 쫓는 힘 | group_name(돈을 쫓는 힘) | C@256 |
| final-17 | p6d-taeo-career | L | 실제 누군가를 지목하는 말은 아니에요 | notice_repeat | — |
| final-18 | p6d-taeo-career | L | 이 장은 투자 권유가 아니라 … | notice_repeat | — |
| final-19 | p6d-taeo-career | L | 이 장은 권유가 아니라 성향 이야기예요 | notice_repeat | — |
| final-20 | p6e-chaerin-love | L | 결혼의 시기나 여부는 여기서 말하지 않아요 | notice_repeat | L@195 |
| final-21 | p6d-sodam-full | T | 이 책은 2026년 11월 4일 기준으로 썼어요 | 정리(tidy) | — |
| final-22 | p6d-sodam-full | A | 지난 경험을 기준점으로 삼는 지난 경험 기억(Si) — 저장본은 이미 바뀐 꼴이라 작가 원문 'Si'로 다시 봄 | 정리(tidy) | — |
| final-23 | p6e-sodam-full | A | 충 축미충(P6e) | 정리(tidy) | — |
| final-24 | p6e-seoha-love-single | A | 되려 → 되레 | (책에 없음) |  |
| final-25 | p6d-pair-business | A | 매우 신약 → 혼자 버티는 힘이 아주 여린 | 정리(tidy) | — |
| final-26 | p6d-taeo-career | A | 어차피 비겁이 강한 당신은 | awkward | — |
| final2-27 | final-deokmin-career | R | 커리어 1장 「한여름 도시 아스팔트 위에 선 큰 나무」 | avoid_image(한여름 도시 아스팔트 위에 선 큰 나무) | — |
| final2-29 | final-deokmin-jiwoo | R | 궁합 「도시 아스팔트 위에서도 쭉 뻗어 오르는 큰 나무」 | avoid_image(한여름 도시 아스팔트 위에 선 큰 나무) | — |
| final2-30 | final-sodam-full-dating | R | 종합 1장 「빗속에서도 꺼지지 않는 캠핑 랜턴」(하람과 같음) | avoid_image(빗속에서도 꺼지지 않는 캠핑 랜턴) | — |
| final2-32 | final-sodam-full-dating | R | 「상대의 퇴근 시간에 맞춰 따뜻한 국물을 데워 두는」 | ilju_phrase(,한번열면상대의퇴근시간에맞춰따뜻한국물을데워) | — |
| final2-33 | final-deokmin-jiwoo | C | 역할 뒤바뀜 「사진을 찍을 때 가운데에 서고 발표를 자원하는 쪽은 최지우님」 | scene_owner | — |
| final2-34 | final-deokmin-jiwoo | C | 최지우 8장 「거슬리는 말에 그 자리에서 바로 받아치는」 | pair_profile(최지우:다툼=정리한 뒤) | — |
| final2-35 | final-deokmin-jiwoo | C | 최지우 7장 「거슬리는 말에 그 자리에서 받아치는 쪽은」 | scene_owner | C@215 |
| final2-36 | final-deokmin-jiwoo | C | 장덕민 7장 「한 박자 두고」 | pair_profile(장덕민:다툼=그 자리에서) | — |
| final2-37 | final-deokmin-jiwoo | C | 장덕민 9장 「곱씹는 시간이 필요한 장덕민님」 | pair_profile(장덕민:다툼=그 자리에서) | — |
| final2-38 | final-deokmin-jiwoo | C | 두 사람 묶음 「두 사람은 하고 싶은 일이 떠오르면 바로 말로 풀어내는 편」 | pair_profile(최지우:표현=행동) | — |
| final2-39 | final-deokmin-jiwoo | F | 「현침살이 있어서 갑·신·묘·오 글자가 겹친 만큼」(午 없음) | glyph_list(갑·신·묘·오:없는 글자 오) | — |
| final2-40 | final-deokmin-career | F | 「당신의 사업은 만들고 넓히는 힘이 큰 확장형」(식상 약) | group_claim | — |
| final2-41 | final-deokmin-love | L | 「자녀의 성별이나 수를 말하는 것이 아니라」 | notice_repeat | — |
| final2-42 | final-deokmin-love | L | 「결혼 여부를 정해 주는 것은 아닙니다」 | notice_repeat | — |
| final2-43 | final-sodam-full-dating | L | 「구체적인 일을 말하는 건 아닙니다」 | label_leak(생성 규칙·면책 노출 「형제가 있다면」) | — |
| final2-44 | final-deokmin-career | L | 「지어낸 연차 없이」 | guide_copy | I@142 |
| final2-45 | final-deokmin-career | L | 「상태가 대표라면」 | safety(internal_term) | — |
| final2-46 | final-deokmin-love | T | 「토 과다」 → 흙 기운이 많아서 | 정리(tidy) | — |
| final2-47 | final-deokmin-love | T | 11월 「이번 가을 남은 두 달」 → 2026년 남은 두 달 | 정리(tidy) | — |
| final2-48 | final-deokmin-career | F | 「태어난 날 땅 글자의 갑신」(갑신은 일주) | pillar_claim | — |
| final2-49 | final-sodam-full-dating | F | 종합 1장 「가장 먼저 다가가 분위기를 풀어 주는」(INTP) | mbti_misattr | — |

## 비용·지연

권 17 · 합 $0.08320 · 권당 평균 $0.00489 · 지연 평균 25초(최대 43초) · 형식 오류 0
버린 지적: {"T_not_comprehensive":14,"F_without_ref":41,"quote_not_verbatim":4,"why_says_no_issue":6,"I_without_field":3,"R_without_pair":2,"A_without_fix":2,"C_without_pair":1,"sentence_number":1}
목록 밖 지적(수리 대상): 67건 → .cache/final3/extra-claude-haiku-5-5.tsv (직접 판정)
