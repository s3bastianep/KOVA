import { ISSUES } from './guiaContent';

export default function GuiaIssuesSummary() {
  return (
    <div id="resumen" className="kv-guia-summary">
      <h3 className="kv-guia-summary-title font-display">
        5 problemas al contratar comercial y cómo resolverlos
      </h3>

      <div className="kv-guia-summary-list">
        {ISSUES.map(({ num, title, summary, solution }) => (
          <div key={num} className="kv-guia-summary-item">
            <span className="kv-guia-summary-num font-display">{num}</span>
            <div>
              <h4 className="font-display">{title}</h4>
              <p>
                {summary} <strong>{solution.split('.')[0]}.</strong>
              </p>
            </div>
          </div>
        ))}
      </div>

        <div className="kv-guia-summary-brand lh-mark">
          litt hunter
          <span className="lh-mark__sq" aria-hidden="true" />
        </div>
    </div>
  );
}
