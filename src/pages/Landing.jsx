import { lazy, Suspense } from 'react';
import SiteLayout from '@/components/landing/SiteLayout';
import Hero from '@/components/validate/Hero';
import LazyWhenVisible from '@/components/validate/LazyWhenVisible';
import { usePageMeta } from '@/hooks/usePageMeta';

const SignalStrip = lazy(() => import('@/components/validate/SignalStrip'));
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

        <LazyWhenVisible minHeight="7rem">
          <Suspense fallback={null}>
            <SignalStrip />
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight="28rem">
          <Suspense fallback={null}>
            <div className="kv-page-band kv-page-band--light">
              <Problema />
            </div>
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight="24rem">
          <Suspense fallback={null}>
            <div className="kv-page-band kv-page-band--dark">
              <SolucionSection />
            </div>
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

        <LazyWhenVisible minHeight="14rem">
          <Suspense fallback={null}>
            <CierreLanding />
          </Suspense>
        </LazyWhenVisible>
      </main>
    </SiteLayout>
  );
}
