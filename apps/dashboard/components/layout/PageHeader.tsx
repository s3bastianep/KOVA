import type { LucideIcon } from 'lucide-react';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  accent?: string;
  tone?: string;
  children?: React.ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  accent = '#EEF2FA',
  tone = 'var(--kova-blue)',
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: accent, color: tone }}
          >
            <Icon className="w-[18px] h-[18px]" />
          </div>
        )}
        <div>
          <h1 className="font-heading text-2xl font-bold leading-tight" style={{ color: 'var(--kova-navy)' }}>
            {title}
          </h1>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}
