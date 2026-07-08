import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type PortalModulePlaceholderProps = {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function PortalModulePlaceholder({
  title,
  description,
  ctaHref = '/portal',
  ctaLabel = 'Volver al dashboard',
}: PortalModulePlaceholderProps) {
  return (
    <div className="kova-card rounded-3xl border p-8 lg:p-10 max-w-2xl">
      <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)] mb-2">
        Próximamente en Fase 2
      </p>
      <h1 className="font-heading text-2xl font-bold mb-3">{title}</h1>
      <p className="text-[var(--kova-muted)] leading-relaxed mb-6">{description}</p>
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--kova-indigo)] hover:underline"
      >
        {ctaLabel}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
