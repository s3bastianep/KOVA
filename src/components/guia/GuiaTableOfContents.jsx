export default function GuiaTableOfContents({ items, activeId, className = 'hidden xl:block' }) {
  return (
    <aside className={className}>
      <div className="kv-guia-toc-sticky kv-guia-toc-panel">
        <p className="kv-guia-toc-title font-display">En esta publicación</p>
        <nav className="kv-guia-toc-nav">
          {items.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`kv-guia-toc-link${activeId === id ? ' kv-guia-toc-link--active' : ''}`}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
