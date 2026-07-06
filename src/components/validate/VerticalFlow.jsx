import { BRAND, KOVA } from '@/theme/kovaPalette';

export default function VerticalFlow({ steps, variant = 'light', className = '' }) {
  const isDark = variant === 'dark';

  return (
    <ol className={`flex flex-col ${className}`}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const isEmphasis = step.emphasis;
        const isMuted = step.muted;

        return (
          <li key={`${step.label}-${i}`} className="flex gap-3 sm:gap-4">
            <div className="flex flex-col items-center shrink-0">
              <span
                className="w-2 h-2 rounded-full mt-2"
                style={{
                  background: isEmphasis ? BRAND.coral : isMuted ? KOVA.border : BRAND.blue,
                  boxShadow: isEmphasis ? `0 0 0 3px rgba(255,59,48,0.15)` : undefined,
                }}
                aria-hidden
              />
              {!isLast && (
                <span
                  className="w-px flex-1 min-h-[1.25rem] my-1"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.12)' : KOVA.border,
                  }}
                  aria-hidden
                />
              )}
            </div>
            <p
              className={`pb-3 sm:pb-3.5 text-sm sm:text-[15px] leading-snug ${
                isEmphasis ? 'font-semibold' : isMuted ? 'font-normal' : 'font-medium'
              }`}
              style={{
                color: isDark
                  ? isEmphasis
                    ? '#FFFFFF'
                    : isMuted
                      ? 'rgba(255,255,255,0.45)'
                      : 'rgba(255,255,255,0.82)'
                  : isEmphasis
                    ? BRAND.coral
                    : isMuted
                      ? KOVA.muted
                      : BRAND.navy,
              }}
            >
              {step.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
