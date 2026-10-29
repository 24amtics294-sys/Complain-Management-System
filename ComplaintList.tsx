import { useMemo, useState } from 'react';
import { Search, Filter, Inbox, Paperclip, MapPin, ChevronRight } from 'lucide-react';
import type { Complaint, ComplaintStatus, ComplaintCategory } from '../types';
import { statusStyles, statusDot, priorityStyles, roleStyles, timeAgo } from '../helpers';
import { categories, statuses } from '../data';

interface ComplaintListProps {
  complaints: Complaint[];
  onSelect: (id: string) => void;
  onNew: () => void;
}

type SortKey = 'recent' | 'oldest' | 'priority';

export default function ComplaintList({ complaints, onSelect, onNew }: ComplaintListProps) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | 'All'>('All');
  const [sort, setSort] = useState<SortKey>('recent');

  const priorityRank = { Critical: 0, High: 1, Medium: 2, Low: 3 };

  const filtered = useMemo(() => {
    let list = complaints.filter((c) => {
      const matchesQuery =
        !query ||
        [c.title, c.description, c.id, c.complainantName, c.location]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
      return matchesQuery && matchesStatus && matchesCategory;
    });
    list = [...list].sort((a, b) => {
      if (sort === 'recent')
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sort === 'oldest')
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return priorityRank[a.priority] - priorityRank[b.priority];
    });
    return list;
  }, [complaints, query, statusFilter, categoryFilter, sort]);

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, ID, name, or location..."
            className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | 'All')}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-sky-400 focus:outline-none"
            >
              <option value="All">All Status</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ComplaintCategory | 'All')}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-sky-400 focus:outline-none"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-sky-400 focus:outline-none"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">By Priority</option>
            </select>
          </div>
          <button
            onClick={onNew}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            + New
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{' '}
        {complaints.length} complaints
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <Inbox className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-lg font-semibold text-slate-700">No complaints found</p>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${statusDot[c.status]}`} />
                  <span className="text-xs font-semibold text-slate-400">{c.id}</span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[c.status]}`}
                >
                  {c.status}
                </span>
              </div>

              <h3 className="mt-3 line-clamp-2 text-base font-semibold text-slate-900 group-hover:text-sky-700">
                {c.title}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">{c.description}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className={`rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${roleStyles[c.role]}`}>
                  {c.role}
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {c.category}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${priorityStyles[c.priority]}`}
                >
                  {c.priority}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 truncate">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{c.location}</span>
                </span>
                <div className="flex items-center gap-3">
                  {c.attachments ? (
                    <span className="flex items-center gap-1">
                      <Paperclip className="h-3.5 w-3.5" />
                      {c.attachments}
                    </span>
                  ) : null}
                  <span>{timeAgo(c.updatedAt)}</span>
                  <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-sky-500" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
