import {
  generateCareerMoneyStudyProductDraft,
  type CareerMoneyStudyGenerationHandlerOptions,
} from "./careerMoneyStudyGenerationHandler";
import {
  generateCompatibilityProductDraft,
  type CompatibilityGenerationHandlerOptions,
} from "./compatibilityGenerationHandler";
import {
  generateLoveMarriageChildProductDraft,
  type LoveMarriageChildGenerationHandlerOptions,
} from "./loveMarriageChildGenerationHandler";
import {
  generateMajorFortuneProductDraft,
  type MajorFortuneGenerationHandlerOptions,
} from "./majorFortuneGenerationHandler";
import {
  generateAnnualFortuneProductDraft,
  type AnnualFortuneGenerationHandlerOptions,
} from "./annualFortuneGenerationHandler";
import {
  generateComprehensiveV2ProductDraft,
  type ComprehensiveV2GenerationHandlerOptions,
} from "./comprehensiveV2GenerationHandler";
import {
  normalizeReportInputPayload,
  type CompatibilityGenerationInput,
  type ReportGenerationInput,
  type ReportInputPayload,
  type ReportProductKind,
} from "./reportInputAdapter";

export type ProductGenerationErrorCode =
  | "PRODUCT_GENERATION_NOT_IMPLEMENTED"
  | "COMPATIBILITY_GENERATION_FAILED"
  | "COMPATIBILITY_DRAFT_INVALID"
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
    readonly code: ProductGenerationErrorCode;
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
  options?: ProductGenerationDispatcherOptions,
) => Promise<ProductGenerationResult>;

export type ProductGenerationDispatcherOptions = {
  readonly careerMoneyStudy?: CareerMoneyStudyGenerationHandlerOptions;
  readonly compatibility?: CompatibilityGenerationHandlerOptions;
  readonly loveMarriageChild?: LoveMarriageChildGenerationHandlerOptions;
  readonly majorFortune?: MajorFortuneGenerationHandlerOptions;
  readonly annualFortune?: AnnualFortuneGenerationHandlerOptions;
  readonly comprehensiveV2?: ComprehensiveV2GenerationHandlerOptions;
};

const PRODUCT_GENERATION_HANDLERS = {
  careerMoneyStudy: handleCareerMoneyStudyGeneration,
  loveMarriageChild: handleLoveMarriageChildGeneration,
  compatibility: handleCompatibilityGeneration,
  majorFortune: handleMajorFortuneGeneration,
  annualFortune: handleAnnualFortuneGeneration,
  comprehensiveV2: handleComprehensiveV2Generation,
} as const satisfies Record<ReportProductKind, ProductGenerationHandler>;

export function getProductGenerationHandler(
  kind: ReportProductKind,
): ProductGenerationHandler {
  return PRODUCT_GENERATION_HANDLERS[kind];
}

export function dispatchProductGenerationInput(
  input: ReportGenerationInput,
  options: ProductGenerationDispatcherOptions = {},
): Promise<ProductGenerationResult> {
  const handler = getProductGenerationHandler(input.kind);
  return handler(input, options);
}

export function prepareProductGenerationFromPayload(
  payload: ReportInputPayload | unknown,
  options: ProductGenerationDispatcherOptions = {},
): Promise<ProductGenerationResult> {
  const normalized = normalizeReportInputPayload(payload);
  if (!normalized.ok) {
    return Promise.resolve(
      invalidInputResult(`Invalid report input: ${normalized.error}`),
    );
  }

  return dispatchProductGenerationInput(normalized.value, options);
}

async function handleCompatibilityGeneration(
  input: ReportGenerationInput,
  options: ProductGenerationDispatcherOptions = {},
): Promise<ProductGenerationResult> {
  if (input.kind !== "compatibility") {
    return invalidInputResult(
      `Generation input kind mismatch: expected compatibility, received ${input.kind}`,
    );
  }

  return generateCompatibilityProductDraft(
    input as CompatibilityGenerationInput,
    options.compatibility,
  );
}

async function handleLoveMarriageChildGeneration(
  input: ReportGenerationInput,
  options: ProductGenerationDispatcherOptions = {},
): Promise<ProductGenerationResult> {
  if (input.kind !== "loveMarriageChild") {
    return invalidInputResult(
      `Generation input kind mismatch: expected loveMarriageChild, received ${input.kind}`,
    );
  }

  const result = await generateLoveMarriageChildProductDraft(
    input,
    options.loveMarriageChild,
  );

  if (result.ok) {
    return result;
  }

  return {
    ok: false,
    kind: "loveMarriageChild",
    error: {
      code: "INVALID_REPORT_INPUT",
      message: `${result.error.code}: ${result.error.message}`,
    },
  };
}

async function handleCareerMoneyStudyGeneration(
  input: ReportGenerationInput,
  options: ProductGenerationDispatcherOptions = {},
): Promise<ProductGenerationResult> {
  if (input.kind !== "careerMoneyStudy") {
    return invalidInputResult(
      `Generation input kind mismatch: expected careerMoneyStudy, received ${input.kind}`,
    );
  }

  const result = await generateCareerMoneyStudyProductDraft(
    input,
    options.careerMoneyStudy,
  );

  if (result.ok) {
    return result;
  }

  return {
    ok: false,
    kind: "careerMoneyStudy",
    error: {
      code: "INVALID_REPORT_INPUT",
      message: `${result.error.code}: ${result.error.message}`,
    },
  };
}

async function handleMajorFortuneGeneration(
  input: ReportGenerationInput,
  options: ProductGenerationDispatcherOptions = {},
): Promise<ProductGenerationResult> {
  if (input.kind !== "majorFortune") {
    return invalidInputResult(
      `Generation input kind mismatch: expected majorFortune, received ${input.kind}`,
    );
  }

  const result = await generateMajorFortuneProductDraft(
    input,
    options.majorFortune,
  );

  if (result.ok) {
    return result;
  }

  return {
    ok: false,
    kind: "majorFortune",
    error: {
      code: "INVALID_REPORT_INPUT",
      message: `${result.error.code}: ${result.error.message}`,
    },
  };
}

async function handleAnnualFortuneGeneration(
  input: ReportGenerationInput,
  options: ProductGenerationDispatcherOptions = {},
): Promise<ProductGenerationResult> {
  if (input.kind !== "annualFortune") {
    return invalidInputResult(
      `Generation input kind mismatch: expected annualFortune, received ${input.kind}`,
    );
  }

  const result = await generateAnnualFortuneProductDraft(
    input,
    options.annualFortune,
  );

  if (result.ok) {
    return result;
  }

  return {
    ok: false,
    kind: "annualFortune",
    error: {
      code: "INVALID_REPORT_INPUT",
      message: `${result.error.code}: ${result.error.message}`,
    },
  };
}

async function handleComprehensiveV2Generation(
  input: ReportGenerationInput,
  options: ProductGenerationDispatcherOptions = {},
): Promise<ProductGenerationResult> {
  if (input.kind !== "comprehensiveV2") {
    return invalidInputResult(
      `Generation input kind mismatch: expected comprehensiveV2, received ${input.kind}`,
    );
  }

  const result = await generateComprehensiveV2ProductDraft(
    input,
    options.comprehensiveV2,
  );

  if (result.ok) {
    return result;
  }

  return {
    ok: false,
    kind: "comprehensiveV2",
    error: {
      code: "INVALID_REPORT_INPUT",
      message: `${result.error.code}: ${result.error.message}`,
    },
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
