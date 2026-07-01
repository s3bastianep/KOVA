import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AccesoAnticipado from '@/components/landing/AccesoAnticipado';
import RolesComerciales from '@/components/validate/RolesComerciales';
import FinalCta from '@/components/validate/FinalCta';
import ImpactStats from '@/components/validate/ImpactStats';
import SectionReveal from '@/components/landing/SectionReveal';
import Hero from '@/components/validate/Hero';
import HeroCapabilities from '@/components/validate/HeroCapabilities';
import Problema from '@/components/validate/Problema';
import StickyCta from '@/components/validate/StickyCta';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:pb-0">
      <Navbar />
      <StickyCta />
      <Hero />
      <SectionReveal><Problema /></SectionReveal>
      <SectionReveal delay={40}><HeroCapabilities /></SectionReveal>
      <SectionReveal delay={40}><ImpactStats /></SectionReveal>
      <SectionReveal delay={40}><AccesoAnticipado /></SectionReveal>
      <SectionReveal delay={40}><RolesComerciales /></SectionReveal>
      <SectionReveal delay={40}><FinalCta /></SectionReveal>
      <Footer />
    </div>
  );
}
