import type { FiveElement, YinYang } from "../report-knowledge/annualFortuneTypes";
import type { MajorFortuneEvidencePacket } from "../report-knowledge/majorFortuneTypes";
import { USER_RELATIONSHIP_STATUS_LABELS } from "../report-knowledge/userContextTypes";
import {
  majorFortuneReportDraftJsonSchema,
  getMajorFortuneReportDraftSchemaTopLevelKeys,
  type MajorFortuneReportDraft,
} from "./majorFortuneReportDraftTypes";
import {
  assertValidMajorFortuneReportDraft,
  validateMajorFortuneReportDraft,
} from "./majorFortuneReportDraftValidator";
import {
  buildOpenAIMajorFortuneReportWriterMessages,
} from "./openaiMajorFortuneReportWriterPrompt";

export type MajorFortuneReportWriterConfig = {
  readonly apiKey: string;
  readonly model: string;
  readonly enabled: boolean;
  readonly fetchImpl?: typeof fetch;
};

export type MajorFortuneReportWriterResult = {
  readonly draft: MajorFortuneReportDraft;
  readonly model: string;
};

export type MajorFortuneOpenAIRequestDiagnostics = {
  readonly status?: number;
  readonly errorType?: string;
  readonly errorCode?: string;
  readonly diagnosticMessage?: string;
  readonly requestId?: string;
  readonly errorParam?: string;
  readonly responseFormatName: typeof majorFortuneResponseFormatName;
  readonly schemaTopLevelKeys: readonly string[];
  readonly schemaApproxChars: number;
  readonly model?: string;
};

export const majorFortuneResponseFormatName = "major_fortune_report_draft";

const openAIResponsesEndpoint = "https://api.openai.com/v1/responses";

const elementKo = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
} as const satisfies Record<FiveElement, string>;

const yinYangKo = {
  yang: "양",
  yin: "음",
} as const satisfies Record<YinYang, string>;

const elementStemKo = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
} as const satisfies Record<FiveElement, string>;

export class MajorFortuneReportWriterFailure extends Error {
  readonly code: string;
  readonly validationErrors?: readonly string[];
  readonly diagnostics?: MajorFortuneOpenAIRequestDiagnostics;

  constructor(input: {
    readonly code: string;
    readonly validationErrors?: readonly string[];
    readonly diagnostics?: MajorFortuneOpenAIRequestDiagnostics;
    readonly cause?: unknown;
  }) {
    super(
      [
        input.code,
        ...(input.validationErrors === undefined
          ? []
          : ["validation errors:", ...input.validationErrors.map((error) => `- ${error}`)]),
        ...(input.diagnostics === undefined
          ? []
          : formatMajorFortuneOpenAIRequestDiagnostics(input.diagnostics)),
      ].join("\n"),
    );
    this.name = "MajorFortuneReportWriterFailure";
    this.code = input.code;
    if (input.validationErrors !== undefined) {
      this.validationErrors = input.validationErrors;
    }
    if (input.diagnostics !== undefined) {
      this.diagnostics = input.diagnostics;
    }
    if (input.cause !== undefined) {
      this.cause = input.cause;
    }
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeDiagnosticText(value: string): string {
  return value
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/g, "Bearer [redacted]")
    .replace(/sk-[A-Za-z0-9._-]+/g, "sk-[redacted]")
    .replace(/Authorization\s*:\s*[^\n]+/gi, "[redacted-auth]")
    .replace(/OPENAI_API_KEY\s*=\s*[^\s]+/g, "OPENAI_API_KEY=[redacted]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

function getStringProperty(
  value: Record<string, unknown>,
  key: string,
): string | undefined {
  const property = value[key];

  return typeof property === "string" ? property : undefined;
}

function getNestedErrorRecord(body: unknown): Record<string, unknown> | undefined {
  if (!isRecord(body)) {
    return undefined;
  }

  return isRecord(body.error) ? body.error : undefined;
}

async function readSafeOpenAIErrorBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      return await response.json();
    }

    const text = await response.text();

    return text.trim().length === 0
      ? {}
      : { message: sanitizeDiagnosticText(text) };
  } catch {
    return {};
  }
}

