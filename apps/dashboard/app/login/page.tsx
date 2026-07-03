'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, saveSession } from '@/lib/api';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('consultor@kova.co');
  const [password, setPassword] = useState('Kova2026!');
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
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--kova-surface)' }}>
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 kova-animate-in">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-heading font-bold" style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}>K</div>
          <span className="font-heading font-bold" style={{ color: 'var(--kova-navy)' }}>Kova Talent OS</span>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold mb-1" style={{ color: 'var(--kova-navy)' }}>Bienvenido de nuevo</h2>
          <p className="text-sm text-slate-500">Ingresa a tu panel de reclutamiento</p>
        </div>

        {error && <div role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}

        <div className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--kova-navy)' }}>Correo</label>
            <div className="flex items-center gap-2 px-3.5 rounded-xl border bg-white focus-within:ring-2 focus-within:ring-[var(--kova-ring)] focus-within:border-[var(--kova-blue)] transition-all" style={{ borderColor: 'var(--kova-border)' }}>
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <input id="login-email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full py-3 text-sm outline-none bg-transparent" />
            </div>
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--kova-navy)' }}>Contraseña</label>
            <div className="flex items-center gap-2 px-3.5 rounded-xl border bg-white focus-within:ring-2 focus-within:ring-[var(--kova-ring)] focus-within:border-[var(--kova-blue)] transition-all" style={{ borderColor: 'var(--kova-border)' }}>
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <input id="login-password" name="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full py-3 text-sm outline-none bg-transparent" />
            </div>
          </div>
          <label htmlFor="login-remember" className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
            <input id="login-remember" name="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded accent-[var(--kova-blue)]" />
            Recordar sesión
          </label>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-sm text-white inline-flex items-center justify-center gap-2 disabled:opacity-60 transition-all" style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Ingresando...</> : <>Iniciar sesión <ArrowRight className="w-4 h-4" /></>}
        </button>

        <div className="text-xs text-slate-400 text-center bg-slate-50 rounded-lg py-2 px-3">
          Demo: <span className="font-medium text-slate-500">consultor@kova.co</span> / <span className="font-medium text-slate-500">Kova2026!</span>
        </div>
      </form>
    </div>
  );
}
