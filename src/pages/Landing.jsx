import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AccesoAnticipado from '@/components/landing/AccesoAnticipado';
import SocialProof from '@/components/landing/SocialProof';
import LogosStrip from '@/components/landing/LogosStrip';
import CtaBand from '@/components/landing/CtaBand';
import SectionReveal from '@/components/landing/SectionReveal';
import Hero from '@/components/validate/Hero';
import Problema from '@/components/validate/Problema';
import Filosofia from '@/components/validate/Filosofia';
import ComoFunciona from '@/components/validate/ComoFunciona';
import Entregable from '@/components/validate/Entregable';
import Diferenciales from '@/components/validate/Diferenciales';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <LogosStrip />
      <SectionReveal><Problema /></SectionReveal>
      <SectionReveal delay={50}><Filosofia /></SectionReveal>
      <SectionReveal delay={50}><ComoFunciona /></SectionReveal>
      <SectionReveal delay={50}><Entregable /></SectionReveal>
      <SectionReveal delay={50}><Diferenciales /></SectionReveal>
      <CtaBand />
      <SectionReveal delay={50}><SocialProof /></SectionReveal>
      <AccesoAnticipado />
      <Footer />
    </div>
  );
}
