import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { createReportFromRawInput } from "../src/lib/report/pipeline";
import type { ReportBlock, ReportOutput } from "../src/lib/report/types";
import type { ReportRequestRawInput } from "../src/lib/validation/types";

const outputRelativePath = "tmp/full-report-qa.md";
const outputPath = join(process.cwd(), outputRelativePath);

const qaInput = {
  displayName: "덕짱",
  birthDate: "1996-12-06",
  birthTime: "14:15",
  birthTimeUnknown: false,
  calendarType: "SOLAR",
  gender: "FEMALE",
  mbtiType: "ENTJ",
  timezone: "Asia/Seoul",
} as const satisfies ReportRequestRawInput;

const expectedSectionLevels = ["FREE_PREVIEW", "PAID_FULL"] as const;

function renderInput(input: ReportRequestRawInput): string[] {
  return [
    "## Input",
    "",
    `- displayName: ${input.displayName ?? ""}`,
    `- birthDate: ${String(input.birthDate ?? "")}`,
    `- birthTime: ${String(input.birthTime ?? "")}`,
    `- birthTimeUnknown: ${String(input.birthTimeUnknown ?? "")}`,
    `- calendarType: ${String(input.calendarType ?? "")}`,
    `- gender: ${String(input.gender ?? "")}`,
    `- mbtiType: ${String(input.mbtiType ?? "")}`,
    `- timezone: ${String(input.timezone ?? "")}`,
    "",
  ];
}

function renderBlock(block: ReportBlock): string[] {
  const lines: string[] = [];

  if (block.titleKo) {
    lines.push(`### ${block.titleKo}`, "");
  }

  if (block.bodyKo) {
    lines.push(block.bodyKo, "");
  }

  if (block.itemsKo) {
    for (const item of block.itemsKo) {
      lines.push(`- ${item}`);
    }
    lines.push("");
  }

  if (block.keyValues) {
    for (const item of block.keyValues) {
      lines.push(`- ${item.keyKo}: ${item.valueKo}`);
    }
    lines.push("");
  }

  return lines;
}

function renderReport(report: ReportOutput): string[] {
  const lines = [
    "## Report",
    "",
    `- title: ${report.titleKo}`,
    `- subtitle: ${report.subtitleKo}`,
    "",
  ];

  if (report.notices.length > 0) {
    lines.push("## Notices", "");
    for (const notice of report.notices) {
      lines.push(`- ${notice}`);
    }
    lines.push("");
  }

  for (const section of report.sections) {
    lines.push(`## ${section.titleKo}`, "", `Level: ${section.level}`, "");
    lines.push(section.summaryKo, "");

    for (const block of section.blocks) {
      lines.push(...renderBlock(block));
    }
  }

  return lines;
}

const result = createReportFromRawInput(qaInput);

if (!result.ok) {
  throw new Error(
    `QA full report generation failed: ${result.errors
      .map((error) => `${error.field}:${error.code}`)
      .join(", ")}`,
  );
}

for (const level of expectedSectionLevels) {
  if (!result.report.sections.some((section) => section.level === level)) {
    throw new Error(`QA full report is missing ${level} sections.`);
  }
}

const markdown = [
  "# 결리포트 QA Full Report",
  "",
  ...renderInput(qaInput),
  ...renderReport(result.report),
].join("\n");

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${markdown}\n`, "utf8");

process.stdout.write(`Wrote ${outputRelativePath}\n`);
