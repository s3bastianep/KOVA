import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const getHashId = (hash) => {
  const rawId = hash.slice(1);

  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
};

function scrollWindowTo(top) {
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  window.scrollTo({ top, left: 0, behavior: 'auto' });
  html.style.scrollBehavior = previous;
}

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType === 'POP') return undefined;

    // Reset before paint so the new page never appears mid-scroll.
    scrollWindowTo(0);

    if (!hash) return undefined;

    const id = getHashId(hash);
    let cancelled = false;
    let attempts = 0;

    const tryScrollToHash = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        const html = document.documentElement;
        const previous = html.style.scrollBehavior;
        html.style.scrollBehavior = 'auto';
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        html.style.scrollBehavior = previous;
        return;
      }
      if (attempts < 12) {
        attempts += 1;
        window.requestAnimationFrame(tryScrollToHash);
      }
    };

    window.requestAnimationFrame(tryScrollToHash);
    return () => {
      cancelled = true;
    };
  }, [pathname, hash, navigationType]);

  return null;
}
