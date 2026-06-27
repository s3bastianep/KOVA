import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import ElProblema from '@/components/landing/ElProblema';
import SocialProof from '@/components/landing/SocialProof';
import QueConstruimos from '@/components/landing/QueConstruimos';
import DemoSection from '@/components/landing/DemoSection';
import ComoFunciona from '@/components/landing/ComoFunciona';
import Beneficios from '@/components/landing/Beneficios';
import NuestraVision from '@/components/landing/NuestraVision';
import KovaVsMercado from '@/components/landing/KovaVsMercado';
import ImpactSection from '@/components/landing/ImpactSection';
import AccesoAnticipado from '@/components/landing/AccesoAnticipado';
import Footer from '@/components/landing/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ElProblema />
      <SocialProof />
      <KovaVsMercado />
      <QueConstruimos />
      <DemoSection />
      <ComoFunciona />
      <Beneficios />
      <ImpactSection />
      <NuestraVision />
      <AccesoAnticipado />
      <Footer />
    </div>
  );
}