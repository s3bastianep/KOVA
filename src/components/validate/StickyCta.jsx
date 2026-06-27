import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const acceso = document.getElementById('acceso');
      const accesoTop = acceso?.getBoundingClientRect().top ?? Infinity;
      setVisible(window.scrollY > 480 && accesoTop > 120);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 p-4 md:hidden"
      style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.95), rgba(15,23,42,0.85))', backdropFilter: 'blur(8px)' }}
    >
      <button
        type="button"
        onClick={() => document.getElementById('acceso')?.scrollIntoView({ behavior: 'smooth' })}
        className="w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl text-sm text-white"
        style={{ background: '#4338CA', boxShadow: '0 4px 14px rgba(67,56,202,0.4)' }}
      >
        Diagnóstico gratuito
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
