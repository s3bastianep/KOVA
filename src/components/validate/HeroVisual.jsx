import { motion } from 'framer-motion';
import HeroEvidenceCard from '@/components/validate/HeroEvidenceCard';

export default function HeroVisual() {
  return (
    <motion.div
      className="cn-hero-evidence"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="cn-hero-evidence__inner">
        <p className="cn-hero-evidence__label">
          <span className="cn-hero-visual__dot" aria-hidden />
          Evaluación con evidencia
        </p>
        <HeroEvidenceCard variant="hero" />
      </div>
    </motion.div>
  );
}
