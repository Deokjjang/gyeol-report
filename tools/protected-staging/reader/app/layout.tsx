import type { ReactNode } from 'react';
import './review.css';
export const metadata = { title: '결리포트 보호된 Book 검수', robots: { index: false, follow: false } };
export default function Layout({ children }: { children: ReactNode }) { return <html lang="ko"><body>{children}</body></html>; }
