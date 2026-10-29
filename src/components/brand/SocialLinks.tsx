// 공식 로고 모양의 단색 아이콘(currentColor, 24 그리드 · 같은 크기). 접근 가능한 이름은 링크에 둔다.
const ICONS = {
  kakao: <path d="M12 3.2c-5.3 0-9.6 3.4-9.6 7.6 0 2.7 1.8 5.1 4.5 6.4l-.9 3.4c-.1.3.3.6.6.4l4-2.7c.5.1 1 .1 1.4.1 5.3 0 9.6-3.4 9.6-7.6S17.3 3.2 12 3.2Z" />,
  instagram: <path fillRule="evenodd" d="M7.2 2.4h9.6a4.8 4.8 0 0 1 4.8 4.8v9.6a4.8 4.8 0 0 1-4.8 4.8H7.2a4.8 4.8 0 0 1-4.8-4.8V7.2a4.8 4.8 0 0 1 4.8-4.8ZM12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 2a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2Zm5.1-4.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />,
  x: <path d="M17.8 2.6h3.2l-7 8 8.2 10.8h-6.4l-5-6.6-5.8 6.6H1.8l7.5-8.6L1.4 2.6H8l4.6 6 5.2-6Zm-1.1 16.9h1.8L7.1 4.4H5.2l11.5 15.1Z" />,
  threads: <path d="M16.6 11.2a7 7 0 0 0-.3-.1c-.2-3.1-1.9-4.9-4.8-4.9h-.1c-1.7 0-3.2.7-4.1 2.1l1.6 1.1c.7-1 1.7-1.2 2.5-1.2 1 0 1.7.3 2.1.8.3.4.6.9.7 1.6a12 12 0 0 0-2.7-.1c-2.7.2-4.5 1.8-4.3 3.9.1 1.1.6 2 1.6 2.6.8.5 1.8.8 2.9.7 1.4-.1 2.6-.6 3.4-1.6.6-.8 1-1.8 1.2-3 .7.4 1.2.9 1.5 1.6.5 1.1.5 2.9-1 4.4-1.3 1.3-2.9 1.9-5.3 1.9-2.7 0-4.7-.9-6-2.5-1.2-1.5-1.9-3.7-1.9-6.5s.7-5 1.9-6.5c1.3-1.6 3.3-2.5 6-2.5s4.8.9 6.1 2.5c.7.8 1.1 1.8 1.4 3l1.9-.5c-.4-1.4-1-2.6-1.8-3.6C17.6 1.9 15.1.8 11.9.8h-.1C8.6.8 6.1 1.9 4.4 3.9 2.9 5.8 2.1 8.4 2.1 11.7v.1c0 3.3.8 5.9 2.3 7.8 1.7 2.1 4.2 3.1 7.4 3.2h.1c2.9 0 4.9-.8 6.6-2.5 2.2-2.2 2.1-4.9 1.4-6.5-.5-1.2-1.5-2.1-2.9-2.8Zm-4.6 4.6c-1.1.1-2.3-.4-2.3-1.5-.1-.8.6-1.7 2.5-1.8h.6c.7 0 1.4.1 2 .2-.2 2.6-1.5 3-2.8 3.1Z" />,
} as const;

export const SOCIAL_LINKS = [
  { kind: "kakao", href: "http://pf.kakao.com/_sbHaX/chat", label: "카카오톡 채널로 문의하기" },
  { kind: "instagram", href: "https://www.instagram.com/gyeolreport/", label: "결리포트 인스타그램" },
  { kind: "x", href: "https://x.com/gyeolreport", label: "결리포트 X" },
  { kind: "threads", href: "https://www.threads.com/@gyeolreport", label: "결리포트 Threads" },
] as const;

export function SocialLinks({ className }: { className?: string }) {
  return <nav className={className} aria-label="결리포트 소셜 채널">
    {SOCIAL_LINKS.map(l => <a key={l.kind} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${l.label} (새 창)`}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false">{ICONS[l.kind]}</svg>
    </a>)}
  </nav>;
}
