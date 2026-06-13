import Link from "next/link";
import type { ReactNode } from "react";

import {
  termsPolicyDescriptionKo,
  termsPolicySections,
} from "../../lib/legal/termsPolicy";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-4">
          <p className="text-sm font-medium text-neutral-400">결리포트 정책</p>
          <h1 className="text-4xl font-bold tracking-tight">이용약관</h1>
          <p className="text-base leading-8 text-neutral-400">
            {termsPolicyDescriptionKo}
          </p>
        </header>

        <section className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
          {termsPolicySections.map((section) => (
            <PolicySection key={section.titleKo} titleKo={section.titleKo}>
              {section.bodyKo.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </PolicySection>
          ))}
        </section>

        <nav className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/privacy"
            className="rounded-xl border border-neutral-800 px-4 py-3 font-semibold text-neutral-200"
          >
            개인정보처리방침
          </Link>
          <Link
            href="/refund"
            className="rounded-xl border border-neutral-800 px-4 py-3 font-semibold text-neutral-200"
          >
            환불정책
          </Link>
          <Link
            href="/business"
            className="rounded-xl border border-neutral-800 px-4 py-3 font-semibold text-neutral-200"
          >
            사업자정보
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-neutral-800 px-4 py-3 font-semibold text-neutral-200"
          >
            홈으로 돌아가기
          </Link>
        </nav>
      </section>
    </main>
  );
}

function PolicySection({
  titleKo,
  children,
}: {
  readonly titleKo: string;
  readonly children: ReactNode;
}) {
  return (
    <article className="space-y-2">
      <h2 className="text-lg font-semibold text-neutral-100">{titleKo}</h2>
      <div className="space-y-2 text-sm leading-7 text-neutral-400">
        {children}
      </div>
    </article>
  );
}
