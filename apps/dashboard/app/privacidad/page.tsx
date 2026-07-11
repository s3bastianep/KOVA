import { ArrowLeft } from 'lucide-react';
import '../login/login.css';

export const metadata = {
  title: 'Política de privacidad | Kova',
};

/**
 * Placeholder structure only — the copy below is generic and NOT reviewed legal text. Replace
 * every section with Kova's actual privacy policy before this page is shared with real users.
 * Linked from the registration form's data-consent checkbox.
 */
export default function PrivacidadPage() {
  return (
    <div className="kv-login">
      <div className="kv-login-bg" aria-hidden />

      <header className="kv-login-nav">
        <a href="/" className="kv-login-logo">
          <span className="kv-login-logo-mark" aria-hidden />
          Kova
        </a>
        <a href="/registro" className="kv-login-back">
          <ArrowLeft size={16} aria-hidden />
          Volver al registro
        </a>
      </header>

      <main style={{ maxWidth: '42rem', margin: '0 auto', padding: '2rem 1.5rem 4rem', color: '#fff' }}>
        <div
          role="alert"
          style={{
            padding: '0.85rem 1.1rem',
            marginBottom: '2rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(250, 204, 21, 0.35)',
            background: 'rgba(250, 204, 21, 0.08)',
            color: '#facc15',
            fontSize: '0.8125rem',
            lineHeight: 1.5,
          }}
        >
          Contenido pendiente de revisión legal. Este texto es un borrador de estructura, no la
          política definitiva de Kova.
        </div>

        <h1 style={{ fontFamily: 'var(--font-sora, Sora, sans-serif)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          Política de privacidad
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
          Última actualización: pendiente.
        </p>

        <section style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Qué datos recopilamos</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
            Datos de contacto (nombre, correo, teléfono), tu hoja de vida y la información
            comercial que nos compartes durante el proceso de perfilamiento (experiencia,
            preferencias, estilo de venta).
          </p>
        </section>

        <section style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Para qué los usamos</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
            Para construir tu perfil comercial y conectarte con empresas cuyas vacantes sean
            compatibles con tu forma de vender. No vendemos tus datos a terceros.
          </p>
        </section>

        <section style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Con quién los compartimos</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
            Con las empresas que abren vacantes en la plataforma, únicamente cuando exista
            compatibilidad con tu perfil.
          </p>
        </section>

        <section style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Tus derechos</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
            Puedes solicitar acceso, corrección o eliminación de tus datos en cualquier momento
            escribiendo a [correo de contacto pendiente].
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Contacto</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
            [Pendiente: correo y datos legales de la empresa.]
          </p>
        </section>
      </main>
    </div>
  );
}
