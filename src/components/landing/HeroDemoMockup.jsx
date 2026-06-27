import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const ACCENT = '#6366F1';
const ACCENT_DARK = '#4F46E5';
const ACCENT_BG = '#EEF2FF';

const bars = [
  { label: 'Orientación al logro', value: 94, bench: 72 },
  { label: 'Tolerancia a presión', value: 88, bench: 65 },
  { label: 'Negociación', value: 91, bench: 70 },
  { label: 'Persuasión', value: 96, bench: 68 },
];

const RadialScore = ({ value, size = 52 }) => {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 52 52">
      <circle cx="26" cy="26" r={r} fill="none" stroke="#E5E7EB" strokeWidth="4" />
      <circle cx="26" cy="26" r={r} fill="none" stroke={ACCENT} strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * 0.25} strokeLinecap="round" />
      <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0F0A2A" fontFamily="Inter,sans-serif">{value}</text>
    </svg>
  );
};

export default function HeroDemoMockup() {
  const [tab, setTab] = useState('perfil');

  const tabs = [
    ['perfil', 'Informe'],
    ['evaluacion', 'Evaluación'],
    ['recomendacion', 'Recomendación'],
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden w-full max-w-lg mx-auto lg:max-w-none lg:mx-0"
      style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 24px 64px rgba(99,102,241,0.12), 0 8px 24px rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center justify-between px-5 py-3" style={{ background: '#FAFBFF', borderBottom: '1px solid #E5E7EB' }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-200" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-200" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-200" />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs" style={{ background: '#F3F4F6', color: '#9CA3AF' }}>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
          kova.co · Selección comercial
        </div>
        <div className="w-12" />
      </div>

      <div className="flex px-4 pt-3" style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className="px-4 py-2.5 text-xs font-semibold transition-all mr-1"
            style={tab === key
              ? { color: ACCENT, borderBottom: `2px solid ${ACCENT}`, marginBottom: '-1px' }
              : { color: '#9CA3AF', borderBottom: '2px solid transparent', marginBottom: '-1px' }
            }
          >
            {label}
          </button>
        ))}
      </div>

      <div className="p-5" style={{ background: '#FAFBFF', minHeight: 320 }}>
        {tab === 'perfil' && (
          <div>
            <div className="flex items-start gap-4 mb-5 pb-5" style={{ borderBottom: '1px solid #E5E7EB' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center font-heading font-black text-sm flex-shrink-0 text-white"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})` }}>AM</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p className="text-sm font-bold" style={{ color: '#0F0A2A' }}>Ana Martínez</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: ACCENT_BG, color: ACCENT }}>Recomendada</span>
                </div>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>Ejecutiva comercial B2B · Bogotá</p>
              </div>
              <RadialScore value={94} />
            </div>
            <div className="space-y-3">
              {bars.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs" style={{ color: '#6B7280' }}>{b.label}</span>
                    <span className="text-xs font-bold" style={{ color: '#0F0A2A' }}>{b.value}</span>
                  </div>
                  <div className="relative h-1.5 rounded-full bg-slate-200">
                    <div className="h-full rounded-full" style={{ width: `${b.value}%`, background: ACCENT }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'evaluacion' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold" style={{ color: '#0F0A2A' }}>Evaluación situacional</p>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md" style={{ background: ACCENT_BG, color: ACCENT }}>Pregunta 5 de 8</span>
            </div>
            <div className="rounded-xl p-4 mb-3 bg-white border border-slate-200">
              <p className="text-xs font-medium leading-relaxed" style={{ color: '#374151' }}>
                Un cliente dice: "El precio está muy alto comparado con la competencia." ¿Cuál es tu primera respuesta?
              </p>
            </div>
            <div className="space-y-2">
              {[
                { text: 'Ofrezco un descuento inmediatamente.', correct: false },
                { text: '¿Qué valoras más al tomar esta decisión?', correct: true },
                { text: 'Nuestro precio es el del mercado.', correct: false },
              ].map((opt, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium border"
                  style={{
                    background: opt.correct ? ACCENT_BG : '#FFFFFF',
                    borderColor: opt.correct ? '#C7D2FE' : '#E5E7EB',
                    color: opt.correct ? ACCENT_DARK : '#6B7280',
                  }}
                >
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 text-white"
                    style={{ background: opt.correct ? ACCENT : '#E5E7EB', color: opt.correct ? '#fff' : '#9CA3AF' }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt.text}
                  {opt.correct && <CheckCircle className="w-3.5 h-3.5 ml-auto flex-shrink-0" style={{ color: ACCENT }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'recomendacion' && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>Fortalezas</p>
              <ul className="space-y-1.5 text-xs" style={{ color: '#374151' }}>
                <li>· Comunicación clara con perfiles decisores</li>
                <li>· Experiencia en venta consultiva B2B</li>
                <li>· Alta orientación al logro bajo presión</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})` }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2 text-white/60">Recomendación</p>
              <p className="text-xs leading-relaxed text-white/95">
                Perfil recomendado para la vacante. Incluir en la terna final y validar fit cultural con liderazgo comercial.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