function normalizeOpenAIErrorDiagnostics(input: {
  readonly status: number;
  readonly body: unknown;
  readonly model?: string;
}): MajorFortuneOpenAIRequestDiagnostics {
  const root = isRecord(input.body) ? input.body : undefined;
  const error = getNestedErrorRecord(input.body);
  const source = error ?? root;
  const diagnosticMessage =
    source === undefined
      ? undefined
      : getStringProperty(source, "message") ??
        getStringProperty(source, "error_description");

  return {
    status: input.status,
    responseFormatName: majorFortuneResponseFormatName,
    schemaTopLevelKeys: getMajorFortuneReportDraftSchemaTopLevelKeys(),
    schemaApproxChars: JSON.stringify(majorFortuneReportDraftJsonSchema).length,
    ...(input.model === undefined ? {} : { model: input.model }),
    ...(source === undefined
      ? {}
      : {
          errorType:
            getStringProperty(source, "type") ??
            getStringProperty(source, "errorType"),
          errorCode:
            getStringProperty(source, "code") ??
            getStringProperty(source, "errorCode"),
          errorParam:
            getStringProperty(source, "param") ??
            getStringProperty(source, "parameter"),
        }),
    ...(diagnosticMessage === undefined
      ? {}
      : { diagnosticMessage: sanitizeDiagnosticText(diagnosticMessage) }),
  };
}

export function formatMajorFortuneOpenAIRequestDiagnostics(
  diagnostics: MajorFortuneOpenAIRequestDiagnostics,
): readonly string[] {
  const lines = ["OpenAI request failed:"];

  if (diagnostics.status !== undefined) {
    lines.push(`status: ${diagnostics.status}`);
  }
  if (diagnostics.errorType !== undefined) {
    lines.push(`type: ${sanitizeDiagnosticText(diagnostics.errorType)}`);
  }
  if (diagnostics.errorCode !== undefined) {
    lines.push(`code: ${sanitizeDiagnosticText(diagnostics.errorCode)}`);
  }
  if (diagnostics.diagnosticMessage !== undefined) {
    lines.push(`message: ${sanitizeDiagnosticText(diagnostics.diagnosticMessage)}`);
  }
  if (diagnostics.errorParam !== undefined) {
    lines.push(`param: ${sanitizeDiagnosticText(diagnostics.errorParam)}`);
  }
  if (diagnostics.requestId !== undefined) {
    lines.push(`requestId: ${sanitizeDiagnosticText(diagnostics.requestId)}`);
  }
  lines.push(`response_format name: ${diagnostics.responseFormatName}`);
  lines.push(`schema top-level keys: ${diagnostics.schemaTopLevelKeys.join(", ")}`);
  lines.push(`schema approx chars: ${diagnostics.schemaApproxChars}`);
  if (diagnostics.model !== undefined) {
    lines.push(`model: ${sanitizeDiagnosticText(diagnostics.model)}`);
  }

  return lines;
}

function extractTextFromResponseBody(body: unknown): string | undefined {
  if (!isRecord(body)) {
    return undefined;
  }
  const outputText = getStringProperty(body, "output_text");

  if (outputText !== undefined) {
    return outputText;
  }
  if (Array.isArray(body.output)) {
    for (const outputItem of body.output) {
      if (!isRecord(outputItem) || !Array.isArray(outputItem.content)) {
        continue;
      }
      for (const contentItem of outputItem.content) {
        if (!isRecord(contentItem)) {
          continue;
        }
        const text =
          getStringProperty(contentItem, "text") ??
          getStringProperty(contentItem, "content");

        if (text !== undefined) {
          return text;
        }
      }
    }
  }

  return undefined;
}

function parseJson(rawText: string): unknown {
  try {
    return JSON.parse(rawText) as unknown;
  } catch (error) {
    throw new MajorFortuneReportWriterFailure({
      code: "OPENAI_MAJOR_FORTUNE_REPORT_WRITER_INVALID_JSON",
      cause: error,
    });
  }
}

function formatCycleElementLabel(packet: MajorFortuneEvidencePacket): string {
  const elements = [
    packet.currentCycle.stemElement,
    packet.currentCycle.branchElement,
  ];
  const uniqueElements = [...new Set(elements)];

  return `${uniqueElements.map((element) => elementKo[element]).join("·")}의 대운`;
}

