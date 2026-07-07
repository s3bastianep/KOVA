import { lazy, Suspense } from 'react';
import SiteLayout from '@/components/landing/SiteLayout';
import Hero from '@/components/validate/Hero';
import SignalStrip from '@/components/validate/SignalStrip';

const Problema = lazy(() => import('@/components/validate/Problema'));
const SolucionSection = lazy(() => import('@/components/validate/SolucionSection'));
const MetodologiaSection = lazy(() => import('@/components/validate/MetodologiaSection'));
const ComparacionSection = lazy(() => import('@/components/validate/ComparacionSection'));
const CierreLanding = lazy(() => import('@/components/validate/CierreLanding'));

export default function Landing() {
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
