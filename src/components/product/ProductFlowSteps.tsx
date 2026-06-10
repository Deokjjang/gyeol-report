const flowSteps = [
  "생년월일시 입력",
  "MBTI 선택",
  "무료 미리보기 확인",
  "결제 후 전체 리포트 열람",
] as const;

export default function ProductFlowSteps() {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {flowSteps.map((step, index) => (
        <li
          key={step}
          className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-semibold text-emerald-700">
            {index + 1}
          </p>
          <p className="mt-2 text-sm font-semibold text-neutral-950">{step}</p>
        </li>
      ))}
    </ol>
  );
}
