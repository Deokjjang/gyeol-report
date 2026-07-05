import type { CareerReportEvidencePacket } from "../report-knowledge/careerReportTypes";

export type OpenAICareerReportWriterMessages = {
  readonly system: string;
  readonly developer: string;
  readonly user: string;
};

function formatList(values: readonly string[]): string {
  return values.length === 0
    ? "- 없음"
    : values.map((value) => `- ${value}`).join("\n");
}

function buildPromptPacket(packet: CareerReportEvidencePacket): object {
  return {
    productType: packet.productType,
    productVersion: packet.productVersion,
    personLabel: packet.personLabel,
    userContext: packet.userContext,
    dayMaster: packet.dayMaster,
    userPillars: packet.userPillars,
    myeongliSignalInterpretations: packet.myeongliSignalInterpretations ?? [],
    natalLabels: packet.natalLabels,
    mbtiType: packet.mbtiType,
    myeongliCareerBasis: packet.myeongliCareerBasis,
    mbtiCareerBasis: packet.mbtiCareerBasis,
    combinedCareerProfile: packet.combinedCareerProfile,
    recommendedJobs: packet.recommendedJobs,
    careerPaths: packet.careerPaths,
    moneyStrategies: packet.moneyStrategies,
    investmentProfile: packet.investmentProfile,
    studyCertificateStrategy: packet.studyCertificateStrategy,
    workRiskWarnings: packet.workRiskWarnings,
    opportunitySignals: packet.opportunitySignals,
    timingHints: packet.timingHints,
    bridgeEvidence: packet.bridgeEvidence,
    safetyNotes: packet.safetyNotes,
  };
}

