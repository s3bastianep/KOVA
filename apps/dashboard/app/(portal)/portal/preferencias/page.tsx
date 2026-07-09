'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { PortalPreferenciasWizard } from '@/components/portal/PortalPreferenciasWizard';
import type { PreferenciasBlock } from '@/lib/portal-preferencias-wizard';

function PreferenciasPageInner() {
  const params = useSearchParams();
  const fromOnboarding = params.get('from') === 'onboarding';
  const blockParam = params.get('block');
  const initialBlock =
    blockParam === 'buscas' || blockParam === 'vendes' || blockParam === 'cierras' ? blockParam : null;

  if (fromOnboarding && typeof window !== 'undefined') {
    window.location.replace('/portal');
    return (
      <div className="flex items-center justify-center py-24 text-[var(--kova-navy-muted)]">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Continuando onboarding...
      </div>
    );
  }

  return <PortalPreferenciasWizard fromOnboarding={false} initialBlock={initialBlock} />;
}

export default function PortalPreferenciasPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24 text-[var(--kova-navy-muted)]">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Cargando...
        </div>
      }
    >
      <PreferenciasPageInner />
    </Suspense>
  );
}
