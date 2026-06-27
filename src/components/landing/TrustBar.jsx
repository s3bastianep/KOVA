import { Shield, Clock, Target, FileCheck } from 'lucide-react';

const items = [
  { icon: Target, label: 'Talento ideal por vacante', desc: 'Perfil y competencias alineadas al rol' },
  { icon: FileCheck, label: 'Recomendación argumentada', desc: 'Informe para decidir con criterio' },
  { icon: Clock, label: 'Respuesta en 48 horas', desc: 'Diagnóstico inicial sin costo' },
  { icon: Shield, label: 'Datos confidenciales', desc: 'Información tratada con reserva' },
];

export default function TrustBar() {
  return (
    <section className="border-y border-slate-200/80 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3.5">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
              >
                <Icon className="w-[18px] h-[18px]" style={{ color: '#4F46E5' }} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-semibold leading-snug" style={{ color: '#0F172A' }}>{label}</p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#64748B' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
