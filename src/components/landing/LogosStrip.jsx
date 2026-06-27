const empresas = [
  { name: 'FinTech Pro', sector: 'Sector financiero' },
  { name: 'NovaTech', sector: 'Tecnología B2B' },
  { name: 'Retail Plus', sector: 'Retail' },
  { name: 'ConsultaCo', sector: 'Servicios' },
  { name: 'InduMax', sector: 'Manufactura' },
];

export default function LogosStrip() {
  return (
    <section className="py-10 px-6 lg:px-8 border-y border-slate-200/80" style={{ background: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] mb-8" style={{ color: '#9CA3AF' }}>
          Empresas que ya confían en nuestro proceso
        </p>
        <div className="flex flex-wrap justify-center items-center gap-3 lg:gap-4">
          {empresas.map(({ name, sector }) => (
            <div
              key={name}
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl transition-all hover:scale-[1.02]"
              style={{ background: '#FAFBFF', border: '1px solid #E5E7EB' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-heading font-black text-[11px] text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}
              >
                {name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold leading-none" style={{ color: '#0F0A2A' }}>{name}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>{sector}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
