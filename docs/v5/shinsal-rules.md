# v5 관계·신살 판정 기준 (학파 선택 한 줄씩)

엔진(`src/lib/saju/detections/`)·v5 만세력 표(`src/lib/report-tables/v5NatalRows.ts`)·브리프(`src/lib/brief/featureHits.ts`)가 같은 기준을 쓴다. 표와 브리프는 엔진 결과(`analyzeChartDetections`)만 읽고 기준을 따로 두지 않는다. 형식: 이름 — 채택 기준 — 다른 학파 — 코드 위치.

## 관계 (표: 합·충·형·파·해 줄, 구성원 자리 모두에 "글자 이름 · 상대 자리")
- 천간합 — 甲己·乙庚·丙辛·丁壬·戊癸, 합화 성립 판정 없음 — 합화 조건(월령·투출)을 따지는 학파 있음 — `tables.ts STEM_HAP_TABLE`, `relations.ts detectRelations`
- 천간충 — 甲庚·乙辛·丙壬·丁癸 4쌍 — 戊甲·己乙을 더하는 설 미채택. 지식 DB 항목이 없어 `ChartDetections.stemClashes`로 따로 내고 표에만 쓴다(브리프 미사용) — `tables.ts STEM_CHUNG_TABLE`, `relations.ts detectStemClashes`
- 육합 — 子丑·寅亥·卯戌·辰酉·巳申·午未, 午未 합화 오행 미지정 — 午未 火/土 학파차이 — `tables.ts YUKHAP_TABLE`
- 삼합 — 세 글자(申子辰·寅午戌·巳酉丑·亥卯未) 모두 있으면 삼합, full이 있으면 같은 국 반합은 생략 — 통용(이견 적음) — `tables.ts SAMHAP_TABLE`, `relations.ts`
- 반합 — 삼합 세 글자 중 아무 두 글자(생지+고지 申辰·寅戌·巳丑·亥未 포함, P6 변경). 브리프 강약은 왕지가 빠지면 weak. 대운·세운 배지와 궁합 점수도 같이 바뀐다(궁합 `branchPair` 丑巳·寅戌·辰申·未亥 0→+0.6, 기존 테스트 기대값 변경 없음) — 왕지(子午卯酉) 포함 2자만 인정하는 학파(P2~P5 기본값) — `relations.ts detectRelations` 삼합 블록, 강약 `featureHits.ts relationStrength`
- 방합 — 寅卯辰·巳午未·申酉戌·亥子丑 세 글자 완성만 — 두 글자도 방합으로 보는 설 미채택 — `tables.ts BANGHAP_TABLE`
- 충 — 子午·丑未·寅申·卯酉·辰戌·巳亥 — 통용(이견 적음) — `tables.ts CHUNG_TABLE`
- 삼형 — 寅巳申·丑戌未 세 글자 full, 두 글자는 partial 형(표 이름 "형") — 두 글자는 형으로 안 보는 설 — `tables.ts SAMHYEONG_TABLE`, `relations.ts`
- 상형·자형 — 상형 子卯, 자형 辰辰·午午·酉酉·亥亥 — 통용(이견 적음) — `tables.ts SANGHYEONG_TABLE·JAHYEONG_BRANCHES`
- 파 — 子酉·丑辰·寅亥·卯午·巳申·戌未 — 통용(이견 적음) — `tables.ts PA_TABLE`
- 해 — 子未·丑午·寅巳·卯辰·申亥·酉戌 — 통용(이견 적음) — `tables.ts HAE_TABLE`
- 원진 — 子未·丑午·寅酉·卯申·辰亥·巳戌, 자리 제한 없음. 표에서는 관계 줄에 짝으로 적는다(신살 줄에 따로 쓰지 않음) — 통용(이견 적음) — `tables.ts WONJIN_TABLE`
- 겹침 — 같은 쌍이 여러 관계면 모두 적는다(巳申 육합·파·형, 子未 해·원진). 같은 글자가 여러 자리면 자리 조합마다 한 건 — 통용(이견 적음) — `relations.ts`

## 신살·귀인 (표: 신살/귀인 줄·십이신살 줄, 엔진이 낸 모든 자리)
- 현침살 — 甲·辛·卯·午·申 글자가 천간이든 지지든 있는 기둥마다(브리프 강약은 글자 수 1/2/3+) — 卯·酉만 보는 v4 표, 未를 더하는 설 미채택 — `tables.ts HYEONCHIM_CHARS`, `natalShinsal.ts`
- 십이신살 — 연지 삼합 기준 한 가지(겁·재·천·지·년·월·망신·장성·반안·역마·육해·화개) — 일지 기준을 같이 보는 학파(v4 표는 두 기준을 섞어 보였음) — `shinsalConstants.ts SHINSAL_RULES`(reference YEAR_BRANCH)
- 도화·역마·화개·망신 — 연지 삼합 기준(십이신살 년살·역마·화개·망신과 같은 표) — 일지 기준 추가설 — `shinsalConstants.ts`
- 고신·과숙 — 연지 방합 기준 앞·뒤 한 칸 — 삼합 기준(구 kst-v2 표) — `shinsalConstants.ts`
- 홍염·천을·태극·문창·학당 — 일간 기준 지지 표 — 표마다 일부 차이 — `shinsalConstants.ts`
- 월덕·천덕 — 월지 기준 천간(천덕은 천간 또는 지지) — 지지 순행설 — `shinsalConstants.ts`
- 백호대살 — 甲辰·乙未·丙戌·丁丑·戊辰·壬戌·癸丑 기둥 — 통용(이견 적음) — `shinsalConstants.ts`
- 괴강살 — 庚辰·庚戌·壬辰·戊戌 기둥(네 기둥 어디든) — 壬戌·戊辰 추가설 미채택 — `tables.ts GOEGANG_PILLARS`
- 양인살 — 양간만 甲卯·丙午·戊午·庚酉·壬子 — 음간 양인(乙辰·丁未 등) 미채택 — `tables.ts YANGIN_BRANCH`
- 귀문관살 — 子酉·丑午·寅未·卯申·辰亥·巳戌 중 월-일·일-시 붙은 자리만 — 년지 포함·자리 제한 없는 설 — `tables.ts GWIMUN_TABLE`, `extraShinsal.ts`
- 천문성 — 亥·卯·未·戌 — 寅·酉 추가설 미채택 — `tables.ts CHEONMUN_BRANCHES`
- 음착양차살 — 12간지 중 일주만 — 월·시주 적용설 미채택 — `tables.ts EUMCHAK_YANGCHA_PILLARS`, `extraShinsal.ts`
- 천라지망 — 辰·巳 함께=천라, 戌·亥 함께=지망(자리 제한 없음) — 이름을 반대로 붙이는 고전 — `tables.ts CHEONRA_JIMANG_PAIRS`
- 공망 — 일주 순공 기준, 일지 자신 제외 — 년주 기준 추가(옵션 `gongmangBasis:"day+year"`) — `gongmang.ts`, `analyze.ts`
- 암록·복성·천의·금여·문곡·재고 — 암록=건록과 육합, 복성 현대표(丁=酉), 천의=월지 앞 지지, 금여=祿前二辰, 문곡=문창과 충, 재고=재성 묘고 — 표마다 이설 — `tables.ts AMROK_BRANCH 등`
- 시간 미상 — 시주를 감지 입력에서 빼서 시주 칸은 비운다(시주 생성 없음) — 통용(이견 적음) — `analyze.ts natalEntries`
