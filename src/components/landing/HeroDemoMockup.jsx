import React, { useState } from 'react';
import { CheckCircle, Lock, Play, Target, TrendingUp, Award, Users } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

const radarData = [
  { subject: 'Logro', A: 94 },
  { subject: 'Presión', A: 88 },
  { subject: 'Negociación', A: 91 },
  { subject: 'Persuasión', A: 96 },
  { subject: 'Escucha', A: 85 },
  { subject: 'Liderazgo', A: 78 },
];

const bars = [
  { label: 'Orientación al logro', value: 94, bench: 72 },
  { label: 'Tolerancia a presión', value: 88, bench: 65 },
  { label: 'Negociación', value: 91, bench: 70 },
  { label: 'Persuasión', value: 96, bench: 68 },
];

const modules = [
  { title: 'ADN del vendedor de alto desempeño', done: true, duration: '2h 30m' },
  { title: 'Manejo de objeciones con criterio', done: true, duration: '3h 15m' },
  { title: 'Técnicas de cierre consultivo', done: false, progress: 65, duration: '4h 00m' },
  { title: 'Prospección y generación de pipeline', done: false, locked: true, duration: '3h 45m' },
];

const RadialScore = ({ value, size = 56 }) => {
  const r = 22; const circ = 2 * Math.PI * r; const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <circle cx="28" cy="28" r={r} fill="none" stroke="#F0F0EA" strokeWidth="4" />
      <circle cx="28" cy="28" r={r} fill="none" stroke="#2EC4A5" strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * 0.25} strokeLinecap="round" />
      <text x="28" y="32" textAnchor="middle" fontSize="11" fontWeight="800" fill="#111110" fontFamily="Inter,sans-serif">{value}</text>
    </svg>
  );
};

