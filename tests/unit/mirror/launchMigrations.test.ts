// 명령 3 D8-5: 운영에 올릴 「남이 본 나」 migration 2개가 CREATE만인지(기존 표 · 함수를 바꾸거나 지우지 않는지) 자동 확인.
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const FILES = ["supabase/migrations/20261127120000_mirror_core.sql", "supabase/migrations/20261128090000_mirror_social.sql"];
const strip = (sql: string) => sql.replace(/--.*$/gm, "").replace(/\$\$[\s\S]*?\$\$/g, "$$ body $$");

describe("「남이 본 나」 migration — CREATE만", () => {
  it("이 기능의 migration은 이 두 개뿐이다", () => {
    expect(readdirSync("supabase/migrations").filter(f => /mirror/.test(f)).sort()).toEqual(FILES.map(f => f.split("/").pop()).sort());
  });
  for (const file of FILES) it(`${file.split("/").pop()}: 새로 만드는 문장(create · RLS · 권한 · 주석)만`, () => {
    const sql = strip(readFileSync(file, "utf8"));
    // 지우기 · 기존 대상 바꾸기 · 데이터 바꾸기 없음(함수 몸통 $$…$$ 안은 새 함수의 본문이라 뺀다).
    expect(sql).not.toMatch(/\b(drop|truncate|create\s+or\s+replace|rename)\b/i);
    expect(sql).not.toMatch(/\b(insert\s+into|update\s+\S+\s+set|delete\s+from)\b/i);
    for (const m of sql.matchAll(/\balter\s+table\s+(?:if\s+exists\s+)?(\S+)/gi)) expect(m[1], m[0]).toMatch(/^public\.mirror_/);
    for (const m of sql.matchAll(/\bcreate\s+(?:unique\s+)?(table|function|index|policy|view|trigger|type|sequence)\s+(?:if\s+not\s+exists\s+)?(?:\S+\s+on\s+)?(\S+)/gi)) {
      expect(m[2], m[0]).toMatch(/mirror_/);
    }
    for (const m of sql.matchAll(/\b(grant|revoke)\b[^;]*\bon\s+(?:table\s+|function\s+)?(\S+)/gi)) expect(m[2], m[0]).toMatch(/mirror_/);
  });
});
