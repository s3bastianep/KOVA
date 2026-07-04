'use client';

import { use, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  ArrowLeft, Building2, Mail, Phone, Globe, MapPin, User, Pencil,
  PlayCircle, Loader2, PauseCircle, CheckCircle2, Archive, Plus,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { ProcessCard } from '@/components/proceso/ProcessCard';
import { countProcessesByBucket, getProcessBucket, PROCESS_BUCKET_META, type ProcessBucket } from '@/lib/process-status';
import type { ProcessPipelineMetrics } from '@/lib/process-metrics';

type Company = {
  id: string;
  name: string;
  sector?: string;
  industry?: string;
  city?: string;
  address?: string;
  website?: string;
  status: string;
  email?: string;
  phone?: string;
  primaryContact?: string;
  commercialDir?: string;
  consultants?: { consultant: { firstName: string; lastName: string; email: string } }[];
  vacancies?: {
    id: string;
    title: string;
    status: string;
    requiredDate?: string;
    createdAt?: string;
    _count?: { candidates: number };
    pipelineMetrics?: ProcessPipelineMetrics;
  }[];
  activities?: { id: string; description: string; createdAt: string }[];
  discoveries?: { step2Data?: Record<string, string> | null }[];
};

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm" style={{ color: 'var(--kova-navy)' }}>{value ?? '-'}</p>
      </div>
    </div>
  );
}

type SolicitudFilter = 'all' | ProcessBucket;

function SolicitudStatCard({
  icon: Icon,
  value,
  bucket,
  active,
  onSelect,
}: {
  icon: typeof PlayCircle;
  value: number;
  bucket: ProcessBucket;
  active: boolean;
  onSelect: (bucket: SolicitudFilter) => void;
}) {
  const meta = PROCESS_BUCKET_META[bucket];
  return (
    <button
      type="button"
      onClick={() => onSelect(bucket)}
      className={`kova-card kova-card-hover p-3 flex items-center gap-2.5 text-left w-full transition-all ${active ? 'ring-2 ring-[var(--kova-blue)] ring-offset-1' : ''}`}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: meta.tint }}>
        <Icon className="w-4 h-4" style={{ color: meta.tone }} />
      </div>
      <div className="min-w-0">
        <p className="font-heading font-bold text-xl leading-none" style={{ color: 'var(--kova-navy)' }}>{value}</p>
        <p className="text-[10px] font-medium text-slate-600 mt-1 truncate">{meta.label}</p>
      </div>
    </button>
  );
}

