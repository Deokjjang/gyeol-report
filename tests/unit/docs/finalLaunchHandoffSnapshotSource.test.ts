import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const snapshot = readDoc("docs/launch/FINAL_LAUNCH_HANDOFF_SNAPSHOT.md");

describe("final launch handoff snapshot source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Final Launch Handoff Snapshot",
      "## 1. 목적",
      "## 2. 현재 Git 기준 상태",
      "## 3. 완료된 제품 기반",
      "## 4. 완료된 안전장치",
      "## 5. 완료된 도메인 기반",
      "## 6. 완료된 문서/Task Spec",
      "## 7. 아직 미구현 상태",
      "## 8. 현재 출시 가능 범위",
      "## 9. 현재 출시 불가 범위",
      "## 10. 검증 명령",
      "## 11. 다음 추천 Task",
      "## 12. 다음 세션 시작 문구",
    ];

    for (const heading of headings) {
      expect(snapshot).toContain(heading);
    }
  });

  it("locks current git and product baseline", () => {
    const markers = [
      "master",
      "home payment inactive copy guard",
      "home page",
      "/report/new",
      "report generation API",
      "rich report rendering",
      "Saju/MBTI",
      "policy routes",
    ];

    for (const marker of markers) {
      expect(snapshot).toContain(marker);
    }
  });

  it("locks completed safety and domain foundations", () => {
    const markers = [
      "home no-payment preview copy",
      "/report/new` payment inactive notice",
      "policy placeholder notices",
      "payment inactive UI guard",
      "source tests",
      "report persistence types",
      "report ID/access token utility",
      "access token hash utility",
      "persistence adapter interface",
      "in-memory persistence adapter",
      "payment types",
      "payment order ID utility",
      "payment adapter interface",
      "in-memory payment adapter",
    ];

    for (const marker of markers) {
      expect(snapshot).toContain(marker);
    }
  });

  it("locks completed launch docs and specs", () => {
    const docs = [
      "launch readiness checklist",
      "payment/storage boundary",
      "paid/free gating UI",
      "minimal report persistence",
      "payment provider decision",
      "production deployment checklist",
      "manual QA checklist",
      "production copy audit",
      "persistence provider decision",
      "access token hash design",
      "production persistence schema draft",
      "paid unlock transaction design",
      "final policy copy preparation",
      "production persistence adapter task spec",
      "payment provider implementation task spec",
      "paid unlock API task spec",
      "launch readiness final audit",
    ];

    for (const doc of docs) {
      expect(snapshot).toContain(doc);
    }
  });

  it("locks unfinished items and launch boundaries", () => {
    const markers = [
      "real payment provider",
      "production DB/persistence provider",
      "paid unlock API/service",
      "final public policy copy",
      "refund/support process automation",
      "production deployment",
      "manual QA execution",
      "internal/private no-payment preview",
      "paid public launch",
      "real purchase",
      "paid unlock",
      "production data retention promise",
      "final legal/payment compliance claim",
    ];

    for (const marker of markers) {
      expect(snapshot).toContain(marker);
    }
  });

  it("locks verification commands and next tasks", () => {
    const markers = [
      "pnpm test",
      "pnpm lint",
      "pnpm build",
      "pnpm release:check",
      "git status --short",
      "56B",
      "57A",
      "58A",
      "59A",
      "60A",
    ];

    for (const marker of markers) {
      expect(snapshot).toContain(marker);
    }
  });

  it("locks next-session start instructions", () => {
    const markers = [
      "FINAL_LAUNCH_HANDOFF_SNAPSHOT.md",
      "git status --short",
      "pnpm release:check",
      "Task 56B",
      "payment provider, production DB",
      "명시적 task 승인",
    ];

    for (const marker of markers) {
      expect(snapshot).toContain(marker);
    }
  });

  it("avoids readiness and completion overclaims", () => {
    const overclaims = [
      "paid launch ready",
      "payment complete",
      "production storage complete",
      "legal review complete",
      "유료 출시 준비 완료",
      "결제 연동 완료",
      "production DB 구현 완료",
      "법률 검토 완료",
    ];

    for (const overclaim of overclaims) {
      expect(snapshot).not.toContain(overclaim);
    }
  });
});