function formatStemLabel(packet: MajorFortuneEvidencePacket): string {
  return `${packet.currentCycle.stem} · ${yinYangKo[packet.currentCycle.stemYinYang]}${elementStemKo[packet.currentCycle.stemElement]}`;
}

function formatBranchLabel(packet: MajorFortuneEvidencePacket): string {
  return `${packet.currentCycle.branch} · ${yinYangKo[packet.currentCycle.branchYinYang]}${elementStemKo[packet.currentCycle.branchElement]}`;
}

function buildAttachedYearMbtiLine(input: {
  readonly tenGod: string;
  readonly mbtiType: string | null;
}): string {
  const type = input.mbtiType ?? "MBTI";

  if (input.tenGod.includes("식신")) {
    return `${type} 성향은 작은 결과물을 빨리 만들어 반응을 확인하는 방식으로 켜집니다. 완성도를 오래 붙잡기보다 먼저 보여 줄 범위를 작게 자르면 속도가 성과로 남습니다.`;
  }
  if (input.tenGod.includes("상관")) {
    return `${type} 성향은 기존 기준에 질문을 던지고 개선안을 바로 제시하는 쪽으로 강해집니다. 말이 앞서기 쉬운 해라 제안, 근거, 일정표를 한 묶음으로 내야 힘이 생깁니다.`;
  }
  if (input.tenGod.includes("편재")) {
    return `${type} 성향은 외부 기회와 계약 앞에서 빠르게 판을 키우려는 방식으로 작동합니다. 확장 감각이 장점이지만 정산일, 책임 범위, 철수 기준을 먼저 잠가야 합니다.`;
  }
  if (input.tenGod.includes("정재")) {
    return `${type} 성향은 돈과 시간을 숫자로 정리하고 관리표를 만들려는 쪽으로 드러납니다. 안정화에는 강하지만 검토만 길어지면 움직임이 늦어질 수 있습니다.`;
  }
  if (input.tenGod.includes("편관")) {
    return `${type} 성향은 압박이 들어올수록 바로 결론을 내고 책임 구조를 세우려는 쪽으로 켜집니다. 위기 대응은 빠르지만 권한 없는 책임까지 떠안지 않아야 합니다.`;
  }
  if (input.tenGod.includes("정관")) {
    return `${type} 성향은 평가, 직장 질서, 역할 기준을 공식화하려는 방식으로 드러납니다. 기준을 세우는 힘은 좋지만 지나치게 딱딱해지면 주변과 속도가 벌어집니다.`;
  }
  if (input.tenGod.includes("편인")) {
    return `${type} 성향은 새 정보를 파고들고 다른 가능성을 검토하는 방식으로 작동합니다. 생각이 깊어지는 만큼 기록, 자료 정리, 회복 시간을 실제 일정에 넣어야 합니다.`;
  }
  if (input.tenGod.includes("정인")) {
    return `${type} 성향은 문서, 자격, 학습 루틴을 체계화하려는 쪽으로 드러납니다. 안정적인 정리는 강점이지만 결정을 지나치게 미루면 대운의 속도를 놓칠 수 있습니다.`;
  }
  if (input.tenGod.includes("비견")) {
    return `${type} 성향은 내 방향을 직접 정하고 독립적으로 밀고 가려는 쪽으로 강해집니다. 자기 기준은 선명해지지만 협업에서는 역할 경계를 먼저 말해야 합니다.`;
  }
  if (input.tenGod.includes("겁재")) {
    return `${type} 성향은 경쟁, 동료 관계, 공동 비용 앞에서 주도권을 잡으려는 방식으로 켜집니다. 사람과 돈이 섞이는 장면은 정서보다 기준을 먼저 분리해야 합니다.`;
  }

  return `${type} 성향은 판단 속도와 실행 기준을 앞세우는 방식으로 작동합니다.`;
}

function formatAttachedFocusAreas(values: readonly string[]): string {
  return values.length > 0 ? values.join("·") : "직업·돈·관계·공부";
}

