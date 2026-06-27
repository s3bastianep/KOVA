import React from 'react';
import { TrendingUp, Award, Users, BookOpen, CheckCircle } from 'lucide-react';

const skills = [
  { label: 'Prospección', value: 87, color: 'bg-brand' },
  { label: 'Negociación', value: 92, color: 'bg-metric' },
  { label: 'Comunicación', value: 95, color: 'bg-sage-dark' },
  { label: 'Cierre', value: 91, color: 'bg-brand-mid' },
  { label: 'Capacitación', value: 88, color: 'bg-metric' },
];

const candidates = [
  { name: 'Ana Martínez', role: 'SDR', score: 94, badge: 'Elite' },
  { name: 'Carlos Ruiz', role: 'Ejecutivo', score: 91, badge: 'Oro' },
  { name: 'Laura Gómez', role: 'KAM', score: 88, badge: 'Plata' },
];

export default function DashboardMockup() {
  const badgeColors = {
    Elite: { bg: 'rgba(107,138,253,0.15)', text: '#6B8AFD' },
    Oro: { bg: 'rgba(251,191,36,0.15)', text: '#D97706' },
    Plata: { bg: 'rgba(148,163,184,0.15)', text: '#64748B' },
  };

  return (
    <div className="relative w-full max-w-[520px] ml-auto">
      {/* Floating card - top left */}
      <div className="absolute -top-5 -left-8 z-20 rounded-2xl p-3.5 w-48" style={{background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.25)'}}>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{background: 'rgba(168,195,176,0.25)'}}>
            <CheckCircle className="w-3.5 h-3.5" style={{color: '#A8C3B0'}} />
          </div>
          <span className="text-xs font-semibold text-white">Nuevo candidato</span>
        </div>
        <p className="text-xs" style={{color: 'rgba(255,255,255,0.6)'}}>Score: <span className="font-bold" style={{color: '#A8C3B0'}}>94/100</span></p>
      </div>

      {/* Floating card - bottom right */}
      <div className="absolute -bottom-5 -right-6 z-20 rounded-2xl p-3.5 w-48" style={{background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.25)'}}>
        <div className="flex items-center gap-2 mb-1.5">
          <TrendingUp className="w-4 h-4" style={{color: '#A8C3B0'}} />
          <span className="text-xs font-semibold text-white">Equipo activo</span>
        </div>
        <p className="text-xs" style={{color: 'rgba(255,255,255,0.6)'}}>Desempeño <span className="font-bold" style={{color: '#A8C3B0'}}>↑ 18%</span></p>
      </div>

      {/* Main dashboard card */}
      <div className="relative z-10 rounded-2xl overflow-hidden" style={{background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)'}}>
        {/* Top bar */}
        <div className="px-5 py-3.5 flex items-center justify-between" style={{background: 'rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
          <span className="font-heading font-bold text-sm text-white">Sales<span style={{color: '#A8C3B0'}}>Rank</span></span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{background: '#FF5F57'}} />
            <span className="w-2.5 h-2.5 rounded-full" style={{background: '#FFBD2E'}} />
            <span className="w-2.5 h-2.5 rounded-full" style={{background: '#28C840'}} />
          </div>
        </div>

        <div className="p-5">
          {/* Score header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{color: 'rgba(255,255,255,0.45)'}}>Commercial Score</p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-heading font-black text-white">92</span>
                <span className="text-xl font-medium mb-1" style={{color: 'rgba(255,255,255,0.4)'}}>/100</span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full mt-2" style={{background: 'rgba(168,195,176,0.2)', color: '#A8C3B0'}}>
                <TrendingUp className="w-3 h-3" /> Top 5%
              </span>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-1">
                {['Evaluación', 'Cert.', 'KPIs'].map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-md font-medium" style={{background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)'}}>{t}</span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg" style={{background: 'rgba(107,138,253,0.2)', color: '#6B8AFD'}}>
                <Award className="w-3 h-3" /> Certificado Elite
              </span>
            </div>
          </div>

          {/* Skills bars */}
          <div className="mb-5 space-y-3">
            {skills.map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium" style={{color: 'rgba(255,255,255,0.55)'}}>{s.label}</span>
                  <span className="text-xs font-bold text-white">{s.value}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{background: 'rgba(255,255,255,0.08)'}}>
                  <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.value}%`, opacity: 0.9 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Candidates mini list */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest" style={{color: 'rgba(255,255,255,0.45)'}}>Ranking de candidatos</p>
              <Users className="w-3.5 h-3.5" style={{color: 'rgba(255,255,255,0.3)'}} />
            </div>
            <div className="space-y-2">
              {candidates.map((c, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)'}}>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center" style={{background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)'}}>{i + 1}</span>
                    <div>
                      <p className="text-xs font-semibold text-white leading-none mb-0.5">{c.name}</p>
                      <p className="text-xs" style={{color: 'rgba(255,255,255,0.4)'}}>{c.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{c.score}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{background: badgeColors[c.badge].bg, color: badgeColors[c.badge].text}}>{c.badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}