export function buildOpenAICareerReportWriterMessages(input: {
  readonly evidencePacket: CareerReportEvidencePacket;
}): OpenAICareerReportWriterMessages {
  const evidenceJson = JSON.stringify(
    buildPromptPacket(input.evidencePacket),
    null,
    2,
  );

  return {
    system: [
      "You are writing a Korean paid career, money, and study report.",
      "Use only the provided career_money_study evidence packet.",
      "Write only valid JSON matching career_money_study_report_draft.",
      "Do not invent calculations, pillars, MBTI, job context, or timing hints.",
      "Do not guarantee career, exam, money, or investment outcomes.",
      "Write in Korean.",
    ].join("\n"),
    developer: [
      "상품명은 직업·커리어·금전·학업 리포트다.",
      "This report is deeper and more direct than the comprehensive report's career section.",
      "Product policy:",
      formatList([
        "타고난 직업성 중심으로 쓴다. 현재 직업 중심의 직무 평가 리포트로 만들지 않는다.",
        "현재 직업, fieldLabel, lifeStatus는 적합도 비교용 현실 context로만 사용한다.",
        "직업, 돈, 투자, 공부를 각각 따로 쓰되 하나의 성향 흐름으로 연결한다.",
        "돈/투자/공부 전략은 성향, 명리 구조, 실제 생활 장면을 연결해 쓴다.",
        "MBTI는 보조 evidence지만 체감 문장에는 적극 반영한다.",
      ]),
      "Myeongli is primary. MBTI is a behavioral/style layer.",
      "Do not scientifically equate MBTI and 사주. MBTI only explains execution style, decision style, money behavior, and study behavior.",
      "bridgeEvidence usage:",
      formatList([
        "Use bridgeEvidence.primaryEvidence in core paragraphs.",
        "Use bridgeEvidence.supportingEvidence as secondary support.",
        "Use bridgeEvidence.cautionEvidence in risk, caution, and repair strategy paragraphs.",
        "Never turn bridgeEvidence.forbiddenAngles into user-facing claims.",
        "Do not treat bridgeEvidence as a calculation result or proof that 명리와 MBTI가 같은 원인이라는 뜻으로 쓰지 않는다.",
      ]),
      "Myeongli signal usage:",
      formatList([
        "Use myeongliSignalInterpretations near the opening summary and in the relevant career, money, study, risk paragraphs.",
        "Connect visible table signals such as 편재, 정재, 정관, 편관, 현침살, 천을귀인, 월덕귀인, 천덕귀인, 화개, and 합충형파해 to work, money, study, feedback, mentor, and collaboration scenes only when they appear in evidence.",
        "Do not use 무인성, 무식상, 과다, 부족, 강함, 약함 unless the exact term is present in the evidence packet.",
        "Myeongli gives the reason for the direction. MBTI explains how the person tends to execute it. Do not merge them into one cause.",
      ]),
      "Do not write deterministic predictions, 수익 보장, 합격 보장, 취업 보장, 연봉 보장, 직업 성공 보장, or 투자 성과 보장.",
      "Use current status, fieldLabel, relationshipStatus, and life stage if present as interpretation filters. They do not change calculations.",
      "Writing tone policy:",
      formatList([
        "직접적이고 구체적인 한국어로 쓴다.",
        "\"너 이렇지?\" 하고 사용자가 바로 알아듣는 체감 문장으로 쓴다.",
        "강함 70 / 부드러움 20 / 안전장치 10의 비율을 유지한다.",
        "약한 가능성 표현을 줄이고 마지막에는 현실 전략을 붙인다.",
        "Avoid weak filler phrases: 가능성이 있습니다, 그럴 수 있습니다, 도움이 될 수 있습니다, 중요할 수 있습니다.",
      ]),
      "Be direct, specific, interesting, and immersive, but do not guarantee outcomes.",
      "Recommend actual job titles. Explain why each job fits. Explain what jobs are less suitable.",
      "Explain money earning style directly.",
      "Explain investment and saving style directly but safely.",
      "Explain study, certificate, and portfolio strategy directly.",
      "Body structure policy:",
      formatList([
        "카드를 과도하게 쪼개지 않는다.",
        "큰 챕터 안에서 문단 밀도를 살린다.",
        "키워드 블록은 유지한다.",
        "직업/돈/투자/공부를 분리하되 같은 성향 흐름으로 이어 쓴다.",
        "같은 문장, 같은 예시 분야, 같은 주의 문장을 여러 카드에 반복하지 않는다.",
        "추천 직업은 상위 후보를 먼저 강하게 설명하고 나머지는 보조 후보처럼 압축한다.",
        "careerTiming에서 같은 연도가 반복되면 한쪽은 연도별 흐름, 다른 한쪽은 연도 숫자 없는 현재 실행 기준처럼 역할을 분리한다.",
        "actionPlan은 여섯 영역을 유지하되 매번 같은 접두어를 반복하지 말고 짧은 다음 행동으로 정리한다.",
        "riskWarnings는 같은 예방 문장을 복붙하지 말고 위험마다 줄이는 방법을 다르게 쓴다.",
        "riskWarnings 예방 문장은 위험별로 달라야 한다: 권한 없는 책임은 역할 범위와 승인선 문서화, 성과 노출 부족은 주간 산출물과 포트폴리오 기록, 회복 루틴 부족은 휴식/정리 시간 캘린더 고정, 기준 없는 확장은 투입 한도/회수 시점/철수 기준 설정.",
      ]),
      "Use concrete work scenes: requirements, schedule, documentation, reporting line, performance evidence, contracts, settlement, incentives, side income, portfolio, certificate, interview, study routine.",
      "Required sections:",
      formatList([
        "careerIdentity: one clear identity and strongest fit/risk",
        "myeongliMbtiSummary: 명리 core, MBTI core, combined reading, alignment/tension",
        "recommendedJobs: 8 to 20 real job titles with fit, reason, caution, and example fields",
        "unsuitableJobs: 3 to 8 less suitable jobs or work environments",
        "careerPaths: 3 to 6 paths with push and avoid",
        "moneyEarningStyle: best income channels, risky channels, side-income ideas",
        "investmentAndSavingStyle: suitable patterns, caution patterns, and financial disclaimer",
        "careerTiming: 3 to 8 timing hints from evidence",
        "studyCertificatePlan: certificates, methods, portfolio, avoid patterns",
        "actionPlan: exactly six labels: 직업, 커리어, 돈, 투자·저축, 학업·자격증, 포트폴리오",
        "riskWarnings and safetyNotes",
      ]),
      "Deokmin-like example:",
      "명리: evidence에 보이는 십성·신살·귀인·합충형파해를 근거로 현실 책임, 돈·자원·계약, 조직 기준, 운영 구조를 설명한다.",
      "MBTI ENTJ: 전략, 효율, 구조화, 리더십은 명리 근거를 실행하는 행동 방식으로만 쓴다.",
      "해석: 서비스 기획자, PM/PO, 운영기획, 사업개발, B2B/SaaS/핀테크/정산 서비스 기획처럼 실제 직업군으로 연결한다.",
      "덜 맞는 쪽: 감정노동 중심 상담직, 산출물 없는 추상 기획, 기준 없이 계속 바뀌는 조직은 피로가 커질 수 있다고 쓴다.",
      "돈: 단타보다 우량 자산·지수형·ETF·장기 분산·매달 일정 금액 적립 방식이 더 맞습니다.",
      "수익 접점: 외부 프로젝트, 계약, 인센티브, 부업성 수익 접점은 열릴 수 있지만 조건을 숫자로 고정해야 합니다.",
      "Allowed strong but safe phrases:",
      formatList([
        "가능성이 올라갑니다",
        "유리해집니다",
        "불리해질 수 있습니다",
        "강하게 체감될 수 있습니다",
        "접점이 늘어날 수 있습니다",
        "수익화 가능성이 커질 수 있습니다",
        "외부 프로젝트 가능성이 커질 수 있습니다",
        "성과를 볼 가능성이 커집니다",
        "이직·직무 전환을 검토하기 쉬운 흐름입니다",
        "장기 적립형이 더 맞습니다",
        "단기 투기보다 분산·적립 방식이 안정적입니다",
      ]),
      "Forbidden hard career and money claims:",
      formatList([
        "반드시",
        "무조건",
        "수익 보장",
        "확정 수익",
        "반드시 성공",
        "무조건 부자",
        "합격 보장",
        "취업 보장",
        "연봉 보장",
        "질병/사고/사망 확정",
        "합격합니다",
        "불합격합니다",
        "이직합니다",
        "퇴사합니다",
        "승진합니다",
        "창업합니다",
        "돈을 법니다",
        "투자 수익이 납니다",
        "성공합니다",
        "망합니다",
      ]),
      "Investment safety boundaries:",
      formatList([
        "Do not recommend specific stocks or tickers.",
        "Do not write 이 종목을 사세요, 매수하세요, or 매도하세요.",
        "Do not promise 수익 보장 or 원금 보장.",
        "Do not give buy/sell instructions.",
        "Generic terms are allowed: 우량주, 지수형, ETF, 장기 분산, 매달 일정 금액, 적립식, 현금흐름.",
        "Always include a visible financial disclaimer in investmentAndSavingStyle.forbiddenNote.",
      ]),
      "Good investment disclaimer example: 이 내용은 성향 기반 해석이며 금융 자문이 아닙니다. 실제 투자는 본인의 판단과 별도 검토가 필요합니다.",
      "Bad writing:",
      formatList([
        "다양한 가능성이 있습니다.",
        "자신에게 맞는 일을 찾으면 좋습니다.",
        "돈 관리를 잘하면 좋습니다.",
      ]),
      "Good writing:",
      "이 사주는 아이디어만 내는 기획자보다, 요구사항·일정·성과 기준을 구조로 묶는 운영형 PM 쪽에서 강점이 살아납니다. 돈은 감으로 굴리는 단타보다, 우량 자산을 매달 일정 금액으로 쌓는 방식이 더 맞습니다. 외부 프로젝트나 계약성 수익 접점은 열릴 수 있지만, 조건을 숫자로 고정하지 않으면 들어온 돈보다 새는 돈이 먼저 커질 수 있습니다.",
      "safetyNotes must be 2 to 4 short Korean strings, user-facing, no internal/debug/schema/evidence terms, no hard deterministic claims.",
    ].join("\n"),
    user: [
      "Write the career_money_study_report_draft JSON from this evidence packet.",
      "Evidence packet:",
      evidenceJson,
    ].join("\n\n"),
  };
}
