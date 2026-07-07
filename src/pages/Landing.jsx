import SiteLayout from '@/components/landing/SiteLayout';
import Hero from '@/components/validate/Hero';
import SignalStrip from '@/components/validate/SignalStrip';
import Problema from '@/components/validate/Problema';
import SolucionSection from '@/components/validate/SolucionSection';
import MetodologiaSection from '@/components/validate/MetodologiaSection';
import ComparacionSection from '@/components/validate/ComparacionSection';
import CierreLanding from '@/components/validate/CierreLanding';

export default function Landing() {
  return (
    <SiteLayout>
      <main>
        <Hero />
        <SignalStrip />

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
      </main>
    </SiteLayout>
  );
}
