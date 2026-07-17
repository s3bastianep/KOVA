const body = document.body;
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
const year = document.querySelector('#year');

year.textContent = new Date().getFullYear();

menuButton?.addEventListener('click', () => {
  const isOpen = body.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    body.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    body.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }
});

const visual = document.querySelector('.match-visual');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (visual && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  visual.addEventListener('pointermove', (event) => {
    const bounds = visual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    visual.style.setProperty('--mx', `${x * 8}px`);
    visual.style.setProperty('--my', `${y * 8}px`);
    visual.style.setProperty('--cx', `${x * -3}px`);
    visual.style.setProperty('--cy', `${y * -3}px`);
  });

  visual.addEventListener('pointerleave', () => {
    visual.style.setProperty('--mx', '0px');
    visual.style.setProperty('--my', '0px');
    visual.style.setProperty('--cx', '0px');
    visual.style.setProperty('--cy', '0px');
  });
}
