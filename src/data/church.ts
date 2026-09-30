// 교회 기본 정보. 홈페이지에 표시되는 내용은 대부분 이 파일에서 수정하면 됩니다.

export const church = {
  name: "산성의빛교회",
  nameEn: "Fortress Light Church",
  denomination: "대한예수교장로회(합동) 성남노회",
  founded: 1971,
  email: "sungnamsansung@gmail.com",
  vision:
    "순결한 신부의 세대가 되어 그리스도의 십자가 복음을 열방에 전하는 이방의 빛",
};

export const pastor = {
  name: "배성환",
  title: "담임목사",
  photo: "/images/pastor.png",
  greeting: [
    "산성의빛교회는 대한예수교장로회(합동) 성남노회에 소속된 교회로 1971년에 설립된 역사가 있는 교회입니다.",
    "2025년에 광주 광명교회와 하나가 되어 진리의 말씀으로 세워져 가고 있습니다.",
    "산성의빛교회는 순결한 신부의 세대가 되어 그리스도의 십자가 복음을 열방에 전하여 이방의 빛이 되려는 비전이 있는 교회입니다.",
  ],
};

export const values = [
  { title: "말씀", text: "말씀이 좋은 교회로 성장하고 있습니다." },
  { title: "치유와 회복", text: "치유와 회복이 강한 교회가 되기를 힘쓰고 있습니다." },
  { title: "평화와 행복", text: "평화와 행복이 넘치기를 기도하는 교회입니다." },
  { title: "비전", text: "비전을 극대화 하도록 도전하는 교회입니다." },
  { title: "나눔과 섬김", text: "나눔과 섬김을 실천하도록 노력하는 교회입니다." },
  {
    title: "다음 세대",
    text: "자녀들 신앙과 교육에 관심과 배려를 가진 미래 지향적인 교회입니다.",
  },
  { title: "선교", text: "선교 및 복음 증거 사역에 최선을 다하고자 하는 교회입니다." },
];

export const motto = {
  year: 2026,
  keywords: ["복음", "제자", "소명"],
  title: "영광의 풍성함",
  reference: "로마서 11:11-12",
  verse:
    "그들의 넘어짐이 세상의 풍성함이 되며 그들의 실패가 이방인의 풍성함이 되거든 하물며 그들의 충만함이리요",
};

export const history = [
  { year: "1971", text: "교회 설립" },
  { year: "2025", text: "광주 광명교회와 하나 됨" },
  { year: "2026", text: "표어 「영광의 풍성함」 — 복음·제자·소명" },
];

export type Campus = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

export const campuses: Campus[] = [
  {
    id: "seongnam",
    name: "성남 성전",
    address: "경기 성남시 중원구 둔촌대로413번길 42-1",
    phone: "070-4102-0675",
  },
  {
    id: "gwangju",
    name: "광주 성전",
    address: "경기 광주시 현곡길 48-50",
    phone: "031-766-9190",
  },
];

export type Service = {
  name: string;
  time: string;
  note?: string;
};

export const serviceGroups: { title: string; services: Service[] }[] = [
  {
    title: "주일예배",
    services: [
      { name: "주일 1부 예배", time: "오전 9:00", note: "성남 성전" },
      { name: "주일 2부 예배", time: "오전 11:00", note: "성남 성전" },
      { name: "주일 오전예배", time: "오전 11:00", note: "광주 성전" },
      { name: "주일 오후예배", time: "오후 2:30", note: "광주 성전" },
    ],
  },
  {
    title: "주중 예배",
    services: [
      { name: "수요예배", time: "오후 7:00", note: "성남 성전" },
      { name: "새벽기도회", time: "오전 5:00", note: "성남/광주 성전 · 월,화,수,목,금" },
      { name: "금요심야기도회", time: "오후 9:00", note: "금요일" },
    ],
  },
  {
    title: "교회학교",
    services: [
      { name: "예꼬마을", time: "오전 11:00", note: "주일" },
      { name: "예꿈마을", time: "오전 10:40", note: "주일" },
      { name: "주일 중고청 예배", time: "오후 1:00", note: "주일" },
    ],
  },
];

// 예꿈도서관
export const library = { name: "예꿈도서관", hours: "월~금 오후 2:00 ~ 9:00" };

// 제자훈련 과정
export const discipleship: { level: string; courses: { name: string; period: string }[] }[] = [
  {
    level: "제자훈련 초급",
    courses: [
      { name: "바나바", period: "4주" },
      { name: "확신반", period: "5주" },
      { name: "교리학교", period: "8주" },
      { name: "중보기도학교", period: "3주" },
      { name: "열린모임", period: "자체적" },
      { name: "셀모임", period: "자체적" },
    ],
  },
  {
    level: "제자훈련 고급",
    courses: [
      { name: "양육반", period: "12주" },
      { name: "제자훈련", period: "12주" },
      { name: "군사훈련", period: "12주" },
      { name: "재생산훈련", period: "12주" },
      { name: "치유수련회", period: "분기별" },
      { name: "선교학교", period: "3주" },
    ],
  },
];

export const social = {
  youtube: "https://www.youtube.com/@FortressLightChurch",
  youtubeChannelId: "UCPsMANSVas3kIzyjO42rOiQ", // 산성의 빛 TV
  instagram: "https://www.instagram.com/sansunglight_official/",
};

export const ministries = [
  {
    id: "yekko",
    name: "예꼬마을",
    subtitle: "교회학교",
    description:
      "말씀과 찬양 안에서 아이들이 예수님을 만나고 믿음의 첫걸음을 내딛는 교회학교입니다.",
    time: "주일 오전 11:00",
    links: [] as { type: "instagram" | "youtube"; label: string; href: string }[],
  },
  {
    id: "yekkum",
    name: "예꿈마을",
    subtitle: "교회학교",
    description:
      "예수님의 꿈을 품고 자라는 아이들의 마을입니다. 말씀과 찬양, 따뜻한 교제 가운데 믿음의 기초를 세워 갑니다.",
    time: "주일 오전 10:40",
    links: [
      { type: "instagram" as const, label: "@jesus_dream_world", href: "https://www.instagram.com/jesus_dream_world/" },
    ],
  },
  {
    id: "adelphos",
    name: "아델포스",
    subtitle: "중고청 · 청년회",
    description:
      "‘형제’라는 뜻의 아델포스는 복음 안에서 한 가족 된 청년들의 공동체입니다. 함께 예배하고 삶을 나누며 소명을 발견해 갑니다.",
    time: "주일 오후 1:00",
    links: [
      { type: "instagram" as const, label: "@adel_pos", href: "https://www.instagram.com/adel_pos/" },
      {
        type: "youtube" as const,
        label: "아델포스 청년회",
        href: "https://www.youtube.com/@%EC%82%B0%EC%84%B1%EC%9D%98%EB%B9%9B%EA%B5%90%ED%9A%8C-%EC%95%84%EB%8D%B8%ED%8F%AC",
      },
    ],
  },
];

// 교회소식과 주보. 새 항목을 배열 맨 앞에 추가하세요.
// 주보 PDF는 public/bulletins/ 폴더에 넣고 file 경로를 적으면 됩니다.
export type NewsItem = { date: string; title: string; body: string };
export type Bulletin = { date: string; title: string; file: string };

export const news: NewsItem[] = [];
export const bulletins: Bulletin[] = [];

export const nav = [
  { href: "/about", label: "교회소개" },
  { href: "/worship", label: "예배안내" },
  { href: "/sermons", label: "설교·영상" },
  { href: "/news", label: "교회소식" },
  { href: "/education", label: "교회학교" },
  { href: "/location", label: "오시는 길" },
];
