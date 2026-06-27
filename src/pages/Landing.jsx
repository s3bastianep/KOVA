import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AccesoAnticipado from '@/components/landing/AccesoAnticipado';
import TrustBar from '@/components/landing/TrustBar';
import SectionReveal from '@/components/landing/SectionReveal';
import Hero from '@/components/validate/Hero';
import Problema from '@/components/validate/Problema';
import CapacidadDemostrada from '@/components/validate/CapacidadDemostrada';
import MetodosEvaluacion from '@/components/validate/MetodosEvaluacion';
import EvidenciaFlujo from '@/components/validate/EvidenciaFlujo';
import ComoFunciona from '@/components/validate/ComoFunciona';
import Entregable from '@/components/validate/Entregable';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <TrustBar />
      <SectionReveal><Problema /></SectionReveal>
      <SectionReveal delay={50}><CapacidadDemostrada /></SectionReveal>
      <SectionReveal delay={50}><MetodosEvaluacion /></SectionReveal>
      <SectionReveal delay={50}><EvidenciaFlujo /></SectionReveal>
      <SectionReveal delay={50}><ComoFunciona /></SectionReveal>
      <SectionReveal delay={50}><Entregable /></SectionReveal>
      <AccesoAnticipado />
      <Footer />
    </div>
  );
}
