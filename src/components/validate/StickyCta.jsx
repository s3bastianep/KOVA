import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CN_CTA_LABEL_SHORT } from '@/theme/landingConsult';

export default function StickyCta() {
  const location = useLocation();
  if (location.pathname === '/contacto') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden border-t cn-sticky-cta">
      <Link to="/contacto" className="cn-btn cn-btn--accent w-full justify-center">
        {CN_CTA_LABEL_SHORT}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
