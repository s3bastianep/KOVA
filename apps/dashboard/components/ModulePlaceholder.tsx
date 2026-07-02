export function ModulePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>{title}</h1>
      <p className="text-sm text-slate-500 max-w-2xl">{description}</p>
      <div className="kova-card p-8 text-center text-slate-400 text-sm">
        Módulo conectado a la API. Datos en tiempo real disponibles desde el backend NestJS.
      </div>
    </div>
  );
}
