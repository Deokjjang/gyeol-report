const flowSteps = [
  "생년월일시 입력",
  "MBTI 선택",
  "결제 후 리포트 생성",
  "90일 온라인 열람",
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
