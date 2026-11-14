# AM2-3 0번 결함 지도

판독 4건(P2 세운 annual-1 · P2 대운 major-1 · AM-01 4종)과 덕짱님 피드백 6가지의 결함마다 원인 층 · 고친 곳 · 재발 방지 검사 · 확인 방법을 적었다.

- 셈: 차단·경계는 하나씩, 경미는 꼴 단위.
- 원인 층은 원인이 있는 가장 위층이다(카드 → 설계도 → 작가 입력 → 작가 규칙 → 결정론 검사 → 화면).
- 원천 데이터: `tools/annual-major/am2-3-defects.ts`. 이 표는 `tools/annual-major/am2-map.ts`가 지금 코드에서 줄 번호를 찾아 만들었다(호출 0).
- 확인 방법 칸:
  - 「P2 replay 적중」은 저장된 P2 원고에 지금 검사를 대어(`am2-hit.ts`) 그 결함 문장이 잡힌 것이다.
  - 「근원」은 결정론으로 잡지 않고 원인 층에서 막은 것이다. 근거(카드·엔진 diff)를 같은 칸에 적었다.
- 4종은 작가 입력(브리프·지침)을 바꾸지 않았다. 6부 결정론 후처리만 고쳤고, 나머지는 목록으로만 남겼다.

#### P2 세운 annual-1 — 차단 18 / 경계 26 / 경미 10 (원인 층: 작가 규칙 21 · 설계도 8 · 카드 14 · 결정론 검사 6 · 작가 입력 4 · 화면 1)

