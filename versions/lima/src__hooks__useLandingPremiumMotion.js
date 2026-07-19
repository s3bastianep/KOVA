import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

function parseCountable(text) {
  const t = String(text || '').trim();
  const m = t.match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  if (!m) return null;
  return { value: parseFloat(m[1].replace(',', '.')), suffix: m[2] || '' };
}

/**
 * Cinematic boutique motion — trust over spectacle.
 * Spec: blur+fade reveals, subtle parallax, Linear-like spotlight,
 * micro button magnetism, glass depth — never bounce / typewriter / neon.
 */
export function useLandingPremiumMotion(rootSelector = '.kova-home-plain') {
  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('kova-home-chrome');
    root.classList.add('kh-cinematic');

    const nav = document.querySelector('.kova-navbar');
    const onNavScroll = () => {
      nav?.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onNavScroll();
    window.addEventListener('scroll', onNavScroll, { passive: true });

    if (reduced) {
      root.classList.add('is-reduced-motion');
      return () => {
        window.removeEventListener('scroll', onNavScroll);
        nav?.classList.remove('is-scrolled');
        document.documentElement.classList.remove('kova-home-chrome');
        root.classList.remove('is-reduced-motion', 'kh-cinematic');
      };
    }

    const prefersFine = window.matchMedia('(pointer: fine)').matches;
    const cleanups = [];

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.05,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const ticker = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

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
          y: 18,
          filter: 'blur(12px)',
        });
        if (heroVisual) {
          gsap.set(heroVisual, { autoAlpha: 0, scale: 0.97, filter: 'blur(12px)' });
        }

        /* Slow cinematic settle — ease-out only, no bounce */
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroTl
          .to(
            heroVisual,
            { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.35 },
            0,
          )
          .to(heroPill, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.85 }, 0.22)
          .to(heroTitle, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.05 }, 0.34)
          .to(heroLead, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9 }, 0.5)
          .to(heroCtas, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }, 0.64)
          .to(heroChecks, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.75 }, 0.76);
      }

      /* ── Parallax: copy 100%, visual ~80% ── */
      if (hero && heroCopy && heroVisual) {
        gsap.to(heroCopy, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
        gsap.to(heroVisual, {
          y: 32,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      /* ── 6. Hero photos breathe ±6px / 12s cycle ── */
      root.querySelectorAll('.kh-collage__photo').forEach((photo, i) => {
        gsap.to(photo, {
          y: i % 2 === 0 ? -6 : 6,
          duration: 6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.45,
        });
      });

      /* ── 4+5. Scroll reveal: opacity + blur + translateY (never sides/bounce) ── */
      const sections = root.querySelectorAll(
        '.kh-section, .kh-trust, .kh-contact, .kh-artifact, #calculadora, #metodologia, #metodo',
      );
      sections.forEach((section) => {
        if (section.classList.contains('kh-dolores-band')) return;
        const bits = section.querySelectorAll(
          '.kh-h2, .kh-eyebrow, .kh-dolor, .kh-costos, .kh-calc, .kh-perfil-card, .kh-mock, .kh-compare, .kh-platform__grid > div, .kh-case-stat, .kh-guide-card, .kh-method-qa__item, .kh-artifact__lead, .kh-platform__lead, .kh-platform__close, .kh-perfil__lead, .kh-trust__label',
        );
        if (!bits.length) return;
        gsap.set(bits, { autoAlpha: 0, y: 24, filter: 'blur(12px)' });
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.to(bits, {
              autoAlpha: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.85,
              ease: 'power3.out',
              stagger: 0.06,
              onComplete: () => {
                bits.forEach((el) => {
                  if (
                    el.matches(
                      '.kh-dolor, .kh-perfil-card, .kh-calc, .kh-guide-card',
                    )
                  ) {
                    gsap.set(el, { clearProps: 'transform' });
                    el.classList.add('kh-float');
                  }
                });
              },
            });
          },
        });
      });

      /* Title-only blur reveal (extra polish on H2s) */
      root.querySelectorAll('.kh-h2, .kh-platform h2, .kh-contact h2').forEach((title) => {
        if (title.closest('.kh-dolores-band')) return;
        ScrollTrigger.create({
          trigger: title,
          start: 'top 86%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              title,
              { filter: 'blur(10px)', autoAlpha: 0.35 },
              { filter: 'blur(0px)', autoAlpha: 1, duration: 0.9, ease: 'power3.out' },
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

        gsap.set([title, aside].filter(Boolean), { autoAlpha: 0, y: 24, filter: 'blur(12px)' });
        gsap.set(rail, { autoAlpha: 0 });
        gsap.set(railDot, { scale: 0, transformOrigin: '50% 50%' });
        gsap.set(railLine, { scaleX: 0, transformOrigin: 'left center' });
        gsap.set(railTarget, { scale: 0.7, autoAlpha: 0 });
        gsap.set(columns, { autoAlpha: 0, y: 24, filter: 'blur(10px)' });
        gsap.set(footer, { autoAlpha: 0, y: 20, filter: 'blur(8px)' });

        const doloresTl = gsap.timeline({
          scrollTrigger: { trigger: doloresBand, start: 'top 76%', once: true },
        });

        doloresTl
          .to(title, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'power3.out' }, 0)
          .to(aside, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out' }, 0.1)
          .to(rail, { autoAlpha: 1, duration: 0.2 }, 0.28)
          .to(railDot, { scale: 1, duration: 0.4, ease: 'power3.out' }, 0.3)
          .to(railLine, { scaleX: 1, duration: 0.75, ease: 'power2.out' }, 0.38)
          .to(railTarget, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'power3.out' }, 0.95)
          .to(
            columns,
            {
              autoAlpha: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.7,
              stagger: 0.1,
              ease: 'power3.out',
              onComplete: () => {
                columns.forEach((el) => {
                  gsap.set(el, { clearProps: 'transform' });
                  el.classList.add('kh-float');
                });
              },
            },
            0.7,
          )
          .to(footer, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.65, ease: 'power3.out' }, 1.15);
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
          y: 24,
          filter: 'blur(12px)',
        });
        gsap.to(stageBtns, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: stages, start: 'top 80%', once: true },
        });
        if (stagePanel) {
          gsap.to(stagePanel, {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.75,
            delay: 0.2,
            ease: 'power3.out',
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
          { autoAlpha: 0, y: 16, filter: 'blur(8px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: flow, start: 'top 82%', once: true },
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
          duration: 1.1 + idx * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: root.querySelector('.kh-chart') || path,
            start: 'top 80%',
            once: true,
          },
        });
      });

      /* ── 9. Counters ~700ms ── */
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
              duration: 0.7,
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

      /* ── 2. Cursor spotlight (Linear-soft) ── */
      if (prefersFine) {
        const spot = document.createElement('div');
        spot.className = 'kh-spotlight';
        root.appendChild(spot);
        let sx = window.innerWidth / 2;
        let sy = window.innerHeight / 3;
        let tx = sx;
        let ty = sy;
        const onMove = (e) => {
          tx = e.clientX;
          ty = e.clientY;
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        const spotTick = () => {
          sx += (tx - sx) * 0.08;
          sy += (ty - sy) * 0.08;
          spot.style.setProperty('--sx', `${sx}px`);
          spot.style.setProperty('--sy', `${sy}px`);
        };
        gsap.ticker.add(spotTick);
        cleanups.push(() => {
          window.removeEventListener('pointermove', onMove);
          gsap.ticker.remove(spotTick);
          spot.remove();
        });
      }

      /* Card cursor light + magnetic CTAs */
      if (prefersFine) {
        const cards = root.querySelectorAll(
          '.kh-dolor, .kh-calc, .kh-stage-panel, .kh-score-shell, .kh-perfil-card',
        );
        cards.forEach((card) => {
          card.classList.add('kh-card-light', 'kh-card-depth');
          const onMove = (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--lx', `${((e.clientX - r.left) / r.width) * 100}%`);
            card.style.setProperty('--ly', `${((e.clientY - r.top) / r.height) * 100}%`);
          };
          card.addEventListener('pointermove', onMove);
          cleanups.push(() => card.removeEventListener('pointermove', onMove));
        });

        /* ── 10. Magnetic buttons (~2–3px) ── */
        const magnets = root.querySelectorAll(
          '.kh-hero__ctas .kh-btn, .kh-contact .kh-btn--lime, .kh-method-cta .kh-btn',
        );
        magnets.forEach((btn) => {
          btn.classList.add('kh-btn-magnetic');
          const onMove = (e) => {
            const r = btn.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
            const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
            btn.style.transform = `translate(${dx * 2.5}px, ${dy * 2.5}px) scale(1.03)`;
          };
          const onLeave = () => {
            btn.style.transform = '';
          };
          btn.addEventListener('pointermove', onMove);
          btn.addEventListener('pointerleave', onLeave);
          cleanups.push(() => {
            btn.removeEventListener('pointermove', onMove);
            btn.removeEventListener('pointerleave', onLeave);
            btn.style.transform = '';
            btn.classList.remove('kh-btn-magnetic');
          });
        });
      }

      /* Soft icon pulse on checkmarks / arrows */
      root.querySelectorAll('.kh-hero__checks em, .kh-contact__checks em, .kh-stage-panel__bullets em').forEach(
        (icon, i) => {
          gsap.to(icon, {
            scale: 1.06,
            opacity: 0.85,
            duration: 2.4 + (i % 3) * 0.3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: i * 0.15,
          });
        },
      );
    }, root);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onNavScroll);
      nav?.classList.remove('is-scrolled');
      cleanups.forEach((fn) => fn());
      ctx.revert();
      gsap.ticker.remove(ticker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      document.documentElement.classList.remove('kova-home-chrome');
      root.classList.remove('kh-cinematic', 'is-reduced-motion');
    };
  }, [rootSelector]);
}