function buildAttachedYearCoreFlow(input: {
  readonly packet: MajorFortuneEvidencePacket;
  readonly row: MajorFortuneEvidencePacket["majorFortuneTimelineRows"][number];
  readonly yearReading:
    | MajorFortuneEvidencePacket["cycleYearTimeline"][number]
    | undefined;
}): string {
  const headline = input.yearReading?.headline ?? input.row.oneLine;

  return `${input.row.year}년 ${input.row.annualGanji} 세운은 ${input.row.annualTenGodLabel} 흐름입니다. ${input.packet.currentMajorFortune.ganji} 대운의 ${input.packet.currentMajorFortune.stemTenGod} 배경 위에서 "${headline}" 흐름을 실제 선택으로 당기는 해입니다.`;
}

function buildAttachedContextualYearScene(input: {
  readonly packet: MajorFortuneEvidencePacket;
  readonly row: MajorFortuneEvidencePacket["majorFortuneTimelineRows"][number];
  readonly yearReading:
    | MajorFortuneEvidencePacket["cycleYearTimeline"][number]
    | undefined;
  readonly mbtiLine: string;
}): string {
  const context = input.packet.userContextReading;
  const field = context.currentField ?? "현재 분야";
  const focus = formatAttachedFocusAreas(context.focusAreas);
  const concern =
    context.currentConcern ||
    `${field}에서 ${focus} 흐름을 어디에 쓸지 정하는 것`;
  const tenGod = input.row.annualTenGodLabel;

  if (tenGod.includes("편재")) {
    return `편재가 강하게 잡히는 해라 돈, 계약, 외부 프로젝트, 부업성 수익처럼 현실 자원이 밖으로 움직입니다. ${field} 맥락에서는 서비스 수익화, 외부 제안, 프로젝트 단위 협업을 실제로 검토하기 쉬워지고, ${focus} 중에서도 돈과 일의 연결이 먼저 체감될 수 있습니다.\n\n이 해의 재미는 기회가 보인다는 데 있지만, 핵심은 기회를 잡는 속도가 아니라 조건을 잠그는 순서입니다. ${concern}이 중요해지는 만큼 계약서, 정산일, 책임 범위, 철수 기준을 먼저 정해야 합니다. ${input.mbtiLine}`;
  }
  if (tenGod.includes("정재")) {
    return `정재 흐름은 돈, 시간, 고정비, 정산 기준을 숫자로 고정하려는 해입니다. ${field}에서는 새 기회를 크게 벌리기보다 이미 움직이는 일의 비용 구조, 반복 지출, 수익화 조건을 표로 정리할 때 힘이 납니다.\n\n${focus}를 모두 건드리더라도 중심은 안정화입니다. 관계에서도 좋은 말보다 약속한 시간, 맡을 역할, 돈의 경계를 분명히 할수록 덜 지칩니다. ${input.mbtiLine}`;
  }
  if (tenGod.includes("식신")) {
    return `식신 흐름은 생각을 밖으로 꺼내 결과물로 보여 주는 해입니다. ${field}에서는 기획안, 기능 개선안, 운영 문서, 포트폴리오처럼 남는 산출물이 힘을 얻고, ${focus} 중에서도 직업과 공부가 실제 결과물로 연결되기 쉽습니다.\n\n많이 만드는 해가 아니라 먼저 검증할 결과물을 고르는 해로 써야 합니다. 작은 결과물 하나를 정하고 반응을 확인하면 이후 돈과 관계의 책임도 덜 무거워집니다. ${input.mbtiLine}`;
  }
  if (tenGod.includes("상관")) {
    return `상관 흐름은 말, 제안, 개선안, 불편한 기준을 건드리는 해입니다. ${field}에서는 기존 방식의 허점을 보고 더 나은 구조를 제안하기 쉬우며, ${focus} 중 직업과 관계에서는 말의 속도와 표현 방식이 체감으로 드러납니다.\n\n이 해는 똑똑하게 말하는 것보다 증거와 순서를 같이 내는 것이 중요합니다. 제안이 많아질수록 일정, 책임자, 다음 확인일을 붙여야 말이 성과로 남습니다. ${input.mbtiLine}`;
  }
  if (tenGod.includes("편관")) {
    return `편관 흐름은 압박, 책임, 평가, 갑작스러운 역할 검증이 강해지는 해입니다. ${field}에서는 일이 빨리 커지거나 기준이 엄격해져 누가 결정하고 누가 책임지는지를 바로 정해야 하는 장면이 생길 수 있습니다.\n\n좋게 쓰면 위기 대응력과 추진력이 살아나지만, 나쁘게 쓰면 권한 없이 책임만 떠안습니다. ${concern}을 현실화하려면 맡을 일, 거절할 일, 보고 라인을 먼저 분리해야 합니다. ${input.mbtiLine}`;
  }
  if (tenGod.includes("정관")) {
    return `정관 흐름은 공식적인 역할, 평가 기준, 직장 질서가 선명해지는 해입니다. ${field}에서는 성과를 말로 증명하기보다 기준, 문서, 프로세스로 보여 주는 장면이 중요해지고, ${focus} 중 직업과 관계는 약속의 안정감으로 체감됩니다.\n\n이 해에는 무리하게 판을 키우기보다 신뢰를 잃지 않는 운영 방식이 더 중요합니다. 기준을 세우되 상대의 속도를 너무 몰아붙이지 않아야 장기 책임으로 이어집니다. ${input.mbtiLine}`;
  }
  if (tenGod.includes("편인")) {
    return `편인 흐름은 새 정보, 방향 재검토, 회복, 공부가 안쪽으로 깊어지는 해입니다. ${field}에서는 당장 확장하기보다 자료를 모으고, 배운 것을 다시 분류하고, 다음 선택의 근거를 만드는 시간이 중요해집니다.\n\n겉으로는 느려 보여도 이 해의 성과는 판단 기준이 정교해지는 데 있습니다. ${focus}를 모두 밀어붙이기보다 공부와 회복 루틴을 먼저 잡아야 다음 해에 덜 흔들립니다. ${input.mbtiLine}`;
  }
  if (tenGod.includes("정인")) {
    return `정인 흐름은 문서, 자격, 안정적인 학습, 회복 루틴을 정리하는 해입니다. ${field}에서는 이미 쌓인 경험을 체계화하고, 자료와 기록을 다음 단계의 자산으로 바꾸기 쉽습니다.\n\n이 해는 새 판을 여는 맛보다 기반을 다지는 맛이 큽니다. 돈과 관계도 크게 흔들기보다 생활 리듬, 공부 시간, 고정 지출을 안정화할수록 대운의 부담이 줄어듭니다. ${input.mbtiLine}`;
  }
  if (tenGod.includes("비견")) {
    return `비견 흐름은 내 기준, 독립성, 경쟁심이 선명해지는 해입니다. ${field}에서는 남의 방식에 맞추기보다 내가 끌고 갈 방향을 직접 정하고 싶어질 수 있으며, ${focus} 중 직업과 공부에서는 자기 주도성이 강해집니다.\n\n다만 독립성이 강해질수록 협업에서는 말하지 않은 기준이 갈등이 됩니다. 같이 할 일과 혼자 할 일을 먼저 나누고, 비용과 역할이 섞이는 장면은 초반에 정리해야 합니다. ${input.mbtiLine}`;
  }
  if (tenGod.includes("겁재")) {
    return `겁재 흐름은 동료, 경쟁자, 공동 비용, 관계 속 경계를 건드리는 해입니다. ${field}에서는 같이 움직이는 사람과 속도가 맞으면 힘이 커지지만, 기준이 흐리면 돈과 책임이 섞여 피로가 커질 수 있습니다.\n\n이 해의 핵심은 사람을 멀리하는 것이 아니라 함께할 조건을 분명히 하는 것입니다. ${concern}을 현실화하려면 공동 프로젝트, 비용 분담, 역할 범위를 말로만 두지 말고 기록으로 남겨야 합니다. ${input.mbtiLine}`;
  }

  return `${input.yearReading?.strategicFocus ?? input.row.strategy} 기준이 실제 선택의 중심이 됩니다. ${field}에서 ${focus}를 어디에 쓸지 정리할 때 이 해의 흐름이 구체적으로 드러납니다.\n\n${input.mbtiLine}`;
}

