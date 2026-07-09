'use client';

import dynamic from 'next/dynamic';

const RiskJarGame = dynamic(() => import('@/components/assessments/RiskJarGame').then((m) => m.RiskJarGame), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-16 text-sm text-[var(--kova-muted)]">
      Cargando prueba...
    </div>
  ),
});

export function PortalPruebaClient() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="kova-portal-eyebrow">Evaluaciones</p>
        <h1 className="kova-portal-title kova-portal-title-lg mt-2 font-heading">Evaluaciones</h1>
        <p className="kova-portal-body mt-2">
          Completa las evaluaciones asignadas para avanzar en tus procesos de selección.
        </p>
      </div>
      <div className="max-w-[440px]">
        <RiskJarGame />
      </div>
    </div>
  );
}
