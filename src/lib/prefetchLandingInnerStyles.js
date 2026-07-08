let innerStylesPromise;

export function prefetchLandingInnerStyles() {
  if (!innerStylesPromise) {
    innerStylesPromise = import('@/styles/landing-wave-inner.css');
  }
  return innerStylesPromise;
}