export default function HeroDemoMockup() {
  const [tab, setTab] = useState('perfil');

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E5E5E0', boxShadow: '0 20px 60px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)' }}>
      {/* Chrome bar */}
      <div className="flex items-center justify-between px-5 py-3" style={{ background: '#F7F8FA', borderBottom: '1px solid #E8E8E3' }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FECACA' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FED7AA' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#BBF7D0' }} />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs" style={{ background: '#EEEEE8', color: '#AAAAAA' }}>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#2EC4A5' }} />
          kova.co · Entregables
        </div>
        <div className="w-16" />
      </div>

      {/* Tabs */}
      <div className="flex px-5 pt-3" style={{ background: '#FFFFFF', borderBottom: '1px solid #E8E8E3' }}>
        {[['perfil', 'Candidato'], ['induccion', 'Inducción'], ['evaluacion', 'Assessment']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className="px-4 py-2.5 text-xs font-semibold transition-all mr-1"
            style={tab === key
              ? { color: '#1877F2', borderBottom: '2px solid #1877F2', marginBottom: '-1px', background: 'transparent' }
              : { color: '#CCCCCC', background: 'transparent', borderBottom: '2px solid transparent', marginBottom: '-1px' }
            }>{label}</button>
        ))}
      </div>

      <div className="p-5" style={{ background: '#FAFAF8', minHeight: 340 }}>

        {tab === 'perfil' && (
          <div>
            <div className="flex items-start gap-4 mb-5 pb-5" style={{ borderBottom: '1px solid #EEEEE8' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center font-heading font-black text-sm flex-shrink-0"
                style={{ background: '#1877F2', color: '#FFFFFF' }}>AM</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-bold" style={{ color: '#111110' }}>Ana Martínez</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: '#E8F8F5', color: '#2EC4A5' }}>Recomendado</span>
                </div>
                <p className="text-xs" style={{ color: '#AAAAAA' }}>SDR Senior · 4 años B2B · Bogotá</p>
              </div>
              <RadialScore value={94} size={52} />
            </div>
            <div className="space-y-3">
              {bars.map(b => (
                <div key={b.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs" style={{ color: '#666660' }}>{b.label}</span>
                    <span className="text-xs font-bold" style={{ color: '#111110' }}>{b.value}</span>
                  </div>
                  <div className="relative h-1.5 rounded-full" style={{ background: '#F0F0EA' }}>
                    <div style={{ width: `${b.value}%`, height: '100%', background: '#2EC4A5', borderRadius: 9999 }} />
                    <div className="absolute top-1/2 -translate-y-1/2 w-px h-3" style={{ left: `${b.bench}%`, background: '#DDDDDD' }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #E8E8E3' }}>
              <p className="text-xs italic leading-relaxed" style={{ color: '#888880' }}>
                "Perfil de alto desempeño. Orientación al logro 22 pts. por encima del benchmark. Recomendada para SDR Senior o KAM."
              </p>
              <p className="text-xs font-semibold mt-1.5" style={{ color: '#2EC4A5' }}>Evaluador Kova</p>
            </div>
          </div>
        )}

        {tab === 'induccion' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold" style={{ color: '#111110' }}>Programa de Inducción Comercial</p>
              <span className="text-xs font-semibold px-2 py-1 rounded-md" style={{ background: '#E8F8F5', color: '#2EC4A5' }}>74% completado</span>
            </div>
            <div className="h-1 rounded-full mb-5" style={{ background: '#F0F0EA' }}>
              <div style={{ width: '74%', height: '100%', background: '#2EC4A5', borderRadius: 9999 }} />
            </div>
            <div className="space-y-2">
              {modules.map((m, i) => (
                <div key={i} className="flex items-center gap-3 px-3.5 py-3 rounded-xl"
                  style={{ background: '#FFFFFF', border: `1px solid ${m.done ? '#E0F0ED' : '#E8E8E3'}`, opacity: m.locked ? 0.45 : 1 }}>
                  <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: m.done ? '#2EC4A5' : m.locked ? '#F0F0EA' : '#F0F8F6' }}>
                    {m.done ? <CheckCircle className="w-3.5 h-3.5 text-white" />
                      : m.locked ? <Lock className="w-3 h-3" style={{ color: '#CCCCCC' }} />
                      : <Play className="w-3 h-3" style={{ color: '#2EC4A5' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: m.locked ? '#CCCCCC' : '#333330' }}>{m.title}</p>
                    {!m.locked && m.progress > 0 && m.progress < 100 && (
                      <div className="h-0.5 rounded-full mt-1.5" style={{ background: '#E8E8E3' }}>
                        <div style={{ width: `${m.progress}%`, height: '100%', background: '#2EC4A5', borderRadius: 9999 }} />
                      </div>
                    )}
                  </div>
                  <span className="text-xs flex-shrink-0" style={{ color: '#AAAAAA' }}>{m.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'evaluacion' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold" style={{ color: '#111110' }}>Assessment Situacional · Kova</p>
              <div className="flex gap-1">
                {[1,2,3,4,5,6,7,8].map(n => (
                  <div key={n} className="w-2 h-2 rounded-full" style={{ background: n <= 5 ? '#1877F2' : '#EEEEE8' }} />
                ))}
              </div>
            </div>
            <div className="rounded-xl p-4 mb-3" style={{ background: '#FFFFFF', border: '1px solid #E8E8E3' }}>
              <p className="text-xs font-medium leading-relaxed" style={{ color: '#333330' }}>
                Un cliente dice: "El precio está muy alto comparado con la competencia." ¿Cuál es tu primera respuesta?
              </p>
            </div>
            <div className="space-y-2 mb-4">
              {[
                { text: 'Ofrezco un descuento inmediatamente.', state: 'neutral' },
                { text: '¿Qué valoras más al tomar esta decisión?', state: 'correct' },
                { text: 'Nuestro precio es el del mercado.', state: 'neutral' },
                { text: 'Le pregunto qué precio da la competencia.', state: 'neutral' },
              ].map((opt, i) => (
                <div key={i} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium"
                  style={{
                    background: opt.state === 'correct' ? '#E8F8F5' : '#FFFFFF',
                    border: `1px solid ${opt.state === 'correct' ? '#2EC4A5' : '#E8E8E3'}`,
                    color: opt.state === 'correct' ? '#2EC4A5' : '#555550',
                  }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: opt.state === 'correct' ? '#2EC4A5' : '#F0F0EA', color: opt.state === 'correct' ? '#fff' : '#AAAAAA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt.text}
                  {opt.state === 'correct' && <CheckCircle className="w-3.5 h-3.5 ml-auto flex-shrink-0" />}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #E8E8E3' }}>
              <span className="text-xs" style={{ color: '#AAAAAA' }}>Competencia: <strong style={{ color: '#2EC4A5' }}>Orientación al logro</strong></span>
              <span className="text-xs font-bold" style={{ color: '#1877F2' }}>Score: 94/100</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}