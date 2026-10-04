import { restoreBookForm } from "../../../lib/book/form";
import { CASES, emptyReview, type ReviewCase, type ReviewResult } from "./model";
export const REVIEW_STORAGE = "gyeol:manual-content-review:v1";
// Separate IndexedDB store avoids localStorage's small quota for six full books.
function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(REVIEW_STORAGE, 1);
    request.onupgradeneeded = () => request.result.createObjectStore("cases");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function transaction<T>(mode: IDBTransactionMode, operation: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("cases", mode), req = operation(tx.objectStore("cases"));
    tx.oncomplete = () => { db.close(); resolve(req.result); };
    tx.onerror = tx.onabort = () => { db.close(); reject(tx.error); };
  });
}
const writes = new Map<string, Promise<unknown>>();
export function saveReviewCase(id: string, value: ReviewCase) {
  const task = (writes.get(id) ?? Promise.resolve()).catch(() => {}).then(() => transaction("readwrite", s => s.put(value, id)));
  writes.set(id, task);
  return task;
}
export async function loadReview(year: number) {
  const state = emptyReview(year);
  for (const c of CASES) {
    const saved = await transaction("readonly", s => s.get(c.id)) as ReviewCase | undefined;
    const form = saved && restoreBookForm({ version: 1, state: saved.form }, year);
    const ready = saved?.phase === "ready" && saved.result?.generationId === saved.generationId && saved.result?.caseId === c.id;
    if (form) state[c.id] = { form, phase: ready ? "ready" : "not-generated", generationId: saved?.generationId, result: ready ? saved?.result : undefined };
  }
  return state;
}
export async function loadReviewBook(caseId: string, generationId: string): Promise<ReviewResult | null> {
  const saved = await transaction("readonly", s => s.get(caseId)) as ReviewCase | undefined;
  return saved?.phase === "ready" && saved.generationId === generationId && saved.result?.generationId === generationId && saved.result.caseId === caseId ? saved.result : null;
}
