'use client';

import { useQuery } from '@tanstack/react-query';
import { FileText, Download } from 'lucide-react';
import { dashboardApi } from '@/lib/api';

type Doc = { id: string; name: string; type: string; company: string; size: string; date: string };

export default function DocumentosPage() {
  const { data, isLoading } = useQuery({ queryKey: ['documents'], queryFn: dashboardApi.documents });
  const docs = (data as Doc[]) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Documentos</h1>
        <p className="text-sm text-slate-500">Hojas de vida, informes y contratos.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : docs.length === 0 ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No hay documentos cargados.</div>
      ) : (
        <div className="kova-card overflow-hidden">
          {docs.map((d) => (
            <div key={d.id} className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#EEF2FA' }}>
                <FileText className="w-5 h-5" style={{ color: 'var(--kova-blue)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--kova-navy)' }}>{d.name}</p>
                <p className="text-xs text-slate-400">{d.type} · {d.company} · {d.size}</p>
              </div>
              <span className="text-xs text-slate-400">{new Date(d.date).toLocaleDateString()}</span>
              <button className="text-slate-400 hover:text-slate-600"><Download className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
