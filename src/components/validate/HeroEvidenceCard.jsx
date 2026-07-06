import { Star } from 'lucide-react';
import { TOP_CANDIDATE, TOP_PROFILE } from '@/data/mockEvaluation';
import { CN } from '@/theme/landingConsult';

const CANDIDATE_PHOTO =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&crop=face&q=90';

const GRADIENT_ID = 'kovaHeroEvidenceGradient';

export default function HeroEvidenceCard({ variant = 'default' }) {
  const score = TOP_PROFILE.matchScore;
  const isHero = variant === 'hero';
  const stroke = isHero ? 3 : 4;
  const radius = isHero ? 26 : 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const topCompetencies = TOP_PROFILE.competencies.slice(0, 2);

  return (
    <div className={`cn-evidence-card${isHero ? ' cn-evidence-card--hero' : ''}`}>
      <div className="cn-evidence-card__header">
        <img
          src={`${CANDIDATE_PHOTO}&w=96`}
          alt={TOP_CANDIDATE.name}
          className="cn-evidence-card__photo"
          width={48}
          height={48}
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <p className="cn-evidence-card__name font-heading">{TOP_CANDIDATE.name}</p>
          <p className="cn-evidence-card__role">{TOP_CANDIDATE.role}</p>
        </div>
        <span className="cn-evidence-card__badge">
          <Star className="w-2.5 h-2.5 fill-current" strokeWidth={0} />
          Recomendada
        </span>
      </div>

      <div className="cn-evidence-card__score-block">
        <div className="cn-evidence-card__ring">
          <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90" aria-hidden>
            <defs>
              <linearGradient id={GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={CN.navy} />
                <stop offset="100%" stopColor={CN.positive} />
              </linearGradient>
            </defs>
            <circle cx="36" cy="36" r={radius} fill="none" stroke={CN.border} strokeWidth={stroke} />
            <circle
              cx="36"
              cy="36"
              r={radius}
              fill="none"
              stroke={`url(#${GRADIENT_ID})`}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="cn-evidence-card__ring-value font-heading">{score}</span>
        </div>
        <div className="cn-evidence-card__score-copy">
          <p className="cn-evidence-card__score-brand font-heading">Score Kova</p>
          <p className="cn-evidence-card__score-sub">Compatibilidad comercial</p>
        </div>
      </div>

      {!isHero && (
        <div className="cn-evidence-card__bars">
          {topCompetencies.map(({ label, value }) => (
            <div key={label} className="cn-evidence-card__bar-row">
              <span className="cn-evidence-card__bar-label">{label}</span>
              <div className="cn-evidence-card__bar-track">
                <div className="cn-evidence-card__bar-fill" style={{ width: `${value}%` }} />
              </div>
              <span className="cn-evidence-card__bar-value">{value}%</span>
            </div>
          ))}
        </div>
      )}

      {isHero && (
        <div className="cn-evidence-card__metrics">
          {topCompetencies.map(({ label, value }) => (
            <span key={label} className="cn-evidence-card__metric">
              {label} <strong>{value}%</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
