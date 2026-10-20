# GYEOL-V4-UX-FINISHING-01

기준: `origin/master` `8d93a165464b0350d28fc3b9aa79d0e482268bfe`.
작업 브랜치: `v4/ux-finishing-01`. Production 배포·master push·운영 DB 변경·실결제·환불·광고·이벤트 활성화는 수행하지 않았다.

## 구현 결과

- 기존 `Publishing`과 인쇄·적층·제본·표지 CSS를 재사용한다. 서버 대기/재시도 화면에서 preparing → composing → binding → covering만 반복한다. 타이머는 complete를 만들지 않는다. 확인되지 않은 상품과 이름은 표시하지 않고 중립적인 책을 사용한다.
- 결제 확인은 정적인 종이 화면이다. 완료 여부를 추정하지 않는다. 기존 서버 완료/실패/만료 판정, 10초 refresh, Worker와 저장본 처리, owner 검증은 그대로다. 실패/만료에는 출판 연출이 없다.
- `/reports/[reportId]/loading.tsx`는 개인정보 없이 “GYEOL REPORT / 책장을 펼치고 있습니다. / 잠시만 기다려 주세요.”를 표시한다. 새 조회나 고정 대기시간을 추가하지 않았다. 저장본 오류 안내도 흰색·검정색 화면을 사용한다.
- OG 왼쪽 표지·색상·제목·ISSUE·공개 이름 정책과 1200×630 크기를 유지한다. 오른쪽은 전 상품 공통 “타고난 결을 읽고, / 삶의 이야기를 펼치다.”와 “GYEOL REPORT / PERSONAL EDITION”이다. OG metadata와 개인화 Kakao 제목, URL·Token·ref 계약은 그대로다.
- 마지막 검정 뒤표지는 기존 구조를 유지한다. 전체 열람 고지는 항상 표시하고 이벤트는 서버 상태별 짧은 안내로 제공한다. 기존 `LAUNCH_NOTICE` 전문은 닫힌 `details`의 “무료 이용권 참여 조건 보기”에서 확인한다. 추천받은 사람에게도 ACTIVE에서만 가입 보상 가능성을 표시한다.
- 첫 클릭의 링크 준비와 다음 클릭의 실제 공유를 구분한다. Kakao 공유창 열림, 시스템 공유, 취소, 복사 실패/수동 복사를 구분한다. 권한 거절 뒤 버튼을 숨긴다. Production의 가짜 미리보기 공유 버튼과 개발용 출판 화면을 차단한다.
- 홈과 개발 미리보기의 공유 자동 넘김 유틸리티는 정확히 4500ms, 수동 선택 후 대기는 8500ms다. 기존 hover·비활성 탭·reduced motion·단일 타이머 처리는 보존했다.
- 출판 애니메이션은 숨겨진 탭과 reduced motion에서 상태 타이머를 중지하고 언마운트 시 정리한다.

## 카카오 수동 등록

