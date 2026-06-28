import { Shield, Target, FileCheck, Users } from 'lucide-react';
import { BRAND, KOVA } from '@/theme/kovaPalette';

const items = [
  { icon: Target, label: 'Talento ideal por vacante', desc: 'Perfil y competencias alineadas al rol' },
  { icon: FileCheck, label: 'Recomendación argumentada', desc: 'Informe para decidir con criterio' },
  { icon: Users, label: 'Acompañamiento especializado', desc: 'Un consultor conduce su vacante' },
  { icon: Shield, label: 'Datos confidenciales', desc: 'Información tratada con reserva' },
];

export default function TrustBar() {
  return (
    <section className="border-y bg-white" style={{ borderColor: KOVA.border }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3.5">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: KOVA.surface, border: `1px solid ${KOVA.border}` }}
              >
                <Icon className="w-[18px] h-[18px]" style={{ color: BRAND.blue }} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-semibold leading-snug" style={{ color: BRAND.navy }}>{label}</p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: KOVA.muted }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