| id | 등급 | 자리 | 결함 | 원인 층 | 고칠 곳(파일:줄 기호) | 재발 방지 검사 | 확인 방법 |
|---|---|---|---|---|---|---|---|
| A-b1 | 차단 | 1.3 ¶1 | 원국·MBTI 짝의 성질을 그 해 성질로(「그래서 …는 해예요」) | 작가 규칙 | chunked/prompt.ts:17 RULES_COMMON 「원국·MBTI의 성질을 그 해·달의 성질로 바꾸지 않는다」<br>chunked/check.ts:387 rootFlags pair_link(YEAR_END) | pair_link | P2 replay 적중(pair_link) |
| A-b2 | 차단 | 4.2 ¶2 | 근거 없는 단정(안정적) | 작가 규칙 | chunked/prompt.ts:17 RULES_COMMON 「안정적이에요」 금지<br>chunked/check.ts:187 FUTURE_ASSERT | future_assert | P2 replay 적중(future_assert) |
| A-b3 | 차단 | 5.1 ¶2 | 남의 반응 단정 + 근거 없는 질문(나를 돕는 사람은 누구?) | 설계도 | knowledge-v5/product-narratives.json:2274 annual people.q 「이 해 사람 쪽은 언제, 어떻게 열릴까?」<br>chunked/check.ts:51 briefCheck QUESTION_CUES · FUTURE_ASSERT | future_assert | P2 replay 적중(future_assert) |
| A-b4 | 차단 | 7·2027-M04 ¶1 | key 번호 달 혼동(5월 을사월에 4월 비견 뜻) | 카드 | chunked/intake.ts:148 keyLabelOf · KeyPlan.range<br>chunked/prompt.ts:177 chunkHeaders · keyNote · keysToLabels<br>chunked/check.ts:118 month_line · key_value(어간) | month_line·key_value | P2 replay 적중(month_line·key_value) |
| A-b5 | 차단 | 7·2027-M04 ¶1 | 달 혼동(땅 글자 편재, 이 달은 식신) | 카드 | chunked/intake.ts:148 keyLabelOf<br>chunked/check.ts:122 key_value 하늘/땅 글자 | key_value·month_line | P2 replay 적중(key_value) |
| A-b6 | 차단 | 7·2027-M04 ¶1 | 달 혼동(4월 비견·일 줄) | 카드 | chunked/intake.ts:148 keyLabelOf<br>chunked/check.ts:122 key_value 다른 달 줄 어간 | key_value | P2 replay 적중(key_value) |
| A-b7 | 차단 | 7·2027-M04 ¶1 | 달 혼동(다른 달 관계 이름·자리) | 카드 | chunked/intake.ts:148 keyLabelOf<br>chunked/check.ts:122 key_value 다른 key 관계 | key_value | P2 replay 적중(key_value) |
| A-b8 | 차단 | 7·2027-M04 ¶1 | 달 혼동(흐름 1/5, 이 달은 2/5) + 표기 깨짐 + 명사 값 | 카드 | chunked/intake.ts:260 keyPlan 흐름 FLOW_DESC(숫자 없음)<br>writer/safety/p6e.ts:242 nativeNumbers 「/」 뒤 숫자<br>chunked/check.ts:122 key_value 흐름 단어·숫자 | key_value | P2 replay 적중(key_value) |
| A-b9 | 차단 | 7·2027-M04 ¶2 | 달 혼동(다른 달 장면 씨앗) | 카드 | chunked/intake.ts:148 keyLabelOf<br>chunked/check.ts:122 key_value 다른 달·해 장면 씨앗 | key_value | P2 replay 적중(key_value·advice_repeat) |
| A-b10 | 차단 | 7·2027-M04 ¶2 | 달 혼동(4월 돈 줄) | 카드 | chunked/intake.ts:148 keyLabelOf<br>chunked/check.ts:122 key_value 다른 달 줄 어간 | key_value·month_line | P2 replay 적중(key_value) |
| A-b11 | 차단 | 7·2027-M05 ¶3 | 고아 + 다른 달 관계 뜻(인사해) | 결정론 검사 | chunked/check.ts:122 key_value 다른 달 관계 뜻 어간<br>chunked/cut.ts:14 LEANS | key_value | P2 replay 적중(key_value) |
| A-b12 | 차단 | 7·2027-M10 ¶2 | 관계 뜻 섞기(인해파에 병신합 뜻) | 카드 | chunked/intake.ts:260 keyPlan 관계 모두 + 뜻 한 줄<br>chunked/prompt.ts:28 관계 뜻 사전 규칙<br>chunked/check.ts:125 rel_mix | rel_mix | P2 replay 적중(domain_list) |
| A-b13 | 차단 | 7·2027-M11 ¶3 | 대사 속 시점 말 | 작가 규칙 | chunked/prompt.ts:39 시점 규칙(따옴표 안도)<br>chunked/check.ts:122 time_quote | time_quote | P2 replay 적중(time_quote·advice_repeat) |
| A-b14 | 차단 | 8.1 ¶1 | 대사 속 시점 말 | 작가 규칙 | chunked/prompt.ts:39 시점 규칙(따옴표 안도)<br>chunked/check.ts:122 time_quote | time_quote | P2 replay 적중(time_quote) |
| A-b15 | 차단 | 8.1 ¶3 | 대사 속 시점 말 | 작가 규칙 | chunked/check.ts:122 time_quote | time_quote | P2 replay 적중(time_quote·advice_repeat) |
| A-b16 | 차단 | 8.3 ¶2 | 지난 일 단정(「-던」 전제) | 작가 규칙 | chunked/prompt.ts:43 「-던」 전제 금지<br>chunked/check.ts:190 PAST_PREMISE | past_premise | P2 replay 적중(past_premise) |
| A-b17 | 차단 | 9.2 ¶1 | 짝 없는 명리×MBTI 연결 + 앞날 확정 + 근거 없는 질문 | 설계도 | knowledge-v5/product-narratives.json:2339 wish 2절 ev:wishTiming<br>brief/design/annual.ts:183 wishTiming<br>chunked/check.ts:125 pair_link · FUTURE_ASSERT | pair_link·future_assert | P2 replay 적중(pair_link) |
| A-b18 | 차단 | 9.2 ¶3 | 활용 오류 | 결정론 검사 | chunked/check.ts:210 GRAMMAR 도우는 | grammar | P2 replay 적중(grammar) |
| A-e1 | 경계 | 1.1 ¶3 | 주어 어긋남(대운이 중간) | 결정론 검사 | chunked/check.ts:210 GRAMMAR 대운은 중간에 | grammar | P2 replay 적중(grammar) |
| A-e2 | 경계 | 1.1 ¶3 | 근거 없는 해석(D3에 일 방식 뜻 없음) | 설계도 | chunked/intake.ts:43 ChapterPlan.allowed · 「쓸 수 있는 근거」<br>chunked/prompt.ts:3 근거 범위 규칙 | —(근원) | 카드 diff: 1장 「쓸 수 있는 근거」 목록 · 규칙 「장마다 쓸 수 있는 근거 밖의 줄을 쓰지 않는다」 |
| A-e3 | 경계 | 1.4 ¶1 | 고객 인용 속 시점 말(인용 두 꼴) | 작가 입력 | chunked/intake.ts:61 WISH_MARK<br>chunked/publish.ts:202 소망 원문 렌더<br>chunked/check.ts:126 wish_quote | wish_quote | P2 replay 적중(wish_quote) |
| A-e4 | 경계 | 1.4 ¶3 | 장 안 면책 | 결정론 검사 | writer/safety/p6e.ts:60 noticeMeaning | notice_repeat | P2 replay 적중(notice_repeat) |
| A-e5 | 경계 | 2.1 소제목 | 소제목 앞날 단정 | 작가 규칙 | chunked/prompt.ts:27 소제목 꼴 규칙<br>chunked/check.ts:125 heading_form | heading_form | P2 replay 적중(heading_form) |
| A-e6 | 경계 | 2.1 ¶3 | 화살표 직역 | 카드 | brief/design/annual.ts:166 loveYear 신호 말(오름·내림)<br>chunked/intake.ts:84 ARROW_KO<br>chunked/check.ts:125 arrow_literal | arrow_literal | P2 replay 적중(arrow_literal) |
| A-e7 | 경계 | 2.2 ¶2 | 입력 밖 전제(솔로인데 이미 생긴 인연) | 작가 규칙 | chunked/prompt.ts:18 입력 밖 가정 규칙<br>chunked/check.ts:192 PARTNER_PREMISE | future_assert | P2 replay 적중(future_assert) |
| A-e8 | 경계 | 3.1 소제목 | 소제목 단정(원국 → 해) | 작가 규칙 | chunked/check.ts:125 heading_form | heading_form | P2 replay 적중(heading_form) |
| A-e9 | 경계 | 3.2 ¶1 | 달 표시 없는 월운 줄(M6)을 달에 묶음 | 카드 | chunked/intake.ts:123 subjectOfFact 달 이름 없으면 그 해 줄<br>chunked/check.ts:51 briefCheck month_label | —(근원) | 카드 diff: M6 → Y 줄(달 이름 없음) · briefCheck month_label 2,010명 0 |
| A-e10 | 경계 | 4.1 ¶1 | 원국 → 해 근거 없는 해석 | 작가 규칙 | chunked/check.ts:125 pair_link(원국 이름 + YEAR_END) | pair_link | P2 replay 적중(pair_link) |
| A-e11 | 경계 | 4.3 ¶1 | 근거 주인 이동(Y28 → N7) | 설계도 | chunked/intake.ts:291 allowed<br>chunked/prompt.ts:3 근거 주인 규칙(양쪽) | —(근원) | 규칙·카드 diff(근거 주인 양방향 규칙) — 뜻을 봐야 하는 꼴 |
| A-e12 | 경계 | 4.3 ¶2 | 정도말 덧붙임 | 작가 규칙 | chunked/prompt.ts:31 정도말 규칙<br>chunked/check.ts:387 rootFlags degree(카드 원문) | degree | P2 replay 적중(degree) |
| A-e13 | 경계 | 7·2027-M01 ¶3 | 시점 말(오늘 안에) | 결정론 검사 | chunked/check.ts:251 TIME_EXTRA 오늘 안에 | time_extra | P2 replay 적중(time_extra) |
| A-e14 | 경계 | 7·2027-M02 ¶2 | 주제어 어긋남(영역 나열 속) | 작가 규칙 | chunked/prompt.ts:71 달·해 본문 「핵심 하나 + 장면 하나 + 행동 하나」<br>chunked/check.ts:126 domain_list | domain_list | P2 replay 적중(domain_list) |
| A-e15 | 경계 | 7·2027-M05 ¶2 | 관계 뜻 뭉갬(지지형에 화국 뜻) | 카드 | chunked/check.ts:125 rel_mix(한 뜻으로 묶음) | rel_mix | P2 replay 적중(domain_list·rel_mix) |
| A-e16 | 경계 | 7·2027-M09 ¶2 | 씨앗의 시점 말 | 작가 입력 | chunked/card.ts:88 cleanSeed SEED_TIME_STRIP<br>chunked/check.ts:208 QUOTE_TIME 이번엔 | time_quote | P2 replay 적중(time_quote·domain_list) |
| A-e17 | 경계 | 7·2027-M12 ¶1 | 관계 동사 섞임(파에 부딪쳐, 해에 맺혀) | 작가 규칙 | chunked/prompt.ts:28 관계 뜻 사전<br>chunked/check.ts:125 rel_verb | rel_verb | P2 replay 적중(rel_verb) |
| A-e18 | 경계 | 7장 key 소제목 | key id 노출 우려(화면) | 화면 | writer/book.ts:359 projectV5Book key 이름<br>src/app/dev/book-preview/BookReader.tsx:115 months 표 | —(근원) | 화면 캡처(흐름표·달 카드 머리는 「1월 · 신축월」) |
| A-e19 | 경계 | 8.1 ¶1 | 지시 어긋남(그중) | 카드 | brief/design/annual.ts:177 useDo 동률 달 모두 | —(근원) | 카드 diff: 「흐름이 가장 크게 오르는 달(같은 세기)」 — 뜻을 봐야 하는 비문 |
| A-e20 | 경계 | 8.1 ¶2 | 설계 밖 근거(N7, 8장) | 설계도 | chunked/intake.ts:291 allowed<br>chunked/check.ts:126 evidence_scope | evidence_scope | P2 replay 적중(evidence_scope) |
| A-e21 | 경계 | 9.1 ¶1 | 고객 인용 변형 | 작가 입력 | chunked/intake.ts:61 WISH_MARK<br>chunked/publish.ts:202 소망 원문 렌더<br>chunked/check.ts:126 wish_quote | wish_quote | P2 replay 적중(wish_quote·chapter_repeat) |
| A-e22 | 경계 | 9.1 ¶2 | 결과 단정 | 작가 규칙 | chunked/check.ts:187 FUTURE_ASSERT 로 이어집니다 | future_assert | P2 replay 적중(future_assert·chapter_repeat) |
| A-e23 | 경계 | 9.2 ¶1 | 카드 칸 이름 노출 | 카드 | chunked/intake.ts:202 ROLE_KO<br>chunked/check.ts:136 CODE 열등기능 | code_leak | P2 replay 적중(code_leak) |
| A-e24 | 경계 | 9.2 ¶1 | MBTI 카드와 어긋남 | 작가 규칙 | chunked/prompt.ts:3 근거 쓰는 법 | —(근원) | 뜻을 봐야 하는 꼴 — 카드 B1 「세 번째로 쓰는 쪽」 고객 말, 규칙 |
| A-e25 | 경계 | 10.2 ¶1 | 습관·지난 일 단정 | 작가 규칙 | chunked/check.ts:190 PAST_PREMISE 때가 있죠 | past_premise | P2 replay 적중(past_premise) |
| A-e26 | 경계 | 10.2 ¶2 | 카드 뜻 변형·설계 밖 근거(N10) | 설계도 | chunked/intake.ts:291 allowed<br>chunked/prompt.ts:3 근거 범위 규칙 | —(근원) | 카드 diff(쓸 수 있는 근거) — 이름 없이 뜻만 옮긴 꼴 |
| A-m1 | 경미 | 7장 key 4곳(M12·M01·M02·M03 ¶1) | 머리 문장 뒤 십성 되풀이 | 작가 규칙 | chunked/prompt.ts:33 머리 문장 다시 알리지 않는다<br>chunked/check.ts:120 head_repeat | head_repeat | P2 replay 적중(head_repeat) |
| A-m2 | 경미 | 8곳(M01·M06·M08·M10·M12·9.1) | 카드 동일 문구 되풀이 | 카드 | chunked/intake.ts:317 tgNote 「앞의 ○와 같은 결 — 달라지는 것」 · 생활 결<br>chunked/check.ts:550 crossRepeats | chapter_repeat | P2 replay 적중(chapter_repeat) |
| A-m3 | 경미 | 4곳(M07·M08·M12) | 같은 뜻 연속 | 결정론 검사 | chunked/check.ts:607 adjacentRepeats<br>chunked/publish.ts:171 남으면 뒤 문장 지움 | rep_adjacent | P2 replay 적중(domain_list) |
| A-m4 | 경미 | 7곳 | 같은 처방 되풀이(순서·끝낼 일·글로 쏟기·열 식히기) | 작가 규칙 | chunked/intake.ts:8 할 일 씨앗<br>chunked/check.ts:586 adviceRepeats 끝낼 일 하나 | advice_repeat | P2 replay 적중(advice_repeat) |
| A-m5 | 경미 | 8곳(3.1·4.1·M07·8.1·8.2·9.1·10.2) | 장 사이 약한 반복(갑오일주 6개 장 등) | 설계도 | chunked/intake.ts:291 allowed · 짝 쓰는 장<br>chunked/check.ts:126 evidence_scope · crossRepeats | evidence_scope·chapter_repeat | P2 replay 적중(evidence_scope·degree) |
| A-m6 | 경미 | 5곳(4.1·5.2·M06·8.3·9.1) | 어색한 소품·비유(씨앗 두 장에 나눔) | 작가 입력 | chunked/intake.ts:246 seedOnce(같은 씨앗 두 장 금지)<br>chunked/card.ts:88 cleanSeed | —(근원) | 카드 diff: 같은 씨앗은 한 장에만 |
| A-m7 | 경미 | 4곳(2.2·5.1 소제목·6.1 소제목·9.1) | 어색한 표현·중의 | 작가 규칙 | chunked/prompt.ts:27 소제목 꼴 | —(근원) | 뜻을 봐야 하는 꼴(판독으로만) |
| A-m8 | 경미 | 9.1 ¶1 | 되풀이 금지 주장 반복 | 설계도 | brief/design/annual.ts:107 wish에서 도울 달 줄 뺌 · wishTiming | —(근원) | 카드 diff: 9장 1절에 도울 달 줄 없음 |
| A-m9 | 경미 | 책 16곳 | 상투구 「모습이 어울려요」 | 작가 규칙 | chunked/prompt.ts:44 받는 틀 장 1·책 4<br>chunked/check.ts:586 adviceRepeats FRAME | advice_repeat | P2 replay 적중(key_value·future_assert·advice_repeat) |
| A-m10 | 경미 | 4곳 | 「반대로」 잘못 씀 | 작가 규칙 | chunked/prompt.ts:58 「반대로」는 대조일 때만<br>chunked/check.ts:586 adviceRepeats CONTRA | advice_repeat | P2 replay 적중(advice_repeat) |

