import { Link } from 'react-router-dom';
import { getRelatedGuides } from './guiaRoutes';

const SIDEBAR_LIMIT = 3;

export default function GuiaSidebar({ currentPath }) {
  const related = getRelatedGuides(currentPath, SIDEBAR_LIMIT);

  return (
    <aside className="hidden lg:block">
      <div className="kv-guia-toc-sticky">
        <p className="kv-guia-toc-title font-display">Artículos recientes</p>
        <div className="kv-guia-sidebar-list">
          {related.map(({ path, title, readTime }) => (
            <Link key={path} to={path} className="kv-guia-sidebar-item kv-guia-sidebar-item--compact">
              <span className="kv-guia-sidebar-meta font-mono">Lectura de {readTime}</span>
              <h3 className="font-display">{title}</h3>
            </Link>
          ))}

          <Link to="/contacto" className="kv-guia-sidebar-cta">
            <span className="font-mono">Consulta comercial</span>
            <p className="font-display">Hablemos de tu vacante comercial</p>
            <p>Un especialista de Litt Hunter revisa tu caso y te presenta una propuesta.</p>
          </Link>
        </div>
      </div>
    </aside>
  );
}