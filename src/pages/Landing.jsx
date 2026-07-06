import SiteLayout from '@/components/landing/SiteLayout';
import Hero from '@/components/validate/Hero';
import SignalStrip from '@/components/validate/SignalStrip';
import Problema from '@/components/validate/Problema';
import SolucionSection from '@/components/validate/SolucionSection';
import MetodologiaSection from '@/components/validate/MetodologiaSection';
import SignatureQuoteSection from '@/components/validate/SignatureQuoteSection';
import StatsBand from '@/components/validate/StatsBand';
import StatsSection from '@/components/validate/StatsSection';
import FilosofiaSection from '@/components/validate/FilosofiaSection';
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
          <SolucionSection />
          <MetodologiaSection />
        </div>

        <SignatureQuoteSection />

        <div className="kv-page-band kv-page-band--dark">
          <StatsBand />
          <StatsSection />
        </div>

        <FilosofiaSection />
        <ComparacionSection />
        <CierreLanding />
      </main>
    </SiteLayout>
  );
}
