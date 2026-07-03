'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, saveSession } from '@/lib/api';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, Sparkles, BarChart3 } from 'lucide-react';

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
      {/* Panel de marca */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between px-16 py-14 text-white relative overflow-hidden" style={{ background: 'linear-gradient(168deg, #0F1F3D 0%, #152238 42%, #1A2D4A 100%)' }}>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'var(--kova-blue-mid)' }} />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'var(--kova-green)' }} />

        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center font-heading font-bold text-lg shadow-lg" style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}>K</div>
          <span className="font-heading font-bold text-lg">Kova Talent OS</span>
        </div>

        <div className="relative">
          <h1 className="font-heading text-4xl font-bold leading-tight mb-4">
            Reclutamiento comercial<br />con evidencia e IA.
          </h1>
          <p className="text-white/60 text-base max-w-md leading-relaxed">
            Metodología, evaluación con evidencia y onboarding integrado en una sola plataforma.
          </p>

          <div className="mt-10 space-y-4 max-w-sm">
            <Feature icon={<Sparkles className="w-4 h-4" />} title="Compatibilidad automática" text="Cada candidato evaluado al instante." />
            <Feature icon={<BarChart3 className="w-4 h-4" />} title="Pipeline y journey del cliente" text="Visibilidad total del proceso." />
            <Feature icon={<ShieldCheck className="w-4 h-4" />} title="Datos seguros" text="Información protegida por proceso." />
          </div>
        </div>

        <p className="relative text-xs text-white/40">© {new Date().getFullYear()} KOVA · Todos los derechos reservados</p>
      </div>

      {/* Formulario */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: 'var(--kova-surface)' }}>
        <form onSubmit={submit} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 kova-animate-in">
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-heading font-bold" style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}>K</div>
            <span className="font-heading font-bold" style={{ color: 'var(--kova-navy)' }}>Kova Talent OS</span>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold mb-1" style={{ color: 'var(--kova-navy)' }}>Bienvenido de nuevo</h2>
            <p className="text-sm text-slate-500">Ingresa a tu panel de reclutamiento</p>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--kova-navy)' }}>Correo</label>
              <div className="flex items-center gap-2 px-3.5 rounded-xl border bg-white focus-within:ring-2 focus-within:ring-[var(--kova-ring)] focus-within:border-[var(--kova-blue)] transition-all" style={{ borderColor: 'var(--kova-border)' }}>
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full py-3 text-sm outline-none bg-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--kova-navy)' }}>Contraseña</label>
              <div className="flex items-center gap-2 px-3.5 rounded-xl border bg-white focus-within:ring-2 focus-within:ring-[var(--kova-ring)] focus-within:border-[var(--kova-blue)] transition-all" style={{ borderColor: 'var(--kova-border)' }}>
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full py-3 text-sm outline-none bg-transparent" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded accent-[var(--kova-blue)]" />
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
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/10 text-white/90">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-white/90">{title}</p>
        <p className="text-xs text-white/50">{text}</p>
      </div>
    </div>
  );
}
