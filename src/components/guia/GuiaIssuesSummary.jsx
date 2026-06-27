import { ISSUES } from './guiaContent';

export default function GuiaIssuesSummary() {
  return (
    <div
      id="resumen"
      className="rounded-2xl p-6 lg:p-8 scroll-mt-28"
      style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
    >
      <h3
        className="font-heading font-bold text-center mb-6"
        style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', color: '#0F172A' }}
      >
        5 problemas al contratar comercial y cómo resolverlos
      </h3>

      <div className="space-y-3">
        {ISSUES.map(({ num, title, summary, solution }) => (
          <div
            key={num}
            className="rounded-xl p-5 bg-white"
            style={{ border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' }}
          >
            <div className="flex items-start gap-4">
              <span
                className="flex-shrink-0 font-heading font-bold text-2xl leading-none"
                style={{ color: '#4338CA' }}
              >
                {num}
              </span>
              <div>
                <h4 className="font-heading font-semibold text-base mb-2" style={{ color: '#0F172A' }}>
                  {title}
                </h4>
                <p className="text-sm leading-relaxed mb-2" style={{ color: '#475569', lineHeight: 1.7 }}>
                  {summary}{' '}
                  <strong style={{ color: '#0F172A' }}>{solution.split('.')[0]}.</strong>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#4338CA' }}>
            <span className="font-heading font-bold text-xs text-white">K</span>
          </div>
          <span className="font-heading font-semibold text-sm" style={{ color: '#4338CA' }}>Kova</span>
        </div>
      </div>
    </div>
  );
}
