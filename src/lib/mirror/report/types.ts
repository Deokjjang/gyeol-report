/**
 * 결 보고서(D5) 입력 · 출력 계약. 보고서 엔진(./engine.ts)은 순수 함수 — 저장소 · 네트워크 · 시각 · 외부 호출 0.
 * 서버(API)는 발행할 때 buildReport(input)를 한 번 부르고 결과(ReportSnapshot)를 mirror_report_issues.snapshot에 그대로 저장한다(다시 계산하지 않는다).
 * 화면(ReportView)은 스냅샷만 그린다.
 */
import type { FacetId } from "../../../data/mirror/items";
import type { StoryKind } from "../../../data/mirror/stories";
import type { Closeness, FriendSession, SelfAnswers } from "../engine";

/** 보고서에 넣을 수 있는 받은 이야기(숨김 · 주인 기기에서 쓴 이야기는 서버가 미리 뺀다). */
export type ReportStory = { id: string; kind: StoryKind; body: string; closeness: Closeness; hearts: number; createdAt: string };

export type ReportInput = {
  /** 주인 이름(친구에게 보이는 이름, 조사 처리용). */
  ownerName: string;
  self: SelfAnswers;
  /** mirror_owner_board 결과(주인 기기 세션은 ownerDevice: true로 들어온다 — 엔진이 countedSessions로 뺀다). 무효 세션은 서버가 미리 뺀다. */
  sessions: readonly FriendSession[];
  stories: readonly ReportStory[];
  /** 1부터. 같은 사람의 다음 호에는 다른 문장 변형이 나온다(seedKey · issueNo로 시드). */
  issueNo: number;
  /** personSeed(userId) — 계정 id 원문이 아닌 해시. */
  seedKey: string;
  issuedAt: string;
  /** 다음 호가 열릴 수 있는 시각(issuedAt + 7일). */
  nextIssueAt: string;
  /** 지난 호 스냅샷(비교용). 1호면 null. */
  previous: ReportSnapshot | null;
};

export type SectionKey = "verdict" | "open" | "blind" | "hidden" | "closer" | "attach" | "stories" | "unknown" | "next" | "one";

/** 장면 하나: 실제 문항 문장 + 고른 답 + "친구 9명 중 9명". */
export type ReportScene = {
  itemId: string;
  facet: FacetId;
  /** 자가용 상황 문장(따옴표 안에 들어갈 말). */
  situation: string;
  /** 친구 다수가 고른 보기 문장. */
  picked: string;
  /** 주인이 직접 고른 보기 문장. */
  mine: string;
  /** "친구 9명 중 9명" 같은 근거 줄. */
  count: string;
  /** 장면 공유 카드에 들어갈 문장(꼭지 2 · 3만): count + 친구용 문장, 예 "친구 9명 중 9명: 민지는 모임이 끝나고 나면 아직 텐션이 남아 있다". */
  share?: { count: string; text: string };
};

export type ReportSection = {
  key: SectionKey;
  title: string;
  /** 결론 한두 문장(먼저 말한다). */
  lead: string[];
  scenes: ReportScene[];
  /** 장면 뒤 풀이 문단(해요체). */
  body: string[];
  /** 작은 근거 줄(예: "10개 질문으로 본 경향이에요"). */
  notes: string[];
  /** 꼭지 7: 고른 이야기. */
  stories?: { kind: StoryKind; kindLabel: string; body: string; closenessLabel: string }[];
  /** 꼭지 8: 「친구에게 물어보기」 버튼을 단다. */
  ask?: boolean;
};

export type ReportFacetEvidence = { facet: FacetId; name: string; domain: string; selfA: number; friendA: number; friendN: number; match: number | null };

export type ReportSnapshot = {
  version: 1;
  issueNo: number;
  issuedAt: string;
  nextIssueAt: string;
  ownerName: string;
  /** 한 줄 판정(꼭지 1): "본인만 차분한 줄 아는 기발한 모험가". */
  verdict: { title: string; sync: number; summary: string };
  /** 꼭지 2~9(또는 「한 사람이 본 나」) — 열린 것만 순서대로. 꼭지 1은 verdict. */
  sections: ReportSection[];
  /** 맨 아래 「근거 모두 보기」(접힘): 12면 표와 답 개수. */
  evidence: { facets: ReportFacetEvidence[]; answers: number; friends: number; byCloseness: Record<Closeness, number | null> };
  /** 마지막 한 줄: 「이 결이 어디서 왔는지, 사주로 더 깊이 보기 →」. */
  bridge: { text: string; href: string };
  /** 다음 호 비교용 숫자(화면에는 쓰지 않아도 된다). */
  stats: { sync: number; answers: number; friends: number; friendRatios: (number | null)[]; matchRates: (number | null)[] };
};
