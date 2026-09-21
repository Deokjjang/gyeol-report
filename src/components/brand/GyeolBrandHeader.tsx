import Link from "next/link";

type GyeolBrandHeaderProps = {
  readonly className?: string;
  readonly taglineKo?: string;
  readonly tone?: "light" | "dark";
};

export default function GyeolBrandHeader({
  className = "",
  taglineKo,
  tone = "light",
}: GyeolBrandHeaderProps) {
  const isDark = tone === "dark";
  const brandClassName = isDark ? "text-neutral-50" : "text-[#211815]";
  const englishClassName = isDark ? "text-[#d7b56d]" : "text-[#8a6b2f]";
  const taglineClassName = isDark ? "text-neutral-400" : "text-[#776b60]";

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <Link
        href="/"
        className="group inline-flex min-h-12 items-center transition duration-200 active:scale-[0.98]"
        aria-label="결리포트 홈"
      >
        <span className="grid gap-0.5">
          <span
            className={`text-xl font-extrabold tracking-normal ${brandClassName}`}
          >
            결리포트
          </span>
          <span
            className={`text-[11px] font-bold uppercase tracking-[0.18em] ${englishClassName}`}
          >
            Gyeol Report
          </span>
        </span>
      </Link>
      {taglineKo ? (
        <p
          className={`hidden max-w-xs text-right text-xs font-semibold leading-5 sm:block ${taglineClassName}`}
        >
          {taglineKo}
        </p>
      ) : null}
    </div>
  );
}
