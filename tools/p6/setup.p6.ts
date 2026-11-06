// 실호출 원고 전용 준비: server-only만 비운다(네트워크 가드는 넣지 않는다 — 실호출·로컬 DB를 쓴다).
import { vi } from "vitest";
vi.mock("server-only", () => ({}));
