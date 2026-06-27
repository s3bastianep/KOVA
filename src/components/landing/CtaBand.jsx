import { ArrowRight } from 'lucide-react';

export default function CtaBand() {
  const scrollToAcceso = () => document.getElementById('acceso')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="py-16 px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-heading font-black text-[clamp(1.5rem,2.5vw,2rem)] leading-tight tracking-[-0.02em] text-white mb-4">
          ¿Listo para contratar con más precisión?
        </h2>
        <p className="text-sm text-white/75 mb-8 max-w-lg mx-auto leading-relaxed">
          Cuéntanos tu vacante comercial y te mostramos cómo evaluamos talento con criterio, método y evidencia.
        </p>
        <button
          onClick={scrollToAcceso}
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: '#FFFFFF', color: '#4F46E5', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
        >
          Cuéntanos tu vacante
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
}
