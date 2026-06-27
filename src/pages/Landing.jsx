import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AccesoAnticipado from '@/components/landing/AccesoAnticipado';
import TrustBar from '@/components/landing/TrustBar';
import SectionReveal from '@/components/landing/SectionReveal';
import Hero from '@/components/validate/Hero';
import Problema from '@/components/validate/Problema';
import CapacidadDemostrada from '@/components/validate/CapacidadDemostrada';
import ComoFunciona from '@/components/validate/ComoFunciona';
import Entregable from '@/components/validate/Entregable';
import SocialProof from '@/components/validate/SocialProof';
import StickyCta from '@/components/validate/StickyCta';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <StickyCta />
      <Hero />
      <TrustBar />
      <SectionReveal><Problema /></SectionReveal>
      <SectionReveal delay={50}><CapacidadDemostrada /></SectionReveal>
      <SectionReveal delay={50}><ComoFunciona /></SectionReveal>
      <SectionReveal delay={50}><Entregable /></SectionReveal>
      <SectionReveal delay={50}><SocialProof /></SectionReveal>
      <AccesoAnticipado />
      <Footer />
    </div>
  );
}