사이트 공유·푸터와 기존 V3 공유/문의 아이콘은 [공식 카카오톡 공유 리소스](https://developers.kakao.com/tool/resource/talk)의 작은 SVG를 수정 없이 사용한다. 원본: `https://developers.kakao.com/tool/images/resource/preview/talk-sharing-small.svg`; 저장: `public/brand/kakao-talk-share.svg`. Instagram과 기존 채널/채팅 URL은 보존했다.

앱 등록용 파일: **`public/brand/gyeol-kakao-app-128.png`**. 기존 `apple-icon.png`를 128×128로 축소한 PNG이며 2,604 bytes다. 기존 검정 배경과 밝은 책 모양을 유지한다.

사용자가 Kakao Developers에서 대상 앱 → **앱 → 일반 → 앱 기본 정보 → 앱 아이콘**을 변경한다. [공식 앱 기본 정보 안내](https://developers.kakao.com/docs/ko/app-setting/app). 사이트 아이콘 변경으로 콘솔 앱 아이콘이 바뀌지는 않는다. 등록은 미수행이다. 앱 ID·REST/JavaScript 키·Secret·로그인 설정은 변경하지 않았다.

Google OAuth의 Supabase 호스트명 표시는 운영 설정 점검 항목이다. 사용자가 Google 앱의 브랜딩·게시 상태를 확인해야 한다. 이번 작업에서는 Auth URL·도메인·인증 로직을 변경하지 않았다.

## 이벤트 준비 — 실행하지 않음

공개 read-only `/api/launch-event`를 2026-10-12 KST에 확인했다: **SCHEDULED**, `campaignSlug: null`, `budgetApproved: false`, 세 혜택 availability 모두 false. 고객/결제/리포트 row를 조회하지 않았다.

기존 runbook: `docs/v4-production-activation-runbook.md`, 일정 보정: `docs/v4-launch-event-schedule-fix.md`. 두 문서의 과거 발급 예산 설명은 최신 `20261011114539_v4_launch_event_unlimited.sql`을 기준으로 읽어야 한다. 이번 작업은 SQL을 수정하거나 적용하지 않았다.

| 필요한 값 | 기존 계약 |
|---|---|
| 정책 식별자 | `launch-20261029` 유지; 이름의 날짜는 시작일이 아님 |
| 캠페인 | 운영자가 선택할 기존 `growth_campaigns.id`와 연결할 `campaign_id`, 고유 `public_slug`, 안내 name/message |
| 종류/수량 | `offer_type: REPORT_TICKET`, `ticket_quantity: 1`, `new_user_only: true` |
| 최초 시작 가능 | `2026-10-10T15:00:00Z` = 10월 11일 00:00 KST |
| 종료/무료권 만료 | `2026-10-31T15:00:00Z` = 11월 1일 00:00 KST, 연장 없음 |
| 승인/활성 | 명시적인 `approved_at`와 캠페인 `status: ACTIVE` 모두 필요 |
| 가입 획득 | 광고 또는 추천 1장, 계정당 평생 1회, 중복 불가 |
| 추천 성공 | 친구의 첫 정상 발행 기준 1장, 계정당 평생 1회 |
| 합계 | 계정당 최대 2장; 전체/경로별 발급량 상한 없음 |
| 과거 limit 컬럼 | 감사 기록으로 보존되나 최신 상태 함수에서 발급량 제한으로 사용하지 않음 |

향후 별도 승인 후 순서:

1. 현재 배포된 일정/무제한 발급 계약과 연결할 캠페인 정보를 읽기 전용으로 재확인한다. 과거 runbook의 migration을 일괄 재적용하지 않는다.
2. 운영자가 slug·안내 문구·캠페인을 확정한다. 필요한 캠페인/정책 준비도 별도 승인된 작업으로 처리하며, 준비만으로 ACTIVE로 만들지 않는다.
3. 본문 품질 작업과 출시 검수 완료 후 운영자가 이벤트 활성화를 명시적으로 승인한다. 승인 시각과 캠페인 ACTIVE 상태를 기존 운영 절차로 적용한다. 기존 종료 시각은 바꾸지 않는다.
4. 공개 상태 API의 ACTIVE와 세 availability를 확인한다. 가입 자격·한도·첫 정상 발행·마감 경계의 기존 지급 검증을 사용한다.
5. 광고는 별도 승인 후 진행한다. 이번 작업에서는 캠페인 생성·승인·활성화·지급·광고를 실행하지 않았다.

## 검증 및 한계

검증 아티팩트는 로컬 `/tmp/gyeol-ux-finishing/`에 있다. 비밀 설정을 제외한 임시 복사본과 격리 Chrome을 사용했고, 이벤트/공유 응답과 Kakao/시스템 공유는 모의 처리했다. 임시 검수 라우트는 실제 저장소에서 제거했다. 카카오 네이티브 앱 자체와 실제 Production 소유 Book 재열람은 이번 로컬 검증의 대상이 아니다.

- 관련 Unit/UI/서버 회귀: 중복을 제외한 265 PASS, 기준 SHA에서도 재현되는 기존 실패 6건. 주요 최종 회귀 162건, Book 미리보기/읽기 39건, owner route 3건, OG 경계 이름 3건, 저장본 공유 계약 16건, 공개 발행/이용권 checkout 40건, 기존 V3 종합/연간 저장본 최종 route 2건을 확인했다. `regression-final.log`, `preview-final.log`, `owner-final.log`, `og-edge-final.log`, `tests-first.log`, `public-flow-final.log`, `public-flow-owner-final.log`, `v3-final.log` 참조. 최초 owner mock/아이콘 assertion 불일치와 fixture hook timeout은 수정·재검증 후 신규 실패 0건이다.
- 6상품 OG 실제 PNG 생성, 긴 한글/공백/특수문자 이름, 선택 연도, 궁합 A 공개 이름 정책, 공개 개인정보 제한 확인. 오른쪽 공통 브랜드 문구는 실제 PNG를 시각 확인했다.
- 브라우저 고유 확인 201건 (`browser.log`, `browser-results.json`), 화면 캡처 70장 이상. 320/390/430/768/1440px에서 출판·결제 확인·서재 로딩·실패·만료·6상품 뒤표지·공유받은 뒤표지·홈 확인. 가로 넘침 없음. 공유 터치 영역 44px 이상. 앱/hydration 예외 0.
- 4단계 반복에서 complete 없음, reduced motion 정지, 6상품 자동 순환 실측 간격 4499.4–4503.0ms, 숨김 신호에 의한 자동 전환 정지, 8500ms 수동 대기, 공유 준비/성공/취소/복사 실패/권한 거절 확인.
- 실제 모바일 Kakao 앱의 공유 카드 미리보기와 변경된 콘솔 앱 아이콘 확인은 배포 승인 뒤 사용자 실기기 검수가 남는다. 이번 검증은 실제 메시지 전송이나 금융 동작을 수행하지 않았다.
- 서재 owner/만료/V3/저장본 경계는 기존 테스트로 확인했다. 실제 Production 고객 Book을 새로 발행하거나 재생성하지 않았다.
- 별도 성능 최적화는 수행하지 않았다. 로딩에 요청/고정 지연을 추가하지 않았고 기존 10초 새로고침과 공유 첫 클릭 준비 요청은 보존했다. 전체 성능 측정은 본문 품질 완료 후 광고 전 별도 작업이다.

기존 미리보기 실패 6건은 기준 SHA의 격리 checkout에서 재현했다: 과거 1,290원 가격 assertion 1건, 각주 fixture assertion 1건, 비동기 법적 페이지의 동기 SSR 테스트 4건. 정책/본문을 수정해서 해결하지 않았다. 이번 SVG→공식 이미지 변경에 직접 영향받는 아이콘 assertion만 갱신했다. 관련 결제/발행 테스트의 owner mock은 현재 권한 경로에 맞췄으며 실제 권한 로직은 그대로다.

TypeScript 독립 검사: 기존 소스 진단 389개가 기준 SHA와 완전히 동일하며 신규 소스 진단 0개다. 기존 개발 빌드 생성 타입의 export 진단 1개는 별도이며 수정하지 않았다. Next Production build는 통과했고 기존 개발 DB 경로의 NFT trace 경고 6건이 있다.

`.gitignore`, `AGENTS.md`, `supabase/.temp/`의 기존 사용자 변경은 보존하고 커밋에서 제외한다. 해석/명리/MBTI/Fusion/본문/Worker/결제/권한/Supabase/gate/기존 스냅샷은 변경하지 않았다.
