import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const cleanupMigration = readFileSync(
  "supabase/migrations/20260920171500_production_test_data_cleanup.sql",
  "utf8",
);
const blockerMigration = readFileSync(
  "supabase/migrations/20260920170603_production_database_blockers.sql",
  "utf8",
);
const preflight = readFileSync(
  "scripts/paid_report_production_preflight_single_result.sql",
  "utf8",
);
const allowlist = [
  ["report_b12iwpy7s23ne", "smoke_order_share_lookup", "smoke"],
  [
    "report_i2ktw0p6be77i",
    "smoke_order_share_token_storage",
    "smoke",
  ],
  [
    "report_jd1lqbwcp0qiq",
    "smoke_order_share_lookup_mq5uhfg5_3ks5cxjv",
    "smoke",
  ],
  [
    "report_mur46odg213h5",
    "smoke_order_share_lookup_mq5tj85t_o6uc7cyw",
    "smoke",
  ],
  ["report_zs55p86hos9p3", "smoke_order_paid_report_storage", "smoke"],
  [
    "report_w8suvtp17higq",
    "mock_order_2e5b35e4-59eb-4ebe-b44b-247656351632",
    "mock_toss",
  ],
  [
    "report_y45g50grdvbvg",
    "mock_order_d58665de-2201-496d-98c3-7fd99b654187",
    "mock_toss",
  ],
  [
    "report_aeb9toph86oy6",
    "mock_order_4e6c50e1-0d8e-403a-9b8e-22a12a24cf78",
    "mock_kakao_pay",
  ],
  [
    "report_b4k7l4omljn7l",
    "mock_order_fdd68a0b-a71d-4a15-8550-b5ed9f68dc65",
    "mock_toss",
  ],
  [
    "report_no9kgoe8s9bgf",
    "mock_order_60d2cf33-0e6d-423a-a196-53ab82671966",
    "mock_kakao_pay",
  ],
] as const;

function sqlLiteral(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

async function createProductionFixture(): Promise<PGlite> {
  const db = new PGlite();

  await db.exec(
    "create role anon; create role authenticated; create role service_role;",
  );
  await db.exec(
    readFileSync("supabase/migrations/0001_create_reports_table.sql", "utf8"),
  );
  await db.exec(
    readFileSync(
      "supabase/migrations/0004_create_payment_orders_table.sql",
      "utf8",
    ),
  );

  const reportRows = allowlist.map(
    ([reportId, paymentOrderId, provider], index) =>
      `(${sqlLiteral(reportId)},'paid_unlocked','paid','{}'::jsonb,'{}'::jsonb,'v1','v1','ko-KR',${sqlLiteral(`hash-${index}`)},'2026-01-01T00:00:00Z','v1',${sqlLiteral(paymentOrderId)},${sqlLiteral(provider)},'paid',1290,'KRW','2026-01-01T00:01:00Z','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z')`,
  );

  await db.exec(`
    insert into public.reports (
      report_id,status,access_mode,input_snapshot,report_snapshot,report_version,
      calculation_version,locale,access_token_hash,access_token_created_at,
      access_token_version,payment_order_id,payment_provider,payment_status,
      payment_amount,payment_currency,payment_paid_at,created_at,updated_at
    ) values ${reportRows.join(",")};

    insert into public.reports (
      report_id,status,access_mode,input_snapshot,report_snapshot,report_version,
      calculation_version,locale,access_token_hash,access_token_created_at,
      access_token_version,created_at,updated_at
    ) values (
      'report_unrelated','generated','preview','{}','{}','v1','v1','ko-KR',
      'hash-unrelated','2026-01-01T00:00:00Z','v1',
      '2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'
    );

    insert into public.payment_orders (
      payment_order_id,product_type,provider,amount,currency,status,input_snapshot
    ) values (
      'real_order_guard','saju_mbti_full','toss',49000,'KRW','paid','{}'
    );
  `);

  return db;
}

describe("production test report cleanup migration", () => {
  it("reproduces the previous ON COMMIT DROP scope failure and removes that dependency", async () => {
    const db = new PGlite();

    try {
      await db.exec(`
        create temporary table production_test_report_cleanup_allowlist (
          report_id text
        ) on commit drop
      `);

      await expect(
        db.query("select * from production_test_report_cleanup_allowlist"),
      ).rejects.toThrow("does not exist");
      expect(cleanupMigration).not.toContain("create temporary table");
      expect(cleanupMigration).not.toContain("pg_temp.");
      expect(cleanupMigration).not.toContain(
        "production_test_report_cleanup_allowlist",
      );
      expect(cleanupMigration).toContain("v_allowlist constant jsonb");
      expect(cleanupMigration).toContain("jsonb_to_recordset(v_allowlist)");
    } finally {
      await db.close();
    }
  });

  it("deletes only the exact ten reports and clears the orphan preflight blocker", async () => {
    const db = await createProductionFixture();

    try {
      await db.exec(cleanupMigration);

      const counts = (
        await db.query<{
          report_count: number;
          unrelated_count: number;
          payment_order_count: number;
          orphan_count: number;
        }>(`
          select
            (select count(*)::int from public.reports) as report_count,
            (select count(*)::int from public.reports where report_id='report_unrelated') as unrelated_count,
            (select count(*)::int from public.payment_orders) as payment_order_count,
            (select count(*)::int from public.reports r
              where r.payment_order_id is not null
                and not exists (
                  select 1 from public.payment_orders po
                  where po.payment_order_id=r.payment_order_id
                )) as orphan_count
        `)
      ).rows[0];

      expect(counts).toEqual({
        report_count: 1,
        unrelated_count: 1,
        payment_order_count: 1,
        orphan_count: 0,
      });

      await db.exec(blockerMigration);
      const rows = (
        await db.query<{
          category: string;
          check_name: string;
          pass: boolean;
          detail: string;
        }>(preflight)
      ).rows;

      expect(
        rows.find((row) => row.category === "BLOCKER_00_SUMMARY"),
      ).toMatchObject({ pass: true });
      expect(
        rows.find(
          (row) =>
            row.check_name ===
            "reports payment_order_id without matching payment_orders row",
        ),
      ).toMatchObject({ pass: true, detail: "violation_count=0" });
    } finally {
      await db.close();
    }
  });

  it("rolls back all deletion when one allowlisted report differs", async () => {
    const db = await createProductionFixture();

    try {
      await db.exec(`
        update public.reports
        set payment_provider='smoke'
        where report_id='report_no9kgoe8s9bgf'
      `);

      await expect(db.exec(cleanupMigration)).rejects.toThrow(
        "1 allowlisted reports fail exact field assertions",
      );
      await db.exec("rollback");

      const result = await db.query<{ count: number }>(
        "select count(*)::int as count from public.reports",
      );
      expect(result.rows[0]?.count).toBe(11);
    } finally {
      await db.close();
    }
  });

  it("rolls back when an allowlisted payment order now exists", async () => {
    const db = await createProductionFixture();

    try {
      await db.exec(`
        insert into public.payment_orders (
          payment_order_id,product_type,provider,amount,currency,status,input_snapshot
        ) values (
          'smoke_order_share_lookup','saju_mbti_full','toss',1290,'KRW','paid','{}'
        )
      `);

      await expect(db.exec(cleanupMigration)).rejects.toThrow(
        "1 allowlisted reports now have matching payment_orders rows",
      );
      await db.exec("rollback");

      const result = await db.query<{ count: number }>(
        "select count(*)::int as count from public.reports",
      );
      expect(result.rows[0]?.count).toBe(11);
    } finally {
      await db.close();
    }
  });
});
