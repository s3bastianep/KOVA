'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Building2, Mail, Phone, Globe, MapPin, User } from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { ProcessCard } from '@/components/proceso/ProcessCard';

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
  vacancies?: { id: string; title: string; status: string; _count?: { candidates: number } }[];
  activities?: { id: string; description: string; createdAt: string }[];
};

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm" style={{ color: 'var(--kova-navy)' }}>{value ?? '—'}</p>
      </div>
    </div>
  );
}

export default function EmpresaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['company', id],
    queryFn: () => dashboardApi.company(id),
  });

  const company = data as Company | undefined;

  return (
    <div className="space-y-6">
      <Link href="/empresas" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" /> Volver a empresas
      </Link>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : isError || !company ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No se pudo cargar la empresa.</div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FA' }}>
              <Building2 className="w-7 h-7" style={{ color: 'var(--kova-blue)' }} />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>{company.name}</h1>
              <p className="text-sm text-slate-500">{company.sector ?? '—'} · {company.industry ?? '—'}</p>
            </div>
            <span className="ml-auto inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-100">{company.status}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="kova-card p-6 space-y-4 lg:col-span-1">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500">Información general</h2>
              <InfoRow icon={MapPin} label="Ciudad" value={company.city} />
              <InfoRow icon={MapPin} label="Dirección" value={company.address} />
              <InfoRow icon={Globe} label="Sitio web" value={company.website} />
              <InfoRow icon={Mail} label="Correo" value={company.email} />
              <InfoRow icon={Phone} label="Teléfono" value={company.phone} />
              <InfoRow icon={User} label="Contacto principal" value={company.primaryContact} />
              <InfoRow icon={User} label="Director comercial" value={company.commercialDir} />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-4">Procesos activos</h2>
                {company.vacancies?.length ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {company.vacancies.map((v) => (
                      <ProcessCard
                        key={v.id}
                        id={v.id}
                        title={v.title}
                        status={v.status}
                        companyName={company.name}
                        candidatesCount={v._count?.candidates ?? 0}
                        interviewsCount={Math.min(v._count?.candidates ?? 0, 4)}
                        finalistsCount={v.status === 'FINALISTS' ? 2 : 0}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Sin procesos registrados.</p>
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
