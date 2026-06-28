import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AccesoAnticipado from '@/components/landing/AccesoAnticipado';
import ImpactStats from '@/components/validate/ImpactStats';
import SectionReveal from '@/components/landing/SectionReveal';
import Hero from '@/components/validate/Hero';
import HeroCapabilities from '@/components/validate/HeroCapabilities';
import LandingFaq from '@/components/validate/LandingFaq';
import StickyCta from '@/components/validate/StickyCta';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <StickyCta />
      <Hero />
      <SectionReveal><HeroCapabilities /></SectionReveal>
      <SectionReveal delay={40}><ImpactStats /></SectionReveal>
      <SectionReveal delay={40}><AccesoAnticipado /></SectionReveal>
      <SectionReveal delay={50}><LandingFaq /></SectionReveal>
      <Footer />
    </div>
  );
}
