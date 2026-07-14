/** Navigate into the Next.js candidate portal with prefetch to cut cold-load delay. */

const PREFETCH_ATTR = 'data-kova-prefetch-portal';

export function prefetchPortal() {
  if (typeof window === 'undefined') return;

  if (!document.querySelector(`link[${PREFETCH_ATTR}]`)) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'document';
    link.href = '/portal';
    link.setAttribute(PREFETCH_ATTR, '1');
    document.head.appendChild(link);
  }

  if (window.__kovaPortalWarmed) return;
  window.__kovaPortalWarmed = true;

  // Hit the proxied Next app so DevServer / first compile starts before navigation.
  void fetch('/portal', {
    method: 'GET',
    credentials: 'same-origin',
    priority: 'low',
  }).catch(() => {
    window.__kovaPortalWarmed = false;
  });
}

export function enterPortal() {
  prefetchPortal();
  window.location.assign('/portal');
}
