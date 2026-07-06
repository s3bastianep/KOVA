import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BarChart3, ClipboardCheck, Search, Target, Users } from 'lucide-react';
import { LC, LC_ICONS } from '@/theme/landingCorporate';

const ICONS = [Search, Target, ClipboardCheck, Users, BarChart3];

function IconCard({ title, desc, Icon, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      className="corp-icon-card"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="corp-icon-card__icon">
        <Icon strokeWidth={1.35} />
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </motion.div>
  );
}

export default function ProcesoResumen() {
  return (
    <section className="corp-icons-section relative overflow-hidden">
      <div className="corp-icons-section__stripe corp-icons-section__stripe--tl" aria-hidden />
      <div className="corp-icons-section__stripe corp-icons-section__stripe--br" aria-hidden />

      <div className="kova-page-container relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="corp-icons-grid">
          {LC_ICONS.map(({ title, desc }, i) => (
            <IconCard key={title} title={title} desc={desc} Icon={ICONS[i]} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
