import { Link } from 'react-router-dom';
import SiteLayout from '@/components/landing/SiteLayout';

export default function PageNotFound() {
  return (
    <SiteLayout>
      <main className="kv-section kv-section--paper-2" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <div className="kv-wrap kv-narrow-center" style={{ textAlign: 'center' }}>
          <p className="kv-founder-num font-display" style={{ fontSize: '4rem' }}>
            404
          </p>
          <h1 className="kv-h2 font-display" style={{ marginTop: '1rem' }}>
            Página no encontrada
          </h1>
          <p className="kv-section-lead" style={{ margin: '1rem auto 2rem' }}>
            La página que busca no existe o fue movida.
          </p>
          <Link to="/" className="kv-btn-solid">
            Volver al inicio →
          </Link>
        </div>
      </main>
    </SiteLayout>
  );
}
