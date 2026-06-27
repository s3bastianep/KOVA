import { ArrowRight } from 'lucide-react';

export default function CtaDiagnostico() {
  const scrollToAcceso = () => document.getElementById('acceso')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="py-16 lg:py-20 px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #4338CA 0%, #3730A3 100%)' }}>
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: '#C7D2FE' }}>
          Próximo paso
        </p>
        <h2
          className="font-heading font-bold text-white mb-4"
          style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', letterSpacing: '-0.025em', lineHeight: 1.2 }}
        >
          Cuéntanos tu vacante. Te respondemos con un plan claro.
        </h2>
        <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
          Diagnóstico comercial sin costo. Un especialista revisa tu caso y te contacta en 24 horas hábiles.
        </p>
        <button
          type="button"
          onClick={scrollToAcceso}
          className="group inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-xl text-sm transition-all hover:opacity-95"
          style={{ background: '#FFFFFF', color: '#4338CA', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
        >
          Agendar diagnóstico comercial
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
}