#### P2 대운 major-1 — 차단 7 / 경계 19 / 경미 15 (원인 층: 카드 10 · 작가 규칙 18 · 결정론 검사 2 · 화면 5 · 작가 입력 3 · 설계도 3)

| id | 등급 | 자리 | 결함 | 원인 층 | 고칠 곳(파일:줄 기호) | 재발 방지 검사 | 확인 방법 |
|---|---|---|---|---|---|---|---|
| B-b1 | 차단 | 3.2 ¶2 | 관계 뜻 지어내기(반합에 사람 뜻) | 카드 | brief/design/major.ts:92 relationsWithNatal 지식 DB 뜻<br>chunked/intake.ts:3 카드 관계 뜻 줄 | —(근원) | 카드 diff: D23 「쇠의 기운이 반쯤 묶여 정리와 결단이 모이기 시작하는 흐름」 |
| B-b2 | 차단 | 3.3 ¶2 | 신살 자리 오류(일주, 카드는 태어난 달) | 카드 | chunked/intake.ts:14 신살 값 「백호대살(태어난 달 · 임술)」 · 일반론 뺌<br>chunked/check.ts:125 seat_claim | seat_claim | P2 replay 적중(seat_claim) |
| B-b3 | 차단 | 3.3 ¶3 | 신살 자리 오류(「에도」) | 카드 | chunked/check.ts:125 seat_claim 에도 | seat_claim | P2 replay 적중(seat_claim) |
| B-b4 | 차단 | 2032 ¶2 | 대사 속 시점 말 | 작가 규칙 | chunked/check.ts:122 time_quote | time_quote | P2 replay 적중(time_quote) |
| B-b5 | 차단 | 2033 ¶1 | 카드 「좋음」을 확정형으로 | 작가 규칙 | chunked/prompt.ts:32 「~기 좋음」 그 꼴 그대로<br>chunked/check.ts:120 future_event · FUTURE_ASSERT | future_event·future_assert | P2 replay 적중(future_event·future_assert) |
| B-b6 | 차단 | 2035 ¶1 | 비문 | 결정론 검사 | chunked/check.ts:210 GRAMMAR 되는 대신 | grammar | P2 replay 적중(grammar) |
| B-b7 | 차단 | 화면 카드 2026 | 화면 꼬리표 시점 말 | 화면 | brief/timeline.ts:214 buildYearEntries 「(이 책을 쓴 해)」<br>chunked/check.ts:51 briefCheck screen | screen | P2 replay 적중(screen) |
| B-e8 | 경계 | 1.1 ¶3 | 읽는 법 지시 | 작가 규칙 | chunked/check.ts:252 DIRECTIVE 먼저 읽어 보세요 | reader_directive | P2 replay 적중(reader_directive) |
| B-e9 | 경계 | 2.2 소제목 | 소제목 지난 일 평서 | 작가 규칙 | chunked/prompt.ts:27 소제목 꼴<br>chunked/check.ts:125 heading_form | heading_form | P2 replay 적중(heading_form) |
| B-e10 | 경계 | 2.2 ¶2 | 지난 대운 나이(만 11~21세) × 직장 장면 | 작가 입력 | chunked/intake.ts:250 seedCtx workplaceOk(지난 대운 만 22세 전)<br>chunked/check.ts:125 past_work | past_work | P2 replay 적중(past_work) |
| B-e11 | 경계 | 2.2 ¶3 | 근거 주인·짝 장 밖(P1은 놓일 장이 없음) | 설계도 | chunked/intake.ts:17 짝 쓰는 장 = 두 줄 교집합<br>chunked/check.ts:125 pair_link | pair_link | P2 replay 적중(evidence_owner) |
| B-e12 | 경계 | 3.1 ¶2 | 지난 일 단정·입력 밖 직무 | 작가 규칙 | chunked/check.ts:190 PAST_PREMISE 낯설지 않을 | past_premise | P2 replay 적중(past_premise) |
| B-e13 | 경계 | 2027 ¶1 | 정도말 | 작가 규칙 | chunked/check.ts:120 degree(카드 원문) | degree | P2 replay 적중(degree) |
| B-e14 | 경계 | 2027 ¶2 | 읽는 법 지시 | 카드 | chunked/card.ts:33 dropGeneral 「쪽으로 읽습니다」 → 「쪽입니다」<br>chunked/check.ts:252 DIRECTIVE | reader_directive | P2 replay 적중(reader_directive·domain_list) |
| B-e15 | 경계 | 2033 ¶1 | 카드 값 명사 붙임 | 카드 | chunked/intake.ts:24 FLOW_DESC 서술형 값<br>chunked/check.ts:210 GRAMMAR | grammar | P2 replay 적중(grammar) |
| B-e16 | 경계 | 6.1 소제목 | 소제목 결과 단정 | 작가 규칙 | chunked/check.ts:125 heading_form | heading_form | P2 replay 적중(heading_form) |
| B-e17 | 경계 | 6.2 소제목 | 소제목 결과 단정(조건 지움) | 작가 규칙 | chunked/check.ts:125 heading_form | heading_form | P2 replay 적중(heading_form) |
| B-e18 | 경계 | 8.1 ¶2 | 정도말 | 작가 규칙 | chunked/check.ts:120 degree | degree | P2 replay 적중(degree·chapter_repeat) |
| B-e19 | 경계 | 8.2 ¶2 | 설계 밖 근거(N7, 8장) · 결과 단정 | 설계도 | chunked/intake.ts:291 allowed<br>chunked/check.ts:126 evidence_scope | evidence_scope | P2 replay 적중(evidence_scope) |
| B-e20 | 경계 | 8.2 ¶3 | 정도말 「가장」 | 작가 규칙 | chunked/check.ts:120 degree | degree | P2 replay 적중(degree) |
| B-e21 | 경계 | 9.1 ¶1 | 카드 칸 이름 | 카드 | chunked/intake.ts:202 ROLE_KO<br>chunked/check.ts:136 CODE | code_leak | P2 replay 적중(code_leak) |
| B-e22 | 경계 | 9.1 ¶2 | 카드 칸 이름 | 카드 | chunked/check.ts:136 CODE | code_leak | P2 replay 적중(code_leak) |
| B-e23 | 경계 | 화면 2023 [살필 점] | 지난 해 앞날 꼴 [살필 점] | 화면 | brief/buildBrief.ts:361 지난 해 caution 없음 | —(근원) | 엔진 diff(지난 해 caution undefined) · 화면 해 카드는 돌아보기형만 |
| B-e24 | 경계 | 화면 2024 [살필 점] | 틀 문자열 「…해: …살피기」 | 화면 | brief/buildBrief.ts:361 cautionOf 한 문장<br>chunked/check.ts:51 briefCheck screen TEMPLATE | screen | P2 replay 적중(screen) |
| B-e25 | 경계 | 화면 2025 [살필 점] | 틀 문자열 | 화면 | brief/buildBrief.ts:361 cautionOf<br>chunked/check.ts:51 briefCheck screen | screen | P2 replay 적중(screen) |
| B-e26 | 경계 | 화면 2031 [해 볼 것] | 화면 문형 정도말 | 카드 | brief/timeline.ts:99 pickAction 정도말 문형 거름 | —(근원) | 엔진 diff: 정도말이 든 행동 문형은 고르지 않음 |
| B-m1 | 경미 | 1.1 ¶1 | 어색한 비유 | 작가 입력 | chunked/card.ts:88 cleanSeed(직장 씨앗 거름) | —(근원) | 씨앗 정리 — 판독으로만 |
| B-m2 | 경미 | 4곳 | 장 사이 근거 문장 되풀이(N7·P1·N9·D25) | 설계도 | chunked/intake.ts:15 주장↔되풀이 금지 충돌 해소 · 짝 쓰는 장 | —(근원) | 카드 diff: D25가 6장 근거에서 빠짐(3장 핵심 주장) · 짝 P1(N7×B1)은 쓰는 장이 겹치지 않아 뺌 · 숙제 줄 N9는 3장만 |
| B-m3 | 경미 | 6곳 | 해 사이 같은 카드 문구 | 카드 | chunked/intake.ts:317 tgNote 앞과 다른 점<br>chunked/check.ts:550 crossRepeats | chapter_repeat | P2 replay 적중(head_repeat·domain_list) |
| B-m4 | 경미 | 4곳 | 같은 처방(쉬기·잠) | 작가 규칙 | chunked/check.ts:586 adviceRepeats | advice_repeat | P2 replay 적중(advice_repeat) |
| B-m5 | 경미 | 5곳 | 같은 처방(말 늦추기·듣기) | 작가 규칙 | chunked/check.ts:586 adviceRepeats | advice_repeat | P2 replay 적중(advice_repeat) |
| B-m6 | 경미 | 2곳 | 같은 처방(월급날) | 작가 규칙 | chunked/check.ts:586 adviceRepeats | advice_repeat | P2 replay 적중(advice_repeat) |
| B-m7 | 경미 | 12회 | 상투구 | 작가 규칙 | chunked/check.ts:584 FRAME 장 1·책 4 | advice_repeat | P2 replay 적중(advice_repeat) |
| B-m8 | 경미 | 6곳 | key 첫 문장 뒤 배치 되풀이 | 작가 규칙 | chunked/check.ts:120 head_repeat(배치 꼴) | head_repeat | P2 replay 적중(head_repeat) |
| B-m9 | 경미 | 4곳 | 같은 뜻 연속 | 결정론 검사 | chunked/check.ts:607 adjacentRepeats | rep_adjacent | P2 replay 적중(rep_adjacent) |
| B-m10 | 경미 | 6.3 ¶1 | 말장난·카드 뜻 비틂 | 작가 규칙 | —(고치지 않음, 목록만) | —(근원) | 판독으로만(뜻 판단) |
| B-m11 | 경미 | 9.2 ¶1 | 어색한 조어(기능 기호) | 카드 | chunked/card.ts:58 stripFnCodes<br>chunked/check.ts:51 briefCheck SLOT | —(근원) | 카드 diff: 짝 이유에 Ti·Ne 기호 없음(2,010명 0) |
| B-m12 | 경미 | 8.1 | 소제목·본문 어긋남 | 작가 규칙 | —(고치지 않음, 목록만) | —(근원) | 판독으로만 |
| B-m13 | 경미 | 8.2 | 어색한 연결 | 작가 규칙 | —(고치지 않음, 목록만) | —(근원) | 판독으로만 |
| B-m14 | 경미 | 3곳(카드↔본문) | 카드·본문 소품 겹침 | 작가 입력 | chunked/intake.ts:8 할 일 씨앗 | —(근원) | 판독으로만 |
| B-m15 | 경미 | 화면 2024 [돌아보기] | 꼬리표 나열 | 화면 | brief/timeline.ts:125 reviewLine 「A와 B가」 | —(근원) | 엔진 diff(reviewLine) |

