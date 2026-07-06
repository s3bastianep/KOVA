import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CN_TESTIMONIALS } from '@/theme/landingConsult';

export default function TestimoniosSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="testimonios" className="cn-section cn-section--testimonials px-5 sm:px-6 lg:px-8 overflow-hidden">
      <div className="kova-page-container" ref={ref}>
        <motion.div
          className="cn-section-header cn-section-header--center max-w-xl mx-auto mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="cn-eyebrow">Voces de clientes</p>
        </motion.div>

        <div className="cn-testimonials-grid">
          {CN_TESTIMONIALS.map(({ quote, name, role, company, photo }, i) => (
            <motion.blockquote
              key={name}
              className="cn-testimonial-card cn-testimonial-card--short"
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
            >
              <p className="cn-testimonial-card__quote font-heading font-semibold">&ldquo;{quote}&rdquo;</p>
              <footer className="cn-testimonial-card__author">
                <img src={photo} alt={name} className="cn-testimonial-card__photo" loading="lazy" />
                <div>
                  <cite className="font-heading font-semibold text-sm not-italic">{name}</cite>
                  <p className="text-xs cn-text-muted">{role} · {company}</p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
