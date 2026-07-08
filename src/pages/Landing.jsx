import { lazy, Suspense } from 'react';
import SiteLayout from '@/components/landing/SiteLayout';
import Hero from '@/components/validate/Hero';
import SignalStrip from '@/components/validate/SignalStrip';
import { usePageMeta } from '@/hooks/usePageMeta';

const Problema = lazy(() => import('@/components/validate/Problema'));
const SolucionSection = lazy(() => import('@/components/validate/SolucionSection'));
const MetodologiaSection = lazy(() => import('@/components/validate/MetodologiaSection'));
const ComparacionSection = lazy(() => import('@/components/validate/ComparacionSection'));
const CierreLanding = lazy(() => import('@/components/validate/CierreLanding'));

export default function Landing() {
  usePageMeta({
    title: 'Reclutamiento especializado en talento comercial',
    description:
      'Contrate con mayor certeza, no solo con intuición. Especialistas en selección comercial con metodología por competencias.',
    path: '/',
  });

  return (
    <SiteLayout>
      <main>
        <Hero />
        <SignalStrip />

        <Suspense fallback={null}>
          <div className="kv-page-band kv-page-band--light">
            <Problema />
          </div>

          <div className="kv-page-band kv-page-band--dark">
            <SolucionSection />
          </div>

          <div className="kv-page-band kv-page-band--light">
            <MetodologiaSection />
          </div>

          <ComparacionSection />
          <CierreLanding />
        </Suspense>
      </main>
    </SiteLayout>
  );
}
