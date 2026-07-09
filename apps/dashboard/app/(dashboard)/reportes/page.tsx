'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Clock, TrendingUp, TrendingDown, BarChart3, Users, Radar,
  Calendar, Download, ChevronDown, Info, FileSpreadsheet, Loader2,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { PageHeader } from '@/components/layout/PageHeader';

type Consultant = { name: string; vacancies: number; candidates?: number; hires: number; successRate?: number };

type Reports = {
  avgTimeToHire: number;
  avgTimeToHireDelta?: number;
  hires6m?: number;
  hires6mDelta?: number;
  activeConsultants?: number;
  activeConsultantsDelta?: number;
  totalSources?: number;
  avgTimePerStage: { stage: string; days: number }[];
  byConsultant: Consultant[];
  sources: { source: string; count: number }[];
  hiresByMonth: { month: string; hires: number }[];
};

const SOURCE_COLORS = ['#7C3AED', '#00B27A', '#2D5BE3', '#F59E0B', '#94A3B8', '#EC4899'];

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');
}

export default function ReportesPage() {
  const { data, isLoading } = useQuery({ queryKey: ['reports'], queryFn: dashboardApi.reports });
  const r = data as Reports | undefined;
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  async function handleExportExcel() {
    setExporting(true);
    setExportError('');
    try {
      const blob = await dashboardApi.exportExcel();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kova-export-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'No se pudo exportar a Excel');
    } finally {
      setExporting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="kova-skeleton h-32 rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          {[0, 1].map((i) => <div key={i} className="kova-skeleton h-72 rounded-2xl" />)}
        </div>
      </div>
    );
  }
  if (!r) return <div className="kova-card p-8 text-center text-slate-400 text-sm">Sin datos de reportes.</div>;

  const totalSources = r.totalSources ?? r.sources.length;
  const hires6m = r.hires6m ?? r.hiresByMonth.reduce((a, b) => a + b.hires, 0);
  const activeConsultants = r.activeConsultants ?? r.byConsultant.length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Reportes"
          subtitle="Business intelligence del proceso de reclutamiento."
          icon={BarChart3}
          accent="#F3E8FF"
          tone="#7C3AED"
        />
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportExcel}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 transition-all disabled:opacity-60"
            >
              {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
              {exporting ? 'Generando Excel...' : 'Exportar Excel'}
            </button>
            <button
              type="button"
              onClick={() => typeof window !== 'undefined' && window.print()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white shadow-sm hover:-translate-y-0.5 transition-all"
              style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}
            >
              <Download className="w-3.5 h-3.5" /> Exportar PDF
            </button>
          </div>
          {exportError ? <p className="text-xs text-red-500">{exportError}</p> : null}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={Clock} tint="#F3E8FF" tone="#7C3AED"
          label="Tiempo prom. contratación"
          value={`${r.avgTimeToHire}`} unit="días"
          delta={r.avgTimeToHireDelta} deltaGoodWhenNegative
          series={r.avgTimePerStage.map((s) => s.days)} color="#7C3AED"
        />
        <KpiCard
          icon={TrendingUp} tint="#E6FAF3" tone="var(--kova-green)"
          label="Contrataciones (6M)"
          value={`${hires6m}`}
          delta={r.hires6mDelta}
          series={r.hiresByMonth.map((m) => m.hires)} color="var(--kova-green)"
        />
        <KpiCard
          icon={Users} tint="#EEF2FA" tone="var(--kova-blue)"
          label="Consultores activos"
          value={`${activeConsultants}`}
          delta={r.activeConsultantsDelta} deltaSuffix=" vs período anterior"
          series={r.byConsultant.map((c) => c.hires)} color="var(--kova-blue)"
        />
        <KpiCard
          icon={Radar} tint="#FFF7E6" tone="#B7791F"
          label="Fuentes de candidatos"
          value={`${totalSources}`}
          deltaLabel="↑ 1 nueva fuente"
          series={r.sources.map((s) => s.count)} color="#F59E0B"
        />
      </div>

      {/* Fila 2 */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Tiempo por etapa */}
        <div className="kova-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading font-bold text-sm inline-flex items-center gap-1.5" style={{ color: 'var(--kova-navy)' }}>
              Tiempo promedio por etapa <Info className="w-3.5 h-3.5 text-slate-300" />
            </h3>
            <span className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500 inline-flex items-center gap-1">
              Días promedio <ChevronDown className="w-3 h-3" />
            </span>
          </div>
          <StageBarChart data={r.avgTimePerStage} />
        </div>

        {/* Fuentes */}
        <div className="kova-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading font-bold text-sm inline-flex items-center gap-1.5" style={{ color: 'var(--kova-navy)' }}>
              Fuentes de candidatos <Info className="w-3.5 h-3.5 text-slate-300" />
            </h3>
            <span className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500 inline-flex items-center gap-1">
              Porcentaje <ChevronDown className="w-3 h-3" />
            </span>
          </div>
          <SourcesDonut sources={r.sources} />
        </div>
      </div>

      {/* Fila 3 */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Contrataciones por mes */}
        <div className="kova-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading font-bold text-sm inline-flex items-center gap-1.5" style={{ color: 'var(--kova-navy)' }}>
              Contrataciones por mes <Info className="w-3.5 h-3.5 text-slate-300" />
            </h3>
            <span className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500 inline-flex items-center gap-1">
              Últimos 6 meses <ChevronDown className="w-3 h-3" />
            </span>
          </div>
          <LineChart data={r.hiresByMonth} />
        </div>

        {/* Desempeño por consultor */}
        <div className="kova-card p-6">
          <h3 className="font-heading font-bold text-sm mb-4 inline-flex items-center gap-1.5" style={{ color: 'var(--kova-navy)' }}>
            Desempeño por consultor <Info className="w-3.5 h-3.5 text-slate-300" />
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[420px]">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                  <th className="py-2 font-semibold">Consultor</th>
                  <th className="py-2 font-semibold text-center">Vacantes</th>
                  <th className="py-2 font-semibold text-center">Candidatos</th>
                  <th className="py-2 font-semibold text-center">Contrataciones</th>
                  <th className="py-2 font-semibold text-right">Tasa éxito</th>
                </tr>
              </thead>
              <tbody>
                {r.byConsultant.map((c) => {
                  const rate = c.successRate ?? (c.vacancies ? Math.round((c.hires / c.vacancies) * 100) : 0);
                  return (
                    <tr key={c.name} className="border-b border-slate-50 last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}>
                            {initials(c.name)}
                          </span>
                          <span className="font-medium truncate" style={{ color: 'var(--kova-navy)' }}>{c.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-center text-slate-600">{c.vacancies}</td>
                      <td className="py-3 text-center text-slate-600">{c.candidates ?? '-'}</td>
                      <td className="py-3 text-center text-slate-600">{c.hires}</td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-semibold text-xs" style={{ color: 'var(--kova-navy)' }}>{rate}%</span>
                          <div className="w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${rate}%`, background: 'var(--kova-green)' }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-2xl px-5 py-3.5 flex items-center justify-center gap-2 text-xs text-slate-500" style={{ background: '#F3E8FF' }}>
        <Radar className="w-3.5 h-3.5" style={{ color: '#7C3AED' }} />
        Los datos se actualizan diariamente a las 02:00 AM · Fuente: Kova Talent OS
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, tint, tone, label, value, unit, delta, deltaLabel, deltaSuffix, deltaGoodWhenNegative, series, color }: {
  icon: typeof Clock; tint: string; tone: string; label: string; value: string; unit?: string;
  delta?: number; deltaLabel?: string; deltaSuffix?: string; deltaGoodWhenNegative?: boolean;
  series: number[]; color: string;
}) {
  const positive = delta != null ? (deltaGoodWhenNegative ? delta <= 0 : delta >= 0) : true;
  const TrendIcon = delta != null && delta < 0 ? TrendingDown : TrendingUp;

  return (
    <div className="kova-card kova-card-hover p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: tint }}>
          <Icon className="w-4 h-4" style={{ color: tone }} />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 leading-tight">{label}</span>
      </div>
      <p className="font-heading text-3xl font-bold leading-none" style={{ color: 'var(--kova-navy)' }}>
        {value}{unit && <span className="text-base font-normal text-slate-400 ml-1">{unit}</span>}
      </p>
      <div className="mt-1.5 min-h-[16px]">
        {deltaLabel ? (
          <span className="text-[11px] font-medium text-green-600">{deltaLabel}</span>
        ) : delta != null ? (
          <span className={`text-[11px] font-medium inline-flex items-center gap-0.5 ${positive ? 'text-green-600' : 'text-red-500'}`}>
            <TrendIcon className="w-3 h-3" /> {delta > 0 ? '+' : ''}{delta}% {deltaSuffix ?? 'vs período anterior'}
          </span>
        ) : null}
      </div>
      <div className="mt-3">
        <AreaSparkline points={series} color={color} />
      </div>
    </div>
  );
}

function AreaSparkline({ points, color }: { points: number[]; color: string }) {
  if (points.length < 2) return <div className="h-10" />;
  const w = 240, h = 40, pad = 2;
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const coords = points.map((p, i) => {
    const x = pad + (i / (points.length - 1)) * (w - pad * 2);
    const y = h - pad - ((p - min) / range) * (h - pad * 2);
    return { x, y };
  });
  const line = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const area = `${line} L${coords[coords.length - 1].x.toFixed(1)},${h} L${coords[0].x.toFixed(1)},${h} Z`;
  const gid = `spark-${color.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-10">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function StageBarChart({ data }: { data: { stage: string; days: number }[] }) {
  const max = Math.max(...data.map((d) => d.days), 1);
  const ticks = 4;
  const top = Math.ceil(max / ticks) * ticks;

  return (
    <div className="flex gap-2">
      <div className="flex flex-col justify-between text-[10px] text-slate-400 pb-6 pr-1" style={{ height: 180 }}>
        {Array.from({ length: ticks + 1 }).map((_, i) => (
          <span key={i}>{top - (top / ticks) * i}</span>
        ))}
      </div>
      <div className="flex-1 flex items-end justify-between gap-2" style={{ height: 180 }}>
        {data.map((d) => (
          <div key={d.stage} className="flex-1 flex flex-col items-center justify-end h-full">
            <span className="text-xs font-bold mb-1" style={{ color: 'var(--kova-navy)' }}>{d.days}</span>
            <div
              className="w-full max-w-[36px] rounded-t-md transition-all"
              style={{ height: `${(d.days / top) * 140}px`, background: 'linear-gradient(180deg, #8B5CF6, #7C3AED)' }}
            />
            <span className="text-[9px] text-slate-400 mt-2 text-center leading-tight h-6">{d.stage}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SourcesDonut({ sources }: { sources: { source: string; count: number }[] }) {
  const total = sources.reduce((s, x) => s + x.count, 0) || 1;
  let cumulative = 0;
  const segments = sources.map((s, i) => {
    const pct = (s.count / total) * 100;
    const start = cumulative;
    cumulative += pct;
    return { ...s, pct, start, color: SOURCE_COLORS[i % SOURCE_COLORS.length] };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-36 h-36 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EEF1F6" strokeWidth="3.5" />
          {segments.map((seg) => (
            <circle key={seg.source} cx="18" cy="18" r="15.9" fill="none"
              stroke={seg.color} strokeWidth="3.5"
              strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
              strokeDashoffset={-seg.start}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading font-bold text-xl" style={{ color: 'var(--kova-navy)' }}>{total}</span>
          <span className="text-[9px] text-slate-400">Total</span>
          <span className="text-[9px] text-slate-400">Total candidatos</span>
        </div>
      </div>
      <div className="flex-1 w-full space-y-2.5">
        {segments.map((seg) => (
          <div key={seg.source} className="flex items-center gap-2 text-sm">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
            <span className="text-slate-600 flex-1 truncate">{seg.source}</span>
            <span className="text-slate-400 text-xs w-10 text-right">{Math.round(seg.pct)}%</span>
            <span className="font-semibold text-xs w-8 text-right" style={{ color: 'var(--kova-navy)' }}>{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChart({ data }: { data: { month: string; hires: number }[] }) {
  if (data.length < 2) return <div className="h-48 flex items-center justify-center text-sm text-slate-400">Sin datos suficientes.</div>;
  const w = 480, h = 180, padX = 24, padY = 24;
  const max = Math.max(...data.map((d) => d.hires), 1);
  const top = Math.ceil(max / 10) * 10;
  const coords = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * (w - padX * 2);
    const y = h - padY - (d.hires / top) * (h - padY * 2);
    return { x, y, ...d };
  });
  const line = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const area = `${line} L${coords[coords.length - 1].x.toFixed(1)},${h - padY} L${coords[0].x.toFixed(1)},${h - padY} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 200 }}>
      <defs>
        <linearGradient id="hires-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = padY + t * (h - padY * 2);
        return <line key={t} x1={padX} y1={y} x2={w - padX} y2={y} stroke="#EEF1F6" strokeWidth="1" />;
      })}
      <path d={area} fill="url(#hires-area)" />
      <path d={line} fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((c) => (
        <g key={c.month}>
          <circle cx={c.x} cy={c.y} r="4" fill="#fff" stroke="#7C3AED" strokeWidth="2.5" />
          <text x={c.x} y={c.y - 10} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 11, fontWeight: 700 }}>{c.hires}</text>
          <text x={c.x} y={h - 6} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10 }}>{c.month}</text>
        </g>
      ))}
    </svg>
  );
}
