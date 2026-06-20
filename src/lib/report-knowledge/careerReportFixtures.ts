import type { CareerReportFixture } from "./careerReportTypes";

export const CAREER_REPORT_FIXTURES = [
  {
    id: "deokmin-career",
    person: {
      label: "덕민",
      birthDate: "1999-07-31",
      birthTime: "07:30",
      gender: "male",
      mbti: "ENTJ",
      userContext: {
        lifeStatus: "employee",
        fieldLabel: "개발·서비스 기획",
        relationshipStatus: "unknown",
      },
      pillars: {
        year: "己卯",
        month: "辛未",
        day: "甲申",
        hour: "戊辰",
      },
      labels: [
        "갑신일주",
        "토 과다",
        "화 부족",
        "수 부족",
        "편재",
        "정재",
        "정관",
        "편관",
        "재다신약",
        "무인성",
        "무식상",
        "현침살",
        "홍염살",
        "귀문관살",
        "원진살",
        "재고귀인",
        "육해살",
        "천살",
        "지살",
        "화개살",
        "천을귀인",
        "금여록",
        "양인살",
        "공망",
      ],
    },
  },
  {
    id: "career-sample-wealth-single",
    person: {
      label: "민준",
      birthDate: "1998-03-14",
      gender: "male",
      mbti: "ENTP",
      userContext: {
        lifeStatus: "freelancer",
        fieldLabel: "브랜드 운영·영업",
        relationshipStatus: "single",
      },
      pillars: {
        year: "戊寅",
        month: "乙卯",
        day: "甲午",
        hour: "庚申",
      },
      labels: [
        "갑오일주",
        "목 과다",
        "수 부족",
        "재성 강함",
        "편재",
        "정재",
        "재고귀인",
        "공망",
      ],
    },
  },
  {
    id: "career-sample-officer-dating",
    person: {
      label: "서윤",
      birthDate: "1996-11-02",
      gender: "female",
      mbti: "ISTJ",
      userContext: {
        lifeStatus: "employee",
        fieldLabel: "공공기관 행정",
        relationshipStatus: "dating",
      },
      pillars: {
        year: "丙子",
        month: "庚戌",
        day: "乙亥",
        hour: "丁丑",
      },
      labels: [
        "을해일주",
        "금 과다",
        "목 부족",
        "관성 강함",
        "편관",
        "정관",
        "천을귀인",
        "공망",
      ],
    },
  },
  {
    id: "career-sample-expression-married",
    person: {
      label: "하린",
      birthDate: "1992-05-21",
      gender: "female",
      mbti: "ENFP",
      userContext: {
        lifeStatus: "business_owner",
        fieldLabel: "온라인 교육 콘텐츠",
        relationshipStatus: "married",
      },
      pillars: {
        year: "癸酉",
        month: "丁巳",
        day: "戊辰",
        hour: "辛酉",
      },
      labels: [
        "무진일주",
        "화 과다",
        "금 부족",
        "수 부족",
        "식상 과다",
        "식신",
        "상관",
        "홍염살",
        "화개살",
      ],
    },
  },
  {
    id: "career-sample-resource-unknown",
    person: {
      label: "도현",
      birthDate: "2001-01-09",
      gender: "male",
      mbti: "INTP",
      userContext: {
        lifeStatus: "exam_certificate",
        fieldLabel: "데이터 분석 자격증",
        relationshipStatus: "unknown",
      },
      pillars: {
        year: "辛巳",
        month: "己丑",
        day: "丙子",
        hour: "甲午",
      },
      labels: [
        "병자일주",
        "수 과다",
        "목 부족",
        "인성 강함",
        "편인",
        "정인",
        "무재성",
        "천을귀인",
        "공망",
      ],
    },
  },
  {
    id: "career-sample-peer-freelancer",
    person: {
      label: "지안",
      birthDate: "2000-09-17",
      gender: "female",
      mbti: "ISFP",
      userContext: {
        lifeStatus: "job_seeker",
        fieldLabel: "영상 편집·프리랜서 준비",
        relationshipStatus: "single",
      },
      pillars: {
        year: "庚辰",
        month: "乙酉",
        day: "庚戌",
        hour: "丙寅",
      },
      labels: [
        "경술일주",
        "금 과다",
        "화 부족",
        "비겁 강함",
        "비견",
        "겁재",
        "무관성",
        "양인살",
        "금여록",
      ],
    },
  },
] as const satisfies readonly CareerReportFixture[];

export function requireCareerReportFixture(
  fixtureId: string,
): CareerReportFixture {
  const fixture = CAREER_REPORT_FIXTURES.find((item) => item.id === fixtureId);

  if (fixture === undefined) {
    throw new Error(`Unknown career report fixture: ${fixtureId}`);
  }

  return fixture;
}
