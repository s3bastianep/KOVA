import { useEffect } from 'react';

function parseCountable(text) {
  const t = String(text || '').trim();
  const m = t.match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  if (!m) return null;
  return { value: parseFloat(m[1].replace(',', '.')), suffix: m[2] || '' };
}

/**
 * B2B motion for /para-empresas — trust over spectacle.
 * Short fades, light rise, no bounce / typewriter / neon loops.
 * GSAP + Lenis load on demand so they stay out of the initial route chunk.
 */
export function useLandingPremiumMotion(rootSelector = '.kova-home-plain') {
  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('kova-home-chrome');
    root.classList.add('kh-cinematic');

    if (reduced) {
      root.classList.add('is-reduced-motion');
      return () => {
        document.documentElement.classList.remove('kova-home-chrome');
        root.classList.remove('is-reduced-motion', 'kh-cinematic');
      };
    }

    let cancelled = false;
    let disposeMotion = () => {};

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('lenis'),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

    const prefersFine = window.matchMedia('(pointer: fine)').matches;
    const cleanups = [];

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.05,
    });
    window.__kovaLenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const ticker = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // Deep-link: Contáctanos → #contacto (and any other hash)
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        requestAnimationFrame(() => {
          lenis.scrollTo(target, { offset: -88, immediate: true });
        });
      }
    }

    const ctx = gsap.context(() => {
      /* ── 1. Hero cinematic enter ── */
      const hero = root.querySelector('.kh-hero');
      const heroCopy = hero?.querySelector('.kh-hero__grid > div:first-child');
      const heroVisual = hero?.querySelector('.kh-hero__collage');
      const heroTitle = hero?.querySelector('h1');
      const heroLead = hero?.querySelector('.kh-hero__lead');
      const heroCtas = hero?.querySelector('.kh-hero__ctas');
      const heroChecks = hero?.querySelector('.kh-hero__checks');
      const heroPill = hero?.querySelector('.kh-pill');

      if (heroCopy) {
        gsap.set([heroPill, heroTitle, heroLead, heroCtas, heroChecks].filter(Boolean), {
          autoAlpha: 0,
          y: 12,
        });
        if (heroVisual) {
          gsap.set(heroVisual, { autoAlpha: 0, y: 10 });
        }

        const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        heroTl
          .to(heroVisual, { autoAlpha: 1, y: 0, duration: 0.7 }, 0)
          .to(heroPill, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.08)
          .to(heroTitle, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.14)
          .to(heroLead, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.22)
          .to(heroCtas, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.3)
          .to(heroChecks, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.36);
      }

      /* Soft parallax — restrained for B2B */
      if (hero && heroCopy && heroVisual) {
        gsap.to(heroCopy, {
          y: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
        gsap.to(heroVisual, {
          y: 14,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      /* Scroll reveals — opacity + small rise only */
      const sections = root.querySelectorAll(
        '.kh-section, .kh-trust, .kh-contact, .kh-artifact, #calculadora, #metodologia, #metodo',
      );
      sections.forEach((section) => {
        if (section.classList.contains('kh-dolores-band')) return;
        const bits = section.querySelectorAll(
          '.kh-h2, .kh-eyebrow, .kh-dolor, .kh-costos, .kh-calc, .kh-perfil-card, .kh-mock, .kh-compare, .kh-platform__grid > div, .kh-case-stat, .kh-guide-card, .kh-method-qa__item, .kh-artifact__lead, .kh-platform__lead, .kh-platform__close, .kh-perfil__lead, .kh-trust__label',
        );
        if (!bits.length) return;
        gsap.set(bits, { autoAlpha: 0, y: 14 });
        ScrollTrigger.create({
          trigger: section,
          start: 'top 82%',
          once: true,
          onEnter: () => {
            gsap.to(bits, {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              ease: 'power2.out',
              stagger: 0.045,
            });
          },
        });
      });

      /* Titles — crisp fade, no blur pass */
      root.querySelectorAll('.kh-h2, .kh-platform h2, .kh-contact h2').forEach((title) => {
        if (title.closest('.kh-dolores-band')) return;
        ScrollTrigger.create({
          trigger: title,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              title,
              { autoAlpha: 0.4, y: 8 },
              { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' },
            );
          },
        });
      });

      /* Dolores band — cascade, ease-out only */
      const doloresBand = root.querySelector('.kh-dolores-band');
      if (doloresBand) {
        const title = doloresBand.querySelector('.kh-dolores-band__title');
        const aside = doloresBand.querySelector('.kh-dolores-band__aside');
        const rail = doloresBand.querySelector('.kh-dolores-band__rail');
        const railDot = doloresBand.querySelector('.kh-dolores-band__rail-dot');
        const railLine = doloresBand.querySelector('.kh-dolores-band__rail-line');
        const railTarget = doloresBand.querySelector('.kh-dolores-band__rail-target');
        const columns = doloresBand.querySelectorAll('.kh-dolor');
        const footer = doloresBand.querySelector('.kh-dolores-band__footer');

        gsap.set([title, aside].filter(Boolean), { autoAlpha: 0, y: 14 });
        gsap.set(rail, { autoAlpha: 0 });
        gsap.set(railDot, { scale: 0, transformOrigin: '50% 50%' });
        gsap.set(railLine, { scaleX: 0, transformOrigin: 'left center' });
        gsap.set(railTarget, { scale: 0.85, autoAlpha: 0 });
        gsap.set(columns, { autoAlpha: 0, y: 14 });
        gsap.set(footer, { autoAlpha: 0, y: 10 });

        const doloresTl = gsap.timeline({
          scrollTrigger: { trigger: doloresBand, start: 'top 78%', once: true },
        });

        doloresTl
          .to(title, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0)
          .to(aside, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.06)
          .to(rail, { autoAlpha: 1, duration: 0.15 }, 0.18)
          .to(railDot, { scale: 1, duration: 0.3, ease: 'power2.out' }, 0.2)
          .to(railLine, { scaleX: 1, duration: 0.55, ease: 'power2.out' }, 0.26)
          .to(railTarget, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, 0.65)
          .to(
            columns,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.45,
              stagger: 0.07,
              ease: 'power2.out',
            },
            0.45,
          )
          .to(footer, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.75);
      }

      /* Timeline stages illuminate in viewport */
      const stages = root.querySelector('.kh-stages');
      if (stages) {
        stages.classList.add('kh-stages--draw');
        stages.style.setProperty('--rail', '0');
        gsap.to(stages, {
          '--rail': 1,
          duration: 1.05,
          ease: 'power2.out',
          scrollTrigger: { trigger: stages, start: 'top 80%', once: true },
        });

        const stageBtns = stages.querySelectorAll('.kh-stage-btn');
        const stagePanel = root.querySelector('.kh-stage-panel');
        gsap.set([stageBtns, stagePanel].filter(Boolean), {
          autoAlpha: 0,
          y: 12,
        });
        gsap.to(stageBtns, {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: { trigger: stages, start: 'top 80%', once: true },
        });
        if (stagePanel) {
          gsap.to(stagePanel, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            delay: 0.12,
            ease: 'power2.out',
            scrollTrigger: { trigger: stages, start: 'top 80%', once: true },
          });
        }

        stageBtns.forEach((btn) => {
          ScrollTrigger.create({
            trigger: btn,
            start: 'top 85%',
            end: 'bottom 35%',
            onEnter: () => btn.classList.add('is-inview'),
            onEnterBack: () => btn.classList.add('is-inview'),
            onLeave: () => {
              if (!btn.classList.contains('is-active')) btn.classList.remove('is-inview');
            },
            onLeaveBack: () => {
              if (!btn.classList.contains('is-active')) btn.classList.remove('is-inview');
            },
          });
        });
      }

      /* Flow pills */
      const flow = root.querySelector('.kh-flow');
      if (flow) {
        gsap.fromTo(
          flow.querySelectorAll('li'),
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: { trigger: flow, start: 'top 84%', once: true },
          },
        );
      }

      /* Chart line draw */
      root.querySelectorAll('.kh-chart__svg path[fill="none"]').forEach((path, idx) => {
        let len = 0;
        try {
          len = path.getTotalLength();
        } catch {
          return;
        }
        if (!len) return;
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.9 + idx * 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: root.querySelector('.kh-chart') || path,
            start: 'top 80%',
            once: true,
          },
        });
      });

      /* Counters ~550ms */
      const counters = [
        ...root.querySelectorAll(
          '.kh-score__stat strong:not(.is-lime), .kh-case-stat strong, .kh-dim__pct',
        ),
      ].filter((el) => !el.closest('.kh-hero__collage') && !el.closest('.kh-mock'));
      counters.forEach((el) => {
        const original =
          el.getAttribute('data-count-original')?.trim() ||
          el.dataset.countOriginal ||
          el.textContent.trim();
        el.dataset.countOriginal = original;
        const parsed = parseCountable(original);
        if (!parsed || Number.isNaN(parsed.value) || parsed.value === 0) {
          el.textContent = original;
          return;
        }
        const { value, suffix } = parsed;
        const format = (n) =>
          `${Number.isInteger(value) ? Math.round(n) : Math.round(n)}${suffix}`;
        el.textContent = format(value);

        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            const obj = { n: 0 };
            el.textContent = format(0);
            gsap.to(obj, {
              n: value,
              duration: 0.55,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = format(obj.n);
              },
              onComplete: () => {
                el.textContent = format(value);
              },
            });
          },
        });
      });

      cleanups.push(() => {
        counters.forEach((el) => {
          if (el.dataset.countOriginal) el.textContent = el.dataset.countOriginal;
        });
      });

      /* Card depth hover (no magnetic / no spotlight loops) */
      if (prefersFine) {
        const cards = root.querySelectorAll(
          '.kh-dolor, .kh-calc, .kh-stage-panel, .kh-score-shell, .kh-perfil-card',
        );
        cards.forEach((card) => {
          card.classList.add('kh-card-depth');
        });
      }
    }, root);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    disposeMotion = () => {
      window.removeEventListener('resize', onResize);
      cleanups.forEach((fn) => fn());
      ctx.revert();
      gsap.ticker.remove(ticker);
      if (window.__kovaLenis === lenis) delete window.__kovaLenis;
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
    })();

    return () => {
      cancelled = true;
      disposeMotion();
      document.documentElement.classList.remove('kova-home-chrome');
      root.classList.remove('kh-cinematic', 'is-reduced-motion');
    };
  }, [rootSelector]);
}
