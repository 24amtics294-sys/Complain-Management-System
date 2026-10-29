import { useState } from 'react';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    // Demo-only credentials. Replace with a PHP authentication API
    // before using this application with real accounts.
    if (
      email.trim().toLowerCase() === 'admin@utu.edu' &&
      password === 'Admin@123'
    ) {
      onLogin();
    } else {
      setError('Invalid email or password. Please try again.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-sky-800 p-10 text-white md:flex">
          <div className="absolute -right-20 -top-16 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-3">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <p className="text-lg font-bold">UTU Complaint Portal</p>
              <p className="text-sm text-blue-200">Uka Tarsadia University</p>
            </div>
          </div>

          <div className="relative py-12">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
              Your Voice Matters
            </p>
            <h1 className="text-4xl font-bold leading-tight">
              A better campus starts with being heard.
            </h1>
            <p className="mt-5 leading-7 text-slate-300">
              Submit complaints, track their progress, and help create a safer
              and better university environment for everyone.
            </p>
          </div>

          <p className="relative text-xs text-blue-200">
            Campus Complaint Management System · Mini Project
          </p>
        </section>

        <section className="flex items-center justify-center p-7 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-200">
              <ShieldCheck className="h-8 w-8" />
            </div>

            <p className="text-sm font-semibold uppercase tracking-wider text-sky-700">
              Welcome back
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Sign in to your account
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your details to access the complaint portal.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-12 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-sky-200 transition hover:from-sky-700 hover:to-indigo-700"
              >
                Sign In <ArrowRight className="h-5 w-5" />
              </button>
            </form>

            <div className="mt-6 rounded-xl border border-sky-100 bg-sky-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">
                Demo credentials
              </p>
              <p className="mt-2 text-sm text-slate-700">Email: admin@utu.edu</p>
              <p className="mt-1 text-sm text-slate-700">Password: Admin@123</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Demo only. This frontend check is not secure authentication.
              </p>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400">
              © Uka Tarsadia University · Complaint Portal
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}