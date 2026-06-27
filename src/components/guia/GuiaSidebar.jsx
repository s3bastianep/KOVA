import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getRelatedGuides } from './guiaRoutes';

export default function GuiaSidebar({ currentPath }) {
  const related = getRelatedGuides(currentPath);

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28">
        <p className="text-sm font-semibold mb-5" style={{ color: '#0F172A' }}>
          Más recursos de Kova
        </p>
        <div className="space-y-5">
          {related.map(({ path, title, excerpt, image, readTime }) => (
            <Link key={path} to={path} className="group block">
              <div className="rounded-xl overflow-hidden mb-3 aspect-[16/10]" style={{ border: '1px solid #E2E8F0' }}>
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <p className="text-[10px] font-medium mb-1" style={{ color: '#94A3B8' }}>
                Lectura de {readTime}
              </p>
              <h3
                className="text-sm font-semibold leading-snug mb-1.5 group-hover:underline"
                style={{ color: '#0F172A' }}
              >
                {title}
              </h3>
              <p className="text-xs leading-relaxed mb-2" style={{ color: '#64748B', lineHeight: 1.65 }}>
                {excerpt}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#4338CA' }}>
                Leer más
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}

          <Link
            to="/#acceso"
            className="block rounded-xl p-4 mt-6 transition-colors hover:bg-indigo-50"
            style={{ background: '#F8FAFF', border: '1px solid #E0E7FF' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#6366F1' }}>
              Diagnóstico gratuito
            </p>
            <p className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>
              Hablemos de tu vacante comercial
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>
              Un especialista humano te contacta en 48 h. Sin IA, sin compromiso.
            </p>
          </Link>
        </div>
      </div>
    </aside>
  );
}
