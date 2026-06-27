import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { RELATED } from './guiaContent';

export default function GuiaSidebar() {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28">
        <p className="text-sm font-semibold mb-5" style={{ color: '#0F172A' }}>
          Recursos relacionados
        </p>
        <div className="space-y-5">
          {RELATED.map(({ title, excerpt, to, image }) => (
            <Link key={title} to={to} className="group block">
              <div className="rounded-xl overflow-hidden mb-3 aspect-[16/10]" style={{ border: '1px solid #E2E8F0' }}>
                <img src={image} alt="" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
              </div>
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
        </div>
      </div>
    </aside>
  );
}
