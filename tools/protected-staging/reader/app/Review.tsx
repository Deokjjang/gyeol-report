'use client';
import { useState } from 'react';
import type { ReviewArtifact } from '../../artifact';
import { ReviewBook } from './ReviewBook';
export function Review() {
  const [artifact, setArtifact] = useState<ReviewArtifact | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  if (artifact) return <><aside className="review-status"><button onClick={() => setArtifact(null)}>다른 검수 Book 열기</button><details><summary>SAFE_OFFLINE · 테스트 전용 · 고객·판매 미승인</summary><p>생성 SHA: {artifact.sourceCommit}</p><p>{artifact.productKey} / {artifact.relationshipCategory ?? '단일 인물'}</p><p>평가 시각: {artifact.evaluatedAt}</p><p>입력 Hash: {artifact.inputHash}</p><p>Book Hash: {artifact.bookHash}</p><p>{artifact.publicationSafetyVersion} / {artifact.readerVersion}</p></details></aside><ReviewBook key={artifact.bookHash} data={artifact.book} /></>;
  return <main className="review-input"><h1>전체 Book 검수</h1><p>로컬에서 실제 생성·검증한 서명된 Book만 열 수 있습니다. 가상 인물만 사용하세요. 고객 사용·판매 품질 승인은 별개입니다.</p><label>검증된 Book 파일<input type="file" accept="application/json,.json" disabled={busy} onChange={async e => {
    const file = e.target.files?.[0]; if (!file) return; setBusy(true); setError('');
    try {
      if (file.size > 8 * 1024 * 1024 + 4096) { setError('Book 파일이 너무 큽니다.'); return; }
      const response = await fetch('/api/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: await file.text(), cache: 'no-store' });
      const result = await response.json();
      if (response.ok && result.ok === true) setArtifact(result.artifact); else setError(result.error ?? '검증에 실패했습니다.');
    } catch { setError('검증 요청에 실패했습니다. Book을 열지 않았습니다.'); } finally { setBusy(false); e.target.value = ''; }
  }} /></label><p role="status">{busy ? '서명·원본 SHA·Book 계약을 확인하고 있습니다.' : error}</p><p>원본 입력과 Book을 서버에 저장하지 않습니다. 열람을 종료하면 브라우저 메모리에서 제거됩니다.</p></main>;
}
