import { Sparkles } from 'lucide-react';

export function ModulePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-[1.65rem] font-bold tracking-tight" style={{ color: 'var(--kova-navy)' }}>
          {title}
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed">{description}</p>
      </div>
      <div className="kova-card p-12 flex flex-col items-center justify-center text-center gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--kova-blue-soft)', color: 'var(--kova-blue)', boxShadow: 'var(--kova-shadow-sm)' }}
        >
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <p className="text-base font-semibold" style={{ color: 'var(--kova-navy)' }}>Módulo en preparación</p>
          <p className="text-sm text-slate-400 max-w-md mt-1 leading-relaxed">
            Esta sección estará disponible próximamente. La estructura de datos y la navegación ya están listas.
          </p>
        </div>
      </div>
    </div>
  );
}
