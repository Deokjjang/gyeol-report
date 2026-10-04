"use client";
import { Component, useEffect, useState, type ReactNode } from "react";
import { BookReadingPresentation } from "../../../components/book/BookEntry";
import { loadReviewBook } from "./storage";
import { reviewContext, type ReviewResult } from "./model";
import s from "./review.module.css";
class RenderBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <main className={s.root}><p role="alert">render: BOOK_RENDER_FAILED</p><a href="/dev/content-review">검수 목록으로 돌아가기</a></main> : this.props.children; }
}
export function ReviewBook({ caseId, generationId }: { caseId: string; generationId: string }) {
  const [result, setResult] = useState<ReviewResult | null>(null), [loaded, setLoaded] = useState(false), [message, setMessage] = useState("");
  useEffect(() => {
    let alive = true;
    loadReviewBook(caseId, generationId).then(value => { if (alive) setResult(value); }).catch(() => { if (alive) setMessage("STORAGE_UNAVAILABLE"); }).finally(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, [caseId, generationId]);
  if (!result || result.generationId !== generationId || result.caseId !== caseId) return <main className={s.root}><p role="status">{loaded ? `CASE ${caseId} · render: ${message || "RESULT_MISSING_OR_REPLACED"} · 같은 브라우저에서 책을 다시 생성해 주세요.` : "생성된 책을 불러오는 중…"}</p><a href="/dev/content-review">검수 목록으로 돌아가기</a></main>;
  return <RenderBoundary><BookReadingPresentation data={result.book} share={result.share} home="/dev/content-review" />
    <aside className={s.toolbar}><details><summary>CASE {caseId} · 검수 도구</summary><p><a href="/dev/content-review">검수 목록으로 돌아가기</a></p><button onClick={async () => { try { await navigator.clipboard.writeText(reviewContext(result)); setMessage("복사 완료"); } catch { setMessage("복사 권한을 확인하세요."); } }}>검수 정보 복사</button><p role="status">{message}</p><pre>{reviewContext(result)}</pre></details></aside>
  </RenderBoundary>;
}
