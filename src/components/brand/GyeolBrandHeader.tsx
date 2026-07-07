import Link from "next/link";

type GyeolBrandHeaderProps = {
  readonly className?: string;
  readonly taglineKo?: string;
};

export default function GyeolBrandHeader({
  className = "",
  taglineKo,
}: GyeolBrandHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <Link
        href="/"
        className="group inline-flex min-h-12 items-center gap-3 rounded-full pr-3 transition duration-200 active:scale-[0.98]"
        aria-label="결리포트 홈"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c79a43]/55 bg-[#7f1d38] text-lg font-extrabold text-[#fffaf0] shadow-[0_10px_28px_rgba(127,29,56,0.22)] transition group-hover:bg-[#8f2543]">
          결
        </span>
        <span className="grid gap-0.5">
          <span className="text-lg font-extrabold tracking-normal text-[#211815]">
            결리포트
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a6b2f]">
            Gyeol Report
          </span>
        </span>
      </Link>
      {taglineKo ? (
        <p className="hidden max-w-xs text-right text-xs font-semibold leading-5 text-[#776b60] sm:block">
          {taglineKo}
        </p>
      ) : null}
    </div>
  );
}
