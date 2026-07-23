import { useEffect } from 'react';
import {
  DEFAULT_DESCRIPTION,
  GEO_PLACENAME,
  GEO_POSITION,
  GEO_REGION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from '@/lib/site';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function usePageMeta({ title, description = DEFAULT_DESCRIPTION, path = '' }) {
  useEffect(() => {
    const desc = description || DEFAULT_DESCRIPTION;
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | ${SITE_TAGLINE}`;
    const url = `${SITE_URL}${path}`;

    document.title = fullTitle;
    upsertMeta('name', 'description', desc);
    upsertMeta('name', 'author', SITE_NAME);
    upsertMeta('name', 'robots', 'index, follow, max-image-preview:large');
    upsertMeta('name', 'geo.region', GEO_REGION);
    upsertMeta('name', 'geo.placename', GEO_PLACENAME);
    upsertMeta('name', 'geo.position', GEO_POSITION);
    upsertMeta('name', 'ICBM', GEO_POSITION.replace(';', ', '));
    upsertLink('canonical', url);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:locale', 'es_CO');
    upsertMeta('property', 'og:image', `${SITE_URL}/brand/litt-hunter-logo.png`);
    upsertMeta('name', 'twitter:card', 'summary');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', desc);

    upsertJsonLd('lh-jsonld-org', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      alternateName: ['LITT HUNTER', 'LittHunter'],
      url: SITE_URL,
      logo: `${SITE_URL}/brand/litt-hunter-logo.png`,
      description: DEFAULT_DESCRIPTION,
      email: 'hola@litthunter.com',
      areaServed: {
        '@type': 'Country',
        name: 'Colombia',
      },
      knowsAbout: [
        'reclutamiento comercial',
        'selección de talento comercial',
        'evaluación por competencias',
        'contratación de vendedores',
      ],
    });

    upsertJsonLd('lh-jsonld-website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: 'es-CO',
      publisher: { '@type': 'Organization', name: SITE_NAME },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/guias?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });
  }, [title, description, path]);
}
