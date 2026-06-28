import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function StickyCta() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 480);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible || location.pathname === '/contacto') return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 p-4 md:hidden border-t"
      style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderColor: '#E7E5E4' }}
    >
      <Link
        to="/contacto"
        className="kova-btn-primary w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-lg text-sm text-white"
      >
        Hablar con un experto
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