function buildAttachedYearCaution(row: MajorFortuneEvidencePacket["majorFortuneTimelineRows"][number]): string {
  const tenGod = row.annualTenGodLabel;

  if (tenGod.includes("식신")) return `${row.year}년에는 결과물을 빨리 내는 힘이 커지는 만큼, 검증되지 않은 산출물을 너무 많이 벌리는 것이 부담이 됩니다. 먼저 보여 줄 결과물 하나와 피드백 받을 날짜를 정하세요.`;
  if (tenGod.includes("상관")) return `${row.year}년에는 말과 제안이 빨라지며 기준을 건드릴 수 있습니다. 불만을 바로 던지기보다 근거, 대안, 일정표를 함께 제시해야 충돌이 줄어듭니다.`;
  if (tenGod.includes("편재")) return `${row.year}년에는 외부 기회가 커 보일수록 돈, 계약, 책임 범위가 먼저 흔들릴 수 있습니다. 구두 약속과 감으로 하는 확장은 줄이세요.`;
  if (tenGod.includes("정재")) return `${row.year}년에는 안정화가 강점이지만 지나친 보수성으로 기회를 놓칠 수 있습니다. 숫자는 고정하되, 실험 비용은 작게 남겨 두는 편이 좋습니다.`;
  if (tenGod.includes("편관")) return `${row.year}년에는 압박을 빨리 해결하려다 권한 없는 책임까지 떠안을 수 있습니다. 급한 일일수록 승인선과 거절 기준을 먼저 확인하세요.`;
  if (tenGod.includes("정관")) return `${row.year}년에는 기준과 평가가 선명해지는 대신 유연성이 줄 수 있습니다. 규칙을 세우되 사람의 속도까지 통제하려 하면 피로가 쌓입니다.`;
  if (tenGod.includes("편인")) return `${row.year}년에는 생각이 깊어지는 만큼 실행이 늦어질 수 있습니다. 공부와 회복을 핑계로 결정을 끝없이 미루지 않도록 기준 날짜를 두세요.`;
  if (tenGod.includes("정인")) return `${row.year}년에는 안정적인 정리가 필요하지만, 준비만 하다 흐름을 놓칠 수 있습니다. 문서화와 실행을 한 주기 안에 같이 배치하세요.`;
  if (tenGod.includes("비견")) return `${row.year}년에는 내 기준이 강해지는 만큼 협업에서 고집으로 보일 수 있습니다. 독립성과 역할 분담을 초반에 분리하세요.`;
  if (tenGod.includes("겁재")) return `${row.year}년에는 사람과 비용이 섞이며 피로가 커질 수 있습니다. 공동 비용, 책임 범위, 중단 기준을 먼저 말해야 합니다.`;

  return `${row.year}년에는 ${row.strategy}`;
}

