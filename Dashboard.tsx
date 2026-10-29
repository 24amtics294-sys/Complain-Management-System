import { useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  TrendingUp,
  ArrowRight,
  FilePlus2,
  RefreshCw,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import type { Complaint, ComplaintStatus, ActivityLog } from '../types';
import { statusStyles, statusDot, formatDate, timeAgo } from '../helpers';

interface DashboardProps {
  complaints: Complaint[];
  activity: ActivityLog[];
  onSelect: (id: string) => void;
  onNew: () => void;
  onViewAll: () => void;
}

export default function Dashboard({ complaints, activity, onSelect, onNew, onViewAll }: DashboardProps) {
  const stats = useMemo(() => {
    const total = complaints.length;
    const byStatus = (s: ComplaintStatus) => complaints.filter((c) => c.status === s).length;
    const critical = complaints.filter((c) => c.priority === 'Critical').length;
    const resolved = byStatus('Resolved');
    const pending = byStatus('Pending') + byStatus('In Progress');
    const resolutionRate = total ? Math.round((resolved / total) * 100) : 0;
    return {
      total,
      pending,
      resolved,
      rejected: byStatus('Rejected'),
      critical,
      resolutionRate,
    };
  }, [complaints]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    complaints.forEach((c) => map.set(c.category, (map.get(c.category) ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [complaints]);

  const statusBreakdown: { status: ComplaintStatus; count: number }[] = useMemo(
    () =>
      (['Pending', 'In Progress', 'Resolved', 'Rejected'] as ComplaintStatus[]).map((status) => ({
        status,
        count: complaints.filter((c) => c.status === status).length,
      })),
    [complaints]
  );

  const recentActivity = useMemo(() => {
    const complaintMap = new Map(complaints.map((c) => [c.id, c]));
    return [...activity]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 6)
      .map((a) => ({ ...a, complaint: complaintMap.get(a.complaintId) }));
  }, [activity, complaints]);

  const maxCat = Math.max(...byCategory.map(([, n]) => n), 1);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-lg">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-wider text-sky-300">
              Uka Tarsadia University
            </p>
            <h2 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
              Campus Complaint Portal
            </h2>
            <p className="mt-3 text-slate-300">
              A central platform for students and professors of Uka Tarsadia University to file
              grievances and follow them through to resolution. Currently monitoring{' '}
              <span className="font-semibold text-white">{stats.total}</span> active cases across
              the campus.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={onNew}
                className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-400 active:scale-95"
              >
                File a Complaint
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={onViewAll}
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View All Cases
              </button>
            </div>
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-3 md:grid-cols-1 md:gap-2">
            <div className="rounded-xl bg-white/5 px-5 py-3 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-wide text-slate-400">Resolution Rate</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.resolutionRate}%</p>
            </div>
            <div className="rounded-xl bg-white/5 px-5 py-3 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-wide text-slate-400">Critical Cases</p>
              <p className="text-2xl font-bold text-rose-400">{stats.critical}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Complaints"
          value={stats.total}
          icon={<AlertTriangle className="h-5 w-5" />}
          tint="text-slate-700 bg-slate-100"
        />
        <StatCard
          label="Pending Action"
          value={stats.pending}
          icon={<Clock className="h-5 w-5" />}
          tint="text-amber-600 bg-amber-50"
        />
        <StatCard
          label="In Progress"
          value={complaints.filter((c) => c.status === 'In Progress').length}
          icon={<Loader2 className="h-5 w-5" />}
          tint="text-sky-600 bg-sky-50"
        />
        <StatCard
          label="Resolved"
          value={stats.resolved}
          icon={<CheckCircle2 className="h-5 w-5" />}
          tint="text-emerald-600 bg-emerald-50"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Status breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900">Status Breakdown</h3>
          <div className="mt-5 space-y-4">
            {statusBreakdown.map(({ status, count }) => {
              const pct = stats.total ? (count / stats.total) * 100 : 0;
              const barColor: Record<ComplaintStatus, string> = {
                Pending: 'bg-amber-500',
                'In Progress': 'bg-sky-500',
                Resolved: 'bg-emerald-500',
                Rejected: 'bg-rose-500',
              };
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <span className={`h-2 w-2 rounded-full ${statusDot[status]}`} />
                      {status}
                    </span>
                    <span className="text-slate-500">{count}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${barColor[status]} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Complaints by Category</h3>
            <TrendingUp className="h-5 w-5 text-slate-400" />
          </div>
          <div className="mt-5 space-y-3">
            {byCategory.map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-sm font-medium text-slate-600">
                  {cat}
                </span>
                <div className="flex-1">
                  <div className="h-7 overflow-hidden rounded-md bg-slate-100">
                    <div
                      className="flex h-full items-center justify-end rounded-md bg-gradient-to-r from-sky-500 to-indigo-500 px-2 text-xs font-semibold text-white transition-all duration-500"
                      style={{ width: `${Math.max((count / maxCat) * 100, 12)}%` }}
                    >
                      {count}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            View all complaints →
          </button>
        </div>
        <ul className="divide-y divide-slate-100">
          {recentActivity.length === 0 && (
            <li className="px-6 py-8 text-center text-sm text-slate-400">
              No activity recorded yet.
            </li>
          )}
          {recentActivity.map((a) => (
            <li key={a.id}>
              <button
                onClick={() => a.complaint && onSelect(a.complaint.id)}
                className="flex w-full items-center gap-4 px-6 py-4 text-left transition hover:bg-slate-50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  {activityIcon(a.action)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {a.complaint ? a.complaint.title : a.complaintId}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    <span className="font-medium text-slate-600">{a.action}</span> · {a.detail}
                  </p>
                </div>
                {a.complaint && (
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[a.complaint.status]}`}
                  >
                    {a.complaint.status}
                  </span>
                )}
                <span className="hidden w-28 shrink-0 text-right text-xs text-slate-400 sm:block">
                  {formatDate(a.timestamp)}
                  <br />
                  {timeAgo(a.timestamp)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function activityIcon(action: string): React.ReactNode {
  const a = action.toLowerCase();
  if (a.includes('creat')) return <FilePlus2 className="h-4 w-4" />;
  if (a.includes('resolv')) return <CheckCircle className="h-4 w-4 text-emerald-600" />;
  if (a.includes('reject')) return <XCircle className="h-4 w-4 text-rose-600" />;
  if (a.includes('status') || a.includes('priority') || a.includes('update'))
    return <RefreshCw className="h-4 w-4 text-sky-600" />;
  return <RefreshCw className="h-4 w-4" />;
}

function StatCard({
  label,
  value,
  icon,
  tint,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tint: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${tint}`}>
          {icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
