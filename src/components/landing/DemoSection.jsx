import React, { useState } from 'react';
import { CheckCircle, Lock, Play, ArrowRight, Clock, Target, TrendingUp, Award, Users } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';

const TABS = [
  { key: 'perfil', label: 'Informe de Candidato' },
  { key: 'induccion', label: 'Programa de Inducción' },
  { key: 'evaluacion', label: 'Assessment Comercial' },
];

const radarData = [
  { subject: 'Logro', A: 94 },
  { subject: 'Presión', A: 88 },
  { subject: 'Negociación', A: 91 },
  { subject: 'Persuasión', A: 96 },
  { subject: 'Escucha', A: 85 },
  { subject: 'Liderazgo', A: 78 },
];

const barCompetencias = [
  { name: 'Orientación al logro', value: 94, bench: 72 },
  { name: 'Tolerancia a presión', value: 88, bench: 65 },
  { name: 'Negociación', value: 91, bench: 70 },
  { name: 'Persuasión', value: 96, bench: 68 },
  { name: 'Escucha activa', value: 85, bench: 74 },
];

const modules = [
  { title: 'ADN del vendedor de alto desempeño', done: true, time: '25 min', xp: 200 },
  { title: 'Manejo de objeciones con criterio', done: true, time: '40 min', xp: 350 },
  { title: 'Técnicas de cierre consultivo', done: false, progress: 65, time: '50 min', xp: 400 },
  { title: 'Prospección y generación de pipeline', done: false, locked: true, time: '60 min', xp: 500 },
  { title: 'KPIs y gestión de la agenda comercial', done: false, locked: true, time: '45 min', xp: 450 },
];

const testQs = [
  {
    q: 'Un cliente dice que necesita consultarlo con su equipo antes de decidir. ¿Qué haces?',
    options: ['Espero a que me contacten.', 'Agendo una reunión conjunta con el equipo decisor.', 'Insisto en cerrar antes de que termine la reunión.', 'Le envío un correo con la propuesta.'],
    correct: 1,
    explanation: 'El vendedor consultivo facilita el proceso de decisión incluyendo a los decisores clave, en lugar de presionar o esperar pasivamente.',
    competency: 'Orientación al logro',
  },
  {
    q: 'Tu pipeline cayó un 40% este mes. ¿Cuál es tu primera acción?',
    options: ['Espero nuevos leads de marketing.', 'Reviso el embudo y reactivo prospectos fríos.', 'Bajo los precios para cerrar rápido.', 'Aumento el volumen de llamadas en frío.'],
    correct: 1,
    explanation: 'Diagnosticar primero y actuar sobre lo existente es la señal de madurez comercial. Los mejores vendedores no esperan: gestionan.',
    competency: 'Proactividad comercial',
  },
];

const RadialScore = ({ value, size = 90 }) => {
  const r = 34; const circ = 2 * Math.PI * r; const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 90 90">
      <circle cx="45" cy="45" r={r} fill="none" stroke="#F0F0EA" strokeWidth="6" />
      <circle cx="45" cy="45" r={r} fill="none" stroke="#2EC4A5" strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * 0.25} strokeLinecap="round" />
      <text x="45" y="50" textAnchor="middle" fontSize="17" fontWeight="800" fill="#111110" fontFamily="Inter,sans-serif">{value}</text>
    </svg>
  );
};

