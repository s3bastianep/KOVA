'use client';

import { useQuery } from '@tanstack/react-query';
import { FileText, Download } from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { PageHeader } from '@/components/layout/PageHeader';

type Doc = { id: string; name: string; type: string; company: string; size: string; date: string };

export default function DocumentosPage() {
  const { data, isLoading } = useQuery({ queryKey: ['documents'], queryFn: dashboardApi.documents });
  const docs = (data as Doc[]) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documentos"
        subtitle="Hojas de vida, informes y contratos."
        icon={FileText}
      />

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : docs.length === 0 ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No hay documentos cargados.</div>
      ) : (
        <div className="kova-card overflow-hidden divide-y divide-slate-50">
          {docs.map((d) => (
            <div key={d.id} className="flex items-center gap-4 p-4 hover:bg-slate-50/60 transition-colors group">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EEF2FA' }}>
                <FileText className="w-5 h-5" style={{ color: 'var(--kova-blue)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--kova-navy)' }}>{d.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{d.type} · {d.company} · {d.size}</p>
              </div>
              <span className="text-xs text-slate-400 hidden sm:block">{new Date(d.date).toLocaleDateString()}</span>
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-[var(--kova-blue)] hover:bg-blue-50 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
