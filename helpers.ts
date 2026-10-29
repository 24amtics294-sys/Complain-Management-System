import type { ComplaintStatus, ComplaintPriority, ComplainantRole } from './types';

export const statusStyles: Record<ComplaintStatus, string> = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  'In Progress': 'bg-sky-50 text-sky-700 ring-sky-600/20',
  Resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Rejected: 'bg-rose-50 text-rose-700 ring-rose-600/20',
};

export const statusDot: Record<ComplaintStatus, string> = {
  Pending: 'bg-amber-500',
  'In Progress': 'bg-sky-500',
  Resolved: 'bg-emerald-500',
  Rejected: 'bg-rose-500',
};

export const priorityStyles: Record<ComplaintPriority, string> = {
  Low: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  Medium: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  High: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  Critical: 'bg-red-50 text-red-700 ring-red-600/20',
};

export const roleStyles: Record<ComplainantRole, string> = {
  Student: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  Professor: 'bg-violet-50 text-violet-700 ring-violet-600/20',
};

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(iso: string): string {
  const d = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(iso);
}

export function nextComplaintId(existing: string[]): string {
  const nums = existing
    .map((id) => parseInt(id.replace(/\D/g, ''), 10))
    .filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 1000;
  return `CMP-${max + 1}`;
}
