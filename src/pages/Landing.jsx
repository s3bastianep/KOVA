import { lazy, Suspense } from 'react';
import SiteLayout from '@/components/landing/SiteLayout';
import Hero from '@/components/validate/Hero';
import LazyWhenVisible from '@/components/validate/LazyWhenVisible';
import { usePageMeta } from '@/hooks/usePageMeta';

const SignalStrip = lazy(() => import('@/components/validate/SignalStrip'));
const PosicionamientoSection = lazy(() => import('@/components/validate/PosicionamientoSection'));
const Problema = lazy(() => import('@/components/validate/Problema'));
const DirectorComercialSection = lazy(() => import('@/components/validate/DirectorComercialSection'));
const SolucionSection = lazy(() => import('@/components/validate/SolucionSection'));
const CasosSection = lazy(() => import('@/components/validate/CasosSection'));
const MetodologiaSection = lazy(() => import('@/components/validate/MetodologiaSection'));
const ComparacionSection = lazy(() => import('@/components/validate/ComparacionSection'));
const MisionSection = lazy(() => import('@/components/validate/MisionSection'));
const TestimoniosWaveSection = lazy(() => import('@/components/validate/TestimoniosWaveSection'));
const CierreLanding = lazy(() => import('@/components/validate/CierreLanding'));

export default function Landing() {
  usePageMeta({
    title: 'Equipos comerciales B2B de alto impacto | Kova',
    description:
      'No llenamos vacantes. Construimos equipos comerciales que impulsan el crecimiento de empresas B2B en Latinoamérica.',
    path: '/',
  });

  return (
    <SiteLayout>
      <main>
        <Hero />

        <LazyWhenVisible minHeight="7rem">
          <Suspense fallback={null}>
            <SignalStrip />
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight="18rem">
          <Suspense fallback={null}>
            <div className="kv-page-band kv-page-band--dark">
              <PosicionamientoSection />
            </div>
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight="28rem">
          <Suspense fallback={null}>
            <div className="kv-page-band kv-page-band--light">
              <Problema />
            </div>
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight="20rem">
          <Suspense fallback={null}>
            <DirectorComercialSection />
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight="24rem">
          <Suspense fallback={null}>
            <div className="kv-page-band kv-page-band--dark">
              <SolucionSection />
            </div>
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight="14rem">
          <Suspense fallback={null}>
            <CasosSection />
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight="22rem">
          <Suspense fallback={null}>
            <div className="kv-page-band kv-page-band--light">
              <MetodologiaSection />
            </div>
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight="24rem">
          <Suspense fallback={null}>
            <ComparacionSection />
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight="16rem">
          <Suspense fallback={null}>
            <div className="kv-page-band kv-page-band--dark">
              <MisionSection />
            </div>
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight="18rem">
          <Suspense fallback={null}>
            <div className="kv-page-band kv-page-band--light">
              <TestimoniosWaveSection />
            </div>
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight="14rem">
          <Suspense fallback={null}>
            <CierreLanding />
          </Suspense>
        </LazyWhenVisible>
      </main>
    </SiteLayout>
  );
}