#### AM-01 4종 — 객관 16 (원인 층: 작가 입력 4 · 결정론 검사 12)

| id | 등급 | 자리 | 결함 | 원인 층 | 고칠 곳(파일:줄 기호) | 재발 방지 검사 | 확인 방법 |
|---|---|---|---|---|---|---|---|
| L-1 | 객관 | 커리어 8장 · 궁합 4장(7건) | DB 문장 그대로 | 작가 입력 | —(고치지 않음, 목록만) | db_copy | 결정론 검사 db_copy · 4종 작가 입력 불변(목록만) — 기존 db_copy 검사 |
| L-2 | 객관 | 커리어 9장 · 궁합 3장(5건) | 같은 문장·같은 뜻 연속(수리 중복) | 결정론 검사 | writer/safety/p6e.ts:145 repeatAdjacent(4종 tidy) | same_sentence | 결정론 검사 same_sentence |
| L-3 | 객관 | 종합 1·9·13장(4건) | 엔진 대조(오행 유무·신살 뜻) | 작가 입력 | —(고치지 않음, 목록만) | —(근원) | 4종 작가 입력 불변 — 목록만(6-2) |
| L-4 | 객관 | 커리어 6·9장 · 궁합 2·3장(4건) | 고아 문장(삭제·수리 뒤) | 결정론 검사 | writer/safety/p6c.ts:8 orphan after repair | orphan_start | 결정론 검사 orphan_start |
| L-5 | 객관 | 커리어 1·7장 · 궁합 9장(3건) | 세기 모순(충돌 틀: 재성 약 · 인성 보통+월지 정인 · 중화) | 작가 입력 | —(고치지 않음, 목록만) | —(근원) | 6-2: 4종 브리프 충돌 틀은 작가 입력 변경이라 목록만 |
| L-6 | 객관 | 종합 4·5·8장(3건) | 직군 안 맞는 장면 | 작가 입력 | —(고치지 않음, 목록만) | —(근원) | 4종 작가 입력 불변 — 「가게·매장」 표지 검사만 추가(6-2) |
| L-7 | 객관 | 종합 4·7장(3건) | 금지 비유(수리가 넣음) | 결정론 검사 | —(고치지 않음, 목록만) | farming | 결정론 검사 farming · 기존 RURAL_PROP 검사(수리 뒤 검사로 잡힘) |
| L-8 | 객관 | 종합 8장 · 커리어 6장(3건) | 시점 말 | 결정론 검사 | —(고치지 않음, 목록만) | time_deictic | 결정론 검사 time_deictic · 기존 time_deictic |
| L-9 | 객관 | 종합 8장 등(3건) | 비문 | 결정론 검사 | —(고치지 않음, 목록만) | —(근원) | 판독으로만 |
| L-10 | 객관 | 커리어 6장 · 궁합 3장(2건) | 장 안 면책 | 결정론 검사 | writer/safety/p6e.ts:60 noticeMeaning(뜻 기준) | notice_repeat | 결정론 검사 notice_repeat |
| L-11 | 객관 | 종합 8장 · 커리어 9장(2건) | 내부 라벨·작성 지시 노출 | 결정론 검사 | writer/safety/p6e.ts:139 META_TRACE 작성 지시 | notice_repeat | 결정론 검사 notice_repeat |
| L-12 | 객관 | 종합 8장 · 커리어(2건) | 확정 꼴 | 결정론 검사 | —(고치지 않음, 목록만) | —(근원) | 4종 기존 검사 — 목록만 |
| L-13 | 객관 | 종합 7장(1건) | 책 안 모순 | 결정론 검사 | —(고치지 않음, 목록만) | —(근원) | 판독으로만 |
| L-14 | 객관 | 연애 9/9장 | 결정론 대체본 발행(브리프 칸·명사형 조각·DB 규칙 원문) | 결정론 검사 | ops/generation/policy.ts:80 judgeBuild keys_filled 보류 · 임시본 즉시 | —(근원) | 6-1 발행 관문 시험(결정론 장 = 보류) |
| L-15 | 객관 | p6e tidy(종합 1장) | tidy 「중화」 바꾸기가 바로 뒤 문장과 겹침 | 결정론 검사 | writer/safety/p6e.ts:268 plainWords 중화 | —(근원) | replay 표(6-2) |
| L-16 | 객관 | p6c element_count | 브리프와 맞는 「가장 센 기운」 오탐 | 결정론 검사 | writer/safety/p6c.ts:175 element_count | —(근원) | replay 표(6-2) |

