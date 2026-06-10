import type { ReactNode } from "react";

type LegalPageLayoutProps = {
  readonly eyebrowKo?: string;
  readonly titleKo: string;
  readonly descriptionKo: string;
  readonly children: ReactNode;
};

export default function LegalPageLayout({
  eyebrowKo = "결리포트 정책",
  titleKo,
  descriptionKo,
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-4">
          <p className="text-sm font-medium text-neutral-400">{eyebrowKo}</p>
          <h1 className="text-4xl font-bold tracking-tight">{titleKo}</h1>
          <p className="text-base leading-8 text-neutral-400">
            {descriptionKo}
          </p>
        </header>

        {children}
      </section>
    </main>
  );
}
