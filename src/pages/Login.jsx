import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { authApi, clearSession, saveSession } from '@/lib/authSession';
import { enterPortal, prefetchPortal } from '@/lib/enterPortal';
import { usePageMeta } from '@/hooks/usePageMeta';
import AuthMosaic from '@/components/auth/AuthMosaic';
import '@/styles/auth-login.css';

const COPY = {
  candidate: {
    eyebrow: 'Candidatos · Kova',
    title: (
      <>
        Tu espacio para <span className="kv-login-accent">oportunidades</span> comerciales
      </>
    ),
    lead: 'Ingresa a tu portal, revisa vacantes compatibles con tu perfil y da seguimiento a tus postulaciones.',
    cardSub: 'Acceso a tu portal de candidato.',
    submit: 'Entrar a mi portal',
    footer: (
      <>
        ¿No tienes cuenta? <Link to="/registro">Crea tu perfil gratis</Link>
      </>
    ),
  },
  staff: {
    eyebrow: 'Talent intelligence · Kova',
    title: (
      <>
        El panel detrás del <span className="kv-login-accent">match</span> comercial
      </>
    ),
    lead: 'Vacantes, candidatos, evaluaciones y agenda en un solo lugar. Para equipos que contratan con criterio y evidencia.',
    cardSub: 'Acceso para el equipo Kova.',
    submit: 'Entrar al panel',
    footer: null,
  },
};

export default function Login({ mode = 'candidate' }) {
  const copy = COPY[mode];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  usePageMeta({
    title: mode === 'staff' ? 'Acceso interno' : 'Iniciar sesión',
    description: 'Accede a tu cuenta Kova.',
    path: mode === 'staff' ? '/acceso' : '/login',
  });

  useEffect(() => {
    if (mode !== 'candidate') return;
    const run = () => prefetchPortal();
    const ric = window.requestIdleCallback?.bind(window);
    if (typeof ric === 'function') {
      const id = ric(run, { timeout: 2000 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(run, 800);
    return () => window.clearTimeout(t);
  }, [mode]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authApi.login(email, password, remember);

      if (mode === 'candidate' && data.user.role !== 'CANDIDATE') {
        clearSession();
        setError('Esta página es solo para candidatos. Si eres del equipo Kova, usa el acceso interno.');
        return;
      }

      if (mode === 'staff' && data.user.role === 'CANDIDATE') {
        clearSession();
        setError('Los candidatos deben iniciar sesión en la página pública de acceso.');
        return;
      }

      saveSession(data);
      if (mode === 'candidate') {
        enterPortal();
        return;
      }
      window.location.assign('/dashboard');
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
        <div className="kv-login-nav-inner">
          <Link to="/" className="kv-login-logo">
            kova<span className="kv-login-logo-dot">.</span>
          </Link>
          <Link to="/" className="kv-login-back">
            <ArrowLeft size={16} aria-hidden />
            Volver al inicio
          </Link>
        </div>
      </header>

      <div className="kv-login-stage">
        <aside className="kv-login-aside">
          <div className="kv-login-mosaic-wrap">
            <AuthMosaic />
          </div>
          <div className="kv-login-copy">
            <p className="kv-login-eyebrow">{copy.eyebrow}</p>
            <h1 className="kv-login-title">{copy.title}</h1>
            <p className="kv-login-lead">{copy.lead}</p>
          </div>
        </aside>

        <form onSubmit={submit} className="kv-login-card">
          <Link to="/" className="kv-login-back kv-login-mobile-back">
            <ArrowLeft size={16} aria-hidden />
            Volver al inicio
          </Link>

          <div className="kv-login-card-head">
            <h2 className="kv-login-card-title">Iniciar sesión</h2>
            <p className="kv-login-card-sub">{copy.cardSub}</p>
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
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="kv-login-input"
              />
              <button
                type="button"
                className="kv-login-toggle-visibility"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
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
                {copy.submit}
                <ArrowRight className="w-4 h-4" aria-hidden />
              </>
            )}
          </button>

          {copy.footer ? <p className="kv-login-footer">{copy.footer}</p> : null}
        </form>
      </div>
    </div>
  );
}