export default function DemoSection() {
  const [tab, setTab] = useState('perfil');
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const q = testQs[qIdx % testQs.length];
  const handleAnswer = (i) => { if (answered) return; setSelected(i); setAnswered(true); };
  const nextQ = () => { setQIdx(qIdx + 1); setSelected(null); setAnswered(false); };

  return (
    <section className="py-28 px-8" style={{ background: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-end mb-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: '#2EC4A5', letterSpacing: '0.15em' }}>Lo que entregamos</p>
            <h2 className="font-heading font-black leading-[1.05]" style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3rem)', color: '#111110', letterSpacing: '-0.03em' }}>
              Así se ven los entregables de Kova.
            </h2>
          </div>
          <p className="text-base leading-relaxed" style={{ color: '#888880', lineHeight: 1.8 }}>
            Cada proceso que hacemos tiene un entregable concreto. Informes de candidatos, programas de inducción y evaluaciones. Aquí puedes ver cómo lucen.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={tab === t.key
                ? { background: '#1877F2', color: '#FFFFFF', border: '1.5px solid #1877F2' }
                : { background: '#FFFFFF', color: '#888880', border: '1.5px solid #E8E8E3' }
              }>{t.label}</button>
          ))}
        </div>

        <div className="rounded-3xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E5E5E0', boxShadow: '0 4px 40px rgba(0,0,0,0.05)' }}>

          {/* INFORME DE CANDIDATO */}
          {tab === 'perfil' && (
            <div className="grid lg:grid-cols-[1fr_340px]">
              <div className="p-10" style={{ borderRight: '1px solid #F0F0EA' }}>
                <div className="flex items-start gap-5 mb-10 pb-8" style={{ borderBottom: '1px solid #F0F0EA' }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-heading font-black flex-shrink-0"
                    style={{ background: '#1877F2', color: '#FFFFFF', fontSize: '1.1rem' }}>AM</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-1">
                      <p className="font-heading font-bold text-xl" style={{ color: '#111110', letterSpacing: '-0.02em' }}>Ana Martínez</p>
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: '#E8F8F5', color: '#2EC4A5' }}>Recomendado</span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#888880' }}>SDR Senior · 4 años experiencia B2B · Bogotá</p>
                    <div className="flex flex-wrap gap-2">
                      {['Cierre consultivo', 'Alta resiliencia', 'Perfil Hunter', 'B2B Senior'].map(b => (
                        <span key={b} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#F7F8FA', color: '#555550', border: '1px solid #E8E8E3' }}>{b}</span>
                      ))}
                    </div>
                  </div>
                  <RadialScore value={94} size={72} />
                </div>

                <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: '#CCCCCC' }}>Evaluación de competencias comerciales</p>
                <div className="space-y-5">
                  {barCompetencias.map(b => (
                    <div key={b.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium" style={{ color: '#444440' }}>{b.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs" style={{ color: '#CCCCCC' }}>Promedio: {b.bench}</span>
                          <span className="text-sm font-black" style={{ color: '#111110' }}>{b.value}</span>
                        </div>
                      </div>
                      <div className="relative h-2 rounded-full overflow-visible" style={{ background: '#F0F0EA' }}>
                        <div className="h-full rounded-full" style={{ width: `${b.value}%`, background: '#2EC4A5' }} />
                        <div className="absolute top-1/2 -translate-y-1/2 w-px h-4" style={{ left: `${b.bench}%`, background: '#DDDDDD' }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-5 rounded-2xl" style={{ background: '#F7F8FA', border: '1px solid #E8E8E3' }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#AAAAAA' }}>Observaciones del evaluador Kova</p>
                  <p className="text-sm leading-relaxed italic" style={{ color: '#555550' }}>
                    "Ana muestra un perfil de alto desempeño en cierre consultivo. Su orientación al logro supera el benchmark sectorial en 22 puntos. Recomendada para posiciones de SDR Senior o transición a KAM."
                  </p>
                </div>
              </div>

              <div className="p-8 flex flex-col gap-6" style={{ background: '#F7F8FA' }}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#CCCCCC' }}>Radar de competencias</p>
                  <p className="text-xs" style={{ color: '#AAAAAA' }}>vs. benchmark del sector</p>
                </div>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#EEEEE8" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#AAAAAA' }} />
                      <Radar name="Ana" dataKey="A" stroke="#2EC4A5" fill="#2EC4A5" fillOpacity={0.12} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {[
                    { icon: Target, label: 'Perfil', val: 'Hunter / SDR Senior' },
                    { icon: TrendingUp, label: 'Potencial', val: 'Transición a KAM' },
                    { icon: Award, label: 'Ranking Kova', val: 'Top 8% del pool' },
                    { icon: Users, label: 'Fit cultural', val: 'Alto, validado' },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label} className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #E8E8E3' }}>
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#2EC4A5' }} />
                      <span className="text-xs flex-shrink-0" style={{ color: '#AAAAAA' }}>{label}</span>
                      <span className="text-xs font-semibold ml-auto text-right" style={{ color: '#111110' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROGRAMA DE INDUCCIÓN */}
          {tab === 'induccion' && (
            <div className="grid lg:grid-cols-[1fr_320px]">
              <div className="p-10" style={{ borderRight: '1px solid #F0F0EA' }}>
                <div className="flex items-center justify-between mb-8 pb-6" style={{ borderBottom: '1px solid #F0F0EA' }}>
                  <div>
                    <p className="font-heading font-bold text-lg" style={{ color: '#111110' }}>Programa de Inducción Comercial</p>
                    <p className="text-sm mt-1" style={{ color: '#888880' }}>Diseñado por Kova · 5 módulos · 14 hrs · Certificación</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-black text-3xl leading-none" style={{ color: '#1877F2', letterSpacing: '-0.04em' }}>74%</p>
                    <p className="text-xs mt-1" style={{ color: '#AAAAAA' }}>Carlos R. · Nivel 4</p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between text-xs mb-2" style={{ color: '#AAAAAA' }}>
                    <span>Progreso general del programa</span><span>3 de 5 módulos</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F0F0EA' }}>
                    <div style={{ width: '74%', height: '100%', background: '#2EC4A5', borderRadius: 9999 }} />
                  </div>
                </div>

                <div className="space-y-3">
                  {modules.map((m, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-4 rounded-2xl"
                      style={{ background: m.done ? '#E8F8F5' : '#FAFAF8', border: `1px solid ${m.done ? '#B0E8DF' : '#EEEEE8'}`, opacity: m.locked ? 0.4 : 1 }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: m.done ? '#2EC4A5' : m.locked ? '#F0F0EA' : '#E8F8F5' }}>
                        {m.done ? <CheckCircle className="w-4 h-4 text-white" />
                          : m.locked ? <Lock className="w-3.5 h-3.5" style={{ color: '#CCCCCC' }} />
                          : <Play className="w-3.5 h-3.5" style={{ color: '#2EC4A5' }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: m.locked ? '#CCCCCC' : '#111110' }}>{m.title}</p>
                        {!m.locked && m.progress > 0 && m.progress < 100 && (
                          <div className="h-1.5 rounded-full mt-2" style={{ background: '#E8E8E3' }}>
                            <div style={{ width: `${m.progress}%`, height: '100%', background: '#2EC4A5', borderRadius: 9999 }} />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Clock className="w-3 h-3" style={{ color: '#DDDDDD' }} />
                        <span className="text-xs" style={{ color: '#AAAAAA' }}>{m.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 flex flex-col gap-5" style={{ background: '#F7F8FA' }}>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#CCCCCC' }}>Métricas del equipo</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: '7 días', label: 'desde inicio' },
                    { val: '94%', label: 'tasa de aprobación' },
                    { val: '18 días', label: 'tiempo promedio' },
                    { val: 'Top 5%', label: 'vs. el pool Kova' },
                  ].map(({ val, label }) => (
                    <div key={label} className="px-4 py-4 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #E8E8E3' }}>
                      <p className="font-heading font-black text-xl leading-none mb-1" style={{ color: '#1877F2', letterSpacing: '-0.02em' }}>{val}</p>
                      <p className="text-xs" style={{ color: '#AAAAAA' }}>{label}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#CCCCCC' }}>Avance por módulo</p>
                  <div style={{ height: 130 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'M1', v: 100 }, { name: 'M2', v: 100 }, { name: 'M3', v: 65 }, { name: 'M4', v: 0 }, { name: 'M5', v: 0 }
                      ]} barSize={22}>
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#CCCCCC' }} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Bar dataKey="v" radius={[5, 5, 0, 0]}>
                          {[100, 100, 65, 0, 0].map((v, i) => <Cell key={i} fill={v === 100 ? '#2EC4A5' : v > 0 ? '#90E0D0' : '#F0F0EA'} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ASSESSMENT */}
          {tab === 'evaluacion' && (
            <div className="grid lg:grid-cols-[1fr_340px]">
              <div className="p-10" style={{ borderRight: '1px solid #F0F0EA' }}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="font-heading font-bold text-lg" style={{ color: '#111110' }}>Assessment Comercial Situacional</p>
                    <p className="text-sm mt-1" style={{ color: '#888880' }}>Aplicado por Kova · Evalúa criterio y orientación al logro</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: '#F7F8FA', color: '#888880', border: '1px solid #E8E8E3' }}>
                    {(qIdx % 2) + 1} / {testQs.length}
                  </span>
                </div>

                <div className="flex gap-2 mb-8">
                  {Array.from({ length: testQs.length }).map((_, i) => (
                    <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i < (qIdx % 2) + 1 ? '#1877F2' : '#F0F0EA' }} />
                  ))}
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold mb-6" style={{ background: '#E8F8F5', color: '#2EC4A5', border: '1px solid #B0E8DF' }}>
                  Competencia evaluada: {q.competency}
                </div>

                <div className="rounded-2xl p-6 mb-6" style={{ background: '#F7F8FA', border: '1px solid #E8E8E3' }}>
                  <p className="text-base font-semibold leading-relaxed" style={{ color: '#111110' }}>{q.q}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {q.options.map((opt, i) => {
                    const isCorrect = i === q.correct;
                    const isSelected = selected === i;
                    let bg = '#FFFFFF', border = '#E8E8E3', color = '#555550';
                    if (answered) {
                      if (isCorrect) { bg = '#E8F8F5'; border = '#2EC4A5'; color = '#2EC4A5'; }
                      else if (isSelected) { bg = '#FFF5F5'; border = '#FCA5A5'; color = '#991B1B'; }
                    } else if (isSelected) { bg = '#F7F8FA'; border = '#1877F2'; color = '#1877F2'; }
                    return (
                      <button key={i} onClick={() => handleAnswer(i)} disabled={answered}
                        className="flex items-start gap-3 px-4 py-4 rounded-2xl text-left transition-all disabled:cursor-default"
                        style={{ background: bg, border: `1.5px solid ${border}` }}>
                        <span className="flex items-center justify-center text-xs font-bold flex-shrink-0 rounded-full"
                          style={{ background: answered && isCorrect ? '#2EC4A5' : '#F0F0EA', color: answered && isCorrect ? '#fff' : '#AAAAAA', width: 22, height: 22, minWidth: 22 }}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-sm leading-relaxed" style={{ color }}>{opt}</span>
                        {answered && isCorrect && <CheckCircle className="w-4 h-4 ml-auto flex-shrink-0 mt-0.5" style={{ color: '#2EC4A5' }} />}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <div className="rounded-2xl p-5 mb-5" style={{ background: '#E8F8F5', border: '1px solid #B0E8DF' }}>
                    <p className="text-xs font-bold mb-1.5" style={{ color: '#2EC4A5' }}>¿Por qué esta es la respuesta correcta?</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#555550' }}>{q.explanation}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: answered ? '#2EC4A5' : '#CCCCCC', fontWeight: answered ? 600 : 400 }}>
                    {answered ? '✓ Respuesta registrada' : 'Selecciona una opción'}
                  </span>
                  {answered && (
                    <button onClick={nextQ}
                      className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white"
                      style={{ background: '#1877F2' }}>
                      Siguiente <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-8 flex flex-col gap-5" style={{ background: '#F7F8FA' }}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#CCCCCC' }}>Radar del candidato</p>
                  <p className="text-xs" style={{ color: '#AAAAAA' }}>Resultados acumulados del assessment</p>
                </div>
                <div style={{ height: 210 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#EEEEE8" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#AAAAAA' }} />
                      <Radar name="Score" dataKey="A" stroke="#2EC4A5" fill="#2EC4A5" fillOpacity={0.12} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2.5">
                  {radarData.slice(0, 4).map(d => (
                    <div key={d.subject} className="flex items-center gap-3">
                      <span className="text-xs w-24 flex-shrink-0" style={{ color: '#888880' }}>{d.subject}</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#E8E8E3' }}>
                        <div style={{ width: `${d.A}%`, height: '100%', background: '#2EC4A5', borderRadius: 9999 }} />
                      </div>
                      <span className="text-xs font-bold w-6 text-right flex-shrink-0" style={{ color: '#111110' }}>{d.A}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #E8E8E3' }}>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#AAAAAA' }}>Score global</p>
                    <p className="font-heading font-black text-2xl mt-0.5" style={{ color: '#1877F2', letterSpacing: '-0.03em' }}>91 / 100</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold" style={{ color: '#AAAAAA' }}>Dictamen Kova</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: '#2EC4A5' }}>Apto · Alta prioridad</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}