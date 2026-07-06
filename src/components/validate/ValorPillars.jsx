import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CN_APPROACH } from '@/theme/landingConsult';

export default function ValorPillars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="cn-section cn-section--warm px-5 sm:px-6 lg:px-8">
      <div className="kova-page-container" ref={ref}>
        <motion.div
          className="cn-section-header cn-section-header--center max-w-xl mx-auto mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="cn-eyebrow">Nuestro enfoque</p>
          <h2 className="cn-heading font-heading font-bold text-balance">
            Cuatro pasos. Un solo criterio.
          </h2>
        </motion.div>

        <motion.div
          className="cn-approach-flow"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          {CN_APPROACH.map((step, i) => (
            <div key={step} className="cn-approach-flow__item">
              <span className="cn-approach-flow__step font-heading font-bold">{step}</span>
              {i < CN_APPROACH.length - 1 && (
                <span className="cn-approach-flow__arrow" aria-hidden>↓</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
