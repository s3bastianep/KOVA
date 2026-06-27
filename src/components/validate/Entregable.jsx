import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const competencies = [
  { name: 'Orientación al logro', rating: 'Alta', note: 'Persiste ante objeciones sin perder el foco en el cierre.' },
  { name: 'Negociación consultiva', rating: 'Alta', note: 'Explora necesidades antes de proponer soluciones.' },
  { name: 'Prospección estructurada', rating: 'Media-alta', note: 'Metodología clara para generar pipeline.' },
  { name: 'Gestión de presión', rating: 'Media', note: 'Mantiene desempeño en ciclos largos; requiere acompañamiento inicial.' },
];

const strengths = [
  'Comunicación clara con perfiles decisores',
  'Experiencia en venta consultiva B2B',
  'Capacidad de diagnosticar necesidades del cliente',
];

const observations = [
  'Funciona mejor en ciclos de venta medios (4 a 8 semanas)',
  'Requiere onboarding estructurado en el producto',
  'Perfil más efectivo con leads calificados que con volumen en frío',
];

export default function Entregable() {
  return (
    <section id="entregable" className="py-24 px-6 lg:px-8" style={{ background: '#FAFBFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-end mb-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#6366F1', letterSpacing: '0.15em' }}>Qué recibe el cliente</p>
            <h2 className="font-heading font-black leading-tight mb-4" style={{ fontSize: 'clamp(1.35rem, 1.8vw, 1.75rem)', color: '#0F0A2A', letterSpacing: '-0.02em' }}>
              Una recomendación que puedes defender ante tu equipo.
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.85 }}>
              No recibes un currículum más. Recibes un reporte con competencias evaluadas, fortalezas identificadas y observaciones para decidir con claridad. Está pensado para gerentes comerciales, líderes de talento humano y gerentes generales.
            </p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #E5E7EB', boxShadow: '0 24px 64px rgba(99,102,241,0.10), 0 8px 24px rgba(0,0,0,0.05)' }}>
          <div className="flex items-center justify-between px-5 py-3" style={{ background: '#F7F8FA', borderBottom: '1px solid #E8E8E3' }}>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FECACA' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FED7AA' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#BBF7D0' }} />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs" style={{ background: '#EEEEE8', color: '#AAAAAA' }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#6366F1' }} />
              kova.co · Reporte de evaluación
            </div>
            <div className="w-16" />
          </div>

          <div className="p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6" style={{ borderBottom: '1px solid #F3F4F6' }}>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: '#EEF2FF' }}>
                  <span className="text-[13px] font-bold" style={{ color: '#6366F1' }}>MC</span>
                </div>
                <div>
                  <p className="font-heading font-bold text-sm" style={{ color: '#0F0A2A' }}>Candidato evaluado</p>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>Vacante: Ejecutivo comercial B2B · Sector tecnología</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg" style={{ background: '#ECFDF5', color: '#059669' }}>Recomendado</span>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-wider mb-4" style={{ color: '#9CA3AF' }}>Evaluación por competencias</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {competencies.map((c) => (
                <div key={c.name} className="p-4 rounded-xl" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold" style={{ color: '#0F0A2A' }}>{c.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: '#EEF2FF', color: '#6366F1' }}>{c.rating}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: '#6B7280' }}>{c.note}</p>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl" style={{ background: '#ECFDF5', border: '1px solid rgba(16,185,129,0.15)' }}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#059669' }}>Fortalezas</p>
                <ul className="space-y-2">
                  {strengths.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-xs" style={{ color: '#374151' }}>
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#10B981' }} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: '#FFFBEB', border: '1px solid rgba(245,158,11,0.15)' }}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#D97706' }}>Observaciones</p>
                <ul className="space-y-2">
                  {observations.map((o) => (
                    <li key={o} className="text-xs leading-relaxed" style={{ color: '#374151' }}>· {o}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-5 rounded-xl" style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2 text-white/60">Recomendación</p>
              <p className="text-sm leading-relaxed text-white/95">
                Perfil recomendado para la vacante. Alta compatibilidad con el estilo consultivo requerido. Sugerimos incluir en la terna final y validar fit cultural con liderazgo comercial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
