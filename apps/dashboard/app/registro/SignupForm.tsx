'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, Lock, Mail, MapPin, Phone, User } from 'lucide-react';
import { authApi, saveSession } from '@/lib/api';
import '../login/login.css';

export function SignupForm() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authApi.candidateRegister({
        nombre,
        email,
        telefono,
        ciudad,
        password,
        consentimientoDatos: consent,
      });
      saveSession(data);
      window.location.assign('/portal');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos crear tu cuenta');
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
          <p className="kv-login-eyebrow">Candidatos · Kova</p>
          <h1 className="kv-login-title">Tu espacio para oportunidades comerciales</h1>
          <p className="kv-login-lead">
            Crea tu cuenta en menos de un minuto. Después completas tu perfil por módulos, a tu
            ritmo, desde tu dashboard personal.
          </p>
        </aside>

        <form onSubmit={submit} className="kv-login-card">
          <a href="/" className="kv-login-back kv-login-mobile-back">
            <ArrowLeft size={16} aria-hidden />
            Volver al inicio
          </a>

          <div className="kv-login-card-head">
            <h2 className="kv-login-card-title">Crear cuenta</h2>
            <p className="kv-login-card-sub">Solo lo esencial para empezar.</p>
          </div>

          {error ? (
            <div role="alert" className="kv-login-error">
              {error}
            </div>
          ) : null}

          <div className="kv-login-field">
            <label htmlFor="signup-nombre" className="kv-login-label">
              Nombre completo
            </label>
            <div className="kv-login-input-wrap">
              <User className="w-4 h-4" aria-hidden />
              <input
                id="signup-nombre"
                type="text"
                autoComplete="name"
                placeholder="María López"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="kv-login-input"
              />
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

          <div className="grid sm:grid-cols-2 gap-4">
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
              <label htmlFor="signup-ciudad" className="kv-login-label">
                Ciudad
              </label>
              <div className="kv-login-input-wrap">
                <MapPin className="w-4 h-4" aria-hidden />
                <input
                  id="signup-ciudad"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="Bogotá"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  required
                  className="kv-login-input"
                />
              </div>
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
                type="password"
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="kv-login-input"
              />
            </div>
          </div>

          <label htmlFor="signup-consent" className="kv-login-remember">
            <input
              id="signup-consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            Acepto el tratamiento de mis datos personales según la política de privacidad de Kova
          </label>

          <button type="submit" disabled={loading} className="kv-login-submit">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                Creando cuenta...
              </>
            ) : (
              <>
                Crear cuenta y entrar
                <ArrowRight className="w-4 h-4" aria-hidden />
              </>
            )}
          </button>

          <p className="kv-login-footer">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </p>
        </form>
      </div>
    </div>
  );
}
