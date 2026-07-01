import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { Users, Zap, Award } from 'lucide-react';

// --- DATA ---
const contratacionData = [
  { semana: 'S1', kova: 18, tradicional: 3 },
  { semana: 'S2', kova: 45, tradicional: 8 },
  { semana: 'S3', kova: 78, tradicional: 15 },
  { semana: 'S4', kova: 100, tradicional: 25 },
  { semana: 'S6', kova: 100, tradicional: 48 },
  { semana: 'S8', kova: 100, tradicional: 68 },
  { semana: 'S12', kova: 100, tradicional: 100 },
];

const retencionData = [
  { mes: 'Mes 1', kova: 100, mercado: 100 },
  { mes: 'Mes 3', kova: 99, mercado: 87 },
  { mes: 'Mes 6', kova: 97, mercado: 72 },
  { mes: 'Mes 9', kova: 96, mercado: 62 },
  { mes: 'Año 1', kova: 94, mercado: 54 },
];

const competenciasData = [
  { comp: 'Logro', kova: 94, bench: 68 },
  { comp: 'Presión', kova: 89, bench: 61 },
  { comp: 'Negoc.', kova: 92, bench: 65 },
  { comp: 'Persuas.', kova: 96, bench: 63 },
  { comp: 'Escucha', kova: 87, bench: 70 },
];

