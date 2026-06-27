import React from 'react';
import { Compass, Globe } from 'lucide-react';

const visionItems = [
  'Las empresas contraten mejor, capaciten mejor y gestionen mejor.',
  'Los profesionales demuestren habilidades con evidencia real.',
  'Las habilidades comerciales se midan de forma objetiva.',
  'La contratación y el desarrollo sean más eficientes y basados en datos.',
  'El conocimiento organizacional se preserve y transfiera de forma sistemática.',
];

export default function MisionVision() {
  return (
    <section className="py-28 px-6" style={{background: '#F5F7FA'}}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <p className="text-brand text-xs font-bold uppercase tracking-widest mb-5">Propósito</p>
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-foreground leading-[1.1]">
            Por qué existimos.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Misión */}
          <div className="rounded-2xl overflow-hidden" style={{background: 'linear-gradient(150deg, #1E3A5F 0%, #2D5490 100%)'}}>
            <div className="p-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6" style={{background: 'rgba(255,255,255,0.12)'}}>
                <Compass className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color: '#A8C3B0'}}>Nuestra Misión</p>
              <h3 className="font-heading font-bold text-xl text-white mb-4 leading-snug">
                Ayudar a las empresas a construir equipos comerciales de alto desempeño mediante evaluación, estandarización, capacitación y tecnología.
              </h3>
              <p className="text-sm leading-relaxed mb-6" style={{color: 'rgba(255,255,255,0.6)'}}>
                No buscamos solo mejorar la contratación. Buscamos transformar la forma en que las organizaciones construyen, desarrollan y escalan sus áreas comerciales.
              </p>
              <div className="rounded-xl p-5" style={{background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)'}}>
                <p className="text-sm leading-relaxed italic" style={{color: 'rgba(255,255,255,0.7)'}}>
                  "Construir sistemas comerciales repetibles y escalables es el mayor diferenciador de las empresas que lideran su mercado."
                </p>
              </div>
            </div>
          </div>

          {/* Visión */}
          <div className="rounded-2xl border border-border bg-white p-8">
            <div className="w-10 h-10 rounded-xl bg-brand/8 flex items-center justify-center mb-6">
              <Globe className="w-5 h-5 text-brand" />
            </div>
            <p className="text-brand text-xs font-bold uppercase tracking-widest mb-3">Nuestra Visión</p>
            <h3 className="font-heading font-bold text-xl text-foreground mb-5 leading-snug">
              Convertirnos en el estándar de talento y excelencia comercial para Latinoamérica.
            </h3>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-5">Queremos un mundo donde:</p>
            <ul className="space-y-3.5">
              {visionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{background: '#EBF1F9'}}>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand block" />
                  </span>
                  <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}