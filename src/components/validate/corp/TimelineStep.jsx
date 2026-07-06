import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { LC } from '@/theme/landingCorporate';

export default function TimelineStep({ n, title, body, side = 'left' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px -80px 0px' });
  const isLeft = side === 'left';

  return (
    <div ref={ref} className={`corp-timeline-row corp-timeline-row--${side}`}>
      <motion.div
        className="corp-timeline-content"
        initial={{ opacity: 0, x: isLeft ? -80 : 80 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -80 : 80 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="corp-ghost-num" aria-hidden>
          {n}
        </span>
        <div className="corp-timeline-text">
          <h3>{title}</h3>
          <p>{body}</p>
        </div>
      </motion.div>

      <div className="corp-timeline-spine-anchor" aria-hidden>
        <motion.span
          className={`corp-timeline-connector corp-timeline-connector--${side}`}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: isLeft ? 'right center' : 'left center' }}
        />
        <motion.span
          className="corp-timeline-dot"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: 0.35, type: 'spring', stiffness: 300, damping: 20 }}
          style={{ background: LC.blueLine, boxShadow: `0 0 0 5px ${LC.blueSoft}` }}
        />
      </div>
    </div>
  );
}
