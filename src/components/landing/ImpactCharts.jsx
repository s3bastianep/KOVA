import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const tiempoContratacion = [
  { label: 'Sem 1', sin: 0, con: 0 },
  { label: 'Sem 2', sin: 8, con: 45 },
  { label: 'Sem 3', sin: 18, con: 85 },
  { label: 'Sem 4', sin: 28, con: 100 },
  { label: 'Sem 6', sin: 52, con: 100 },
  { label: 'Sem 8', sin: 70, con: 100 },
  { label: 'Sem 12', sin: 100, con: 100 },
];

const retencion = [
  { mes: 'Mes 1', kova: 100, mercado: 100 },
  { mes: 'Mes 3', kova: 99, mercado: 88 },
  { mes: 'Mes 6', kova: 97, mercado: 74 },
  { mes: 'Mes 9', kova: 96, mercado: 65 },
  { mes: 'Año 1', kova: 94, mercado: 54 },
];

const desempeno = [
  { semana: 'S1', kova: 20, tradicional: 5 },
  { semana: 'S2', kova: 45, tradicional: 10 },
  { semana: 'S3', kova: 68, tradicional: 18 },
  { semana: 'S4', kova: 85, tradicional: 28 },
  { semana: 'S6', kova: 95, tradicional: 45 },
  { semana: 'S8', kova: 100, tradicional: 62 },
  { semana: 'S12', kova: 100, tradicional: 80 },
];

const CustomTooltip = ({ active, payload, label, nameMap }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3.5 py-2.5 text-xs" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
      <p className="font-semibold mb-1" style={{ color: '#111827' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{nameMap?.[p.name] || p.name}: <strong>{p.value}%</strong></p>
      ))}
    </div>
  );
};

const charts = [
  { id: 'velocidad', label: '01', title: 'Velocidad de productividad', subtitle: 'Semanas hasta rendimiento completo', insight: 'Con Kova, un asesor nuevo alcanza el 100% en 4 semanas. Sin proceso estructurado, tarda hasta 12.', stat: '3×', statLabel: 'más rápido', accent: '#4F46E5' },
  { id: 'retencion', label: '02', title: 'Retención del equipo', subtitle: '% de permanencia al primer año', insight: 'El mercado promedio pierde casi la mitad de su fuerza comercial. Kova mantiene el 94%.', stat: '94%', statLabel: 'retención año 1', accent: '#16A34A' },
  { id: 'desempeno', label: '03', title: 'Curva de aprendizaje', subtitle: '% de dominio del proceso de ventas', insight: 'A la semana 4, el equipo Kova ya domina el 85% del proceso. Sin estructura, llegan al 28%.', stat: '−8 sem', statLabel: 'ahorradas', accent: '#EA580C' },
];

export default function ImpactCharts() {
  const [active, setActive] = useState('velocidad');
  const selected = charts.find(c => c.id === active);

  const renderChart = (id, accent) => {
    const gradId = `grad_${id}`;
    if (id === 'velocidad') return (
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={tiempoContratacion} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accent} stopOpacity={0.18} />
              <stop offset="95%" stopColor={accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<CustomTooltip nameMap={{ sin: 'Sin proceso', con: 'Con Kova' }} />} />
          <Area type="monotone" dataKey="sin" stroke="#D1D5DB" strokeWidth={1.5} fill="none" strokeDasharray="4 3" dot={false} />
          <Area type="monotone" dataKey="con" stroke={accent} strokeWidth={2} fill={`url(#${gradId})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    );
    if (id === 'retencion') return (
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={retencion} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accent} stopOpacity={0.18} />
              <stop offset="95%" stopColor={accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
          <YAxis domain={[40, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<CustomTooltip nameMap={{ mercado: 'Mercado', kova: 'Kova' }} />} />
          <Area type="monotone" dataKey="mercado" stroke="#D1D5DB" strokeWidth={1.5} fill="none" strokeDasharray="4 3" dot={false} />
          <Area type="monotone" dataKey="kova" stroke={accent} strokeWidth={2} fill={`url(#${gradId})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    );
    return (
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={desempeno} margin={{ top: 10, right: 10, left: -24, bottom: 0 }} barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="semana" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<CustomTooltip nameMap={{ tradicional: 'Sin proceso', kova: 'Kova' }} />} />
          <Bar dataKey="tradicional" fill="#E5E7EB" radius={[3, 3, 0, 0]} />
          <Bar dataKey="kova" fill={accent} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <section className="py-24 px-6 lg:px-8" style={{ background: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#4F46E5', letterSpacing: '0.15em' }}>Impacto medible</p>
          <h2 className="font-heading font-black leading-tight" style={{ fontSize: 'clamp(1.75rem, 2.8vw, 2.5rem)', color: '#1a1a2e', letterSpacing: '-0.02em' }}>
            Los números no mienten.
          </h2>
          <p className="text-sm mt-3 max-w-lg mx-auto" style={{ color: '#6B7280', lineHeight: 1.8 }}>
            La diferencia entre contratar con proceso y sin él, en velocidad, retención y desempeño.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {charts.map(({ id, label, title, accent }) => (
            <button key={id} onClick={() => setActive(id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={active === id
                ? { background: accent, color: '#FFFFFF', boxShadow: `0 4px 14px ${accent}35` }
                : { background: '#F8F9FC', color: '#6B7280', border: '1px solid #E5E7EB' }
              }>
              <span className="text-xs opacity-50">{label}</span> {title}
            </button>
          ))}
        </div>

        {selected && (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
            <div className="grid lg:grid-cols-[1fr_240px]">
              <div className="p-8 lg:p-10">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-heading font-bold text-lg" style={{ color: '#111827', letterSpacing: '-0.01em' }}>{selected.title}</h3>
                    <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{selected.subtitle}</p>
                  </div>
                  <div className="hidden sm:flex flex-col gap-1.5 text-xs mt-0.5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 rounded" style={{ background: selected.accent }} />
                      <span style={{ color: '#374151' }}>Con Kova</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 border-t border-dashed" style={{ borderColor: '#D1D5DB' }} />
                      <span style={{ color: '#9CA3AF' }}>Sin proceso</span>
                    </div>
                  </div>
                </div>
                <div className="mt-5">{renderChart(selected.id, selected.accent)}</div>
              </div>

              <div className="p-8 lg:py-10 lg:pr-10 lg:pl-0 flex flex-col justify-center" style={{ borderLeft: '1px solid #F3F4F6' }}>
                <div className="mb-6 p-5 rounded-xl" style={{ background: `${selected.accent}10`, border: `1px solid ${selected.accent}20` }}>
                  <p className="font-heading font-black text-3xl leading-none" style={{ color: selected.accent, letterSpacing: '-0.04em' }}>{selected.stat}</p>
                  <p className="text-xs font-semibold mt-1" style={{ color: '#374151' }}>{selected.statLabel}</p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.8 }}>{selected.insight}</p>
                <button
                  onClick={() => document.getElementById('acceso')?.scrollIntoView({ behavior: 'smooth' })}
                  className="mt-6 text-xs font-semibold px-4 py-2.5 rounded-lg transition-all text-white self-start"
                  style={{ background: selected.accent }}>
                  Quiero estos resultados →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}