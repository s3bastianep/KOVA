import { Wrench } from 'lucide-react';

export function ModulePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>{title}</h1>
      <p className="text-sm text-slate-500 max-w-2xl">{description}</p>
      <div className="kova-card p-10 flex flex-col items-center justify-center text-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FA' }}>
          <Wrench className="w-6 h-6" style={{ color: 'var(--kova-blue)' }} />
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>Módulo en preparación</p>
        <p className="text-sm text-slate-400 max-w-md">
          Esta sección estará disponible próximamente. La estructura de datos y la navegación ya están listas.
        </p>
      </div>
    </div>
  );
}
