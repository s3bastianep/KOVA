import { useEffect, useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import HomeDarkDesktop from './HomeDarkDesktop';
import HomeDarkMobile from './HomeDarkMobile';

const MOBILE_MQ = '(max-width: 1050px)';

/**
 * Home router: desktop keeps the current approved layout;
 * mobile mounts yesterday's home experience (8f02286) unchanged.
 */
export default function HomeDark() {
  usePageMeta({
    title: 'Empresas y talento comercial alineados para crecer.',
    description:
      'Entendemos tu negocio, la cultura y el potencial de cada profesional para construir equipos comerciales de alto desempeño.',
    path: '/',
  });

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(MOBILE_MQ).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isMobile ? <HomeDarkMobile /> : <HomeDarkDesktop />;
}
