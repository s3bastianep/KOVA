import '@/styles/contacto-kova.css';
import { useEffect } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';

const SECCIONES = [
  {
    titulo: 'Qué datos recopilamos',
    texto:
      'Datos de contacto (nombre, correo, teléfono), tu hoja de vida y la información comercial que nos compartes durante el proceso de perfilamiento (experiencia, preferencias, estilo de venta).',
  },
  {
    titulo: 'Para qué los usamos',
    texto:
      'Para construir tu perfil comercial y conectarte con empresas cuyas vacantes sean compatibles con tu forma de vender. No vendemos tus datos a terceros.',
  },
  {
    titulo: 'Con quién los compartimos',
    texto:
      'Con las empresas que abren vacantes en la plataforma, únicamente cuando exista compatibilidad con tu perfil.',
  },
  {
    titulo: 'Tus derechos',
    texto:
      'Puedes solicitar acceso, corrección o eliminación de tus datos en cualquier momento escribiendo a hola@litthunter.com.',
  },
  {
    titulo: 'Contacto',
    texto: 'Para cualquier consulta sobre esta política, escríbenos a hola@litthunter.com.',
  },
];

export default function Privacidad() {
  usePageMeta({
    title: 'Política de privacidad',
    description: 'Cómo Litt Hunter recopila, usa y protege tus datos personales.',
    path: '/privacidad',
  });

  useEffect(() => {
    document.documentElement.classList.add('kova-home-chrome', 'kova-contacto-active');
    return () => document.documentElement.classList.remove('kova-home-chrome', 'kova-contacto-active');
  }, []);

  return (
    <div className="kova-contacto">
      <header className="kc-head kc-head--left">
        <div className="kc-wrap">
          <p className="kc-eyebrow">Legal</p>
          <h1>Política de privacidad</h1>
          <p className="kc-head__lead">Última actualización: julio de 2026.</p>
        </div>
      </header>

      <main className="kc-main">
        <div className="kc-wrap kc-legal">
          {SECCIONES.map(({ titulo, texto }) => (
            <section key={titulo} className="kc-legal__block">
              <h2>{titulo}</h2>
              <p>{texto}</p>
            </section>
          ))}
        </div>
      </main>

      <footer className="kc-footer">
        <div className="kc-wrap">
          <p>© {new Date().getFullYear()} Litt Hunter</p>
        </div>
      </footer>
    </div>
  );
}
