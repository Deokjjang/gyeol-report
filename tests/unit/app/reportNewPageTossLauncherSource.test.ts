import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  join(process.cwd(), "src/app/report/new/page.tsx"),
  "utf8",
);
const launcherSource = readFileSync(
  join(process.cwd(), "src/components/payment/DevTossCheckoutLauncher.tsx"),
  "utf8",
);
const pageLauncherSource = [
  pageSource.match(
    /import DevTossCheckoutLauncher from "\.\.\/\.\.\/\.\.\/components\/payment\/DevTossCheckoutLauncher";/,
  )?.[0] ?? "",
  pageSource.match(
    /const DEV_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED =\r?\n  process\.env\.NEXT_PUBLIC_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED === "1";/,
  )?.[0] ?? "",
  pageSource.match(
    /\{DEV_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED \? \(\r?\n\s*<DevTossCheckoutLauncher \/>/,
  )?.[0] ?? "",
].join("\n");

describe("report new page Toss launcher source", () => {
  it("imports and renders the dev Toss launcher as a gated component", () => {
    expect(pageSource).toContain(
      'import DevTossCheckoutLauncher from "../../../components/payment/DevTossCheckoutLauncher"',
    );
    expect(pageSource).toContain("전체 리포트 열람");
    expect(pageSource).toContain("무료 미리보기");
    expect(pageSource).toContain("정가 1,290원");
    expect(pageSource).toContain("런칭가 990원");
    expect(pageSource).toContain("정식 결제 연결 준비 중입니다.");
    expect(pageSource).toContain("DEV_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED ? (");
    expect(pageSource).toContain("<DevTossCheckoutLauncher />");
    expect(pageSource).not.toContain("결제 " + "비활성 안내");
    expect(launcherSource).toContain(
      "NEXT_PUBLIC_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED",
    );
    expect(launcherSource).toContain(
      "process.env.NEXT_PUBLIC_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED === \"1\"",
    );
    expect(launcherSource).toContain(
      "if (!DEV_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED)",
    );
    expect(launcherSource).toContain("return null");
  });

  it("does not add unsafe payment behavior to the report page", () => {
    const pageBlockedMarkers = [
      "/v1/" + "payments/confirm",
      "payment" + "Key",
      "provider" + "PaymentId",
      "provider" + "_payment" + "_id",
      "checkout" + "Url",
      "TOSS" + "_SECRET" + "_KEY",
      "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "wall" + "et",
      "re" + "charge",
      "point " + "balance",
      "credit " + "balance",
      "충" + "전",
      "포" + "인트",
      "잔" + "액",
    ];

    for (const marker of pageBlockedMarkers) {
      expect(pageLauncherSource).not.toContain(marker);
    }
  });
});
