import React from 'react';
import { CheckCircle, X } from 'lucide-react';

const noSomos = [
  'Una bolsa de empleo o portal de vacantes.',
  'Una agencia de RRHH generalista.',
  'Una consultora que entrega reportes sin acompañamiento.',
  'Un proveedor de capacitaciones genéricas.',
];

const siSomos = [
  'Una firma de headhunting especializada en perfiles comerciales, gerenciales y directivos.',
  'Un equipo de consultores con experiencia real en liderazgo y desarrollo comercial.',
  'Un aliado estratégico que opera, no solo recomienda.',
  'La firma que integra talento, consultoría, marketing y coaching en un solo servicio.',
];

export default function QuienesSomos() {
  return (
    <section className="py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{color: '#0BB5E0'}}>Quiénes Somos</p>
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-foreground leading-[1.1] mb-5">
            Somos la firma que más entiende el talento comercial en Latinoamérica.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Kova nació de la experiencia directa en selección, liderazgo y desarrollo de equipos comerciales. Sabemos lo que funciona porque lo hemos vivido desde adentro.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* No somos */}
          <div className="rounded-2xl border border-border p-8 bg-white">
            <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{color: '#94A3B8'}}>Lo que NO somos</p>
            <div className="space-y-3">
              {noSomos.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{background: '#F8FAFC', border: '1px solid #F1F5F9'}}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{background: '#FEE2E2'}}>
                    <X className="w-3 h-3" style={{color: '#EF4444'}} />
                  </div>
                  <span className="text-sm text-muted-foreground line-through">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sí somos */}
          <div className="rounded-2xl p-8" style={{background: 'linear-gradient(150deg, #0A1628 0%, #0B2240 100%)', border: '1px solid rgba(11,181,224,0.25)'}}>
            <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{color: '#10B981'}}>Lo que SÍ somos</p>
            <div className="space-y-3">
              {siSomos.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)'}}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{background: 'rgba(168,195,176,0.2)'}}>
                    <CheckCircle className="w-3 h-3" style={{color: '#10B981'}} />
                  </div>
                  <span className="text-sm font-medium text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl p-8 text-center border border-border">
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
            Después de años en procesos de selección, liderazgo y desarrollo comercial, creamos Kova para que las empresas tengan acceso a{' '}
            <span className="text-foreground font-bold">talento, consultoría y estrategia comercial de verdad</span>, sin intermediarios genéricos.
          </p>
        </div>
      </div>
    </section>
  );
}