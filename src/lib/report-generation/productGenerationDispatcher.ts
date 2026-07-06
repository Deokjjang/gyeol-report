import {
  normalizeReportInputPayload,
  type ReportGenerationInput,
  type ReportInputPayload,
  type ReportProductKind,
} from "./reportInputAdapter";

export type ProductGenerationErrorCode =
  | "PRODUCT_GENERATION_NOT_IMPLEMENTED"
  | "INVALID_REPORT_INPUT";

export type ProductGenerationSuccessResult = {
  readonly ok: true;
  readonly kind: ReportProductKind;
  readonly draft: unknown;
  readonly evidencePacket?: unknown;
};

export type ProductGenerationNotImplementedResult = {
  readonly ok: false;
  readonly kind: ReportProductKind;
  readonly error: {
    readonly code: "PRODUCT_GENERATION_NOT_IMPLEMENTED";
    readonly message: string;
  };
};

export type ProductGenerationInvalidInputResult = {
  readonly ok: false;
  readonly error: {
    readonly code: "INVALID_REPORT_INPUT";
    readonly message: string;
  };
};

export type ProductGenerationResult =
  | ProductGenerationSuccessResult
  | ProductGenerationNotImplementedResult
  | ProductGenerationInvalidInputResult;

export type ProductGenerationHandler = (
  input: ReportGenerationInput,
) => ProductGenerationResult;

const PRODUCT_GENERATION_HANDLERS = {
  careerMoneyStudy: createNotImplementedHandler("careerMoneyStudy"),
  loveMarriageChild: createNotImplementedHandler("loveMarriageChild"),
  compatibility: createNotImplementedHandler("compatibility"),
  majorFortune: createNotImplementedHandler("majorFortune"),
  annualFortune: createNotImplementedHandler("annualFortune"),
} as const satisfies Record<ReportProductKind, ProductGenerationHandler>;

export function getProductGenerationHandler(
  kind: ReportProductKind,
): ProductGenerationHandler {
  return PRODUCT_GENERATION_HANDLERS[kind];
}

export function dispatchProductGenerationInput(
  input: ReportGenerationInput,
): ProductGenerationResult {
  const handler = getProductGenerationHandler(input.kind);
  return handler(input);
}

export function prepareProductGenerationFromPayload(
  payload: ReportInputPayload | unknown,
): ProductGenerationResult {
  const normalized = normalizeReportInputPayload(payload);
  if (!normalized.ok) {
    return invalidInputResult(`Invalid report input: ${normalized.error}`);
  }

  return dispatchProductGenerationInput(normalized.value);
}

function createNotImplementedHandler(
  kind: ReportProductKind,
): ProductGenerationHandler {
  return (input) => {
    if (input.kind !== kind) {
      return invalidInputResult(
        `Generation input kind mismatch: expected ${kind}, received ${input.kind}`,
      );
    }

    return {
      ok: false,
      kind,
      error: {
        code: "PRODUCT_GENERATION_NOT_IMPLEMENTED",
        message: `Product generation is not implemented for ${kind}.`,
      },
    };
  };
}

function invalidInputResult(message: string): ProductGenerationInvalidInputResult {
  return {
    ok: false,
    error: {
      code: "INVALID_REPORT_INPUT",
      message,
    },
  };
}
