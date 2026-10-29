import { useEffect, useState } from 'react';
import {
  X,
  MapPin,
  User,
  Mail,
  Paperclip,
  Clock,
  Calendar,
  Tag,
  Save,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import type { Complaint, ComplaintStatus, ComplaintPriority, ActivityLog } from '../types';
import { statuses, priorities } from '../data';
import {
  statusStyles,
  statusDot,
  priorityStyles,
  roleStyles,
  formatDateTime,
  timeAgo,
} from '../helpers';

interface ComplaintDetailProps {
  complaint: Complaint;
  activity: ActivityLog[];
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Complaint>) => void;
  onDelete: (id: string) => void;
}

export default function ComplaintDetail({
  complaint,
  activity,
  onClose,
  onUpdate,
  onDelete,
}: ComplaintDetailProps) {
  const [status, setStatus] = useState<ComplaintStatus>(complaint.status);
  const [priority, setPriority] = useState<ComplaintPriority>(complaint.priority);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setStatus(complaint.status);
    setPriority(complaint.priority);
    setConfirmDelete(false);
  }, [complaint]);

  const dirty = status !== complaint.status || priority !== complaint.priority;

  function handleSave() {
    const patch: Partial<Complaint> = {};
    if (status !== complaint.status) patch.status = status;
    if (priority !== complaint.priority) patch.priority = priority;
    if (Object.keys(patch).length > 0) {
      onUpdate(complaint.id, patch);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
      <div
        className="my-8 w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between rounded-t-2xl border-b border-slate-100 bg-white px-6 py-5">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${statusDot[complaint.status]}`} />
              <span className="text-xs font-semibold text-slate-400">{complaint.id}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${statusStyles[complaint.status]}`}
              >
                {complaint.status}
              </span>
            </div>
            <h2 className="mt-2 text-xl font-bold leading-snug text-slate-900">
              {complaint.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          {/* Meta grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Meta icon={<Tag className="h-4 w-4" />} label="Category" value={complaint.category} />
            <Meta
              icon={<span className={`h-2.5 w-2.5 rounded-full ${statusDot[complaint.status]}`} />}
              label="Priority"
              value={
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${priorityStyles[complaint.priority]}`}
                >
                  {complaint.priority}
                </span>
              }
            />
            <Meta
              icon={<MapPin className="h-4 w-4" />}
              label="Location"
              value={complaint.location}
            />
            <Meta
              icon={<User className="h-4 w-4" />}
              label="Complainant"
              value={
                <span className="flex items-center gap-2">
                  {complaint.complainantName}
                  <span className={`rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${roleStyles[complaint.role]}`}>
                    {complaint.role}
                  </span>
                </span>
              }
            />
            <Meta
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={
                <a
                  href={`mailto:${complaint.complainantEmail}`}
                  className="text-sky-600 hover:underline"
                >
                  {complaint.complainantEmail}
                </a>
              }
            />
            <Meta
              icon={<Calendar className="h-4 w-4" />}
              label="Filed On"
              value={formatDateTime(complaint.createdAt)}
            />
            <Meta
              icon={<Clock className="h-4 w-4" />}
              label="Last Updated"
              value={`${formatDateTime(complaint.updatedAt)} (${timeAgo(complaint.updatedAt)})`}
            />
            <Meta
              icon={<Paperclip className="h-4 w-4" />}
              label="Attachments"
              value={`${complaint.attachments ?? 0} file(s)`}
            />
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Description
            </h3>
            <p className="mt-2 whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
              {complaint.description}
            </p>
          </div>

          {/* Manage */}
          <div className="mt-6 rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Manage Complaint
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-slate-600">Status</label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {statuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                        status === s
                          ? 'border-sky-500 bg-sky-50 text-sky-700 ring-1 ring-sky-500'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Priority</label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {priorities.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                        priority === p
                          ? 'border-sky-500 bg-sky-50 text-sky-700 ring-1 ring-sky-500'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {saved && (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <AlertCircle className="h-3.5 w-3.5" /> Changes saved.
              </p>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
              <button
                onClick={handleSave}
                disabled={!dirty}
                className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition ${
                  dirty
                    ? 'bg-sky-600 hover:bg-sky-500 active:scale-95'
                    : 'cursor-not-allowed bg-slate-300'
                }`}
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>

            {confirmDelete && (
              <div className="mt-4 flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
                <p className="text-sm font-medium text-rose-700">
                  Delete this complaint permanently?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-md px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onDelete(complaint.id)}
                    className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Activity log */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Activity Log
            </h3>
            <ol className="mt-4 space-y-0 border-l-2 border-slate-100 pl-5">
              {activity.length === 0 && (
                <li className="text-sm text-slate-400">No activity recorded yet.</li>
              )}
              {activity.map((a) => (
                <li key={a.id} className="relative pb-5">
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white bg-sky-500 ring-1 ring-sky-200" />
                  <p className="text-sm font-semibold text-slate-800">{a.action}</p>
                  <p className="text-sm text-slate-500">{a.detail}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{formatDateTime(a.timestamp)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-slate-50 px-3.5 py-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-slate-500 ring-1 ring-slate-200">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <div className="mt-0.5 text-sm font-medium text-slate-800">{value}</div>
      </div>
    </div>
  );
}
