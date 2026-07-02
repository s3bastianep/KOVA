'use client';

import { useQuery } from '@tanstack/react-query';
import { Phone, Mail, Users, MessageSquare } from 'lucide-react';
import { dashboardApi } from '@/lib/api';

type Interaction = { id: string; company: string; type: string; note: string; date: string; next?: string };

const typeIcon: Record<string, React.ElementType> = {
  Llamada: Phone,
  Correo: Mail,
  Reunión: Users,
  WhatsApp: MessageSquare,
};

export default function CrmPage() {
  const { data, isLoading } = useQuery({ queryKey: ['crm'], queryFn: dashboardApi.crm });
  const items = (data as Interaction[]) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>CRM Comercial</h1>
        <p className="text-sm text-slate-500">Seguimiento de interacciones con cada empresa.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : items.length === 0 ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No hay interacciones registradas.</div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => {
            const Icon = typeIcon[it.type] ?? MessageSquare;
            return (
              <div key={it.id} className="kova-card p-5 flex gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#EEF2FA' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--kova-blue)' }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--kova-navy)' }}>{it.company}</h3>
                    <span className="text-xs text-slate-400">{new Date(it.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{it.note}</p>
                  {it.next && <p className="text-xs mt-2" style={{ color: 'var(--kova-blue)' }}>Próximo paso: {it.next}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
