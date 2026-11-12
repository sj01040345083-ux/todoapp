import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BellRing,
  Check,
  Eye,
  FileText,
  MessageCircleQuestion,
  MessageSquare,
  Pin,
  X,
} from 'lucide-react';
import { BOARD_CATEGORIES, BOARD_POSTS, BRANCHES, HQ_ID } from '../../data/boardData';
import { BoardPost } from '../../types';

// 차트 색상 (단일 계열 = 단일 hue)
const SERIES = '#2a78d6';
const DAY = 86400000;

type Period = 7 | 30;

const branchName = (id: string) =>
  id === HQ_ID ? '본사' : BRANCHES.find((b) => b.id === id)?.name ?? id;
const categoryMeta = (id: string) => BOARD_CATEGORIES.find((c) => c.id === id)!;

const dateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const relativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return '방금 전';
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  return `${d}일 전`;
};

const Card: React.FC<{ title: string; subtitle?: string; className?: string; children: React.ReactNode; action?: React.ReactNode }> = ({
  title,
  subtitle,
  className = '',
  children,
  action,
}) => (
  <section className={`bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs min-w-0 ${className}`}>
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
);

const StatTile: React.FC<{ label: string; value: number | string; unit?: string; note?: string; icon: React.ReactNode; tone: string }> = ({
  label,
  value,
  unit,
  note,
  icon,
  tone,
}) => (
  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
      <span className={`p-1.5 rounded-lg ${tone}`}>{icon}</span>
      {label}
    </div>
    <p className="mt-3 text-2xl font-bold text-slate-900 tabular-nums">
      {value}
      {unit && <span className="text-sm font-semibold text-slate-500 ml-0.5">{unit}</span>}
    </p>
    {note && <p className="text-[11px] text-slate-500 mt-1">{note}</p>}
  </div>
);

// ---- 일별 게시글 추이 (막대 + 호버 툴팁) ----
const DailyActivityChart: React.FC<{ data: { key: string; label: string; count: number }[] }> = ({ data }) => {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(4, ...data.map((d) => d.count));
  const niceMax = Math.ceil(max / 4) * 4;
  const ticks = [0, niceMax / 2, niceMax];
  const W = 640;
  const H = 200;
  const padL = 28;
  const padB = 22;
  const padT = 8;
  const plotW = W - padL;
  const plotH = H - padB - padT;
  const slot = plotW / data.length;
  const barW = Math.max(4, Math.min(28, slot - 2));
  const labelEvery = data.length > 10 ? 5 : 1;
  const y = (v: number) => padT + plotH - (v / niceMax) * plotH;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="일별 게시글 수 막대 차트">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeWidth={1} />
            <text x={padL - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill="#64748b">
              {t}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = padL + i * slot + (slot - barW) / 2;
          const h = Math.max(0, y(0) - y(d.count));
          const r = Math.min(4, barW / 2, h);
          return (
            <g key={d.key}>
              {h > 0 && (
                <path
                  d={`M${x},${y(0)} V${y(d.count) + r} Q${x},${y(d.count)} ${x + r},${y(d.count)} H${x + barW - r} Q${x + barW},${y(d.count)} ${x + barW},${y(d.count) + r} V${y(0)} Z`}
                  fill={SERIES}
                  opacity={hover === null || hover === i ? 1 : 0.45}
                />
              )}
              {(i % labelEvery === 0 || i === data.length - 1) && (
                <text x={padL + i * slot + slot / 2} y={H - 6} textAnchor="middle" fontSize={10} fill="#64748b">
                  {d.label}
                </text>
              )}
              <rect
                x={padL + i * slot}
                y={padT}
                width={slot}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 bg-slate-900 text-white text-xs rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap"
          style={{ left: `${((padL + hover * slot + slot / 2) / W) * 100}%` }}
        >
          <span className="text-slate-300">{data[hover].key}</span>
          <span className="ml-2 font-semibold">{data[hover].count}건</span>
        </div>
      )}
    </div>
  );
};