export default function EmpresaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['company', id],
    queryFn: () => dashboardApi.company(id),
  });

  const company = data as Company | undefined;
  const discovery = company?.discoveries?.[0]?.step2Data ?? null;
  const solicitudes = company?.vacancies ?? [];
  const [solicitudFilter, setSolicitudFilter] = useState<SolicitudFilter>('all');

  const solicitudStats = useMemo(() => countProcessesByBucket(solicitudes), [solicitudes]);
  const filteredSolicitudes = useMemo(() => {
    if (solicitudFilter === 'all') return solicitudes;
    return solicitudes.filter((v) => getProcessBucket(v.status) === solicitudFilter);
  }, [solicitudes, solicitudFilter]);

  return (
    <div className="space-y-6">
      <Link href="/clientes" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" /> Volver a clientes
      </Link>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : isError || !company ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No se pudo cargar la empresa.</div>
      ) : (
        <>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FA' }}>
              <Building2 className="w-7 h-7" style={{ color: 'var(--kova-blue)' }} />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>{company.name}</h1>
              <p className="text-sm text-slate-500">{company.sector ?? '-'} · {company.industry ?? '-'}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Link
                href={`/empresas/${id}/editar`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Pencil className="w-4 h-4" /> Editar
              </Link>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-100">{company.status}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="kova-card p-6 space-y-4 lg:col-span-1">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500">Información general</h2>
                <Link href={`/empresas/${id}/editar`} className="text-xs font-semibold text-[var(--kova-blue)] hover:underline">
                  Editar
                </Link>
              </div>
              <InfoRow icon={MapPin} label="Ciudad" value={company.city} />
              <InfoRow icon={MapPin} label="Dirección" value={company.address} />
              <InfoRow icon={Globe} label="Sitio web" value={company.website} />
              <InfoRow icon={Mail} label="Correo" value={company.email} />
              <InfoRow icon={Phone} label="Teléfono" value={company.phone} />
              <InfoRow icon={User} label="Contacto principal" value={company.primaryContact} />
              <InfoRow icon={User} label="Director comercial" value={company.commercialDir} />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="kova-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500">Discovery comercial</h2>
                  <Link href={`/empresas/${id}/editar`} className="text-xs font-semibold text-[var(--kova-blue)] hover:underline">
                    Editar discovery
                  </Link>
                </div>
                {discovery ? (
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <InfoRow icon={Building2} label="¿Qué vende?" value={discovery.whatSells} />
                    <InfoRow icon={Building2} label="¿Cuánto vende?" value={discovery.revenue} />
                    <InfoRow icon={Building2} label="¿Cómo vende?" value={discovery.howSells} />
                    <InfoRow icon={Building2} label="Mercado" value={discovery.market} />
                    <InfoRow icon={Building2} label="Competidores" value={discovery.competitors} />
                    <InfoRow icon={Building2} label="Modelo comercial" value={discovery.commercialModel} />
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Sin discovery registrado. Completa la información comercial del cliente.</p>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500">Solicitudes de búsqueda</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {solicitudes.length} solicitud{solicitudes.length === 1 ? '' : 'es'} registrada{solicitudes.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <Link
                    href={`/procesos/nuevo?cliente=${id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}
                  >
                    <Plus className="w-3.5 h-3.5" /> Nueva solicitud
                  </Link>
                </div>

                {solicitudes.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5 mb-4">
                      <SolicitudStatCard
                        icon={PlayCircle}
                        value={solicitudStats.active}
                        bucket="active"
                        active={solicitudFilter === 'active'}
                        onSelect={setSolicitudFilter}
                      />
                      <SolicitudStatCard
                        icon={Loader2}
                        value={solicitudStats.review}
                        bucket="review"
                        active={solicitudFilter === 'review'}
                        onSelect={setSolicitudFilter}
                      />
                      <SolicitudStatCard
                        icon={PauseCircle}
                        value={solicitudStats.paused}
                        bucket="paused"
                        active={solicitudFilter === 'paused'}
                        onSelect={setSolicitudFilter}
                      />
                      <SolicitudStatCard
                        icon={CheckCircle2}
                        value={solicitudStats.closed}
                        bucket="closed"
                        active={solicitudFilter === 'closed'}
                        onSelect={setSolicitudFilter}
                      />
                      <SolicitudStatCard
                        icon={Archive}
                        value={solicitudStats.archived}
                        bucket="archived"
                        active={solicitudFilter === 'archived'}
                        onSelect={setSolicitudFilter}
                      />
                    </div>

                    {solicitudFilter !== 'all' && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-slate-500">
                          Filtrando: {PROCESS_BUCKET_META[solicitudFilter].label}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSolicitudFilter('all')}
                          className="text-xs font-semibold text-[var(--kova-blue)] hover:underline"
                        >
                          Ver todas
                        </button>
                      </div>
                    )}

                    {filteredSolicitudes.length ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {filteredSolicitudes.map((v) => (
                          <ProcessCard
                            key={v.id}
                            id={v.id}
                            title={v.title}
                            status={v.status}
                            statusMode="bucket"
                            companyName={company.name}
                            companyId={company.id}
                            pipelineMetrics={v.pipelineMetrics}
                            dueDate={v.requiredDate}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">No hay solicitudes en este estado.</p>
                    )}
                  </>
                ) : (
                  <div className="kova-card p-8 text-center">
                    <p className="text-sm text-slate-400 mb-3">Sin solicitudes registradas para este cliente.</p>
                    <Link href={`/procesos/nuevo?cliente=${id}`} className="text-sm font-medium" style={{ color: 'var(--kova-blue)' }}>
                      Crear primera solicitud →
                    </Link>
                  </div>
                )}
              </div>

              <div className="kova-card p-6">
                <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-4">Actividad reciente</h2>
                {company.activities?.length ? (
                  <ul className="space-y-3">
                    {company.activities.map((a) => (
                      <li key={a.id} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: 'var(--kova-blue)' }} />
                        <div>
                          <p className="text-sm" style={{ color: 'var(--kova-navy)' }}>{a.description}</p>
                          <p className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleDateString()}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400">Sin actividad registrada.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
