import React, { useState } from 'react';
import { Users, ClipboardList, BookOpen, LayoutGrid, ArrowRight, CheckCircle } from 'lucide-react';

const servicios = [
  {
    id: 'reclutamiento', icon: Users, num: '01', label: 'Reclutamiento', color: '#EFF6FF', accent: '#2563EB',
    title: 'Buscamos, evaluamos y presentamos a los mejores perfiles comerciales.',
    desc: 'Hacemos todo el proceso: definimos el perfil ideal, buscamos activamente (no esperamos CVs), entrevistamos con metodología por competencias y presentamos una terna validada. Tú solo decides.',
    items: ['Definición del perfil comercial ideal', 'Búsqueda activa, no solo publicaciones', 'Entrevistas por competencias comerciales', 'Assessment de orientación al logro', 'Informe ejecutivo por candidato', 'Garantía de reemplazo'],
    highlight: 'Entregamos terna en 2 a 3 semanas.',
  },
  {
    id: 'evaluacion', icon: ClipboardList, num: '02', label: 'Evaluación Psicotécnica', color: '#FFF7ED', accent: '#F97316',
    title: 'Medimos objetivamente el perfil comercial antes de contratar.',
    desc: 'Aplicamos una batería de pruebas diseñada específicamente para perfiles de ventas. Medimos orientación al logro, tolerancia a la presión, capacidad de negociación y comunicación persuasiva, con datos, no con intuición.',
    items: ['Prueba de orientación al logro', 'Evaluación de tolerancia a presión y resiliencia', 'Assessment de negociación y persuasión', 'Perfil de liderazgo comercial', 'Reporte ejecutivo con scores por competencia', 'Benchmarks vs. top performers del sector'],
    highlight: 'Reporte en 24 horas.',
  },
  {
    id: 'estandarizacion', icon: LayoutGrid, num: '03', label: 'Diseño del Proceso', color: '#F0FDF4', accent: '#10B981',
    title: 'Tu proceso de ventas, estandarizado y vivo en una plataforma interactiva.',
    desc: 'Mapeamos cómo vende tu empresa hoy, identificamos los cuellos de botella y construimos el proceso ideal: etapas, guiones, protocolos y KPIs. Todo queda en una plataforma interactiva donde cualquier asesor puede consultarlo en el momento que lo necesite, no en un PDF que nadie abre.',
    items: ['Mapeo del proceso de ventas actual', 'Diseño del embudo por etapas específicas de tu negocio', 'Guiones de atención, seguimiento y cierre personalizados', 'Protocolos de manejo de objeciones según tu producto', 'KPIs y métricas por rol comercial', 'Plataforma interactiva de consulta permanente para el equipo'],
    highlight: 'Plataforma activa en 3 a 4 semanas.',
  },
  {
    id: 'capacitacion', icon: BookOpen, num: '04', label: 'Capacitación e Inducción', color: '#F5F3FF', accent: '#7C3AED',
    title: 'Inducción gamificada, personalizada con el proceso real de tu empresa.',
    desc: 'No usamos contenido genérico. Construimos el programa de inducción con el proceso que diseñamos para tu empresa y lo entregamos en formato gamificado: niveles, retos, evaluaciones y certificaciones. El asesor aprende haciendo, no leyendo un manual. Y si tiene una duda en 3 meses, vuelve a la plataforma y la resuelve.',
    items: ['Programa diseñado 100% con tu proceso de ventas real', 'Módulos gamificados: niveles, puntos y certificaciones', 'Evaluaciones prácticas con casos de tu industria', 'Plataforma de acceso permanente para consultas del equipo', 'Actualizaciones del contenido cuando el proceso evoluciona', 'Dashboard de progreso individual por asesor'],
    highlight: 'Programa gamificado listo en 4 a 5 semanas.',
  },
];

export default function QueConstruimos() {
  const [active, setActive] = useState('reclutamiento');
  const selected = servicios.find(s => s.id === active);
  const SelectedIcon = selected?.icon;

  return (
    <section id="producto" className="py-28 px-8" style={{ background: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">

        <div className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: '#2563EB', letterSpacing: '0.15em' }}>Lo que hacemos</p>
          <div className="grid lg:grid-cols-2 gap-8 items-end">
            <h2 className="font-heading font-black leading-tight" style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2.1rem)', color: '#111827', letterSpacing: '-0.025em' }}>
              Cuatro servicios.<br />Un solo equipo lo hace todo.
            </h2>
            <p className="text-base leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.8 }}>
              No somos una plataforma. Somos la firma que recluta, evalúa, diseña y capacita para que tú tengas un área comercial que funcione desde el primer día.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {servicios.map(({ id, num, label, icon: Icon, accent }) => (
            <button key={id} onClick={() => setActive(id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={active === id
                ? { background: accent, color: '#FFFFFF', border: `1.5px solid ${accent}`, boxShadow: `0 4px 16px ${accent}40` }
                : { background: '#F9FAFB', color: '#6B7280', border: '1.5px solid #E5E7EB' }
              }>
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-xs font-bold opacity-50 mr-0.5">{num}</span>
              {label}
            </button>
          ))}
        </div>

        {selected && (
          <div className="rounded-3xl overflow-hidden" style={{ background: selected.color, border: `1.5px solid ${selected.accent}25`, boxShadow: `0 8px 40px ${selected.accent}15` }}>
            <div className="grid lg:grid-cols-[1fr_320px]">
              <div className="p-10 lg:p-14">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: selected.accent }}>
                    <SelectedIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: selected.accent }}>{selected.num} · {selected.label}</span>
                </div>
                <h3 className="font-heading font-bold text-lg mb-6 leading-snug" style={{ color: '#111827', letterSpacing: '-0.02em' }}>{selected.title}</h3>
                <p className="text-sm leading-relaxed mb-8" style={{ color: '#4B5563', lineHeight: 1.8 }}>{selected.desc}</p>
                <div className="flex items-center gap-3 p-4 rounded-xl mb-8" style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid ${selected.accent}30` }}>
                  <span className="text-sm font-semibold" style={{ color: selected.accent }}>{selected.highlight}</span>
                </div>
                <button onClick={() => document.getElementById('acceso')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group inline-flex items-center gap-2 text-sm font-bold px-6 py-3.5 rounded-2xl transition-all text-white"
                  style={{ background: selected.accent, boxShadow: `0 4px 20px ${selected.accent}40` }}>
                  Solicitar este servicio <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
              <div className="p-10 lg:py-14 lg:pr-14 lg:pl-0" style={{ borderLeft: `1px solid ${selected.accent}20` }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: selected.accent }}>Qué incluye</p>
                <div className="space-y-4">
                  {selected.items.map(item => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: selected.accent }} />
                      <span className="text-sm leading-relaxed" style={{ color: '#374151' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}