function buildAttachedYearActionStandard(row: MajorFortuneEvidencePacket["majorFortuneTimelineRows"][number]): string {
  const tenGod = row.annualTenGodLabel;

  if (/식신|상관/.test(tenGod)) return "작은 결과물 1개, 검증 날짜, 다음 수정 범위를 먼저 정하고 움직입니다.";
  if (/편재|정재/.test(tenGod)) return "계약서, 정산일, 책임 범위, 철수 기준을 숫자로 고정한 뒤 확장합니다.";
  if (/편관|정관/.test(tenGod)) return "승인선, 담당 범위, 평가 기준, 거절할 일을 먼저 문서화합니다.";
  if (/편인|정인/.test(tenGod)) return "학습 목표, 기록 방식, 회복 루틴, 실행 날짜를 한 세트로 묶습니다.";
  if (/비견|겁재/.test(tenGod)) return "혼자 할 일, 함께할 일, 비용을 나눌 일을 초반에 분리합니다.";

  return "그해 먼저 고정할 역할, 돈 기준, 회복 루틴을 하나씩 정합니다.";
}

function buildAttachedTimelineRows(
  packet: MajorFortuneEvidencePacket,
): MajorFortuneReportDraft["majorFortuneTimelineRows"] {
  return packet.majorFortuneTimelineRows.map((row) => {
    const yearReading =
      packet.cycleYearTimeline.find((item) => item.year === row.year) ??
      packet.cycleYearTimeline[0];
    const mbtiLine = buildAttachedYearMbtiLine({
      tenGod: row.annualTenGodLabel,
      mbtiType: packet.mbtiBasis.type,
    });
    const realWorldScenes = buildAttachedContextualYearScene({
      packet,
      row,
      yearReading,
      mbtiLine,
    });

    return {
      ...row,
      ageLabel:
        row.ageLabel === null || row.ageLabel.includes("한국나이")
          ? row.ageLabel
          : `한국나이 ${row.ageLabel}`,
      ageBasisLabel:
        row.ageBasisLabel === null
          ? "입력 대운표 기준 한국나이"
          : row.ageBasisLabel.includes("한국나이")
            ? row.ageBasisLabel
            : `${row.ageBasisLabel} · 한국나이`,
      yearDetail: {
        coreFlow: buildAttachedYearCoreFlow({ packet, row, yearReading }),
        realWorldScenes,
        cautionPoint: buildAttachedYearCaution(row),
        actionStandard: buildAttachedYearActionStandard(row),
      },
    };
  });
}

