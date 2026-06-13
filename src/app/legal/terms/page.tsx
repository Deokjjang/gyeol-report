import type { ReactNode } from "react";

import LegalPageLayout from "../../../components/legal/LegalPageLayout";
import {
  termsPolicyDescriptionKo,
  termsPolicySections,
} from "../../../lib/legal/termsPolicy";

export default function LegalTermsPage() {
  return (
    <LegalPageLayout
      titleKo="이용약관"
      descriptionKo={termsPolicyDescriptionKo}
    >
      <section className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        {termsPolicySections.map((section) => (
          <PolicyBlock key={section.titleKo} titleKo={section.titleKo}>
            {section.bodyKo.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </PolicyBlock>
        ))}
      </section>
    </LegalPageLayout>
  );
}

function PolicyBlock({
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
