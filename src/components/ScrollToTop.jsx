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

function scrollToElement(el) {
  const lenis = window.__kovaLenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: -88, immediate: true });
    return;
  }
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  el.scrollIntoView({ behavior: 'auto', block: 'start' });
  html.style.scrollBehavior = previous;
}

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType === 'POP') return undefined;

    if (!hash) {
      scrollWindowTo(0);
      return undefined;
    }

    const id = getHashId(hash);
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 40;

    const tryScrollToHash = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        scrollToElement(el);
        // Lenis may init after the first hit — re-apply once ready.
        window.setTimeout(() => {
          if (!cancelled) {
            const again = document.getElementById(id);
            if (again) scrollToElement(again);
          }
        }, 120);
        window.setTimeout(() => {
          if (!cancelled) {
            const again = document.getElementById(id);
            if (again) scrollToElement(again);
          }
        }, 450);
        return;
      }
      if (attempts < maxAttempts) {
        attempts += 1;
        window.setTimeout(tryScrollToHash, 50);
      }
    };

    tryScrollToHash();
    return () => {
      cancelled = true;
    };
  }, [pathname, hash, navigationType]);

  return null;
}
