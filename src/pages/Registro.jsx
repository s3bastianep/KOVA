import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Loader2, Lock, Mail, Phone, User } from 'lucide-react';
import { authApi, saveSession } from '@/lib/authSession';
import { enterPortal, prefetchPortal } from '@/lib/enterPortal';
import { usePageMeta } from '@/hooks/usePageMeta';
import AuthMosaic from '@/components/auth/AuthMosaic';
import '@/styles/auth-login.css';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [entering, setEntering] = useState(false);

  usePageMeta({
    title: 'Registro de candidatos',
    description: 'Crea tu perfil comercial en Kova.',
    path: '/registro',
  });

  // Warm Next /portal while the user fills the form (cuts cold-compile wait).
  useEffect(() => {
    const run = () => prefetchPortal();
    const ric = window.requestIdleCallback?.bind(window);
    if (typeof ric === 'function') {
      const id = ric(run, { timeout: 2000 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(run, 800);
    return () => window.clearTimeout(t);
  }, []);

  const goPortal = () => {
    setEntering(true);
    enterPortal();
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authApi.candidateRegister({
        nombre: `${nombre.trim()} ${apellido.trim()}`.trim(),
        email,
        telefono,
        ciudad: '',
        password,
        consentimientoDatos: consent,
      });
      saveSession(data);
      prefetchPortal();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos crear tu cuenta');
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
            <p className="kv-login-eyebrow">Candidatos · Kova</p>
            <h1 className="kv-login-title">
              Encuentra la oportunidad <span className="kv-login-accent">hecha para ti</span>.
            </h1>
            <p className="kv-login-lead">
              Crea tu cuenta en 30 segundos. Después subes tu hoja de vida y nosotros completamos tu
              perfil por ti.
            </p>
          </div>
        </aside>

        {success ? (
          <div className="kv-login-card kv-login-success" role="status" aria-live="polite">
            <span className="kv-login-success-check">
              <Check className="w-7 h-7" strokeWidth={3} aria-hidden />
            </span>
            <h2 className="kv-login-card-title">¡Cuenta creada!</h2>
            <p className="kv-login-card-sub">
              {entering ? 'Entrando a tu perfil…' : 'Ya puedes entrar a construir tu perfil.'}
            </p>
            <button
              type="button"
              className="kv-login-submit kv-login-success-cta"
              onClick={goPortal}
              disabled={entering}
            >
              {entering ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                  Cargando portal…
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </>
              )}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="kv-login-card">
            <Link to="/" className="kv-login-back kv-login-mobile-back">
              <ArrowLeft size={16} aria-hidden />
              Volver al inicio
            </Link>

            <div className="kv-login-card-head">
              <h2 className="kv-login-card-title">Crear cuenta</h2>
              <p className="kv-login-card-sub">Solo lo esencial para empezar.</p>
            </div>

            {error ? (
              <div role="alert" className="kv-login-error">
                {error}
              </div>
            ) : null}

            <div className="kv-login-field-row">
              <div className="kv-login-field">
                <label htmlFor="signup-nombre" className="kv-login-label">
                  Nombre
                </label>
                <div className="kv-login-input-wrap">
                  <User className="w-4 h-4" aria-hidden />
                  <input
                    id="signup-nombre"
                    type="text"
                    autoComplete="given-name"
                    placeholder="María"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="kv-login-input"
                  />
                </div>
              </div>

              <div className="kv-login-field">
                <label htmlFor="signup-apellido" className="kv-login-label">
                  Apellido
                </label>
                <div className="kv-login-input-wrap">
                  <User className="w-4 h-4" aria-hidden />
                  <input
                    id="signup-apellido"
                    type="text"
                    autoComplete="family-name"
                    placeholder="López"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    required
                    className="kv-login-input"
                  />
                </div>
              </div>
            </div>

            <div className="kv-login-field">
              <label htmlFor="signup-email" className="kv-login-label">
                Correo
              </label>
              <div className="kv-login-input-wrap">
                <Mail className="w-4 h-4" aria-hidden />
                <input
                  id="signup-email"
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
              <label htmlFor="signup-telefono" className="kv-login-label">
                Teléfono
              </label>
              <div className="kv-login-input-wrap">
                <Phone className="w-4 h-4" aria-hidden />
                <input
                  id="signup-telefono"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+57 300 000 0000"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                  className="kv-login-input"
                />
              </div>
            </div>

            <div className="kv-login-field">
              <label htmlFor="signup-password" className="kv-login-label">
                Contraseña
              </label>
              <div className="kv-login-input-wrap">
                <Lock className="w-4 h-4" aria-hidden />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
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
              <p className="kv-login-hint">Mínimo 8 caracteres</p>
            </div>

            <label htmlFor="signup-consent" className="kv-login-remember">
              <input
                id="signup-consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
              />
              Acepto el tratamiento de mis datos personales según la{' '}
              <a
                href="/privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="kv-login-inline-link"
              >
                política de privacidad de Kova
              </a>
            </label>

            <button type="submit" disabled={loading} className="kv-login-submit">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </>
              )}
            </button>

            <p className="kv-login-footer">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
