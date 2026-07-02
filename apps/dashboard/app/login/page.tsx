'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, saveSession } from '@/lib/api';

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
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 text-white" style={{ background: 'linear-gradient(168deg, #0F1F3D 0%, #152238 42%, #1A2D4A 100%)' }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-lg mb-8" style={{ background: 'var(--kova-blue)' }}>K</div>
        <h1 className="font-heading text-4xl font-bold mb-4">Kova Talent OS</h1>
        <p className="text-white/70 text-lg max-w-md leading-relaxed">
          Plataforma especializada en reclutamiento de talento comercial. Metodología, evaluación con evidencia y onboarding integrado.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <form onSubmit={submit} className="w-full max-w-md space-y-6">
          <div>
            <h2 className="font-heading text-2xl font-bold mb-1" style={{ color: 'var(--kova-navy)' }}>Iniciar sesión</h2>
            <p className="text-sm text-slate-500">Acceda al dashboard privado de Kova</p>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</div>}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--kova-navy)' }}>Correo</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-200" style={{ borderColor: 'var(--kova-border)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--kova-navy)' }}>Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-200" style={{ borderColor: 'var(--kova-border)' }} />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Recordar sesión
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-semibold text-sm kova-btn-primary disabled:opacity-60">
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

          <p className="text-xs text-slate-400 text-center">
            Demo: consultor@kova.co / Kova2026!
          </p>
        </form>
      </div>
    </div>
  );
}
