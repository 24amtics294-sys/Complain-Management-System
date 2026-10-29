
import { useState } from 'react';
import {
  Send,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';

import type {
  FormEvent,
  ReactNode,
} from 'react';

import type {
  ComplaintInput,
  ComplaintCategory,
  ComplaintPriority,
  ComplainantRole,
} from '../types';

import { categories, priorities, roles } from '../data';

interface ComplaintFormProps {
  onSubmit: (data: ComplaintInput) => Promise<void>;
  onCancel: () => void;
}

type Errors = Partial<Record<keyof ComplaintInput, string>>;

const empty: ComplaintInput = {
  title: '',
  description: '',
  category: 'Classroom & Facilities',
  priority: 'Medium',
  role: 'Student',
  complainantName: '',
  complainantEmail: '',
  location: '',
};

export default function ComplaintForm({
  onSubmit,
  onCancel,
}: ComplaintFormProps) {
  const [form, setForm] = useState<ComplaintInput>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function update<K extends keyof ComplaintInput>(
    key: K,
    value: ComplaintInput[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));

    if (errors[key]) {
      setErrors((current) => ({
        ...current,
        [key]: undefined,
      }));
    }

    setSubmitError('');
  }

  function validate(): boolean {
    const nextErrors: Errors = {};

    if (!form.title.trim()) {
      nextErrors.title = 'Title is required';
    } else if (form.title.trim().length < 8) {
      nextErrors.title = 'Title must be at least 8 characters';
    }

    if (!form.description.trim()) {
      nextErrors.description = 'Description is required';
    } else if (form.description.trim().length < 20) {
      nextErrors.description =
        'Please provide at least 20 characters of detail';
    }

    if (!form.complainantName.trim()) {
      nextErrors.complainantName = 'Your name is required';
    }

    if (!form.complainantEmail.trim()) {
      nextErrors.complainantEmail = 'Email is required';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.complainantEmail.trim())
    ) {
      nextErrors.complainantEmail = 'Enter a valid email address';
    }

    if (!form.location.trim()) {
      nextErrors.location = 'Location is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting || !validate()) {
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    setSubmitted(false);

    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        complainantName: form.complainantName.trim(),
        complainantEmail: form.complainantEmail.trim(),
        location: form.location.trim(),
      });

      setForm({ ...empty });
      setErrors({});
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Complaint submit nahi ho paayi. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      {submitted && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">
          <CheckCircle2 className="h-5 w-5 shrink-0" />

          <p className="text-sm font-medium">
            Your complaint has been submitted successfully. You can
            track its status from the dashboard.
          </p>

          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="ml-auto text-emerald-600 hover:text-emerald-800"
            aria-label="Dismiss success message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {submitError && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-800"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <p className="text-sm">{submitError}</p>

          <button
            type="button"
            onClick={() => setSubmitError('')}
            className="ml-auto"
            aria-label="Dismiss error message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-7 py-5">
          <h2 className="text-xl font-bold text-slate-900">
            File a New Complaint
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Provide clear details so your grievance can be routed
            and resolved quickly.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 px-7 py-6"
        >
          <Field label="Complaint Title" error={errors.title} required>
            <input
              type="text"
              value={form.title}
              onChange={(event) => update('title', event.target.value)}
              placeholder="e.g. Broken streetlight on Park Road"
              className={inputClass(!!errors.title)}
              disabled={submitting}
            />
          </Field>

          <Field
            label="Description"
            error={errors.description}
            required
            hint={`${form.description.length} characters`}
          >
            <textarea
              value={form.description}
              onChange={(event) =>
                update('description', event.target.value)
              }
              rows={5}
              placeholder="Describe the issue, when it started, and its impact..."
              className={inputClass(!!errors.description)}
              disabled={submitting}
            />
          </Field>

          <Field label="You are a" required>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  disabled={submitting}
                  onClick={() =>
                    update('role', role as ComplainantRole)
                  }
                  className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                    form.role === role
                      ? 'border-sky-500 bg-sky-50 text-sky-700 ring-1 ring-sky-500'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category" required>
              <select
                value={form.category}
                disabled={submitting}
                onChange={(event) =>
                  update(
                    'category',
                    event.target.value as ComplaintCategory
                  )
                }
                className={inputClass(false)}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Priority" required>
              <div className="grid grid-cols-4 gap-2">
                {priorities.map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    disabled={submitting}
                    onClick={() =>
                      update(
                        'priority',
                        priority as ComplaintPriority
                      )
                    }
                    className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                      form.priority === priority
                        ? 'border-sky-500 bg-sky-50 text-sky-700 ring-1 ring-sky-500'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <Field label="Location" error={errors.location} required>
            <input
              type="text"
              value={form.location}
              onChange={(event) =>
                update('location', event.target.value)
              }
              placeholder="e.g. Sector 5, near Central Park"
              className={inputClass(!!errors.location)}
              disabled={submitting}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Your Name"
              error={errors.complainantName}
              required
            >
              <input
                type="text"
                value={form.complainantName}
                onChange={(event) =>
                  update('complainantName', event.target.value)
                }
                placeholder="Full name"
                className={inputClass(!!errors.complainantName)}
                disabled={submitting}
              />
            </Field>

            <Field
              label="Email Address"
              error={errors.complainantEmail}
              required
            >
              <input
                type="email"
                value={form.complainantEmail}
                onChange={(event) =>
                  update('complainantEmail', event.target.value)
                }
                placeholder="you@email.com"
                className={inputClass(!!errors.complainantEmail)}
                disabled={submitting}
              />
            </Field>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  required,
  hint,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700">
          {label}
          {required && (
            <span className="ml-0.5 text-rose-500">*</span>
          )}
        </label>

        {hint && (
          <span className="text-xs text-slate-400">{hint}</span>
        )}
      </div>

      <div className="mt-1.5">{children}</div>

      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return `w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
      : 'border-slate-200 focus:border-sky-400 focus:ring-sky-200'
  }`;
}
