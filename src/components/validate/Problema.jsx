import { Clock, UserX, Users } from 'lucide-react';
import {
  CN_PROBLEM_HEADLINE,
  CN_PROBLEM_POINTS,
  CN_PROBLEM_STAKES,
  CN_PROBLEM_STAKES_HEADLINE,
  CN_PROBLEM_STAKES_TAG,
  CN_PROBLEM_TAG,
} from '@/theme/landingConsult';

const stakeIcons = {
  clock: Clock,
  team: Users,
  turnover: UserX,
};

export default function Problema() {
  return (
    <section id="problema" className="kv-section">
      <div className="kv-wrap">
        <div className="kv-problem-split">
          <div className="kv-problem-main">
            <span className="kv-section-tag font-mono">{CN_PROBLEM_TAG}</span>
            <h2 className="kv-h2 font-display">{CN_PROBLEM_HEADLINE}</h2>
            <ul className="kv-problem-points">
              {CN_PROBLEM_POINTS.map(({ title, desc }) => (
                <li key={title} className="kv-problem-point">
                  <h3 className="font-display">{title}</h3>
                  <p>{desc}</p>
                </li>
              ))}
            </ul>
          </div>

          <aside className="kv-problem-stakes" aria-label={CN_PROBLEM_STAKES_TAG}>
            <span className="kv-problem-stakes-tag font-mono">{CN_PROBLEM_STAKES_TAG}</span>
            <h3 className="kv-problem-stakes-headline font-display">{CN_PROBLEM_STAKES_HEADLINE}</h3>
            <ul className="kv-problem-stakes-list">
              {CN_PROBLEM_STAKES.map(({ icon, title, desc }) => {
                const Icon = stakeIcons[icon];
                return (
                  <li key={title}>
                    <span className="kv-problem-stake-icon" aria-hidden>
                      <Icon strokeWidth={2} />
                    </span>
                    <div>
                      <h4 className="font-display">{title}</h4>
                      <p>{desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
