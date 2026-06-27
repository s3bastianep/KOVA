import { TOC_ITEMS } from './guiaContent';

export default function GuiaTableOfContents({ activeId }) {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-28">
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          En esta publicación
        </p>
        <nav className="space-y-1">
          {TOC_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="block text-sm leading-snug py-2 pl-3 border-l-2 transition-colors"
              style={{
                color: activeId === id ? '#4338CA' : '#64748B',
                borderColor: activeId === id ? '#4338CA' : 'transparent',
                fontWeight: activeId === id ? 600 : 400,
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="mt-10 pt-6 border-t" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>
            Compartir
          </p>
          <div className="flex gap-3">
            {['LinkedIn', 'Correo'].map((label) => (
              <span
                key={label}
                className="text-xs font-medium px-3 py-1.5 rounded-md cursor-default"
                style={{ background: '#F1F5F9', color: '#64748B' }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
