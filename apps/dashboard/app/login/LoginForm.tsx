'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2, Lock, Mail } from 'lucide-react';
import { authApi, saveSession } from '@/lib/api';
import './login.css';

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
    <div className="kv-login">
      <div className="kv-login-bg" aria-hidden />

      <header className="kv-login-nav">
        <a href="/" className="kv-login-logo">
          <span className="kv-login-logo-mark" aria-hidden />
          Kova
        </a>
        <a href="/" className="kv-login-back">
          <ArrowLeft size={16} aria-hidden />
          Volver al inicio
        </a>
      </header>

      <div className="kv-login-stage">
        <aside className="kv-login-aside">
          <p className="kv-login-eyebrow">Talent intelligence · Kova</p>
          <h1 className="kv-login-title">El panel detrás del match comercial</h1>
          <p className="kv-login-lead">
            Vacantes, candidatos, evaluaciones y agenda en un solo lugar. Para equipos que contratan
            con criterio y evidencia, no solo intuición.
          </p>
        </aside>

        <form onSubmit={submit} className="kv-login-card">
          <a href="/" className="kv-login-back kv-login-mobile-back">
            <ArrowLeft size={16} aria-hidden />
            Volver al inicio
          </a>

          <div className="kv-login-card-head">
            <h2 className="kv-login-card-title">Iniciar sesión</h2>
            <p className="kv-login-card-sub">Acceso para el equipo Kova y cuentas habilitadas.</p>
          </div>

          {error ? (
            <div role="alert" className="kv-login-error">
              {error}
            </div>
          ) : null}

          <div className="kv-login-field">
            <label htmlFor="login-email" className="kv-login-label">
              Correo
            </label>
            <div className="kv-login-input-wrap">
              <Mail className="w-4 h-4" aria-hidden />
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="kv-login-input"
              />
            </div>
          </div>

          <div className="kv-login-field">
            <label htmlFor="login-password" className="kv-login-label">
              Contraseña
            </label>
            <div className="kv-login-input-wrap">
              <Lock className="w-4 h-4" aria-hidden />
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="kv-login-input"
              />
            </div>
          </div>

          <label htmlFor="login-remember" className="kv-login-remember">
            <input
              id="login-remember"
              name="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Recordar sesión en este dispositivo
          </label>

          <button type="submit" disabled={loading} className="kv-login-submit">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                Ingresando...
              </>
            ) : (
              <>
                Entrar al panel
                <ArrowRight className="w-4 h-4" aria-hidden />
              </>
            )}
          </button>

          <p className="kv-login-footer">
            ¿Buscas oportunidades comerciales?{' '}
            <a href="/registro">Crea tu perfil de candidato</a>
          </p>
        </form>
      </div>
    </div>
  );
}
