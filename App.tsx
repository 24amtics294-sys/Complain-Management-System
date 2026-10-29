
import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  FilePlus,
  ListChecks,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

import type {
  Complaint,
  ComplaintInput,
  ComplaintStatus,
  ComplaintPriority,
  ActivityLog,
} from './types';

import { getComplaints, saveComplaint } from './api/complaints';

import Dashboard from './components/Dashboard';
import ComplaintForm from './components/ComplaintForm';
import ComplaintList from './components/ComplaintList';
import ComplaintDetail from './components/ComplaintDetail';
import Login from './components/Login';

type View = 'dashboard' | 'new' | 'list';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const [activity, setActivity] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('cms_activity');
      return saved ? (JSON.parse(saved) as ActivityLog[]) : [];
    } catch {
      return [];
    }
  });

  const [view, setView] = useState<View>('dashboard');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const loadComplaints = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getComplaints();
      setComplaints(data);
      setApiError('');
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : 'Could not load complaints from the database.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      void loadComplaints();
    }
  }, [isLoggedIn, loadComplaints]);

  useEffect(() => {
    localStorage.setItem('cms_activity', JSON.stringify(activity));
  }, [activity]);

  const selected = selectedId
    ? complaints.find((c) => c.id === selectedId) ?? null
    : null;

  const selectedActivity = selectedId
    ? activity
        .filter((a) => a.complaintId === selectedId)
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() -
            new Date(b.timestamp).getTime()
        )
    : [];

  const addComplaint = useCallback(
    async (input: ComplaintInput): Promise<void> => {
      setApiError('');

      try {
        const result = await saveComplaint(input);
        const now = new Date().toISOString();
        const id = String(result.id);

        const newComplaint: Complaint = {
          ...input,
          id,
          status: 'Pending',
          createdAt: now,
          updatedAt: now,
          attachments: 0,
        };

        setComplaints((prev) => [newComplaint, ...prev]);

        setActivity((prev) => [
          ...prev,
          {
            id: `A${prev.length + 1}-${id}`,
            complaintId: id,
            action: 'Created',
            detail: `Complaint registered by ${input.complainantName} (${input.role})`,
            timestamp: now,
          },
        ]);

        setView('list');
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Complaint could not be saved.';

        setApiError(message);
        throw error;
      }
    },
    []
  );

  // Status and priority updates currently change the UI only.
  const updateComplaint = useCallback(
    (id: string, patch: Partial<Complaint>) => {
      const now = new Date().toISOString();

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, ...patch, updatedAt: now } : c
        )
      );

      setActivity((prev) => {
        const entries: ActivityLog[] = [];

        if (patch.status) {
          entries.push({
            id: `A${prev.length + 1}-${id}-s`,
            complaintId: id,
            action: 'Status Updated',
            detail: `Status changed to ${patch.status as ComplaintStatus}`,
            timestamp: now,
          });
        }

        if (patch.priority) {
          entries.push({
            id: `A${prev.length + entries.length + 1}-${id}-p`,
            complaintId: id,
            action: 'Priority Updated',
            detail: `Priority changed to ${patch.priority as ComplaintPriority}`,
            timestamp: now,
          });
        }

        return [...prev, ...entries];
      });
    },
    []
  );

  const deleteComplaint = useCallback((id: string) => {
    setComplaints((prev) => prev.filter((c) => c.id !== id));
    setActivity((prev) => prev.filter((a) => a.complaintId !== id));
    setSelectedId(null);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('dashboard');
    setSelectedId(null);
    setApiError('');
  };

  const navItems: {
    key: View;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      key: 'new',
      label: 'File Complaint',
      icon: <FilePlus className="h-4 w-4" />,
    },
    {
      key: 'list',
      label: 'All Complaints',
      icon: <ListChecks className="h-4 w-4" />,
    },
  ];

  // Show login before displaying the portal.
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <button
            onClick={() => setView('dashboard')}
            className="flex items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </span>

            <span className="text-left">
              <span className="block text-base font-bold leading-tight text-slate-900">
                UTU Complaint Portal
              </span>
              <span className="block text-xs leading-tight text-slate-500">
                Uka Tarsadia University
              </span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 sm:flex">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setView(item.key)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                    view === item.key
                      ? 'bg-sky-50 text-sky-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        <nav className="flex items-center gap-1 border-t border-slate-100 px-2 py-2 sm:hidden">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition ${
                view === item.key
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {apiError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            {apiError}
            <button
              onClick={() => void loadComplaints()}
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <p className="py-10 text-center text-sm text-slate-500">
            Loading complaints from database...
          </p>
        ) : (
          <>
            {view === 'dashboard' && (
              <Dashboard
                complaints={complaints}
                activity={activity}
                onSelect={(id) => setSelectedId(id)}
                onNew={() => setView('new')}
                onViewAll={() => setView('list')}
              />
            )}

            {view === 'new' && (
              <ComplaintForm
                onSubmit={addComplaint}
                onCancel={() => setView('dashboard')}
              />
            )}

            {view === 'list' && (
              <ComplaintList
                complaints={complaints}
                onSelect={(id) => setSelectedId(id)}
                onNew={() => setView('new')}
              />
            )}
          </>
        )}
      </main>

      {selected && (
        <div onClick={() => setSelectedId(null)}>
          <ComplaintDetail
            complaint={selected}
            activity={selectedActivity}
            onClose={() => setSelectedId(null)}
            onUpdate={updateComplaint}
            onDelete={deleteComplaint}
          />
        </div>
      )}

      <footer className="border-t border-slate-200 bg-white py-6">
        <p className="text-center text-xs text-slate-400">
          Uka Tarsadia University — Campus Complaint Management System · Mini-Project Demo
        </p>
      </footer>
    </div>
  );
}
