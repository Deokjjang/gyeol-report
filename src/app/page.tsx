import ProductGrid from "../components/product/ProductGrid";
import type { ProductTileItem } from "../components/product/ProductTile";
import {
  GYEOL_HOME_PRODUCT_GRID,
  GYEOL_PRODUCTS,
} from "../lib/product/gyeolProducts";

const activeComprehensiveProduct =
  GYEOL_HOME_PRODUCT_GRID.find((product) => product.isPurchasable) ??
  GYEOL_PRODUCTS[0];

const launchProductGrid = [
  activeComprehensiveProduct,
  {
    id: "career_money_study_report",
    productKey: "career_money_study",
    slug: "career-money-study",
    nameKo: "직업·커리어·돈·학업 리포트",
    versionBadgeKo: "v1.0 준비",
    shortDescriptionKo:
      "타고난 직업성, 돈을 다루는 방식, 투자·저축 성향, 공부 루틴을 하나의 흐름으로 정리합니다.",
    status: "preview_available",
    isPurchasable: false,
    href: null,
    previewHref: "/report/new?product=career-money-study",
    previewCtaLabelKo: "입력 흐름 미리보기",
    previewStatusKo: "준비 중 · 미리보기 가능",
    badgeKo: "개발 preview",
    visualKey: "career_money_study",
  },
  {
    id: "love_marriage_child_report",
    productKey: "love_marriage_child",
    slug: "love-marriage-child",
    nameKo: "연애·결혼·자녀 리포트",
    versionBadgeKo: "v1.0 준비",
    shortDescriptionKo:
      "관계에서 드러나는 표현 방식, 책임 방식, 생활 리듬과 가족 역할을 참고용으로 봅니다.",
    status: "preview_available",
    isPurchasable: false,
    href: null,
    previewHref: "/report/new?product=love-marriage-child",
    previewCtaLabelKo: "입력 흐름 미리보기",
    previewStatusKo: "준비 중 · 미리보기 가능",
    badgeKo: "개발 preview",
    visualKey: "love_marriage_child",
  },
  {
    id: "compatibility_report",
    nameKo: "궁합 리포트",
    versionBadgeKo: "v1.0 준비",
    shortDescriptionKo:
      "연애, 결혼, 가족, 동료, 협업 관계까지 두 사람의 연결 구조와 조율 포인트를 봅니다.",
    status: "coming_soon",
    isPurchasable: false,
    href: null,
    badgeKo: "출시 준비 중",
    visualKey: "compatibility",
  },
  {
    id: "daewoon_report",
    nameKo: "대운 리포트",
    versionBadgeKo: "v1.0 준비",
    shortDescriptionKo:
      "10년 단위의 큰 흐름과 올해 세운을 교차해 일, 돈, 관계의 배경 변화를 정리합니다.",
    status: "coming_soon",
    isPurchasable: false,
    href: null,
    badgeKo: "출시 준비 중",
    visualKey: "daewoon",
  },
  {
    id: "saewoon_report",
    nameKo: "세운 리포트",
    versionBadgeKo: "v1.0 준비",
    shortDescriptionKo:
      "선택 연도의 흐름과 월운을 상반기·하반기 기준으로 읽고 행동 기준을 정리합니다.",
    status: "coming_soon",
    isPurchasable: false,
    href: null,
    badgeKo: "출시 준비 중",
    visualKey: "saewoon",
  },
] as const satisfies readonly ProductTileItem[];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4efe7] px-5 py-8 text-[#201a18] sm:px-8 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-10">
        <header className="animate-[gyeol-reveal_520ms_ease-out] space-y-7 rounded-lg border border-[#d8d1c4] bg-[#fffdf8] p-5 shadow-[0_22px_80px_rgba(40,24,28,0.10)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-5">
              <p className="text-sm font-extrabold tracking-[0.18em] text-[#7f1d38]">
                결리포트
              </p>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-extrabold tracking-normal text-[#201a18] sm:text-5xl">
                  명리 기반 프리미엄 디지털 리포트
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[#5d5149] sm:text-base">
                  결제 후 입력값을 바탕으로 자동 생성되는 유료 디지털
                  리포트입니다. 사람 상담이 아닌 자동 생성 리포트이며, 명리
                  기반 계산과 MBTI 정밀 DB 반영 결과를 결제 후 온라인에서
                  열람할 수 있습니다. 온라인에서 결과를 열람할 수 있습니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-bold text-[#4c433c]">
                <span className="rounded-full border border-[#d8d1c4] bg-[#f4efe7] px-3 py-1">
                  자동 생성 디지털 리포트
                </span>
                <span className="rounded-full border border-[#d8d1c4] bg-[#f4efe7] px-3 py-1">
                  명리 기반
                </span>
                <span className="rounded-full border border-[#d8d1c4] bg-[#f4efe7] px-3 py-1">
                  MBTI 정밀 DB 반영
                </span>
                <span className="rounded-full border border-[#d8d1c4] bg-[#f4efe7] px-3 py-1">
                  상담이 아닌 참고용 리포트
                </span>
              </div>
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-lg border border-[#7f1d38]/20 bg-[#7f1d38]/10 p-4">
                <dt className="font-semibold text-[#7f1d38]">런칭가</dt>
                <dd className="mt-1 text-2xl font-extrabold text-[#7f1d38]">
                  990원
                </dd>
              </div>
              <div className="rounded-lg border border-[#d8d1c4] bg-[#f4efe7] p-4">
                <dt className="font-semibold text-[#7b7165]">정가</dt>
                <dd className="mt-1 font-bold text-[#8b8174] line-through">
                  1,290원
                </dd>
              </div>
              <div className="rounded-lg border border-[#d8d1c4] bg-[#f4efe7] p-4">
                <dt className="font-semibold text-[#7b7165]">제공 방식</dt>
                <dd className="mt-1 font-bold text-[#201a18]">
                  결제 후 온라인 열람
                </dd>
              </div>
              <div className="rounded-lg border border-[#d8d1c4] bg-[#f4efe7] p-4">
                <dt className="font-semibold text-[#7b7165]">구매 상태</dt>
                <dd className="mt-1 font-bold text-[#201a18]">
                  사주×MBTI 종합 리포트 구매 가능
                </dd>
              </div>
            </dl>
          </div>
        </header>

        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold text-[#7f1d38]">상품 선택</p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-normal text-[#201a18]">
                결리포트 상품군
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[#6f675d]">
              현재 구매 가능한 상품은 기존 정책 그대로 종합 리포트입니다.
              나머지 상품은 출시 준비 중이며, 준비 상태를 명확히 구분합니다.
            </p>
          </div>
          <ProductGrid products={launchProductGrid} />
        </section>
      </section>
    </main>
  );
}