// ---- 가로 막대 목록 ----
const HBarList: React.FC<{
  rows: { id: string; label: string; value: number; extra?: string }[];
  onSelect?: (id: string) => void;
  selected?: string | null;
}> = ({ rows, onSelect, selected }) => {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => {
        const dim = selected && selected !== r.id;
        const Inner = (
          <>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700">{r.label}</span>
              <span className="text-slate-500 tabular-nums">
                <span className="font-semibold text-slate-800">{r.value}건</span>
                {r.extra && <span className="ml-1.5">{r.extra}</span>}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(r.value / max) * 100}%`, background: SERIES, opacity: dim ? 0.35 : 1 }}
              />
            </div>
          </>
        );
        return (
          <li key={r.id} title={`${r.label}: ${r.value}건`}>
            {onSelect ? (
              <button onClick={() => onSelect(r.id)} className="w-full text-left cursor-pointer hover:bg-slate-50 rounded-lg -mx-1 px-1 py-0.5">
                {Inner}
              </button>
            ) : (
              Inner
            )}
          </li>
        );
      })}
    </ul>
  );
};

const PostRow: React.FC<{ post: BoardPost }> = ({ post }) => {
  const cat = categoryMeta(post.category);
  return (
    <li className="py-2.5 flex items-start gap-3">
      <span className={`shrink-0 mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${cat.badge}`}>{cat.name}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-800 truncate flex items-center gap-1.5">
          {post.pinned && <Pin className="w-3.5 h-3.5 text-indigo-600 shrink-0" aria-label="고정" />}
          {post.urgent && (
            <span className="shrink-0 inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600">
              <AlertTriangle className="w-3 h-3" />
              긴급
            </span>
          )}
          <span className="truncate">{post.title}</span>
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          {branchName(post.branchId)} · {post.author} · {relativeTime(post.createdAt)}
        </p>
      </div>
      <div className="shrink-0 flex items-center gap-2.5 text-[11px] text-slate-500 tabular-nums">
        <span className="inline-flex items-center gap-0.5"><Eye className="w-3 h-3" />{post.views}</span>
        <span className="inline-flex items-center gap-0.5"><MessageSquare className="w-3 h-3" />{post.comments}</span>
      </div>
    </li>
  );
};

export const BoardDashboard: React.FC = () => {
  const [period, setPeriod] = useState<Period>(7);
  const [branch, setBranch] = useState<string | null>(null);

  const now = Date.now();
  const since = now - period * DAY;

  const branchPosts = useMemo(
    () => BOARD_POSTS.filter((p) => !branch || p.branchId === branch || p.branchId === HQ_ID),
    [branch]
  );
  const periodPosts = useMemo(() => branchPosts.filter((p) => new Date(p.createdAt).getTime() >= since), [branchPosts, since]);
  const notices = useMemo(() => BOARD_POSTS.filter((p) => p.category === 'notice'), []);

  // KPI
  const prevCount = branchPosts.filter((p) => {
    const t = new Date(p.createdAt).getTime();
    return t < since && t >= since - period * DAY;
  }).length;
  const delta = periodPosts.length - prevCount;
  const pending = branchPosts.filter((p) => p.answered === false);
  const unreadCount = branch
    ? notices.filter((n) => !n.readBy?.includes(branch)).length
    : notices.reduce((sum, n) => sum + (BRANCHES.length - (n.readBy?.length ?? 0)), 0);
  const totalReadSlots = notices.length * (branch ? 1 : BRANCHES.length);
  const readRate = Math.round(((totalReadSlots - unreadCount) / totalReadSlots) * 100);
  const urgentCount = periodPosts.filter((p) => p.urgent).length;

  // 일별 추이
  const daily = useMemo(() => {
    const buckets = new Map<string, number>();
    periodPosts.forEach((p) => {
      const k = dateKey(new Date(p.createdAt));
      buckets.set(k, (buckets.get(k) ?? 0) + 1);
    });
    return Array.from({ length: period }, (_, i) => {
      const d = new Date(now - (period - 1 - i) * DAY);
      const k = dateKey(d);
      return { key: k, label: `${d.getMonth() + 1}/${d.getDate()}`, count: buckets.get(k) ?? 0 };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodPosts, period]);

  // 분류별
  const byCategory = BOARD_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.name,
    value: periodPosts.filter((p) => p.category === c.id).length,
  })).sort((a, b) => b.value - a.value);

  // 지점별 (기간 내, 본사 제외)
  const byBranch = BRANCHES.map((b) => {
    const posts = BOARD_POSTS.filter((p) => p.branchId === b.id && new Date(p.createdAt).getTime() >= since);
    return {
      id: b.id,
      label: b.name,
      value: posts.length,
      extra: `· 댓글 ${posts.reduce((s, p) => s + p.comments, 0)}`,
    };
  }).sort((a, b) => b.value - a.value);

  const recent = periodPosts.filter((p) => p.category !== 'notice').slice(0, 7);
  const visibleBranches = branch ? BRANCHES.filter((b) => b.id === branch) : BRANCHES;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-16">
      {/* 타이틀 + 필터 */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold text-indigo-600">시연용 샘플</p>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">지점 소통게시판 대시보드</h1>
          <p className="text-sm text-slate-500 mt-1">
            {branch ? `${branchName(branch)} 기준` : `전체 ${BRANCHES.length}개 지점`} · 최근 {period}일
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={branch ?? ''}
            onChange={(e) => setBranch(e.target.value || null)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            aria-label="지점 선택"
          >
            <option value="">전체 지점</option>
            {BRANCHES.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <div className="inline-flex bg-slate-100 rounded-xl p-1" role="group" aria-label="기간">
            {([7, 30] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                  period === p ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                최근 {p}일
              </button>
            ))}
          </div>
          {branch && (
            <button onClick={() => setBranch(null)} className="text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer inline-flex items-center gap-1">
              <X className="w-3.5 h-3.5" />초기화
            </button>
          )}
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatTile
          label="신규 게시글"
          value={periodPosts.length}
          unit="건"
          note={period === 7 ? `지난주 대비 ${delta >= 0 ? '+' : ''}${delta}건` : `일 평균 ${(periodPosts.length / period).toFixed(1)}건`}
          icon={<FileText className="w-3.5 h-3.5" />}
          tone="bg-indigo-50 text-indigo-600"
        />
        <StatTile
          label="답변 대기"
          value={pending.length}
          unit="건"
          note="질문·업무요청 미처리"
          icon={<MessageCircleQuestion className="w-3.5 h-3.5" />}
          tone="bg-amber-50 text-amber-600"
        />
        <StatTile
          label="공지 확인율"
          value={readRate}
          unit="%"
          note={`미확인 ${unreadCount}건`}
          icon={<BellRing className="w-3.5 h-3.5" />}
          tone="bg-emerald-50 text-emerald-600"
        />
        <StatTile
          label="긴급 게시글"
          value={urgentCount}
          unit="건"
          note={`최근 ${period}일`}
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
          tone="bg-rose-50 text-rose-600"
        />
      </div>

      {/* 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card title="일별 게시글 추이" subtitle={`최근 ${period}일 · 본사 공지 포함`} className="lg:col-span-2">
          <DailyActivityChart data={daily} />
        </Card>
        <Card title="분류별 게시글" subtitle={`최근 ${period}일`}>
          <HBarList rows={byCategory} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card title="지점별 활동" subtitle="막대를 누르면 해당 지점만 볼 수 있어요">
          <HBarList rows={byBranch} selected={branch} onSelect={(id) => setBranch(branch === id ? null : id)} />
        </Card>

        <Card title="공지 확인 현황" subtitle="본사 공지별 지점 확인 여부" className="lg:col-span-2">
          <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500">
                  <th className="text-left font-semibold pb-2 pr-3">공지</th>
                  {visibleBranches.map((b) => (
                    <th key={b.id} className="font-semibold pb-2 px-1 whitespace-nowrap">{b.name.replace(/점$/, '')}</th>
                  ))}
                  <th className="text-right font-semibold pb-2 pl-2">확인</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notices.map((n) => {
                  const read = visibleBranches.filter((b) => n.readBy?.includes(b.id)).length;
                  return (
                    <tr key={n.id}>
                      <td className="py-2 pr-3 text-slate-800 font-medium max-w-[220px] truncate" title={n.title}>
                        {n.pinned && <Pin className="w-3 h-3 text-indigo-600 inline mr-1 -mt-0.5" />}
                        {n.title}
                      </td>
                      {visibleBranches.map((b) => {
                        const ok = n.readBy?.includes(b.id);
                        return (
                          <td key={b.id} className="py-2 px-1 text-center" title={`${b.name}: ${ok ? '확인' : '미확인'}`}>
                            {ok ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 inline" aria-label="확인" />
                            ) : (
                              <span className="text-[10px] font-semibold text-rose-600">미확인</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="py-2 pl-2 text-right tabular-nums text-slate-700 font-semibold whitespace-nowrap">
                        {read}/{visibleBranches.length}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="최근 게시글" subtitle="지점 게시글 최신순" className="lg:col-span-2">
          {recent.length ? (
            <ul className="divide-y divide-slate-100 -my-2.5">
              {recent.map((p) => <PostRow key={p.id} post={p} />)}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 py-6 text-center">해당 기간에 게시글이 없습니다.</p>
          )}
        </Card>
        <Card title="답변 대기 중" subtitle="오래된 순">
          {pending.length ? (
            <ul className="space-y-2">
              {[...pending].reverse().slice(0, 6).map((p) => (
                <li key={p.id} className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                  <p className="text-sm font-medium text-slate-800 truncate">{p.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {branchName(p.branchId)} · {categoryMeta(p.category).name} · {relativeTime(p.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 py-6 text-center">대기 중인 항목이 없습니다 🎉</p>
          )}
        </Card>
      </div>
    </div>
  );
};
