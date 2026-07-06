import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CN_POST_HIRE } from '@/theme/landingConsult';

export default function PostContratacionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="despues" className="cn-section cn-section--cream px-5 sm:px-6 lg:px-8">
      <div className="kova-page-container" ref={ref}>
        <motion.div
          className="cn-section-header cn-section-header--center max-w-xl mx-auto mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="cn-eyebrow">Después de contratar</p>
          <h2 className="cn-heading font-heading font-bold text-balance">
            ¿Qué ocurre después de contratarlos?
          </h2>
        </motion.div>

        <motion.div
          className="cn-post-hire-flow"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          {CN_POST_HIRE.map((step, i) => (
            <div key={step} className="cn-post-hire-flow__item">
              <span className="cn-post-hire-flow__step font-heading font-semibold">{step}</span>
              {i < CN_POST_HIRE.length - 1 && (
                <span className="cn-post-hire-flow__arrow" aria-hidden>↓</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
