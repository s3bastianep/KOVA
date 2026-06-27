import React from 'react';

const problemas = [
  { num: '01', title: 'Contratas a alguien y en 6 meses ya no está.', desc: 'No es coincidencia. Es que la entrevista no mide lo que importa en ventas. Con Kova, antes de presentarte a alguien ya sabemos si tolera la presión, si cierra y si va a quedarse.', color: '#6366F1', bg: '#EEF2FF' },
  { num: '02', title: 'Tus vendedores venden diferente — y ninguno vende bien.', desc: 'Cada asesor improvisa su propio método. El resultado depende de la persona, no del sistema. Kova diseña el proceso comercial de tu empresa y lo convierte en la forma en que todos venden.', color: '#0EA5E9', bg: '#F0F9FF' },
  { num: '03', title: 'El vendedor nuevo tarda 4 meses en producir algo.', desc: 'Le explican el producto en dos días y lo sueltan. Sin inducción estructurada, pierde tiempo y te cuesta dinero. Con Kova el asesor llega con un programa gamificado listo desde el día uno.', color: '#10B981', bg: '#ECFDF5' },
  { num: '04', title: 'Contratas por intuición — y casi siempre te equivocas.', desc: 'Los vendedores saben venderse en la entrevista. Kova aplica pruebas psicotécnicas diseñadas para perfiles comerciales y te entrega un informe con datos reales, no con corazonadas.', color: '#F59E0B', bg: '#FFFBEB' },
  { num: '05', title: 'Se va el mejor y se lleva todo lo que sabía.', desc: 'El proceso vivía en su cabeza. Sin documentación, la siguiente persona arranca de cero. Kova deja el proceso vivo en una plataforma interactiva — el conocimiento se queda en tu empresa.', color: '#EF4444', bg: '#FEF2F2' },
  { num: '06', title: 'Quieres crecer el equipo, pero escalar es un caos.', desc: 'Lo que funciona con 3 asesores se rompe con 10. Kova construye el sistema para que cualquier persona nueva lo aprenda rápido, lo replique y empiece a vender en semanas.', color: '#8B5CF6', bg: '#F5F3FF' },
];

export default function ElProblema() {
  return (
    <section id="problema" className="py-24 px-6 lg:px-8" style={{ background: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[380px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#6366F1', letterSpacing: '0.15em' }}>El diagnóstico</p>
            <h2 className="font-heading font-black leading-tight mb-5" style={{ fontSize: 'clamp(1.35rem, 1.8vw, 1.75rem)', color: '#0F0A2A', letterSpacing: '-0.02em' }}>
              Si tienes un área comercial, alguno de estos ya te costó dinero.
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#6B7280', lineHeight: 1.85 }}>
              Los vemos en todas las empresas que auditamos. Y todos tienen solución — si se atacan con el proceso correcto desde el inicio.
            </p>
            <div className="p-5 rounded-2xl" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
              <p className="text-sm leading-relaxed italic mb-3" style={{ color: '#374151' }}>
                "Llevábamos 3 años contratando mal y no lo sabíamos. Con Kova en 6 semanas teníamos un equipo que sabía vender y se quedaba."
              </p>
              <p className="text-xs font-bold" style={{ color: '#6366F1' }}>— Director Comercial, sector financiero · Bogotá</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {problemas.map((p) => (
              <div key={p.num} className="p-5 rounded-2xl" style={{ background: p.bg, border: `1px solid ${p.color}1A` }}>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-black mb-3" style={{ background: p.color, color: '#FFFFFF' }}>{p.num}</span>
                <h3 className="font-heading font-bold text-sm mb-2 leading-snug" style={{ color: '#0F0A2A' }}>{p.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.75 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}