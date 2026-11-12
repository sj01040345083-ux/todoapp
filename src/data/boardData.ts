import { Branch, BoardCategory, BoardPost } from '../types';

// 지점 소통게시판 — 시연용 샘플 데이터
export const BRANCHES: Branch[] = [
  { id: 'gangnam', name: '강남점', region: '서울' },
  { id: 'hongdae', name: '홍대점', region: '서울' },
  { id: 'busan', name: '부산서면점', region: '부산' },
  { id: 'daegu', name: '대구동성로점', region: '대구' },
  { id: 'gwangju', name: '광주충장점', region: '광주' },
  { id: 'daejeon', name: '대전둔산점', region: '대전' },
];

export const HQ_ID = 'hq';

export const BOARD_CATEGORIES: { id: BoardCategory; name: string; badge: string }[] = [
  { id: 'notice', name: '공지', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'request', name: '업무요청', badge: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'question', name: '질문', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'share', name: '자료공유', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'suggestion', name: '건의', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
];

const TITLES: Record<BoardCategory, string[]> = {
  notice: [
    '11월 프로모션 운영 가이드 안내',
    '연말 재고 실사 일정 공지',
    '신규 POS 시스템 업데이트 안내',
    '동절기 매장 안전 점검 체크리스트',
    '고객 응대 매뉴얼 개정판 배포',
    '본사 정기 교육 일정 안내',
  ],
  request: [
    '진열대 교체 요청드립니다',
    '홍보물 추가 발송 요청',
    '인력 지원 요청 (주말 근무)',
    'POS 단말기 점검 요청',
    '택배 회수 일정 조정 요청',
  ],
  question: [
    '포인트 적립 오류 처리 방법 문의',
    '반품 기준 변경 사항 질문',
    '신규 상품 입고 일정 문의',
    '근태 시스템 등록 방법 질문',
    '프로모션 중복 적용 가능 여부 문의',
  ],
  share: [
    '이번 주 베스트 진열 사례 공유',
    '고객 만족도 설문 결과 공유',
    '매출 상승 이벤트 운영 후기',
    'VMD 사진 자료 공유',
  ],
  suggestion: [
    '지점 간 재고 이동 절차 간소화 건의',
    '야간 마감 체크리스트 개선 건의',
    '교육 영상 모바일 시청 지원 건의',
  ],
};

const AUTHORS = ['김민지', '이준호', '박서연', '최도윤', '정하은', '강태민', '윤지우', '한소희'];

// 결정적(seeded) 난수 — 새로고침해도 같은 샘플이 보이도록
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generatePosts(): BoardPost[] {
  const rand = mulberry32(20261112);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
  const now = Date.now();
  const DAY = 86400000;
  const posts: BoardPost[] = [];

  const categoryWeights: [BoardCategory, number][] = [
    ['request', 0.3],
    ['question', 0.3],
    ['share', 0.2],
    ['suggestion', 0.2],
  ];
  const pickCategory = (): BoardCategory => {
    let r = rand();
    for (const [c, w] of categoryWeights) {
      if ((r -= w) <= 0) return c;
    }
    return 'request';
  };

  // 지점 게시글
  for (let i = 0; i < 92; i++) {
    const daysAgo = Math.floor(Math.pow(rand(), 1.3) * 30);
    const category = pickCategory();
    const branch = pick(BRANCHES);
    const createdAt = new Date(now - daysAgo * DAY - Math.floor(rand() * 10) * 3600000).toISOString();
    const needsAnswer = category === 'question' || category === 'request';
    posts.push({
      id: `post-${i + 1}`,
      title: pick(TITLES[category]),
      category,
      branchId: branch.id,
      author: pick(AUTHORS),
      createdAt,
      views: 12 + Math.floor(rand() * 140),
      comments: Math.floor(rand() * 9),
      urgent: rand() < 0.08,
      answered: needsAnswer ? daysAgo > 3 || rand() < 0.55 : undefined,
    });
  }

  // 본사 공지 — 지점별 확인 여부 포함
  TITLES.notice.forEach((title, i) => {
    const daysAgo = i * 5 + Math.floor(rand() * 3);
    const readBy = BRANCHES.filter(() => rand() < Math.min(0.95, 0.45 + daysAgo * 0.04)).map((b) => b.id);
    posts.push({
      id: `notice-${i + 1}`,
      title,
      category: 'notice',
      branchId: HQ_ID,
      author: '본사 운영팀',
      createdAt: new Date(now - daysAgo * DAY - 3600000 * 2).toISOString(),
      views: 80 + Math.floor(rand() * 220),
      comments: Math.floor(rand() * 6),
      urgent: i === 0 || i === 3,
      pinned: i < 2,
      readBy,
    });
  });

  return posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const BOARD_POSTS: BoardPost[] = generatePosts();
