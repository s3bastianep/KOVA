import { useEffect } from 'react';

function parseCountable(text) {
  const t = String(text || '').trim();
  const m = t.match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  if (!m) return null;
  return { value: parseFloat(m[1].replace(',', '.')), suffix: m[2] || '' };
}

const EASE = {
  out: 'power3.out',
  soft: 'power2.out',
  expo: 'expo.out',
  back: 'back.out(1.7)',
  bounce: 'back.out(2.2)',
  none: 'none',
};

/**
 * Loud 2026 motion for /para-empresas — clearly visible per section.
 * Reduced-motion safe.
 */
export function useLandingPremiumMotion(rootSelector = '.kova-home-plain') {
  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('kova-home-chrome');
    root.classList.add('kh-cinematic', 'kh-motion-loud');

    const nav = document.querySelector('.kova-navbar');
    const onNavScroll = () => {
      nav?.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onNavScroll();
    window.addEventListener('scroll', onNavScroll, { passive: true });

    if (reduced) {
      root.classList.add('is-reduced-motion');
      root.classList.remove('kh-motion-loud');
      return () => {
        window.removeEventListener('scroll', onNavScroll);
        nav?.classList.remove('is-scrolled');
        document.documentElement.classList.remove('kova-home-chrome');
        root.classList.remove('is-reduced-motion', 'kh-cinematic', 'kh-motion-loud');
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
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.1,
      });
      window.__kovaLenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      const ticker = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
          requestAnimationFrame(() => {
            lenis.scrollTo(target, { offset: -88, immediate: true });
          });
        }
      }

      const idleFloat = (els, amp = 10, dur = 2.8) => {
        const list = gsap.utils.toArray(els).filter(Boolean);
        if (!list.length) return;
        list.forEach((el, i) => {
          gsap.to(el, {
            y: `+=${amp * (i % 2 === 0 ? 1 : -1)}`,
            duration: dur + (i % 3) * 0.35,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: i * 0.15,
          });
        });
      };

      const ctx = gsap.context(() => {
        /* Accents pulse */
        root.querySelectorAll('.kh-accent').forEach((el) => {
          el.classList.add('kh-accent--alive');
        });

        /* ── 1. HERO — big entrance ── */
        const hero = root.querySelector('.kh-hero');
        const heroCopy = hero?.querySelector('.kh-hero__copy, .kh-hero__grid > div:first-child');
        const heroVisual = hero?.querySelector('.kh-hero__collage');
        const heroTitle = hero?.querySelector('h1');
        const heroLead = hero?.querySelector('.kh-hero__lead');
        const heroCtas = hero?.querySelector('.kh-hero__ctas');
        const heroChecks = hero?.querySelectorAll('.kh-hero__checks > *');
        const heroPill = hero?.querySelector('.kh-pill');
        const heroChart = hero?.querySelector('.kh-chart');
        const floats = [...(hero?.querySelectorAll('.kh-float') || [])];
        const photos = hero?.querySelectorAll('.kh-collage__photo');
        const chip = hero?.querySelector('.kh-collage__chip');
        const score = hero?.querySelector('.kh-score-shell');
        const visualM = hero?.querySelector('.kh-hero__visual-m');

        if (heroCopy) {
          gsap.set(heroPill, { autoAlpha: 0, y: 24 });
          gsap.set(heroLead, { autoAlpha: 0, y: 28 });
          gsap.set(heroCtas, { autoAlpha: 0, y: 28 });
          if (heroChecks?.length) gsap.set(heroChecks, { autoAlpha: 0, y: 16 });
          if (heroTitle) {
            gsap.set(heroTitle, {
              autoAlpha: 0,
              y: 36,
            });
          }
          if (heroVisual) {
            gsap.set(heroVisual, {
              autoAlpha: 0,
              y: 28,
            });
          }
          if (visualM) {
            gsap.set(visualM, {
              autoAlpha: 0,
              y: 28,
            });
          }
          if (heroChart) gsap.set(heroChart, { autoAlpha: 0, y: 24 });
          if (photos?.length) gsap.set(photos, { autoAlpha: 0, y: 20 });
          if (chip) gsap.set(chip, { autoAlpha: 0, y: 16 });
          if (score) gsap.set(score, { autoAlpha: 0, y: 24 });
          floats.forEach((f, i) => {
            gsap.set(f, { autoAlpha: 0, y: 20 + i * 6 });
          });

          const heroTl = gsap.timeline({ defaults: { ease: EASE.expo } });
          heroTl
            .to(heroVisual, { autoAlpha: 1, y: 0, duration: 0.9 }, 0)
            .to(visualM, { autoAlpha: 1, y: 0, duration: 0.75 }, 0.05)
            .to(
              photos,
              { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.1, ease: EASE.out },
              0.15,
            )
            .to(heroPill, { autoAlpha: 1, y: 0, duration: 0.45, ease: EASE.out }, 0.08)
            .to(heroTitle, { autoAlpha: 1, y: 0, duration: 0.75 }, 0.12)
            .to(heroLead, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.out }, 0.35)
            .to(heroCtas, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.out }, 0.45)
            .to(
              heroChecks,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.06,
                ease: EASE.out,
              },
              0.52,
            )
            .to(chip, { autoAlpha: 1, y: 0, duration: 0.45, ease: EASE.out }, 0.48)
            .to(score, { autoAlpha: 1, y: 0, duration: 0.55, ease: EASE.out }, 0.42)
            .to(
              floats,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: EASE.out,
              },
              0.5,
            )
            .to(heroChart, { autoAlpha: 1, y: 0, duration: 0.55, ease: EASE.out }, 0.58);

          heroTl.eventCallback('onComplete', () => {
            // Clear transforms so scrub/layout never warps glyph spacing
            gsap.set(
              [heroTitle, heroPill, heroLead, heroCtas, heroCopy, visualM].filter(Boolean),
              { clearProps: 'transform,filter' },
            );
            if (heroChecks?.length) gsap.set(heroChecks, { clearProps: 'transform,filter' });
            idleFloat(chip, 6, 3.2);
          });
        }

        // Parallax only on the visual — never on the headline text
        if (hero && heroVisual) {
          gsap.to(heroVisual, {
            y: 40,
            ease: EASE.none,
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
          });
        }

        /* ── 2. TRUST — punchy entrance; CSS marquee keeps scrolling ── */
        const trust = root.querySelector('.kh-trust');
        if (trust) {
          const label = trust.querySelector('.kh-trust__label');
          const marquee = trust.querySelector('.kh-trust__marquee');
          gsap.set(label, { autoAlpha: 0, x: -48, scale: 0.95 });
          gsap.set(marquee, { autoAlpha: 0, x: 60 });

          gsap
            .timeline({
              scrollTrigger: { trigger: trust, start: 'top 95%', once: true },
            })
            .to(label, { autoAlpha: 1, x: 0, scale: 1, duration: 0.65, ease: EASE.expo })
            .to(marquee, { autoAlpha: 1, x: 0, duration: 0.7, ease: EASE.expo }, 0.1);
        }

        /* ── 3. DOLORES — hard alternate slides ── */
        const doloresBand = root.querySelector('.kh-dolores-band');
        if (doloresBand) {
          const title = doloresBand.querySelector('.kh-dolores-band__title');
          const aside = doloresBand.querySelector('.kh-dolores-band__aside');
          const rail = doloresBand.querySelector('.kh-dolores-band__rail');
          const railDot = doloresBand.querySelector('.kh-dolores-band__rail-dot');
          const railLine = doloresBand.querySelector('.kh-dolores-band__rail-line');
          const railTarget = doloresBand.querySelector('.kh-dolores-band__rail-target');
          const columns = [...doloresBand.querySelectorAll('.kh-dolor')];
          const footer = doloresBand.querySelector('.kh-dolores-band__footer');

          gsap.set(title, { autoAlpha: 0, y: 48 });
          gsap.set(aside, { autoAlpha: 0, x: 32 });
          gsap.set(rail, { autoAlpha: 0 });
          gsap.set(railDot, { scale: 0, transformOrigin: '50% 50%' });
          gsap.set(railLine, { scaleX: 0, transformOrigin: 'left center' });
          gsap.set(railTarget, { scale: 0.4, autoAlpha: 0 });
          columns.forEach((col, i) => {
            gsap.set(col, {
              autoAlpha: 0,
              x: i % 2 === 0 ? -48 : 48,
              y: 24,
            });
          });
          gsap.set(footer, { autoAlpha: 0, y: 24 });

          gsap
            .timeline({
              scrollTrigger: { trigger: doloresBand, start: 'top 88%', once: true },
            })
            .to(title, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE.expo }, 0)
            .to(aside, { autoAlpha: 1, x: 0, duration: 0.55, ease: EASE.out }, 0.12)
            .to(rail, { autoAlpha: 1, duration: 0.2 }, 0.18)
            .to(railDot, { scale: 1, duration: 0.4, ease: EASE.out }, 0.2)
            .to(railLine, { scaleX: 1, duration: 0.9, ease: EASE.expo }, 0.28)
            .to(railTarget, { scale: 1, autoAlpha: 1, duration: 0.45, ease: EASE.out }, 0.85)
            .to(
              columns,
              {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: EASE.out,
              },
              0.35,
            )
            .to(footer, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.out }, 0.9);
        }

        /* ── 4. CALCULADORA — dramatic split ── */
        const calcSection = root.querySelector('#calculadora');
        if (calcSection) {
          const head = calcSection.querySelector('.kh-costo-head, .kh-h2');
          const cards = calcSection.querySelectorAll('.kh-costo-card');
          const panel = calcSection.querySelector('.kh-calc');

          gsap.set(head, { autoAlpha: 0, y: 40 });
          gsap.set(cards, {
            autoAlpha: 0,
            x: -48,
            transformOrigin: 'left center',
          });
          gsap.set(panel, {
            autoAlpha: 0,
            x: 56,
            transformOrigin: '90% 40%',
          });

          gsap
            .timeline({
              scrollTrigger: { trigger: calcSection, start: 'top 88%', once: true },
            })
            .to(head, { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE.expo }, 0)
            .to(
              cards,
              {
                autoAlpha: 1,
                x: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: EASE.out,
              },
              0.1,
            )
            .to(
              panel,
              {
                autoAlpha: 1,
                x: 0,
                duration: 0.75,
                ease: EASE.expo,
              },
              0.18,
            );
        }

        /* ── 5. METODOLOGÍA — clip stages + wipe ── */
        const metodoLogia = root.querySelector('#metodologia');
        const stages = root.querySelector('.kh-stages');
        if (metodoLogia && stages) {
          const eye = metodoLogia.querySelector('.kh-eyebrow');
          const h2 = metodoLogia.querySelector('.kh-h2');
          const stageBtns = stages.querySelectorAll('.kh-stage-btn');
          const stagePanel = root.querySelector('.kh-stage-panel');
          const perfil = metodoLogia.querySelector('.kh-perfil');

          stages.classList.add('kh-stages--draw');
          stages.style.setProperty('--rail', '0');

          gsap.set([eye, h2].filter(Boolean), { autoAlpha: 0, y: 40 });
          gsap.set(stageBtns, {
            autoAlpha: 0,
            clipPath: 'inset(100% 0 0 0)',
            y: 24,
            scale: 0.96,
          });
          if (stagePanel) {
            gsap.set(stagePanel, {
              autoAlpha: 0,
              clipPath: 'inset(0 0 0 100%)',
              scale: 0.96,
            });
          }
          if (perfil) gsap.set(perfil, { autoAlpha: 0, y: 56, scale: 0.92 });

          gsap
            .timeline({
              scrollTrigger: { trigger: metodoLogia, start: 'top 88%', once: true },
            })
            .to(eye, { autoAlpha: 1, y: 0, duration: 0.45, ease: EASE.out }, 0)
            .to(h2, { autoAlpha: 1, y: 0, duration: 0.75, ease: EASE.expo }, 0.05)
            .to(stages, { '--rail': 1, duration: 1.35, ease: EASE.expo }, 0.15)
            .to(
              stageBtns,
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0 0 0)',
                y: 0,
                scale: 1,
                duration: 0.65,
                stagger: 0.12,
                ease: EASE.out,
              },
              0.22,
            )
            .to(
              stagePanel,
              {
                autoAlpha: 1,
                clipPath: 'inset(0 0 0 0%)',
                scale: 1,
                duration: 0.85,
                ease: EASE.expo,
              },
              0.4,
            )
            .to(
              perfil,
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.75, ease: EASE.expo },
              0.6,
            );

          stageBtns.forEach((btn) => {
            ScrollTrigger.create({
              trigger: btn,
              start: 'top 88%',
              end: 'bottom 30%',
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

        /* ── 6. MÉTODO — pop flow + 3D mocks ── */
        const metodo = root.querySelector('#metodo');
        if (metodo) {
          const lead = metodo.querySelector('.kh-artifact__lead, .kh-h2');
          const flowLis = metodo.querySelectorAll('.kh-flow li');
          const mocks = metodo.querySelectorAll('.kh-mock');
          const qa = metodo.querySelectorAll('.kh-method-qa__item');
          const casePanel = metodo.querySelector('.kh-case-panel');

          gsap.set(lead, { autoAlpha: 0, y: 28 });
          gsap.set(flowLis, { autoAlpha: 0, y: 24, scale: 0.92 });
          gsap.set(mocks, {
            autoAlpha: 0,
            y: 48,
          });
          gsap.set(qa, { autoAlpha: 0, y: 24 });
          if (casePanel) {
            gsap.set(casePanel, {
              autoAlpha: 0,
              y: 28,
            });
          }

          const metTl = gsap
            .timeline({
              scrollTrigger: { trigger: metodo, start: 'top 86%', once: true },
            })
            .to(lead, { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE.expo }, 0)
            .to(
              flowLis,
              {
                autoAlpha: 1,
                scale: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: EASE.out,
              },
              0.14,
            )
            .to(
              mocks,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.75,
                stagger: 0.14,
                ease: EASE.expo,
              },
              0.35,
            )
            .to(
              qa,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: EASE.out,
              },
              0.6,
            )
            .to(casePanel, { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE.out }, 0.72);

          metTl.eventCallback('onComplete', () => {
            idleFloat(mocks, 8, 3.4);
          });
        }

        /* ── 7. PLATFORM — bloom track ── */
        const platform = root.querySelector('.kh-platform-band');
        if (platform) {
          const kicker = platform.querySelector('.kh-platform__kicker');
          const title = platform.querySelector('.kh-platform__intro h2');
          const lead = platform.querySelector('.kh-platform__lead');
          const trackItems = platform.querySelectorAll('.kh-platform__track > li');
          const end = platform.querySelector('.kh-platform__end');

          gsap.set(kicker, { autoAlpha: 0, x: -24 });
          gsap.set(title, { autoAlpha: 0, y: 36 });
          gsap.set(lead, { autoAlpha: 0, y: 24 });
          gsap.set(trackItems, { autoAlpha: 0, y: 40 });
          gsap.set(end, { autoAlpha: 0, y: 24 });

          gsap
            .timeline({
              scrollTrigger: { trigger: platform, start: 'top 88%', once: true },
            })
            .to(kicker, { autoAlpha: 1, x: 0, duration: 0.45, ease: EASE.out }, 0)
            .to(title, { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE.expo }, 0.06)
            .to(lead, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.out }, 0.18)
            .to(
              trackItems,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.65,
                stagger: 0.12,
                ease: EASE.expo,
              },
              0.25,
            )
            .to(end, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.out }, 0.55);
        }

        /* ── 8. GUARANTEE — iris + badge bounce ── */
        const guarantee = root.querySelector('#garantia, .kh-guarantee');
        if (guarantee) {
          const panel = guarantee.querySelector('.kh-guarantee__panel') || guarantee;
          const badge = guarantee.querySelector('.kh-guarantee__badge');
          const copy = guarantee.querySelector('.kh-guarantee__copy');
          const points = guarantee.querySelectorAll('.kh-guarantee__points li');

          gsap.set(panel, {
            autoAlpha: 0,
            clipPath: 'inset(0 28% 0 28% round 20px)',
            scale: 0.96,
          });
          if (badge) gsap.set(badge, { scale: 0.35, autoAlpha: 0, rotate: -12 });
          if (copy) gsap.set(copy, { autoAlpha: 0, y: 28 });
          if (points.length) gsap.set(points, { autoAlpha: 0, x: -20 });

          gsap
            .timeline({
              scrollTrigger: { trigger: guarantee, start: 'top 90%', once: true },
            })
            .to(
              panel,
              {
                autoAlpha: 1,
                clipPath: 'inset(0 0% 0 0% round 20px)',
                scale: 1,
                duration: 1,
                ease: EASE.expo,
              },
              0,
            )
            .to(
              badge,
              { scale: 1, autoAlpha: 1, rotate: 0, duration: 0.7, ease: EASE.bounce },
              0.25,
            )
            .to(copy, { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE.out }, 0.35)
            .to(
              points,
              { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.1, ease: EASE.out },
              0.48,
            );
        }

        /* ── 9. CONTACT — never pre-hide (conversion-critical) ── */
        const contact = root.querySelector('#contacto, .kh-contact');
        if (contact) {
          const copy = contact.querySelector('.kh-contact__copy');
          const form = contact.querySelector('.kh-form');
          const fields = contact.querySelectorAll('.kh-form label, .kh-form .kh-btn');
          const h2 = contact.querySelector('h2');
          const leads = copy?.querySelectorAll('p');

          gsap
            .timeline({
              defaults: { immediateRender: false },
              scrollTrigger: { trigger: contact, start: 'top 88%', once: true },
            })
            .fromTo(
              h2,
              { autoAlpha: 0, y: 28 },
              { autoAlpha: 1, y: 0, duration: 0.65, ease: EASE.expo },
              0,
            )
            .fromTo(
              leads,
              { autoAlpha: 0, y: 16 },
              { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06, ease: EASE.out },
              0.1,
            )
            .fromTo(
              form,
              { autoAlpha: 0, y: 20 },
              { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE.expo },
              0.08,
            )
            .fromTo(
              fields,
              { autoAlpha: 0, y: 10 },
              { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.04, ease: EASE.out },
              0.28,
            );
        }

        /* Generic catch-all for leftover section heads */
        root.querySelectorAll('.kh-section .kh-h2, .kh-section .kh-eyebrow').forEach((el) => {
          if (el.closest('.kh-dolores-band, #metodologia, #metodo, #calculadora, .kh-platform-band')) {
            return;
          }
          if (gsap.getProperty(el, 'opacity') === 0) return;
          gsap.from(el, {
            autoAlpha: 0,
            y: 48,
            duration: 0.75,
            ease: EASE.expo,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          });
        });

        /* Chart draw */
        const chart = root.querySelector('.kh-chart');
        if (chart) {
          chart.querySelectorAll('.kh-chart__svg path[fill="none"]').forEach((path, idx) => {
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
              duration: 1.4 + idx * 0.15,
              ease: EASE.expo,
              scrollTrigger: { trigger: chart, start: 'top 90%', once: true },
            });
          });
          chart.querySelectorAll('circle').forEach((c, i) => {
            gsap.fromTo(
              c,
              { scale: 0, transformOrigin: '50% 50%' },
              {
                scale: 1,
                duration: 0.55,
                delay: 0.7 + i * 0.14,
                ease: EASE.bounce,
                scrollTrigger: { trigger: chart, start: 'top 90%', once: true },
              },
            );
          });
        }

        /* Counters — snappier */
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
            start: 'top 90%',
            once: true,
            onEnter: () => {
              const obj = { n: 0 };
              el.textContent = format(0);
              gsap.to(obj, {
                n: value,
                duration: 1.05,
                ease: EASE.expo,
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

        /* Subtle button hover class only — no magnetic pull */
        root.querySelectorAll('.kh-btn').forEach((btn) => {
          btn.classList.add('kh-btn--motion');
        });

        if (prefersFine) {
          root
            .querySelectorAll(
              '.kh-calc, .kh-stage-panel, .kh-score-shell, .kh-perfil-card, .kh-mock, .kh-guarantee__panel, .kh-costo-card, .kh-dolor',
            )
            .forEach((card) => card.classList.add('kh-card-depth'));
        }
      }, root);

      /* Refresh after layout settles */
      requestAnimationFrame(() => ScrollTrigger.refresh());
      setTimeout(() => ScrollTrigger.refresh(), 400);

      /* Failsafe: never leave conversion UI stuck invisible */
      const safetyId = window.setTimeout(() => {
        root.querySelectorAll('#contacto, #contacto *').forEach((el) => {
          if (!(el instanceof HTMLElement)) return;
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || Number(cs.opacity) === 0) {
            gsap.set(el, {
              clearProps: 'opacity,visibility,transform,filter',
              autoAlpha: 1,
            });
          }
        });
        root.querySelectorAll('.kh-btn, .kh-form, .kh-calc').forEach((el) => {
          if (!(el instanceof HTMLElement)) return;
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || Number(cs.opacity) === 0) {
            gsap.set(el, {
              clearProps: 'opacity,visibility,transform,filter',
              autoAlpha: 1,
            });
          }
        });
      }, 3500);
      cleanups.push(() => clearTimeout(safetyId));

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
      window.removeEventListener('scroll', onNavScroll);
      nav?.classList.remove('is-scrolled');
      disposeMotion();
      document.documentElement.classList.remove('kova-home-chrome');
      root.classList.remove('kh-cinematic', 'is-reduced-motion', 'kh-motion-loud');
    };
  }, [rootSelector]);
}
