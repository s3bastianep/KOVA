export const GUIA_CONTRATAR = '/guia-contratar-comercial';
export const GUIA_EVALUACION = '/guia-evaluacion-comercial';
export const GUIA_PSICOMETRICAS = '/guia-psicometricas-vs-comercial';
export const GUIA_ROTACION = '/guia-rotacion-comercial';
export const GUIA_HABILIDADES = '/guia-habilidades-blandas-comercial';

export const GUIAS = [
  {
    path: GUIA_CONTRATAR,
    title: '5 problemas al atraer talento comercial y cómo resolverlos',
    excerpt: 'Los errores más comunes al identificar vendedores y cómo abordarlos con criterio especializado.',
    readTime: '12 min',
    image: '/images/guia-reunion-comercial.png',
  },
  {
    path: GUIA_EVALUACION,
    title: 'Evaluación comercial: criterios que sí predicen desempeño',
    excerpt: 'Por qué la evaluación comercial supera los métodos tradicionales para identificar talento ideal.',
    readTime: '18 min',
    image: '/images/guia-evaluacion-comercial.png',
  },
  {
    path: GUIA_PSICOMETRICAS,
    title: 'Psicométricas vs. evaluación comercial',
    excerpt: 'Por qué las pruebas genéricas no predicen desempeño en ventas y qué hace Kova diferente.',
    readTime: '16 min',
    image: '/images/guia-psicometricas-hero.png',
  },
  {
    path: GUIA_ROTACION,
    title: 'Señales débiles de contratación y rotación',
    excerpt: 'Cómo las malas señales en la contratación convierten la escasez comercial en rotación.',
    readTime: '14 min',
    image: '/images/guia-rotacion-hero.png',
  },
  {
    path: GUIA_HABILIDADES,
    title: 'Cómo evaluar habilidades blandas al atraer talento comercial',
    excerpt: 'Cómo los líderes comerciales pueden evaluar por competencias sin pruebas genéricas.',
    readTime: '15 min',
    image: '/images/guia-habilidades-hero.png',
  },
];

export function isGuiaPath(pathname) {
  return pathname === '/guias' || pathname.startsWith('/guia-');
}

export function getRelatedGuides(currentPath, limit) {
  const others = GUIAS.filter((g) => g.path !== currentPath);
  return limit != null ? others.slice(0, limit) : others;
}
