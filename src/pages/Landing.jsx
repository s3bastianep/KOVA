import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AccesoAnticipado from '@/components/landing/AccesoAnticipado';
import SocialProof from '@/components/landing/SocialProof';
import DemoSection from '@/components/landing/DemoSection';
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
      <Problema />
      <Filosofia />
      <ComoFunciona />
      <Entregable />
      <DemoSection />
      <Diferenciales />
      <SocialProof />
      <AccesoAnticipado />
      <Footer />
    </div>
  );
}
