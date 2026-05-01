const mbtiTypes = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const;

export default function NewReportPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-neutral-50">
      <section className="mx-auto max-w-md space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-medium text-neutral-400">Gyeol Report</p>
          <h1 className="text-3xl font-bold tracking-tight">결리포트 만들기</h1>
          <p className="leading-7 text-neutral-400">
            생년월일, 출생시간, MBTI를 입력하면 사주 구조와 자기인식의
            겹침을 정리합니다.
          </p>
        </header>

        <form className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <input type="hidden" name="calendarType" value="SOLAR" />
          <input type="hidden" name="timezone" value="Asia/Seoul" />

          <div className="space-y-2">
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-neutral-200"
            >
              생년월일
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
            />
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-neutral-200">
            <input
              name="birthTimeUnknown"
              type="checkbox"
              className="h-5 w-5 rounded border-neutral-700 bg-neutral-950"
            />
            출생시간을 모릅니다
          </label>

          <div className="space-y-2">
            <label
              htmlFor="birthTime"
              className="block text-sm font-medium text-neutral-200"
            >
              출생시간
            </label>
            <input
              id="birthTime"
              name="birthTime"
              type="time"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-neutral-200"
            >
              성별
            </label>
            <select
              id="gender"
              name="gender"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
              defaultValue=""
            >
              <option value="">선택</option>
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="mbtiType"
              className="block text-sm font-medium text-neutral-200"
            >
              MBTI
            </label>
            <select
              id="mbtiType"
              name="mbtiType"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
              defaultValue=""
            >
              <option value="">선택</option>
              {mbtiTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-neutral-50 px-5 py-4 font-semibold text-neutral-950"
          >
            무료 미리보기 생성
          </button>
        </form>

        <div className="space-y-3 text-sm leading-6 text-neutral-500">
          <p>현재 V1은 양력과 Asia/Seoul 시간대만 지원합니다.</p>
          <p>
            본 리포트는 자기이해용 콘텐츠이며, 질병·투자·법률 판단이나 미래
            사건 예측을 제공하지 않습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