#### 덕짱님 피드백 6가지 — 피드백 6 (원인 층: 결정론 검사 2 · 카드 2 · 작가 규칙 1 · 작가 입력 1)

| id | 등급 | 자리 | 결함 | 원인 층 | 고칠 곳(파일:줄 기호) | 재발 방지 검사 | 확인 방법 |
|---|---|---|---|---|---|---|---|
| F-1 | 피드백 | 책 전체 | 같은 문장·같은 뜻 연속 | 결정론 검사 | chunked/check.ts:607 adjacentRepeats<br>chunked/publish.ts:171 남으면 뒤 문장 지움 | rep_adjacent | 결정론 검사 rep_adjacent |
| F-2 | 피드백 | 책 전체 | 한 책 안 같은 처방 반복 | 카드 | chunked/intake.ts:8 할 일 씨앗 · 같은 십성 「앞과 다른 점」<br>chunked/check.ts:586 adviceRepeats(7묶음) | advice_repeat | 결정론 검사 advice_repeat |
| F-3 | 피드백 | 장 첫 문장 · 달·해 본문 | 공식 같은 틀(장 첫 문장 소품, 달·해 4단 나열) | 작가 규칙 | chunked/prompt.ts:4 장 첫 문장 · 핵심 하나 + 장면 하나 + 행동 하나<br>chunked/check.ts:126 opening_prop · domain_list | opening_prop·domain_list | 결정론 검사 opening_prop·domain_list |
| F-4 | 피드백 | 책 전체 | 사실·시점 오류 | 카드 | chunked/intake.ts:12 key 이름 · 신살 자리 · 관계 뜻<br>chunked/check.ts:122 key_value · seat_claim · rel_* · time_* | key_value·seat_claim·rel_verb·rel_mix·time_quote | 결정론 검사 key_value·seat_claim·rel_verb·rel_mix·time_quote |
| F-5 | 피드백 | 책 전체 | 입력 밖 가정(주부·임원·후배·경험) | 작가 입력 | chunked/card.ts:88 cleanSeed ROLE_PROP · HOMEMAKER · WORKPLACE<br>chunked/prompt.ts:18 입력 밖 직업·역할·경험 규칙<br>chunked/check.ts:125 past_premise · past_work · PARTNER_PREMISE | past_premise·past_work | 결정론 검사 past_premise·past_work |
| F-6 | 피드백 | 책 전체 · 화면 | 내부 흔적 노출 | 결정론 검사 | chunked/check.ts:118 code_leak · meta_trace · briefCheck SLOT<br>writer/safety/p6e.ts:139 META_TRACE | code_leak·meta_trace | 결정론 검사 code_leak·meta_trace |