// --- CUSTOM TOOLTIP ---
const ChartTooltip = ({ active, payload, label, labelA, labelB }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: '#6B7280' }}>{i === 0 ? labelB : labelA}:</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#0F0A2A' }}>{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function ImpactSection() {
  const [activeChart, setActiveChart] = useState(0);

  const tabs = [
    { label: 'Velocidad de contratación', icon: Zap, color: '#6366F1' },
    { label: 'Retención del equipo', icon: Users, color: '#10B981' },
    { label: 'Desempeño vs. mercado', icon: Award, color: '#F59E0B' },
  ];

  return (
    <section id="impacto" className="py-28 px-6 lg:px-8 overflow-hidden" style={{ background: '#FAFBFF' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end mb-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#6366F1', letterSpacing: '0.15em' }}>Impacto medible</p>
            <h2 className="font-heading font-black leading-tight" style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2.1rem)', color: '#0F0A2A', letterSpacing: '-0.025em' }}>
              Los números detrás de<br />cada proceso que hacemos.
            </h2>
          </div>
          <p className="text-sm max-w-xs lg:text-right" style={{ color: '#9CA3AF', lineHeight: 1.8 }}>
            Datos reales de procesos que acompañamos: velocidad, retención y desempeño comparado.
          </p>
        </div>

        {/* Top KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {[
            { val: '3×', label: 'más rápido que el promedio', sub: 'en tiempo de contratación', color: '#6366F1', bg: '#EEF2FF' },
            { val: '94%', label: 'retención al primer año', sub: 'vs. 54% del mercado', color: '#10B981', bg: '#ECFDF5' },
            { val: '−8 sem', label: 'ahorradas en inducción', sub: 'con proceso estructurado', color: '#0EA5E9', bg: '#F0F9FF' },
            { val: '6–18×', label: 'costo de una mala contratación', sub: 'en salarios perdidos', color: '#F59E0B', bg: '#FFFBEB' },
          ].map(({ val, label, sub, color, bg }) => (
            <div key={val} className="rounded-2xl p-5" style={{ background: bg, border: `1px solid ${color}1A` }}>
              <p className="font-heading font-black text-xl leading-none mb-1.5" style={{ color, letterSpacing: '-0.03em' }}>{val}</p>
              <p className="text-xs font-semibold leading-snug mb-0.5" style={{ color: '#1e1b4b' }}>{label}</p>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Chart tabs + panel */}
        <div className="rounded-3xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 8px 40px rgba(99,102,241,0.06)' }}>

          {/* Tab bar */}
          <div className="flex" style={{ borderBottom: '1px solid #F3F4F6', background: '#FAFBFF' }}>
            {tabs.map(({ label, icon: Icon, color }, i) => (
              <button key={i} onClick={() => setActiveChart(i)}
                className="flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-semibold transition-all"
                style={{
                  color: activeChart === i ? color : '#9CA3AF',
                  borderBottom: activeChart === i ? `2px solid ${color}` : '2px solid transparent',
                  background: activeChart === i ? `${color}06` : 'transparent',
                }}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1fr_260px]">

            {/* Chart */}
            <div className="p-8 lg:p-10">
              {activeChart === 0 && (
                <>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-heading font-bold text-lg" style={{ color: '#0F0A2A' }}>Productividad del asesor nuevo</h3>
                      <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Semanas desde el primer día hasta rendimiento completo</p>
                    </div>
                    <div className="flex flex-col gap-1.5 text-xs">
                      <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm" style={{ background: '#6366F1' }} /><span style={{ color: '#374151' }}>Con Kova</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm" style={{ background: '#E5E7EB' }} /><span style={{ color: '#9CA3AF' }}>Sin proceso</span></div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={contratacionData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gKova" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 4" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="semana" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                      <ReferenceLine y={100} stroke="#E5E7EB" strokeDasharray="3 3" label={{ value: 'Pleno rendimiento', position: 'insideTopRight', fontSize: 10, fill: '#9CA3AF' }} />
                      <Tooltip content={<ChartTooltip labelA="Con Kova" labelB="Sin proceso" />} />
                      <Area type="monotone" dataKey="tradicional" stroke="#D1D5DB" strokeWidth={1.5} fill="none" strokeDasharray="4 3" dot={false} />
                      <Area type="monotone" dataKey="kova" stroke="#6366F1" strokeWidth={2.5} fill="url(#gKova)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <p className="text-xs mt-4 text-center" style={{ color: '#9CA3AF' }}>
                    La zona sombreada = semanas en que Kova ya está a velocidad de crucero y el proceso tradicional aún no.
                  </p>
                </>
              )}

              {activeChart === 1 && (
                <>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-heading font-bold text-lg" style={{ color: '#0F0A2A' }}>Retención del equipo comercial</h3>
                      <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>% del equipo que permanece activo en los primeros 12 meses</p>
                    </div>
                    <div className="flex flex-col gap-1.5 text-xs">
                      <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm" style={{ background: '#10B981' }} /><span style={{ color: '#374151' }}>Con Kova</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm" style={{ background: '#E5E7EB' }} /><span style={{ color: '#9CA3AF' }}>Mercado promedio</span></div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={retencionData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 4" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[40, 105]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                      <Tooltip content={<ChartTooltip labelA="Kova" labelB="Mercado" />} />
                      <Area type="monotone" dataKey="mercado" stroke="#D1D5DB" strokeWidth={1.5} fill="none" strokeDasharray="4 3" dot={false} />
                      <Area type="monotone" dataKey="kova" stroke="#10B981" strokeWidth={2.5} fill="url(#gGreen)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <p className="text-xs mt-4 text-center" style={{ color: '#9CA3AF' }}>
                    40 puntos de diferencia al año 1. Cada punto perdido es un sueldo desperdiciado en buscar reemplazo.
                  </p>
                </>
              )}

              {activeChart === 2 && (
                <>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-heading font-bold text-lg" style={{ color: '#0F0A2A' }}>Score de competencias comerciales</h3>
                      <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Perfiles colocados por Kova vs. benchmark del mercado (0–100)</p>
                    </div>
                    <div className="flex flex-col gap-1.5 text-xs">
                      <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm" style={{ background: '#F59E0B' }} /><span style={{ color: '#374151' }}>Perfiles Kova</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm" style={{ background: '#E5E7EB' }} /><span style={{ color: '#9CA3AF' }}>Benchmark</span></div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={competenciasData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={6} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="2 4" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="comp" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 110]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltip labelA="Kova" labelB="Benchmark" />} />
                      <Bar dataKey="bench" fill="#F3F4F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="kova" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs mt-4 text-center" style={{ color: '#9CA3AF' }}>
                    Los perfiles que presenta Kova superan el benchmark sectorial en todas las competencias clave.
                  </p>
                </>
              )}
            </div>

            {/* Insight sidebar */}
            <div className="p-8 flex flex-col justify-center gap-5" style={{ background: '#FAFBFF', borderLeft: '1px solid #F3F4F6' }}>
              {activeChart === 0 && (
                <>
                  <div className="rounded-2xl p-5" style={{ background: '#EEF2FF', border: '1px solid rgba(99,102,241,0.15)' }}>
                    <p className="font-heading font-black text-3xl leading-none mb-1" style={{ color: '#6366F1', letterSpacing: '-0.04em' }}>3×</p>
                    <p className="text-xs font-semibold" style={{ color: '#4338CA' }}>más rápido</p>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.85 }}>
                    Con inducción estructurada y proceso definido, un asesor nuevo alcanza el <strong style={{ color: '#0F0A2A' }}>100% de productividad en 4 semanas</strong>. Sin estructura, ese mismo proceso tarda hasta 12.
                  </p>
                  <div className="space-y-2">
                    {[['Sem. 4', '100%', '#6366F1'], ['Sem. 4 (trad.)', '25%', '#D1D5DB']].map(([l, v, c]) => (
                      <div key={l} className="flex items-center justify-between text-xs">
                        <span style={{ color: '#9CA3AF' }}>{l}</span>
                        <span className="font-bold" style={{ color: c }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {activeChart === 1 && (
                <>
                  <div className="rounded-2xl p-5" style={{ background: '#ECFDF5', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <p className="font-heading font-black text-3xl leading-none mb-1" style={{ color: '#10B981', letterSpacing: '-0.04em' }}>40 pts</p>
                    <p className="text-xs font-semibold" style={{ color: '#059669' }}>de diferencia al año 1</p>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.85 }}>
                    El mercado promedio pierde casi la mitad del equipo comercial en el primer año. <strong style={{ color: '#0F0A2A' }}>Kova mantiene el 94%</strong>, porque contratar bien desde el inicio reduce la rotación.
                  </p>
                  <div className="space-y-2">
                    {[['Año 1 · Kova', '94%', '#10B981'], ['Año 1 · Mercado', '54%', '#D1D5DB']].map(([l, v, c]) => (
                      <div key={l} className="flex items-center justify-between text-xs">
                        <span style={{ color: '#9CA3AF' }}>{l}</span>
                        <span className="font-bold" style={{ color: c }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {activeChart === 2 && (
                <>
                  <div className="rounded-2xl p-5" style={{ background: '#FFFBEB', border: '1px solid rgba(245,158,11,0.15)' }}>
                    <p className="font-heading font-black text-3xl leading-none mb-1" style={{ color: '#F59E0B', letterSpacing: '-0.04em' }}>Top 8%</p>
                    <p className="text-xs font-semibold" style={{ color: '#D97706' }}>del pool de candidatos</p>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.85 }}>
                    Solo presentamos candidatos que superan el benchmark sectorial en orientación al logro, resiliencia y negociación. <strong style={{ color: '#0F0A2A' }}>No en uno: en todos los criterios.</strong>
                  </p>
                  <div className="space-y-2">
                    {competenciasData.map(({ comp, kova, bench }) => (
                      <div key={comp} className="flex items-center justify-between text-xs">
                        <span style={{ color: '#9CA3AF' }}>{comp}</span>
                        <span className="font-bold" style={{ color: '#F59E0B' }}>+{kova - bench} pts</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <button onClick={() => document.getElementById('acceso')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-xs font-semibold px-4 py-2.5 rounded-xl transition-all text-white self-start mt-2"
                style={{ background: tabs[activeChart].color, boxShadow: `0 4px 14px ${tabs[activeChart].color}30` }}>
                Quiero estos resultados →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}