function attachDeterministicEvidence(input: {
  readonly parsed: unknown;
  readonly evidencePacket: MajorFortuneEvidencePacket;
}): unknown {
  if (
    typeof input.parsed !== "object" ||
    input.parsed === null ||
    Array.isArray(input.parsed)
  ) {
    return input.parsed;
  }

  return {
    ...input.parsed,
    version: "v1",
    productType: "major_fortune",
    productVersion: "v1",
    personLabel: input.evidencePacket.personLabel,
    userContextSummary: {
      ...((input.parsed as { readonly userContextSummary?: object }).userContextSummary ?? {}),
      relationshipStatusLabel:
        input.evidencePacket.userContext.relationshipStatus === undefined ||
        input.evidencePacket.userContext.relationshipStatus === null
          ? null
          : USER_RELATIONSHIP_STATUS_LABELS[
              input.evidencePacket.userContext.relationshipStatus
            ],
    },
    cycleSummary: {
      ...((input.parsed as { readonly cycleSummary?: object }).cycleSummary ?? {}),
      ganji: input.evidencePacket.currentCycle.ganji,
      displayTitle: `현재 대운 ${input.evidencePacket.currentCycle.ganji}`,
      cycleIndexLabel: `${input.evidencePacket.cyclePosition.cycleIndex}번째 대운`,
      currentPositionLabel: input.evidencePacket.cyclePosition.positionLabel,
      ageRangeLabel:
        input.evidencePacket.majorCycleBasis.basisType ===
        "user_supplied_major_fortune_table"
          ? "대운표 기준 구간"
          : `${input.evidencePacket.currentCycle.startAge}세~${input.evidencePacket.currentCycle.endAge}세`,
      yearRangeLabel: `${input.evidencePacket.currentCycle.startYear}년~${input.evidencePacket.currentCycle.endYear}년`,
      stemLabel: formatStemLabel(input.evidencePacket),
      branchLabel: formatBranchLabel(input.evidencePacket),
      elementLabel: formatCycleElementLabel(input.evidencePacket),
      tenGodLabel: `${input.evidencePacket.majorTenGod.stemTenGod}의 대운`,
      basisLabel: input.evidencePacket.majorCycleBasis.displayLabel,
    },
    calculationBasis: input.evidencePacket.calculationBasis,
    previousToCurrentShift: {
      previousGanji:
        input.evidencePacket.previousToCurrentShift.previousGanji ?? null,
      currentGanji: input.evidencePacket.previousToCurrentShift.currentGanji,
      plain: input.evidencePacket.previousToCurrentShift.plain,
      whatChanged: input.evidencePacket.previousToCurrentShift.whatChanged,
    },
    decadeArchetype: input.evidencePacket.decadeArchetype,
    myeongliLayers: {
      ...input.evidencePacket.myeongliLayers,
      branchInteractionLayer: {
        ...input.evidencePacket.myeongliLayers.branchInteractionLayer,
        interactions:
          input.evidencePacket.myeongliLayers.branchInteractionLayer.interactions.map(
            (interaction) => ({
              ...interaction,
              year: interaction.year ?? null,
            }),
          ),
      },
      auxiliaryStarsLayer:
        input.evidencePacket.myeongliLayers.auxiliaryStarsLayer.map((star) => ({
          label: star.label,
          plain: star.plain,
          caution: star.caution ?? null,
        })),
    },
    strongYears: input.evidencePacket.strongYearsWithinCycle.map((year) => ({
      year: year.year,
      ganji: year.ganji,
      headline: year.headline,
      body: year.whyStrong,
      advice: year.action,
      whyStrong: year.whyStrong,
      likelyArea: year.likelyArea,
      pushStrategy: year.pushStrategy,
      reduceStrategy: year.reduceStrategy,
    })),
    majorFortuneTimelineRows: buildAttachedTimelineRows(input.evidencePacket),
    cycleYearTimeline: input.evidencePacket.cycleYearTimeline.map((year) => ({
      year: year.year,
      ganji: year.ganji,
      yearIndexInCycle: year.yearIndexInCycle,
      phase: year.phase,
      headline: year.headline,
      roleOfYearInCycle: year.roleOfYearInCycle,
      plainInterpretation: year.plainInterpretation,
      strategicFocus: year.strategicFocus,
      whyItMatters: year.whyItMatters,
    })),
  };
}

