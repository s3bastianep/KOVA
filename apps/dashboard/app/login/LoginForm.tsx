'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { authApi, saveSession } from '@/lib/api';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authApi.login(email, password, remember);
      saveSession(data);
      router.push('/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setError(msg && msg !== 'Unauthorized' ? msg : 'Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-10 kova-shell-bg">
      <div className="w-full max-w-[980px] grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-10 items-center kova-main-panel">
        <div className="hidden lg:block space-y-6 px-4">
          <div className="inline-flex items-center gap-2 kova-badge kova-badge-blue">
            <ShieldCheck className="w-3.5 h-3.5" />
            Plataforma de reclutamiento comercial
          </div>
          <h1 className="font-heading text-4xl font-bold leading-[1.1]" style={{ color: 'var(--kova-navy)' }}>
            Gestiona talento comercial con claridad y velocidad
          </h1>
          <p className="text-base text-slate-500 leading-relaxed max-w-md">
            Procesos, candidatos, evaluaciones y clientes en un solo lugar. Diseñado para equipos de hunting B2B.
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-md pt-2">
            {['Pipeline visual', 'Informes Kova', 'Agenda integrada', 'Base de talento'].map((item) => (
              <div key={item} className="kova-card px-4 py-3 text-sm font-medium text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="kova-card p-8 sm:p-9 space-y-6 kova-animate-in shadow-[var(--kova-shadow-lg)]">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-heading font-bold"
              style={{
                background: 'linear-gradient(135deg, var(--kova-blue), #6366F1)',
                boxShadow: '0 10px 24px -8px rgba(37, 99, 235, 0.55)',
              }}
            >
              K
            </div>
            <div>
              <p className="font-heading font-bold text-lg" style={{ color: 'var(--kova-navy)' }}>Kova Talent OS</p>
              <p className="text-xs text-slate-400">Acceso al panel</p>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold mb-1" style={{ color: 'var(--kova-navy)' }}>Bienvenido de nuevo</h2>
            <p className="text-sm text-slate-500">Ingresa a tu espacio de trabajo</p>
          </div>

          {error && (
            <div role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold mb-2" style={{ color: 'var(--kova-navy)' }}>
                Correo
              </label>
              <div className="kova-input-shell">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="kova-input py-1"
                />
              </div>
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold mb-2" style={{ color: 'var(--kova-navy)' }}>
                Contraseña
              </label>
              <div className="kova-input-shell">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="kova-input py-1"
                />
              </div>
            </div>
            <label htmlFor="login-remember" className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
              <input
                id="login-remember"
                name="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded accent-[var(--kova-blue)]"
              />
              Recordar sesión
            </label>
          </div>

          <button type="submit" disabled={loading} className="kova-btn-primary w-full py-3.5 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Ingresando...
              </>
            ) : (
              <>
                Iniciar sesión <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
