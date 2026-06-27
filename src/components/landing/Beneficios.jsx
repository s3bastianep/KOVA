import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const items = [
  { titulo: 'Equipo reclutado con criterio', desc: 'Cada candidato pasa por pruebas psicotécnicas y entrevistas por competencias.', color: '#6366F1', bg: '#EEF2FF' },
  { titulo: 'Proceso de ventas documentado', desc: 'Un playbook que cualquier asesor puede seguir desde el primer día.', color: '#10B981', bg: '#ECFDF5' },
  { titulo: 'Productividad en menos de 4 semanas', desc: 'Los nuevos asesores llegan a velocidad de crucero mucho antes que lo habitual.', color: '#F59E0B', bg: '#FFFBEB' },
  { titulo: '94% de retención al año', desc: 'Contratar bien reduce la rotación. Un reemplazo cuesta entre 6 y 18 salarios.', color: '#0EA5E9', bg: '#F0F9FF' },
  { titulo: 'Sistema que escala sin caos', desc: 'Pasar de 5 a 20 asesores deja de ser un problema con proceso claro instalado.', color: '#8B5CF6', bg: '#F5F3FF' },
  { titulo: 'Todo en un solo proveedor', desc: 'Reclutamiento, evaluación, diseño y capacitación. Sin múltiples firmas ni fricciones.', color: '#EF4444', bg: '#FEF2F2' },
];

export default function Beneficios() {
  return (
    <section id="resultados" className="py-24 px-6 lg:px-8" style={{ background: '#FAFBFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-end mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#F59E0B', letterSpacing: '0.15em' }}>Resultados concretos</p>
            <h2 className="font-heading font-black leading-tight" style={{ fontSize: 'clamp(1.35rem, 1.8vw, 1.75rem)', color: '#0F0A2A', letterSpacing: '-0.02em' }}>
              Lo que cambia después de Kova.
            </h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.85 }}>
            Cada proyecto termina con entregables concretos. No consultoría sin fin: resultados desde el primer mes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map(({ titulo, desc, color, bg }) => (
            <div key={titulo} className="p-6 rounded-2xl" style={{ background: bg, border: `1px solid ${color}18` }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-4" style={{ background: color }}>
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="font-heading font-bold text-sm mb-2" style={{ color: '#0F0A2A' }}>{titulo}</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.75 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}