function buildOpenAIPayload(input: {
  readonly model: string;
  readonly messages: ReturnType<typeof buildOpenAIMajorFortuneReportWriterMessages>;
}): object {
  return {
    model: input.model,
    input: [
      { role: "system", content: input.messages.system },
      { role: "developer", content: input.messages.developer },
      { role: "user", content: input.messages.user },
    ],
    text: {
      format: {
        type: "json_schema",
        name: majorFortuneResponseFormatName,
        schema: majorFortuneReportDraftJsonSchema,
        strict: true,
      },
    },
    temperature: 0.4,
  };
}

export async function generateMajorFortuneReportDraft(input: {
  readonly evidencePacket: MajorFortuneEvidencePacket;
  readonly config: MajorFortuneReportWriterConfig;
}): Promise<MajorFortuneReportWriterResult> {
  if (input.config.enabled !== true) {
    throw new MajorFortuneReportWriterFailure({
      code: "OPENAI_REPORT_WRITER_DISABLED",
    });
  }
  if (
    !isNonEmptyString(input.config.apiKey) ||
    !isNonEmptyString(input.config.model)
  ) {
    throw new MajorFortuneReportWriterFailure({
      code: "OPENAI_REPORT_WRITER_CONFIG_MISSING",
    });
  }

  const messages = buildOpenAIMajorFortuneReportWriterMessages({
    evidencePacket: input.evidencePacket,
  });
  const model = input.config.model.trim();
  const fetchImpl = input.config.fetchImpl ?? fetch;
  let response: Response;

  try {
    response = await fetchImpl(openAIResponsesEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildOpenAIPayload({ model, messages })),
    });
  } catch (error) {
    throw new MajorFortuneReportWriterFailure({
      code: "OPENAI_MAJOR_FORTUNE_REPORT_WRITER_REQUEST_FAILED",
      diagnostics: {
        responseFormatName: majorFortuneResponseFormatName,
        schemaTopLevelKeys: getMajorFortuneReportDraftSchemaTopLevelKeys(),
        schemaApproxChars: JSON.stringify(majorFortuneReportDraftJsonSchema)
          .length,
        model,
        diagnosticMessage: sanitizeDiagnosticText(
          error instanceof Error ? error.message : String(error),
        ),
      },
      cause: error,
    });
  }

  if (!response.ok) {
    const body = await readSafeOpenAIErrorBody(response);

    throw new MajorFortuneReportWriterFailure({
      code: "OPENAI_MAJOR_FORTUNE_REPORT_WRITER_REQUEST_FAILED",
      diagnostics: normalizeOpenAIErrorDiagnostics({
        status: response.status,
        body,
        model,
      }),
    });
  }

  const body = (await response.json()) as unknown;
  const rawText = extractTextFromResponseBody(body);

  if (!isNonEmptyString(rawText)) {
    throw new MajorFortuneReportWriterFailure({
      code: "OPENAI_MAJOR_FORTUNE_REPORT_WRITER_EMPTY_RESPONSE",
    });
  }

  const parsed = attachDeterministicEvidence({
    parsed: parseJson(rawText),
    evidencePacket: input.evidencePacket,
  });
  const validation = validateMajorFortuneReportDraft(parsed);

  if (!validation.ok) {
    throw new MajorFortuneReportWriterFailure({
      code: "OPENAI_MAJOR_FORTUNE_REPORT_WRITER_VALIDATION_FAILED",
      validationErrors: validation.errors,
    });
  }

  return {
    draft: assertValidMajorFortuneReportDraft(validation.value),
    model,
  };
}
